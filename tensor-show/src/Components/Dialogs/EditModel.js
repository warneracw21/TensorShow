import React from 'react';
import clsx from 'clsx';

// Import Style Tools
import { makeStyles } from '@material-ui/core/styles';

// Import Material-Kit Components
import {
	Drawer,
	Button,
 	Dialog,
 	DialogTitle,
 	DialogContent,
 	ListItemText,
 	ListItem,
 	List,
 	Divider,
 	AppBar,
 	Toolbar,
 	IconButton,
 	Typography,
 	ListItemIcon,
 	ListItemSecondaryAction,
 	TextField,
 	Paper,
 	Slide } from '@material-ui/core';

// Import Icons
import CloseIcon from '@material-ui/icons/Close';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

// Import Contexts
import { useEditModelDialogState, useEditModelDialogDispatch } from '../../AppStores/EditModelDialogContext';
import { useModelStoreState, useModelStoreDispatch } from '../../AppStores/ModelStore';
import { useEditLayerDialogDispatch } from '../../AppStores/EditLayerDialogContext';
import { useCurrentLayerDispatch } from '../../AppStores/CurrentLayerContext';
import { useTreePosStoreState } from '../../AppStores/TreePosStore';
import { useLayerInfoStoreState } from '../../AppStores/LayerInfoStore';

