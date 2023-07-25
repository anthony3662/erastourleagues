import * as React from 'react';
import { Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ROUTES } from '../../routes/constants';
import QuizIcon from '@mui/icons-material/Quiz';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import InfoIcon from '@mui/icons-material/Info';
import HandshakeIcon from '@mui/icons-material/Handshake';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import GavelIcon from '@mui/icons-material/Gavel';
import { useState } from 'react';

export const AboutMenu: React.FC<{ handleMenuClick: (route: string) => void }> = ({ handleMenuClick }) => {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <ListItemButton onClick={() => setAboutOpen(v => !v)}>
        <ListItemIcon>
          <MenuBookIcon color={'primary'} />
        </ListItemIcon>
        <ListItemText primary={'About'} />
        {aboutOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={aboutOpen} timeout='auto' unmountOnExit>
        <List component='div' disablePadding>
          <ListItemButton sx={{ pl: 4 }} onClick={() => handleMenuClick(ROUTES.howToPlay)}>
            <ListItemIcon>
              <QuizIcon color={'primary'} />
            </ListItemIcon>
            <ListItemText primary='How to Play' />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }} onClick={() => handleMenuClick(ROUTES.about)}>
            <ListItemIcon>
              <InfoIcon color={'primary'} />
            </ListItemIcon>
            <ListItemText primary='About Us' />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }} onClick={() => handleMenuClick(ROUTES.supportUs)}>
            <ListItemIcon>
              <VolunteerActivismIcon color={'primary'} />
            </ListItemIcon>
            <ListItemText primary='Support Us' />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }} onClick={() => handleMenuClick(ROUTES.termsOfUse)}>
            <ListItemIcon>
              <HandshakeIcon color={'primary'} />
            </ListItemIcon>
            <ListItemText primary='Terms of Use' />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }} onClick={() => handleMenuClick(ROUTES.privacyPolicy)}>
            <ListItemIcon>
              <PrivacyTipIcon color={'primary'} />
            </ListItemIcon>
            <ListItemText primary='Privacy Policy' />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }} onClick={() => handleMenuClick(ROUTES.litigation)}>
            <ListItemIcon>
              <GavelIcon color={'primary'} />
            </ListItemIcon>
            <ListItemText primary='Statement on Litigation' />
          </ListItemButton>
          <ListItem sx={{ pl: 4 }}>
            <a href={'/'}>
              <img src={'https://swiftball-static.s3.us-east-2.amazonaws.com/static/venmo.png'} width={150} />
            </a>
          </ListItem>
        </List>
      </Collapse>
    </>
  );
};
