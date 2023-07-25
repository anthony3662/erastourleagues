const nodemailer = require('nodemailer');
const User = require('../models/User');
const mailgunTransport = require('nodemailer-mailgun-transport');
const moment = require('moment/moment');
const crypto = require('crypto');

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const BASE_CLIENT_URL = process.env.NODE_ENV === 'production' ? 'https://www.erastourleagues.com' : 'http://localhost:3000';

const MAILGUN_KEY = process.env.MAILGUN_KEY;
// Create a Mailgun transporter
const transporter = nodemailer.createTransport(
  mailgunTransport({
    auth: {
      api_key: MAILGUN_KEY, // Replace with your Mailgun API key
      domain: 'swiftball.mom', // Replace with your Mailgun domain name
    },
  }),
);

const sendTestEmail = async () => {
  const mailOptions = {
    from: 'postmaster@erastourleagues.com',
    to: 'erastourleagues@gmail.com',
    subject: 'Test Email',
    text: 'This is a test email sent with Nodemailer and Mailgun.',
  };

  await transporter.sendMail(mailOptions);
};

const sendInterruptedDraftNotification = async (usernames) => {
  try {
    // Retrieve user emails for the given usernames
    const emails = await User.model.find({ username: { $in: usernames } }).distinct('email').exec();

    // Send test email to each user
    for (const email of emails) {
      const mailOptions = {
        from: 'postmaster@erastourleagues.com',
        to: email,
        subject: 'Swiftball Draft',
        text: 'A server crash interrupted your draft, our apologies. The league owner will need to reschedule your draft.',
      };

      await transporter.sendMail(mailOptions);
    }
  } catch (error) {
    console.error('Error sending interrupt notices:', error);
  }
};


const inviteTokenKey = 'shhitsasecret';
const generateInvitationToken = inviteEmail => {
  const cipher = crypto.createCipher('aes256', inviteTokenKey);
  const token = cipher.update(inviteEmail, 'utf8', 'hex') + cipher.final('hex');
  return token;
};

const decryptInvitationToken = token => {
  const decipher = crypto.createDecipher('aes256', inviteTokenKey);
  const inviteEmail = decipher.update(token, 'hex', 'utf8') + decipher.final('utf8');
  return inviteEmail;
};

const sendInviteEmail = async (leagueName, inviteEmail) => {
  const invitationToken = generateInvitationToken(inviteEmail);
  const invitationLink = `${BASE_CLIENT_URL}?invitationToken=${invitationToken}`;

  const mailOptions = {
    from: 'postmaster@erastourleagues.com',
    to: inviteEmail,
    subject: `Swiftball invitation: ${leagueName}`,
    text: `You have been invited to join a Swiftball league!`,
    html: `
      <p>You have been invited to join a Swiftball league! Click the following link to join ${leagueName}:</p>
      <p>
        <a href="${invitationLink}" style="color: blue; text-decoration: underline;">${invitationLink}</a>
      </p>
      <p>Invitation link expires in 24 hours.</p>
      <p>If you want to unsubscribe from future invitations, click <a href="${BASE_CLIENT_URL}/public/unsubscribe?email=${inviteEmail}" style="color: blue; text-decoration: underline;">here</a>.</p>
    `,
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (e) {
    console.error(e);
  }
};


const sendDraftSchedule = async (leagueName, inviteEmail, unixMills) => {
  const draftMoment = moment.utc(Number(unixMills));
  const pacificTime = draftMoment.tz('America/Los_Angeles').format('LLL');
  const easternTime = draftMoment.tz('America/New_York').format('LLL');

  const mailOptions = {
    from: 'postmaster@erastourleagues.com',
    to: inviteEmail,
    subject: `Swiftball draft: ${leagueName}`,
    text: `A draft has been scheduled for ${leagueName}. If you can't make it, please ask the league owner to reschedule.
Pacific Time: ${pacificTime}
EasternTime: ${easternTime}
    `,
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  emailRegex,
  transporter,
  sendTestEmail,
  sendInviteEmail,
  sendDraftSchedule,
  sendInterruptedDraftNotification,
  generateInvitationToken,
  decryptInvitationToken,
};
