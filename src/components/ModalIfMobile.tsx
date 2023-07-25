import * as React from 'react';
import { useWindowSize } from '@uidotdev/usehooks';
import AddchartIcon from '@mui/icons-material/Addchart';
import { AppBar, Button, Dialog, Fab, Toolbar, IconButton, Typography, Theme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  fab: {
    position: 'fixed',
    bottom: '32px',
    right: '32px',
    zIndex: theme.zIndex.tooltip, // Ensures the FAB appears above other elements
  },
}));

export const ModalIfMobile: React.FC<{
  children: React.ReactNode;
  breakpoint: number;
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  buttonText: string;
}> = ({ children, breakpoint, isOpen, setIsOpen, buttonText }) => {
  const classes = useStyles();
  const { width } = useWindowSize();

  if (width >= breakpoint) {
    return children;
  }

  const handleClose = () => setIsOpen(false);

  const openButton = (
    <Fab className={classes.fab} variant='extended' color={'primary'} aria-label='add' onClick={() => setIsOpen(true)}>
      <AddchartIcon sx={{ mr: 1 }} />
      {buttonText}
    </Fab>
  );

  return (
    <>
      {!isOpen ? openButton : null}
      <Dialog fullScreen open={isOpen} onClose={handleClose}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
              Pick your outfits!
            </Typography>
            <Button autoFocus color='inherit' onClick={handleClose}>
              close
            </Button>
          </Toolbar>
        </AppBar>
        {children}
      </Dialog>
    </>
  );
};
