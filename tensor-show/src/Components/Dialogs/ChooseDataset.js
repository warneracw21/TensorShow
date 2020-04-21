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
import AddCircleIcon from '@material-ui/icons/AddCircle';

// Import Contexts
import { useChooseDatasetDialogState, useChooseDatasetDialogDispatch } from '../../AppStores/ChooseDatasetDialogContext';
import { useLayerInfoStoreState, useLayerInfoStoreDispatch } from '../../AppStores/LayerInfoStore';

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
  modelActionPanel: {
  	position: 'relative',
  	marginTop: '10%',
  	marginLeft: '1%',
  	height: '40%',
  	width: '95%',
  	backgroundColor: "#FF0000"
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



export default function ChooseDataset() {
  const classes = useStyles();

  // Subscribe to Context
  const { open } = useChooseDatasetDialogState();
  const datasetDialogDispatch = useChooseDatasetDialogDispatch();

  const layerInfoStore = useLayerInfoStoreState();
  const layerInfoStoreDispatch = useLayerInfoStoreDispatch();


  const handleClose = () => {
    datasetDialogDispatch({open: false})
  };

  // Set Input Layer Information on Click
  const setDataset = (event, dataset_name) => {
    event.preventDefault();

    let layer_params;

    switch (dataset_name) {
      case "cifar10": {
        layer_params = {
          dataset_name: "CIFAR10",
          shape: "32 x 32 x 3",
          labels: 10
        }
        break;
      }
      case "cifar100": {
        layer_params = {
          dataset_name: "CIFAR100",
          shape: "32 x 32 x 1",
          labels: 100
        }
        break;
      }
      case "digits_mnist": {
        layer_params = {
          dataset_name: "MNIST Digits",
          shape: "28 x 28 x 1",
          labels: 10
        }
        break;
      }
      case "fashion_mnist": {
        layer_params = {
          dataset_name: "MNSIT Fashion",
          shape: "28 x 28 x 1",
          labels: 10
        }
        break;
      }
    }

    // Update Input Layer Parameters
    layerInfoStoreDispatch({
      type: 'update',
      layerID: "000",
      layer_info: {
        layer_params: layer_params
      }
    });

    datasetDialogDispatch({open: false})
  }





  ///////////////////////////////////////////////
  // Choose Dataset Window
  ///////////////////////////////////////////////
  const choose_dataset_window = (
  	<List>
  		<ListItem>
        <ListItemText 
          primary="CIFAR10" 
          secondary="Dataset of 50,000 32x32 color training images, labeled over 10 categories, and 10,000 test images." />
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="Choose Dataset"
            onClick={(event) => setDataset(event, "cifar10")}>
            <AddCircleIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="CIFAR100" 
          secondary="Dataset of 50,000 32x32 color training images, labeled over 100 categories, and 10,000 test images." />
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="Choose Dataset"
            onClick={(event) => setDataset(event, "cifar100")}>
            <AddCircleIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="MNIST database of handwritten digits" 
          secondary="Dataset of 60,000 28x28 grayscale images of the 10 digits, along with a test set of 10,000 images." />
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="Choose Dataset"
            onClick={(event) => setDataset(event, "digits_mnist")}>
            <AddCircleIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Fashion-MNIST database of fashion articles" 
          secondary="Dataset of 60,000 28x28 grayscale images of 10 fashion categories, along with a test set of 10,000 images. This dataset can be used as a drop-in replacement for MNIST. The class labels are:" />
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="Choose Dataset"
            onClick={(event) => setDataset(event, "fashion_mnist")}>
            <AddCircleIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>

  	</List>
	 	);


  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
      	<DialogTitle>Choose Dataset</DialogTitle>
      	<DialogContent>
      		{choose_dataset_window}
	      </DialogContent>
      </Dialog>
    </div>
  );
}
