import * as React from 'react';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ROUTES } from '../../routes/constants';
import StadiumIcon from '@mui/icons-material/Stadium';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import { useState } from 'react';

export const StatsMenu: React.FC<{ handleMenuClick: (route: string) => void }> = ({ handleMenuClick }) => {
  const [statsOpen, setStatsOpen] = useState(false);

  return (
    <>
      <ListItemButton onClick={() => setStatsOpen(v => !v)}>
        <ListItemIcon>
          <InsightsIcon color={'primary'} />
        </ListItemIcon>
        <ListItemText primary={'Stats'} />
        {statsOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={statsOpen} timeout='auto' unmountOnExit>
        <List component='div' disablePadding>
          <ListItemButton sx={{ pl: 4 }} onClick={() => handleMenuClick(ROUTES.concerts)}>
            <ListItemIcon>
              <StadiumIcon color={'primary'} />
            </ListItemIcon>
            <ListItemText primary='Concerts' />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }} onClick={() => handleMenuClick(ROUTES.outfits)}>
            <ListItemIcon>
              <CheckroomIcon color={'primary'} />
            </ListItemIcon>
            <ListItemText primary='Outfits' />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }} onClick={() => handleMenuClick(ROUTES.surpriseSongs)}>
            <ListItemIcon>
              <LibraryMusicIcon color={'primary'} />
            </ListItemIcon>
            <ListItemText primary='Surprise Songs' />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
};
