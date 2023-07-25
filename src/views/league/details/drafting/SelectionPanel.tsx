import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  Theme,
  Button,
  Fab,
  Box,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Outfit } from '../../../../models/outfit';
import { OutfitsPanel, useStyles, Wrapper } from './SelectionPanel.styles';
import { ToggleButtonGroup } from '@mui/material';
import { useWindowSize } from '@uidotdev/usehooks';
import { ToggleButton } from '@mui/material';
import { useState } from 'react';
import { useRequest } from '../../../../utils/useRequest';
import { ENDPOINTS, PickOutfitParams, PickOutfitResponse } from '../../../../constants/endpoints';
import { League } from '../../../../models/league';
import { SelectionLinkPopover } from './SelectionLinkPopover';
import { OutfitCategory } from '../../../../constants/outfitCategory';

export const SelectionPanel: React.FC<{
  league: League;
  remainingOutfits: Outfit[];
  canSelect: boolean;
  currentPickNumber: number;
  closeModal: () => void;
}> = ({ league, remainingOutfits, canSelect, currentPickNumber, closeModal }) => {
  const { width } = useWindowSize();
  const classes = useStyles();
  const isModalView = width < 992;

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filter, setFilter] = useState('all');
  const { post: postPick, isLoading } = useRequest<PickOutfitResponse, PickOutfitParams>();

  const handleStateChange = (event: React.MouseEvent<HTMLElement>, newFilter: string | null) => {
    setFilter(newFilter ?? 'all');
  };

  const getFilteredOutfits = () => {
    if (filter === 'all') {
      return remainingOutfits;
    } else {
      return remainingOutfits.filter(outfit => outfit.category === filter);
    }
  };

  const filteredOutfits = getFilteredOutfits();

  const handlePick = async (pickNumber: number, serialId: number) => {
    const response = await postPick({
      endpoint: ENDPOINTS.pickOutfit,
      body: {
        leagueId: league._id,
        pickNumber,
        serialId,
      },
    }).catch();
  };

  const floatingButtons = (
    <Box sx={{ '& > :not(style)': { m: 1 } }} className={classes.fab}>
      <Fab size='medium' color={'error'} aria-label={'close'} onClick={closeModal}>
        <CloseIcon />
      </Fab>
      <Fab
        variant={'extended'}
        color={'primary'}
        aria-label='filter'
        onClick={() =>
          setIsFilterOpen(value => {
            if (!value) {
              return true;
            }
            setFilter('all');
            return false;
          })
        }>
        <TuneIcon sx={{ mr: 1 }} />
        {isFilterOpen ? 'Close Filter' : 'Filter'}
      </Fab>
    </Box>
  );

  return (
    <Wrapper>
      {isModalView ? floatingButtons : null}
      <OutfitsPanel>
        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Designer</TableCell>
                <TableCell>Point Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOutfits.map(outfit => (
                <TableRow key={outfit._id}>
                  <TableCell>
                    <div style={{ display: 'flex' }}>
                      {canSelect && !isLoading ? (
                        <Tooltip title={'Add'}>
                          <IconButton onClick={() => handlePick(currentPickNumber, outfit.serialId)}>
                            <AddCircleOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                      <SelectionLinkPopover outfit={outfit} />
                    </div>
                  </TableCell>
                  <TableCell align={'justify'}>{outfit.category}</TableCell>
                  <TableCell>{outfit.designer}</TableCell>
                  <TableCell align={'center'}>{outfit.pointValue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </OutfitsPanel>
      {isFilterOpen || !isModalView ? (
        <ToggleButtonGroup
          className={classes.toggleButtonGroup}
          value={filter}
          onChange={handleStateChange}
          size={'small'}
          exclusive
          orientation={'vertical'}>
          <ToggleButton value={'all'}>All</ToggleButton>
          <ToggleButton value={OutfitCategory.lover}>Lover</ToggleButton>
          <ToggleButton value={OutfitCategory.fearless}>Fearless</ToggleButton>
          <ToggleButton value={OutfitCategory.evermore}>Evermore</ToggleButton>
          <ToggleButton value={OutfitCategory.speakNow}>Speak Now</ToggleButton>
          <ToggleButton value={OutfitCategory.red}>Red</ToggleButton>
          <ToggleButton value={OutfitCategory.folklore}>Folklore</ToggleButton>
          <ToggleButton value={OutfitCategory.eightyNine}>1989</ToggleButton>
          <ToggleButton value={OutfitCategory.surpriseSongs}>Surprise</ToggleButton>
          <ToggleButton value={OutfitCategory.midnights}>Midnights</ToggleButton>
        </ToggleButtonGroup>
      ) : null}
    </Wrapper>
  );
};
