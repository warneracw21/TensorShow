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
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
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
import { useModelTrainStoreState, useModelTrainStoreDispatch } from '../../AppStores/ModelTrainStore';
import { useServeModelFileState } from '../../AppStores/ServeModelFileContext';


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
  title: {
    flexGrow: 1,
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
  layerTypeSelectControl: {
    display: "block",
    margin: theme.spacing(1),
    minWidth: 150,
  },

  resultsWindow: {
    display: 'flex',
    justifyContent: 'space-evenly',
    height: 600,
    width: 1200,
  },

  lossGraphWindow: {
    height: 500,
    width: 500,
    backgroundColor: '#FF00FF'
  },

  accuracyGraphWindow: {
    height: 500,
    width: 500,
    backgroundColor: '#FF00FF'
  }



}));


export default function EditModel(params) {
  const classes = useStyles();

  // Subscribe to Contexts
  const { open, model_key } = useEditModelDialogState();
  const editModelDialogDispatch = useEditModelDialogDispatch();
  const editLayerDialogDispatch = useEditLayerDialogDispatch();

  const currentLayerDispatch = useCurrentLayerDispatch();

  const modelStoreState = useModelStoreState();

  const treePosState = useTreePosStoreState();
  const layerInfoState = useLayerInfoStoreState();

  const serveModelFileState = useServeModelFileState();

  // const modelTrainStoreState = useModelTrainStoreState();
  // const modelTrainStoreDispatch = useModelTrainStoreDispatch();

  // Set Component Hooks
  const [numEpochs, setNumEpochs] = React.useState(100)
  const [batchSize, setBatchSize] = React.useState(256)
  const [optimizerType, setOptimizerType] = React.useState("Gradient Descent");
  const [openViewLayers, setOpenViewLayers] = React.useState(false);
  const [openViewResults, setOpenViewResults] = React.useState(false);


  // Handle Dialog Opening and Closing
  const handleClickOpen = () => {
    editModelDialogDispatch({open: true, modek_key: null})
  };

  const handleClose = () => {
    editModelDialogDispatch({open: false, modek_key: null})
  };

  const handleTrain = () => {
    params.trainModel({
      model_key: model_key,
      num_epochs: numEpochs,
      batch_size: batchSize,
      optimizer_type: optimizerType
    })
  }

  React.useEffect(() => {
    console.log("model store changed")
  }, [modelStoreState[model_key]])

  // Extract Model
  const model = modelStoreState[model_key];
  if (model === undefined) {
  	return <div/>;
  }

  console.log(model)

  if (model["status"] == "init") {
    console.log("init")
  }

  if (model["status"] == "trained") {
    console.log("trained")
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
  const getModelDownload = () => {
    if (serveModelFileState === null) {
      return <div/>
    } else {
      const onClickFunction = () => {
        var fileDownload = require('react-file-download');
        fileDownload(serveModelFileState.model_file, 'model.json');
      }
      return <Button onClick={onClickFunction}>Click Here</Button>
    }
  }
  const model_info_window = (
  	<div>
  		<Typography variant="h6" align="left">Model Information</Typography>
			<div className={classes.paramTextFieldGroup}>
				<TextField
					className={classes.layerNameTextField}
	        label="Model Name"
	        defaultValue={model.model_name}
	      />
	    </div>
      <div className={classes.paramTextFieldGroup}>
        <Button style={{margin: 10}} variant="contained" 
          onClick={() => setOpenViewLayers(true)}>
          View Layers
        </Button>
        <Button style={{margin: 10}} variant="contained"
          onClick={() => params.reqModelFile({model_key})}>
          Download Model
        </Button>
      </div>
      <div className={classes.paramTextFieldGroup}>
        {getModelDownload()}
      </div>
    </div>
	 	);

  ///////////////////////////////////////////////
  // Training Window
  ///////////////////////////////////////////////
  const optimizer_types = ["Gradient Descent", "Adagrad", "RMSProp", "Adam"]
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
          value={batchSize}
          onChange={(event) => setBatchSize(event.target.value)}
	        helperText="Batch Size"
	      />
        <TextField
          className={classes.paramTextField}
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          value={numEpochs}
          onChange={(event) => setNumEpochs(event.target.value)}
          helperText="Number of Epochs"
        />
      </div>
      <div className={classes.paramTextFieldGroup}>
        <FormControl className={classes.layerTypeSelectControl}>
          <Select
            style={{minWidth: 150}}
            labelId="activation-type-select-label"
            variant="outlined"
            value={optimizerType}
            onChange={(event) => setOptimizerType(event.target.value)}
          >
            {optimizer_types.map(i => (
              <MenuItem value={i}>{i}</MenuItem>))}
          </Select>
          <FormHelperText>Select Optimizer</FormHelperText>
        </FormControl>
      </div>
      <div className={classes.paramTextFieldGroup}>
		    <Button style={{margin: 10}} variant="contained"
          onClick={handleTrain}>
				  Train Model
				</Button>
        <Button style={{margin: 10}} variant="contained" disabled>
          Download Variables
        </Button>
      </div>
		</div>

  );

  ///////////////////////////////////////////////
  // Testing Window
  ///////////////////////////////////////////////
  // const testing_window = (
  // 	<div>
		// 	<Typography variant="h6" align="left">Testing Parameters</Typography>
		// 	<div className={classes.paramTextFieldGroup}>
		// 		<TextField
		// 			className={classes.paramTextField}
	 //        type="number"
	 //        InputLabelProps={{
	 //          shrink: true,
	 //        }}
	 //        variant="outlined"
	 //        helperText="Number of Epochs"
	 //      />
	 //    </div>
	 //    <div className={classes.paramTextFieldGroup}>
		//     <Button style={{margin: 10}} variant="contained" disabled>
		// 		  Test Model
		// 		</Button>
		// 		<Button style={{margin: 10}} variant="contained" disabled>
		// 		  View Results
		// 		</Button>
		// 	</div>
		// </div>

  // );

  ////////////////////////////////////
  // Results Graphs
  ///////////////////////////////////
  

  // // View Results Dialog
  // const view_results_dialog = (
  //   <Dialog maxWidth={'lg'} open={openViewResults} onClose={() => setOpenViewResults(false)}>
  //     <DialogTitle>View Results</DialogTitle>
  //     <DialogContent>
  //       <div className={classes.resultsWindow}>
  //         <canvas ref={lossGraphRef} className={classes.lossGraphWindow}/>
  //         <canvas ref={accuGraphRef} className={classes.accuracyGraphWindow}/>
  //       </div>

  //     </DialogContent>
  //   </Dialog>

  //   )


  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
      	<DialogTitle>View Model</DialogTitle>
      	<DialogContent>
      		{model_info_window}
      		{view_layers_dialog}
	      	{training_window}
	      </DialogContent>
      </Dialog>
    </div>
  );
}