const layer_type_map = {
	"conv_layer": "Convolutional",
	"pool_layer": "Pooling",
	"full_layer": "Fully Connected"
}

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  title: {
    flexGrow: 1,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },

  modelActionPanel: {
  	position: 'relative',
  	marginTop: '10%',
  	marginLeft: '1%',
  	height: '40%',
  	width: '95%',
  	backgroundColor: "#FF0000"
  },
  modelActionPanelShift: {
    width: `calc(95% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  modelActionPanelTitle: {
  	position: 'absolute',
  	marginTop: '2%',
  	marginLeft: '1%',
  },

  modelActionPanelSub: {
  	display: 'absolute',
  	marginTop: '10%',
  	marginLeft: '10%',
  	height: 250,
  	width: '80%',
  	backgroundColor: '#0FF000'
  },

   paramTextFieldGroup: {
  	display: "flex"
  },
  paramTextField: {
  	margin: theme.spacing(1),
  	maxWidth: 150
  },

  layerNameTextField: {
		margin: theme.spacing(1),
		minWidth: 120
	},

}));


export default function EditModel() {
  const classes = useStyles();

  // Subscribe to Contexts
  const { open, model_key } = useEditModelDialogState();
  const editModelDialogDispatch = useEditModelDialogDispatch();
  const editLayerDialogDispatch = useEditLayerDialogDispatch();

  const currentLayerDispatch = useCurrentLayerDispatch();

  const modelStoreState = useModelStoreState();

  const treePosState = useTreePosStoreState();
  const layerInfoState = useLayerInfoStoreState();

  // Handle Dialog Opening and Closing
  const handleClickOpen = () => {
    editModelDialogDispatch({open: true, modek_key: null})
  };

  const handleClose = () => {
    editModelDialogDispatch({open: false, modek_key: null})
  };

  // Set Up Layer Drawer
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };




  ///////////////////////////////////////////////
  // Set Component Hooks
  ///////////////////////////////////////////////
  const [openViewLayers, setOpenViewLayers] = React.useState(false);



  // Extract Model
  const model = modelStoreState[model_key];
  if (model === undefined) {
  	return <div/>;
  }

  ///////////////////////////////////////////////
  // Calculate Layer List
  ///////////////////////////////////////////////
  const handleEditLayer = (event, position) => {
  	event.preventDefault();

  	// Set Current Layer Context
  	currentLayerDispatch({sender_pos: position});

    // Open Dialog
    editLayerDialogDispatch({open: true, dialog_type: "edit"})

  }

  const layerIDs = model.layerIDs;
  const checkAddButton = (param) => {
   	if (param.layer_type === 'input_layer') {
   		return null
   	} else {
   		return <Button onClick={(event) => handleEditLayer(event, param.position)}>Edit</Button>
   	}
   }
  const layer_list = (
  	<div style={{width: "100%"}}>
  	<List>
      {layerIDs.map((layerID, index) => {
        let param = layerInfoState[layerID]
        return (
          <ListItem key={index}>
            <ListItemText
            	primary={`${index + 1}: ${param.layer_name}`}
            	secondary={layer_type_map[param.layer_type] + ' Layer'}
            />
             {checkAddButton(param)}
            
          </ListItem>)
      })}
    </List>
    </div>

  );

  ///////////////////////////////////////////////
  // View Layers Dialog
  ///////////////////////////////////////////////
  const view_layers_dialog = (
  	<Dialog maxWidth={'lg'} open={openViewLayers} onClose={() => setOpenViewLayers(false)}>
  		<DialogTitle>View Layers</DialogTitle>
  		<DialogContent>
  			{layer_list}
  		</DialogContent>
  	</Dialog>

  	)


  ///////////////////////////////////////////////
  // Model Information Window
  ///////////////////////////////////////////////
  const model_info_window = (
  	<div>
  		<Typography variant="h6" align="left">Model Information</Typography>
			<div className={classes.paramTextFieldGroup}>
				<TextField
					className={classes.layerNameTextField}
	        label="Model Name"
	        defaultValue={model.model_name}
	      />
	      <Button 
	      	style={{margin: 10}} 
	      	variant="contained" 
	      	onClick={() => setOpenViewLayers(true)}>View Layers</Button>
	    	</div>
	    </div>
	 	);

  ///////////////////////////////////////////////
  // Training Window
  ///////////////////////////////////////////////
  const training_window = (
  	<div>
			<Typography variant="h6" align="left">Training Parameters</Typography>
			<div className={classes.paramTextFieldGroup}>
				<TextField
					className={classes.paramTextField}
	        type="number"
	        InputLabelProps={{
	          shrink: true,
	        }}
	        variant="outlined"
	        helperText="Number of Epochs"
	      />
	    </div>
	    <div className={classes.paramTextFieldGroup}>
		    <Button style={{margin: 10}} variant="contained">
				  Train Model
				</Button>
				<Button style={{margin: 10}} variant="contained" disabled>
				  View Results
				</Button>
			</div>
		</div>

  );

  ///////////////////////////////////////////////
  // Testing Window
  ///////////////////////////////////////////////
  const testing_window = (
  	<div>
			<Typography variant="h6" align="left">Testing Parameters</Typography>
			<div className={classes.paramTextFieldGroup}>
				<TextField
					className={classes.paramTextField}
	        type="number"
	        InputLabelProps={{
	          shrink: true,
	        }}
	        variant="outlined"
	        helperText="Number of Epochs"
	      />
	    </div>
	    <div className={classes.paramTextFieldGroup}>
		    <Button style={{margin: 10}} variant="contained" disabled>
				  Test Model
				</Button>
				<Button style={{margin: 10}} variant="contained" disabled>
				  View Results
				</Button>
			</div>
		</div>

  );

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
      	<DialogTitle>View Model</DialogTitle>
      	<DialogContent>
      		{model_info_window}
      		{view_layers_dialog}
	      	{training_window}
	      	{testing_window}
	      </DialogContent>
	      <Drawer
	        className={classes.drawer}
	        variant="persistent"
	        anchor="right"
	        open={drawerOpen}
	        classes={{
	          paper: classes.drawerPaper,
	        }}
	      >
	        <div className={classes.drawerHeader}>
	          <IconButton onClick={handleDrawerClose}>
	             <ChevronRightIcon />
	          </IconButton>
	        </div>
	        <Divider />
	        {layer_list}
	      </Drawer>
      </Dialog>
    </div>
  );
}
