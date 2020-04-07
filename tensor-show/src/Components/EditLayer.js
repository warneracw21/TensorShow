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

// Import Contexts
import { useTreePosStoreState, useTreePosStoreDispatch } from '../AppStores/TreePosStore';
import { useDialogState, useDialogDispatch } from '../AppStores/DialogContext';
import { useCurrentLayerState } from '../AppStores/CurrentLayerContext';
import { useLayerInfoStoreState, useLayerInfoStoreDispatch } from '../AppStores/LayerInfoStore';

// Declare Constants
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

// Declare Contexts
const NextLayerTypeContext = React.createContext(null);
const NextLayerParamsContext = React.createContext(null);


////////////////////////////////////////////////
// Helper Functions
////////////////////////////////////////////////
const getNextLayerOptions = (parent_layer_type) => {
	switch (parent_layer_type) {
		case "input_layer": {
			return ["conv_layer", "pool_layer", "full_layer"]
		}
		case "conv_layer": {
			return ["conv_layer", "pool_layer", "full_layer"]
		}
		case "pool_layer": {
			return ["conv_layer", "pool_layer", "full_layer"]
		}
		case "full_layer": {
			return ["full_layer"]
		}
	}
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

export default function EditLayer() {
	const classes = useStyles();

	// Necessary Information
	// 1) LayerID (where do we store the new information)
	// 2) Layer Information (do we start from scratch or is there old information to update)
	// 3) Parent Type (this is how we limit what options the next layer can be)

	// Enter into the context of this dialog
	const {open, dialog_type} = useDialogState();
	const dialogDispatch = useDialogDispatch();

	const currentLayerState = useCurrentLayerState();
	const sender_pos = currentLayerState.sender_pos;
	const sender_pos_key = `${sender_pos.row}${sender_pos.group}${sender_pos.slot}`

	const treePosState = useTreePosStoreState();
	const treePosDispatch = useTreePosStoreDispatch();

	const layerInfoStoreState = useLayerInfoStoreState();
	const layerInfoStoreDispatch = useLayerInfoStoreDispatch();
	const sender_info = layerInfoStoreState[sender_pos_key]

	// Get information for Dialog
	const sender_layer_name = sender_info.layer_name
	const sender_layer_type = sender_info.layer_type
	const sender_layer_params = sender_info.layer_params;
	console.log(sender_layer_name, sender_layer_type, sender_layer_params)

	// Set up Dialog Content for next layer
	const next_layer_options = getNextLayerOptions(sender_layer_type)
	const [nextLayerName, setNextLayerName] = React.useState("New Layer")
	const [nextLayerType, setNextLayerType] = React.useState(next_layer_options[0])
	const [nextLayerParams, setNextLayerParams] = React.useState({})

	///////////////////////////////////////////////////////
	// Edit Layer Functionality Methods
	///////////////////////////////////////////////////////
	const handleAdd = (event) => {
		event.preventDefault();

		// Calculate sender connection position
		var tree = treePosState;
		var parent = tree.rows[sender_pos.row].groups[sender_pos.group].slots[sender_pos.slot];

		var active_connections = parent.active_connections;
		active_connections = active_connections.filter( onlyUnique ); 

		const connection_pos = active_connections.length;

		////////////////////////////////////
		// LIMIT ACTIVE CONNECTIONS TO N=5
		////////////////////////////////////
		if (connection_pos > 4) {
			alert("Limit Number of Connections Exceeded (N = 5)");
			dialogDispatch(false);
			return;
		}

		let new_sender_pos = {...sender_pos, connection: connection_pos}

		// console.log("Sending Dispatch Signal")
		// Step 2) Register new layer to layer_tree with associated hash (for retrieval)
		treePosDispatch({
			type: 'add_child', 
			sender_pos: new_sender_pos, 
		});
		// console.log("Ending Dispatch Signal")

		// Step 1) Register layerID and layer_info to LayerInfoStore
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
				layer_params: next_layer_params
			}
		})
		
		// Step 3) Close Dialog
		dialogDispatch({open: false});

	}

	const handleSave = (event) => {
		event.preventDefault();

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
			layerID: sender_pos_key, 
			layer_info: {
				layer_name: nextLayerName,
				layer_type: nextLayerType,
				layer_params: next_layer_params
			}
		})
		dialogDispatch({open: false});
	}

	const handleDelete = (event) => {
		event.preventDefault();

		treePosDispatch({
			type: 'delete_node', 
			sender_pos: sender_pos
		});
		dialogDispatch({open: false});
	}

	const handleCancel = (event) => {
		event.preventDefault();

		dialogDispatch({open: false});
	}

	///////////////////////////////////////////////////////
	// Layer Parameters
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
      	<TextField
      		className={classes.paramTextField}
	        type="number"
	        InputLabelProps={{
	          shrink: true,
	        }}
	        variant="outlined"
	        helperText="Window Channels"
	        value={windowChannels}
	        onChange={(event) => setWindowChannels(event.target.value)}
	      />
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
	        onChange={(event) => setStrideX(event.value.target)}
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
	        onChange={(event) => setStrideY(event.value.target)}
	      />
	     </div>
		</div>
	);

	///////////////////////////////////////////////////////
	// Fully Connected Parameters
	///////////////////////////////////////////////////////
	const [outputUnits, setOutputUnits] = React.useState(16)
	const [lastLayer, setLastLayer] = React.useState(false)
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
	        value={strideX}
	        onChange={(event) => setStrideX(event.target.value)}
	      />
       	<FormControlLabel
       		className={classes.paramTextField}
		      control={
	          <Checkbox
	            checked={lastLayer}
	            onChange={() => setLastLayer(!lastLayer)}
	            color="secondary"
	          />
	        }
        	label="Last Layer?"
      	/>
	     </div>
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
	const pooling_types = ["None", "Maximum Pooling", "Average Pooling", "Minimum Pooling"]
	const [poolingType, setPoolingType] = React.useState("None")
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
		if (dialog_type === 'edit') {
			setNextLayerName(sender_layer_name)
			setNextLayerType(sender_layer_type)
		} else {
			setNextLayerName("New Layer")
			setNextLayerType(next_layer_options[0])
		}

		if (dialog_type === 'edit') {
			if ((sender_layer_type === 'conv_layer') | (sender_layer_type === 'pool_layer')) {
				setWindowWidth(sender_layer_params.window.width);
				setWindowHeight(sender_layer_params.window.height);
				setWindowChannels(sender_layer_params.window.channels);
				setStrideX(sender_layer_params.stride.x)
				setStrideY(sender_layer_params.stride.y)

				if (sender_layer_type === 'conv_layer') {
					setActivationType(sender_layer_params.activation)
					setRegularizationType(sender_layer_params.regularization)
				} else {
					setPoolingType(sender_layer_params.pooling)
				}
			}
			else if (sender_layer_type === 'full_layer') {
				setOutputUnits(sender_layer_params.output.units)
				setLastLayer(sender_layer_params.last_layer)
				setActivationType(sender_layer_params.activation)
				setRegularizationType(sender_layer_params.regularization)
			}
		}
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





