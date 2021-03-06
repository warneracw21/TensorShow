/////////////////////////////////////////////////
// Edit Layer
/////////////////////////////////////////////////
import React from 'react';

// Import Styling Tools
import { makeStyles } from '@material-ui/core/styles';

// Import Components
import {
	Dialog, 
	DialogTitle, 
	DialogContent, 
	DialogContentText, 
	DialogActions } from '@material-ui/core';

import {
	Divider,
	Typography,
	TextField,
	InputLabel,
	FormControl,
	MenuItem,
	Select,
	FormControlLabel,
	FormHelperText,
	Checkbox,
	Button } from '@material-ui/core';


/////////////////////////////////////////////////
// Set Up Contexts
/////////////////////////////////////////////////
import { useTreePosStoreState, useTreePosStoreDispatch } from '../../AppStores/TreePosStore';
import { useEditLayerDialogState, useEditLayerDialogDispatch } from '../../AppStores/EditLayerDialogContext';
import { useCurrentLayerState, useCurrentLayerDispatch } from '../../AppStores/CurrentLayerContext';
import { useLayerInfoStoreState, useLayerInfoStoreDispatch } from '../../AppStores/LayerInfoStore';
import { useModelStoreDispatch } from '../../AppStores/ModelStore';


/////////////////////////////////////////////////
// Declare Constants
/////////////////////////////////////////////////
const useStyles = makeStyles((theme) => ({
	layerNameTextField: {
		margin: theme.spacing(1),
		minWidth: 120
	},
	layerTypeSelectControl: {
		display: "block",
    margin: theme.spacing(1),
    minWidth: 150,
  },
  paramTextFieldGroup: {
  	display: "flex"
  },
  paramTextField: {
  	margin: theme.spacing(1),
  	maxWidth: 150
  }
}))

const layer_type_map = {
	"conv_layer": "Convolutional",
	"pool_layer": "Pooling",
	"full_layer": "Fully Connected"
}


