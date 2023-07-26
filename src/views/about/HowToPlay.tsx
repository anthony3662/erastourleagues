import * as React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from 'styled-components';

const Wrapper = styled.div`
  h4 {
    padding-left: 16px;
  }
  @media (min-width: 576px) {
    padding: 32px;
    h4 {
      padding-left: 0;
    }
  }
`;
export const HowToPlay = () => {
  return (
    <Wrapper>
      <Typography gutterBottom variant={'h4'} sx={{ color: 'primary.dark' }}>
        How to Play
      </Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6' color={'primary.dark'}>
            What is Erastourleagues.com?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Erastourleagues.com is a fantasy football style game built for fans of Taylor Swift and the Eras Tour.</Typography>
          <Typography>
            Create or join a four-player league and put together a team of your favorite outfits. Make sure to set your lineups and surprise
            song picks before each concert! Score points when your chosen outfits appear in the concert. Leaderboards will be posted after
            each concert, there will be prizes for the top scorers!
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6' color={'primary.dark'}>
            When can I create a league?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>You can create or join a league anytime before Taylor's tour ends, unlike traditional fantasy football.</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6' color={'primary.dark'}>
            How do I invite players to my league?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            After creating the league, enter the emails of friends you want to invite. Invites can be sent to any email address, but the
            recipient will need to sign in with a Google account to setup their account. We hope to add additional login methods in the
            future. Within the league page, you can resend or withdraw invites as needed. Once all players have accepted, you'll be able to
            schedule a draft.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6' color={'primary.dark'}>
            I received an email invite. How do I accept it?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Open the link in your email, then sign in with a google account. The email on the account does not need to match the email your
            invite was sent to. If it's your first time using Erastourleagues.com, you'll choose a username and avatar. Once you reach the
            My Leagues page, you'll see a prompt to accept your invitation. Make sure to use the link in your email, if you access
            Erastourleagues.com a different way, you won't see the accept invite prompt.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6' color={'primary.dark'}>
            How do I schedule a draft?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Once all players have accepted, the league's creator can schedule a draft. The draft can be scheduled as little as 15 minutes
            into the future. Email notifications will be sent to your league mates. It's recommended you discuss the draft time with your
            friends beforehand.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6' color={'primary.dark'}>
            My draft is coming up. What do I do?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Login a few minutes before your draft and click into your league page. The league page will automatically load the drafting
            interface at the scheduled time. If that doesn't happen, reload the page just after the scheduled time. After the drafting
            interface loads, there's a 5 minute buffer before team selection starts to accommodate latecomers. If you arrive late, you'll
            still be able to participate in the remaining rounds of the draft. Make sure to do some research using the Stats section of the
            site so you'll know what you want at draft time!
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6' color={'primary.dark'}>
            How do I draft players?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            When its your turn, you have 30 seconds to select an outfit by clicking the plus icon next to the outfit. If the timer runs out,
            the pick will be made for you. A draft has 10 rounds.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6' color={'primary.dark'}>
            How do I set my lineups?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Within your league page, click the Team tab. Each outfit has a dropdown you can use to swap it out, for example if you have the
            Blue Guitar on your bench and you want to swap it with the Pink Dress on your starters, you'd click the dropdown next to Blue
            Guitar and select Pink Dress. You'll only see the dropdowns if you have the next concert selected in the dropdown just under the
            site logo, otherwise you'll be viewing your past lineups. Don't forget to set your surprise songs. Your selected albums do not
            have to match your selected songs. If you don't set your lineup, your lineup from the previous concert will carry over. You are
            not able to change lineups or accept trades while a concert is ongoing.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6' color={'primary.dark'}>
            How do I make a trade?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            In the trade tab, you'll see all of the trades that have been proposed in your league. If you've been proposed a trade, simply
            click accept to complete the trade. Trades cannot be accepted while Taylor is performing. To offer a trade, choose the username
            of the player you'd like to propose to. A proposal must include the same number of items on each side. Trade offers are valid
            for 7 days. The proposer does have the ability to withdraw offers.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6' color={'primary.dark'}>
            When can I set my lineup?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lineups are usually locked at 7:45PM local time, although they may be locked earlier in the case of an early start, like we saw
            in Cincinnati N1. To see the lineup deadline for the next show, go to Concerts in the Stats menu, click View Current/Next
            concert, and you'll see the start time converted to your local time zone. You can set your lineup for the next show once the
            current show ends.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6' color={'primary.dark'}>
            What prizes are available?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Top scoring players can win Taylor Swift merch like CDs, vinyls, or clothing. If we receive enough support, we'll also offer
            concert tickets. Prizes will be awarded for top scores for individual concerts. Prizes will also be awarded for cumulative
            scoring over periods of time, for example a player achieving the highest cumulative points over the course of the Oceania leg of
            the tour. The prizes we offer will depend on the level of community support we get as this is a free-to-play fan project that is
            completely advertising/sponsor free. Prize acceptance is governed by our Terms of Use. If you'd like to donate, 100% of merch
            and concert tickets donated will be given out to our players.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6' color={'primary.dark'}>
            How are prize winners notified?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Prize winners are notified through the email address associated with the Google account they use to sign in.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6' color={'primary.dark'}>
            Is Erastourleagues.com live updated during concerts?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            I've watched every livestream so far and will do my best to continue doing so. The page automatically fetches new data from our
            servers at 3 minute intervals during concerts, players do not need to refresh the page.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6' color={'primary.dark'}>
            How can I watch the concert?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <a href={'https://swiftstream.gay/'}>Swiftstream.gay</a>
          </Typography>
          <Typography>
            <a href={'https://www.twitch.tv/folkleric'}>Folkleric</a>
          </Typography>
          <Typography>
            <a href={'https://www.tiktok.com/@tessdear'}>Tessdear</a>
            <b />
            Usually, at least one of the above is livestreaming. Check <a href={'https://www.instagram.com/tstourtips/'}>tstourtips</a> for
            the most up to date livestream information.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6' color={'primary.dark'}>
            Is Erastourleagues.com live updated during concerts?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            I've watched every livestream so far and will do my best to continue doing so. The page automatically fetches new data from our
            servers at 3 minute intervals during concerts, players do not need to refresh the page.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Wrapper>
  );
};
