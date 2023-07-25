# Eras Tour Leagues

[erastourleagues.com](https://erastourleagues.com)

# A Fantasy Platform for fans of Taylor Swift and the Eras Tour

### Taylor's tour is possibly the first tour in history where you can watch every single show live online.

With that, comes a dedicated following of fans who follow the tour the same way that ever since the start of television, sports fans have watched every game of the season.

With that, comes fantasy games!

Form a league, hold a draft. Before each concert, set your lineup. If the outfits and songs you chose appear at Taylor's concert, score points. Most Swifties believe that Taylor is always sending us secret messages using several means, including the outfits she wears and the songs she plays at her concert. They're not wrong. Succeeding at this game will likely be much tougher than you might think.

The site is live updated during concerts. Leaderboards are posted for every show, prizes will be available to top achievers, depending on the financial and community support this project receives.

### Also, I'm open to work. I was HIGHLY MOTIVATED on this project, a true passion project, and I'll be highly motivated for you if you have the right opportunity! I'm an experienced mobile/web engineer, React Native/React/Typescript. If you're interested, please email erastourleagues@gmail.com using a work domain email.

Demo - https://drive.google.com/file/d/1ga7XrdpWOoDcq_sLCSU75-RYrKF7ixV8/view?usp=sharing

## Deployed with AWS Elastic Beanstalk, Cloudfront, S3

## Building

1. Yarn install in root and server directories
2. Make a .env file in the server directory with MONGO_USERNAME, MONGO_PASSWORD, MAILGUN_KEY
3. You can setup nodemailer with a gmail account if you don't have a mailgun key.
4. Run yarn build in the root to build the JS bundle
5. The Concert, Outfit, and SurpriseSong tables need to be seeded for app to function.
   * Use the seed data in server/models/seed
   * Add code to mongo connection callback in public.js to create the seed documents. Remove this code once the DB is seeded.
6. In separate tabs, run node server/public.js and server/core.js
   * Recommend to use node instead of nodemon due to server startup tasks
7. The public endpoints are on port 3000. The authenticated endpoints are on 3001.
8. Go to localhost:3000 in your browser.
9. Once you've created your first account, go into the DB and set isAdmin on the user document to true to give it admin panel access.
