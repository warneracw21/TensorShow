import React from 'react';

// Import Style Tools
import { makeStyles } from '@material-ui/core/styles';

// Import Material-Kit Components
import {
	Button,
 	Dialog,
 	ListItemText,
 	ListItem,
 	List,
 	Divider,
 	AppBar,
 	Toolbar,
 	IconButton,
 	Typography,
 	CloseIcon,
 	Slide } from '@material-ui/core';

// Import Contexts
import { useEditModelDialogState, useEditModelDialogDispatch } from '../AppStores/EditModelDialogContext';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditModel() {
  const classes = useStyles();
  const { open, model_key } = useEditModelDialogState();

  const handleClickOpen = () => {
    useEditModelDialogDispatch({open: true, modek_key: null})
  };

  const handleClose = () => {
    useEditModelDialogDispatch({open: false, modek_key: null})
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open full-screen dialog
      </Button>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Sound
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem button>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary="Default notification ringtone" secondary="Tethys" />
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
}