////////////////////////////////////////////////
// Helper Functions
////////////////////////////////////////////////
const getNextLayerOptions = (parent_layer_type, dialog_type) => {
	switch (parent_layer_type) {
		case "input_layer": {
			return ["conv_layer", "pool_layer", "full_layer"]
		}
		case "conv_layer": {
			if (dialog_type === 'edit') {
				return ["conv_layer", "pool_layer"]
			} else {
				return ["conv_layer", "pool_layer", "full_layer"]
			}
		}
		case "pool_layer": {
			if (dialog_type === 'edit') {
				return ["conv_layer", "pool_layer"]
			} else {
				return ["conv_layer", "pool_layer", "full_layer"]
			}
		}
		case "full_layer": {
			return ["full_layer"]
		}
	}
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

////////////////////////////////////////////////
// Edit Layer
////////////////////////////////////////////////
export default function EditLayer(params) {
	const classes = useStyles();

	////////////////////////////////////////////////
	// Subscribe to Contexts for this Dialog
	////////////////////////////////////////////////
	const {open, dialog_type} = useEditLayerDialogState();
	const dialogDispatch = useEditLayerDialogDispatch();

	const currentLayerState = useCurrentLayerState();
	const currentLayerDispatch = useCurrentLayerDispatch();

	const treePosState = useTreePosStoreState();
	const treePosDispatch = useTreePosStoreDispatch();

	const layerInfoStoreState = useLayerInfoStoreState();
	const layerInfoStoreDispatch = useLayerInfoStoreDispatch();

	const modelStoreDispatch = useModelStoreDispatch();

	////////////////////////////////////////////////
	// Calculate Sender Information
	////////////////////////////////////////////////
	const sender_pos = currentLayerState.sender_pos;
	const sender_pos_key = `${sender_pos.row}${sender_pos.group}${sender_pos.slot}`
	const sender_info = layerInfoStoreState[sender_pos_key]

	// Get information for Dialog
	const sender_layer_name = sender_info.layer_name
	const sender_layer_type = sender_info.layer_type
	const sender_layer_params = sender_info.layer_params;
	const parent_pos = sender_info.parent_pos;

	var disable_last_layer = false;
	if (dialog_type === 'edit') {
		if (sender_info.inModel) {
			disable_last_layer = true
		}
	}

	////////////////////////////////////////////////
	// Establish Dialog Hooks for storing Layer Info
	////////////////////////////////////////////////
	const next_layer_options = getNextLayerOptions(sender_layer_type, dialog_type)
	const [nextLayerName, setNextLayerName] = React.useState("New Layer")
	const [nextLayerType, setNextLayerType] = React.useState(next_layer_options[0])
	const [nextLayerParams, setNextLayerParams] = React.useState({})
	const [modelName, setModelName] = React.useState("New Model")

	///////////////////////////////////////////////////////
	// Edit Layer Functionality Methods
	///////////////////////////////////////////////////////
	const handleAdd = (event) => {
		event.preventDefault();

		// Calculate sender connection position
		const tree = treePosState;
		const parent = tree.rows[sender_pos.row].groups[sender_pos.group].slots[sender_pos.slot];

		var active_connections = parent.active_connections;
		active_connections = active_connections.filter( onlyUnique ); 

		const connection_pos = active_connections.length;
		const new_sender_pos = {...sender_pos, connection: connection_pos}

		// Add Child Position to Position Tree
		treePosDispatch({
			type: 'add_child', 
			sender_pos: new_sender_pos, 
		});

		// ADD Layer Information to LayerInfoStore
		const new_layer_pos_key = `${sender_pos.row + 1}${sender_pos.group}${sender_pos.slot}${connection_pos}`
		
		let next_layer_params;
		switch (nextLayerType) {
			case "conv_layer": {
				next_layer_params = pullConvParams();
				break;
			}
			case "pool_layer": {
				next_layer_params = pullPoolParams();
				break;
			}
			case "full_layer": {
				next_layer_params = pullFullParams();
				break
			}
		}

		layerInfoStoreDispatch({
			type: 'add', 
			layerID: new_layer_pos_key, 
			layer_info: {
				layer_name: nextLayerName,
				layer_type: nextLayerType,
				position: {
					row: sender_pos.row + 1,
					group: `${sender_pos.group}${sender_pos.slot}`,
					slot: connection_pos
				},
				parent_pos: sender_pos,
				layer_params: next_layer_params
			}
		})

		// Check if Last Layer is added
		var model_card_position_key;
		if (lastLayer) {

			// Add Position for Model Card
			treePosDispatch({
				type: 'add_child', 
				sender_pos: {
					row: sender_pos.row + 1,
					group: `${sender_pos.group}${sender_pos.slot}`,
					slot: connection_pos,
					connection: 0
				}
			});

			// Calculate position key of model card
			model_card_position_key = `${sender_pos.row + 2}${sender_pos.group}${sender_pos.slot}${connection_pos}0`
			layerInfoStoreDispatch({
			type: 'add', 
			layerID: model_card_position_key, 
			layer_info: {
				layer_name: modelName,
				layer_type: "model",
				layerID: model_card_position_key
			}
		})


			// Add Model Card in Layer Info Store

			///////////////////////////////////////////
			// Add Model to Model Context
			///////////////////////////////////////////
			params.addModel({
				parent_pos: {
					row: sender_pos.row + 1,
					group: `${sender_pos.group}${sender_pos.slot}`,
					slot: connection_pos
				},
				model_key: model_card_position_key,
				model_name: modelName
			})

			// Calculate layers

		}
		
		// Close Dialog
		dialogDispatch({open: false});

	}

	const handleSave = (event) => {
		event.preventDefault();

		// UPDATE Layer Information to LayerInfoStore
		let next_layer_params;
		switch (nextLayerType) {
			case "conv_layer": {
				next_layer_params = pullConvParams();
				break;
			}
			case "pool_layer": {
				next_layer_params = pullPoolParams();
				break;
			}
			case "full_layer": {
				next_layer_params = pullFullParams();
				break
			}
		}

		// Update Layer Info Store
		layerInfoStoreDispatch({
			type: 'update', 
			layerID: sender_pos_key, 
			layer_info: {
				layer_name: nextLayerName,
				layer_type: nextLayerType,
				layer_params: next_layer_params
			}
		})

		// Update Model if in Model
		if (sender_info.inModel) {
			params.editModelLayer({
				model_key: sender_info.inModel,
				layer_key: sender_pos_key
			})
		}
		

		// HACK (forces UI Update)
		treePosDispatch({type: 'init'});

		// Update Current Layer to be the current layer
		currentLayerDispatch({sender_pos: sender_pos});

		// Close Dialog
		dialogDispatch({open: false});
	}

	const handleDelete = (event) => {
		event.preventDefault();

		// Remove node from parent connections
		const tree = treePosState;
		const parent_pos = sender_info.parent_pos;
		const parent_node = tree.rows[parent_pos.row].groups[parent_pos.group].slots[parent_pos.slot]
		var active_connections = parent_node.active_connections
		active_connections = active_connections.filter( onlyUnique )
		active_connections.pop()
		parent_node.active_connections = active_connections;

		// Delete Sender Node Position from Position Tree
		treePosDispatch({
			type: 'delete_node', 
			sender_pos: sender_pos
		});

		// Delete Sender Node Information from Info Store
		layerInfoStoreDispatch({
			type: 'delete',
			layerID: sender_pos_key
		})

		// Check if the layer is in a model
		if (sender_info.inModel) {
			modelStoreDispatch({
				type: 'delete_model',
				modelID: sender_info.inModel
			})
		}


		// Set currentLayer to parent
		currentLayerDispatch({sender_pos: parent_pos});

		// Close Dialog
		dialogDispatch({open: false});
	}

	const handleCancel = (event) => {
		event.preventDefault();

		// Close Dialog
		dialogDispatch({open: false});
	}

	///////////////////////////////////////////////////////
	// Handle Changes of Layer Information
	///////////////////////////////////////////////////////
	const handleChangeNextLayerName = event => {
		setNextLayerName(event.target.value)
  };

  const handleChangeNextLayerType = event => {
  	setNextLayerType(event.target.value)
  }


	///////////////////////////////////////////////////////
	// Window Parameters
	///////////////////////////////////////////////////////
	const [windowWidth, setWindowWidth] = React.useState(5)
	const [windowHeight, setWindowHeight] = React.useState(5)
	const [windowChannels, setWindowChannels] = React.useState(16)
	const windowParams = (
		<div>
			<Typography variant="h6" align="left">Window Parameters</Typography>
			<div className={classes.paramTextFieldGroup}>
				<TextField
					className={classes.paramTextField}
	        type="number"
	        InputLabelProps={{
	          shrink: true,
	        }}
	        variant="outlined"
	        helperText="Window Width"
	        value={windowWidth}
	        onChange={(event) => setWindowWidth(event.target.value)}
	      />
       	<TextField
       		className={classes.paramTextField}
	        type="number"
	        InputLabelProps={{
	          shrink: true,
	        }}
	        variant="outlined"
	        helperText="Window Height"
	        value={windowHeight}
	        onChange={(event) => setWindowHeight(event.target.value)}
	      />
      	{nextLayerType === "pool_layer" ? null: <TextField
      		className={classes.paramTextField}
	        type="number"
	        InputLabelProps={{
	          shrink: true,
	        }}
	        variant="outlined"
	        helperText="Window Channels"
	        value={windowChannels}
	        onChange={(event) => setWindowChannels(event.target.value)}
	      />}
	     </div>

		</div>
	);

	///////////////////////////////////////////////////////
	// Stride Parameters
	///////////////////////////////////////////////////////
	const [strideX, setStrideX] = React.useState(1)
	const [strideY, setStrideY] = React.useState(1)
	const strideParams = (
		<div>
			<Typography variant="h6" align="left">Stride Parameters</Typography>
			<div className={classes.paramTextFieldGroup}>
				<TextField
					className={classes.paramTextField}
	        type="number"
	        InputLabelProps={{
	          shrink: true,
	        }}
	        variant="outlined"
	        helperText="X Stride"
	        value={strideX}
	        onChange={(event) => setStrideX(event.target.value)}
	      />
       	<TextField
       		className={classes.paramTextField}
	        type="number"
	        InputLabelProps={{
	          shrink: true,
	        }}
	        variant="outlined"
	        helperText="Y Stride"
	        value={strideY}
	        onChange={(event) => setStrideY(event.target.value)}
	      />
	     </div>
		</div>
	);

	///////////////////////////////////////////////////////
	// Fully Connected Parameters
	///////////////////////////////////////////////////////
	const [outputUnits, setOutputUnits] = React.useState(16)
	const [disableOutputUnits, setDisableOutputUnits] = React.useState(false);
	const [lastLayer, setLastLayer] = React.useState(false)
	const checkLastLayer = () => {

		if (layerInfoStoreState["000"].layer_params.dataset_name === "") {
			alert("Please Choose a Dataset before Finishing the Model!");
			return;
		}

		setLastLayer(!lastLayer);

		if (lastLayer) {
			setDisableOutputUnits(false)
		} else {
			setOutputUnits(layerInfoStoreState["000"].layer_params.labels);
			setDisableOutputUnits(true);
		}
	}
	const fullParams = (
		<div>
			<Typography variant="h6" align="left">Fully Connected Parameters</Typography>
			<div className={classes.paramTextFieldGroup}>
				<TextField
					className={classes.paramTextField}
	        type="number"
	        InputLabelProps={{
	          shrink: true,
	        }}
	        variant="outlined"
	        helperText="Output Units"
	        value={outputUnits}
	        onChange={(event) => setOutputUnits(event.target.value)}
	        disabled={disableOutputUnits}
	      />
       	<FormControlLabel
       		className={classes.paramTextField}
		      control={
	          <Checkbox
	            checked={lastLayer}
	            onChange={() => checkLastLayer()}
	            color="secondary"
	            disabled={disable_last_layer}
	          />
	        }
        	label="Last Layer?"
      	/>
	    </div>
   		{lastLayer ? (
   			<TextField
					className={classes.layerNameTextField}
	        label="Model Name"
	        defaultValue="Default Value"
	        value={modelName}
	        onChange={(event) => setModelName(event.target.value)}
	      />): null}
		</div>
	);

	///////////////////////////////////////////////////////
	// Activation and Regularization Parameters
	///////////////////////////////////////////////////////
	const activation_types = ["None", "Relu", "Sigmoid", "Tanh"]
	const regularization_types = ["None", "L1: Lasso", "L2: Ridge"]
	const [activationType, setActivationType] = React.useState("None")
	const [regularizationType, setRegularizationType] = React.useState("None")
	const activationParams = (
		<div>
			<Typography variant="h6" align="left">Activation & Regularization</Typography>
			<div className={classes.paramTextFieldGroup}>
				<FormControl className={classes.layerTypeSelectControl}>
	        <Select
	        	style={{minWidth: 150}}
	          labelId="activation-type-select-label"
	          variant="outlined"
	          value={activationType}
	          disabled={disableOutputUnits}
	          onChange={(event) => setActivationType(event.target.value)}
	        >
	          {activation_types.map(i => (
	          	<MenuItem value={i}>{i}</MenuItem>))}
	        </Select>
	        <FormHelperText>Activation Type</FormHelperText>
	      </FormControl>
	      <FormControl className={classes.layerTypeSelectControl}>
	        <Select
	        	style={{minWidth: 150}}
	          labelId="activation-type-select-label"
	          variant="outlined"
	          disabled={disableOutputUnits}
	          value={regularizationType}
	          onChange={(event) => setRegularizationType(event.target.value)}
	        >
	          {regularization_types.map(i => (
	          	<MenuItem value={i}>{i}</MenuItem>))}
	        </Select>
	        <FormHelperText>Activation Type</FormHelperText>
	      </FormControl>
		  </div>
		</div>
	);

	///////////////////////////////////////////////////////
	// Pooling Parameters
	///////////////////////////////////////////////////////
	const pooling_types = ["Maximum Pooling", "Average Pooling"]
	const [poolingType, setPoolingType] = React.useState(pooling_types[0])
	const poolingParams = (
		<div>
			<Typography variant="h6" align="left">Pooling Parameter</Typography>
			<div className={classes.paramTextFieldGroup}>
				<FormControl className={classes.layerTypeSelectControl}>
	        <Select
	        	style={{minWidth: 150}}
	          labelId="activation-type-select-label"
	          variant="outlined"
	          value={poolingType}
	          onChange={(event) => setPoolingType(event.target.value)}
	        >
	          {pooling_types.map(i => (
	          	<MenuItem value={i}>{i}</MenuItem>))}
	        </Select>
	        <FormHelperText>Pooling Type</FormHelperText>
	      </FormControl>
		  </div>
		</div>
	);

	///////////////////////////////////////////////////////
	// Parameter Pulling Methods
	///////////////////////////////////////////////////////
	const pullConvParams = () => ({
		window: {
			width: windowWidth,
			height: windowHeight,
			channels: windowChannels
		},
		stride: {
			x: strideX,
			y: strideY
		},
		activation: activationType,
		regularization: regularizationType
	});

	const pullPoolParams = () => ({
		window: {
			width: windowWidth,
			height: windowHeight,
			channels: windowChannels
		},
		stride: {
			x: strideX,
			y: strideY
		},
		pooling: poolingType
	});

	const pullFullParams = () => ({
		output: {
			units: outputUnits
		},
		last_layer: lastLayer,
		activation: activationType,
		regularization: regularizationType
	});

	///////////////////////////////////////////////////////
	// Setup Parameter Window given the Next Layer Type
	///////////////////////////////////////////////////////
	let parameter_window;
	switch (nextLayerType) {
		case "conv_layer": {
			parameter_window = (
				<div>
					{windowParams}
					{strideParams}
					{activationParams}
				</div>
			);
			break;
		}
		case "pool_layer": {
			parameter_window = (
				<div>
					{windowParams}
					{strideParams}
					{poolingParams}
				</div>
			);
			break;
		}
		case "full_layer": {
			parameter_window = (
				<div>
					{fullParams}
					{activationParams}
				</div>
			);
			break;
		}
	}

	///////////////////////////////////////////////////////
	// Setup Button Group given the Dialog Type
	///////////////////////////////////////////////////////
	let dialog_button_group;
	switch (dialog_type) {
		case "edit": {
			dialog_button_group = (
				<DialogActions>
	        <Button onClick={handleCancel} color="primary">
	          Cancel
	        </Button>
	        <Button onClick={handleSave} color="primary">
	          Save
	        </Button>
	        <Button onClick={handleDelete} color="primary">
	        	Delete 
	        </Button>
      	</DialogActions>
			)
			break;
		}
		case 'add': {
			dialog_button_group = (
				<DialogActions>
	        <Button onClick={handleCancel} color="primary">
	          Cancel
	        </Button>
	        <Button onClick={handleAdd} color="primary">
	          Add
	        </Button>
      	</DialogActions>
			)
			break;
		}
	}


	///////////////////////////////////////////////////////
	// Setup Default Parameters
	///////////////////////////////////////////////////////
	React.useEffect(() => {

		// Always set last layer to false
		setLastLayer(false);
		setDisableOutputUnits(false)

		// In Edit Mode -> set layer name to saved layer name
		if (dialog_type === 'edit') {
			setNextLayerName(sender_layer_name)
			setNextLayerType(sender_layer_type)

		// In Add Mode -> set layer name to default value
		} else {
			setNextLayerName("New Layer")
			setNextLayerType(next_layer_options[0])
		}

		if (dialog_type === 'edit') {

			// In Convolution and Pooling Layer -> Set window and stride info
			if ((sender_layer_type === 'conv_layer') | (sender_layer_type === 'pool_layer')) {
				setWindowWidth(sender_layer_params.window.width);
				setWindowHeight(sender_layer_params.window.height);
				setWindowChannels(sender_layer_params.window.channels);
				setStrideX(sender_layer_params.stride.x)
				setStrideY(sender_layer_params.stride.y)

				// In Convolution Type -> Set Activation and Regularization
				if (sender_layer_type === 'conv_layer') {
					setActivationType(sender_layer_params.activation)
					setRegularizationType(sender_layer_params.regularization)

				// In Pooling Type -> Set Activation and Regularization
				} else {
					setPoolingType(sender_layer_params.pooling)
				}
			}

			// In Dense Type -> Set Output, Last Layer, Acrtivation and Regularization
			else if (sender_layer_type === 'full_layer') {
				console.log(sender_layer_params.last_layer)
				setOutputUnits(sender_layer_params.output.units)
				setLastLayer(sender_layer_params.last_layer)
				setActivationType(sender_layer_params.activation)
				setDisableOutputUnits(lastLayer)
				setRegularizationType(sender_layer_params.regularization)
			}
		}

	// Run on Dialog open
	}, [open])



	return (
		<Dialog open={open} onClose={() => dialogDispatch(false)}>
			<DialogTitle style={{display: 'inline', float: 'left'}}>
			{(dialog_type === "edit" ? "Edit Layer": "Add Layer")}
			</DialogTitle>
			<DialogContent>
				<Typography variant="h6" align="left">Layer Information</Typography>

				<div className={classes.paramTextFieldGroup}>
					<TextField
						className={classes.layerNameTextField}
	          label="Layer Name"
	          defaultValue="Default Value"
	          value={nextLayerName}
	          onChange={handleChangeNextLayerName}
	        />
	        <FormControl className={classes.layerTypeSelectControl}>
		        <InputLabel shrink id="layer-type-select-label">
		          Layer Type
		        </InputLabel>
		        <Select
		          labelId="layer-type-select-label"
		          value={nextLayerType}
		          onChange={handleChangeNextLayerType}
		          displayEmpty
		        >
		          {next_layer_options.map(i => (
		          	<MenuItem value={i}>{layer_type_map[i]}</MenuItem>))}
		        </Select>
		      </FormControl>
		     </div>
		     {parameter_window}
			</DialogContent>
			{dialog_button_group}
		</Dialog>
	)
}
