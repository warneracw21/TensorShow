import React from 'react';

// Import Styling Tools
import { makeStyles } from '@material-ui/core/styles';

// Import Components
import {
	Paper,
	Button,
	Typography
} from '@material-ui/core';

// Subscribe to LayerInfo Context
import { useLayerInfoStoreState, useLayerInfoStoreDispatch } from '../AppStores/LayerInfoStore';
import { useModelStoreState, useModelStoreDispatch } from '../AppStores/ModelStore';

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		height: 275,
		width: 250,
		backgroundColor: "#f5f5f5"
	},
	rootModel: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		height: 150,
		width: 250,
		backgroundColor: "#f5f5f5"
	},
	header: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		paddingTop: 5,
		height: 70,
		width: "100%",
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		boxShadow: "0px 2px 2px grey",
		backgroundColor: "#ff911c"
	},
	editButton: {
		marginTop: 1,
		width: "60%",
		backgroundColor: "#bf711d"
	},
	addLayerButton: {
		marginTop: 10,
		width: "60%",
	},

	contentBox: {
		position: 'relative',
		marginTop: 10,
		height: 150,
		width: 240,
		borderRadius: 10,
		boxShadow: "0px 2px 2px grey",
		// backgroundColor: "#e6e6e6"

	},
	contentBoxModel: {
		position: 'relative',
		marginTop: 10,
		height: 100,
		width: 240,
		borderRadius: 10,
		boxShadow: "0px 2px 2px grey",
		// backgroundColor: "#e6e6e6"

	},
	contentDivider: {
		position: 'absolute',
		left: "47.5%",
		top: "5%",
		borderLeft: '2px solid black',
		height: "90%"
	},

	labelBox: {
		position: "absolute",
		paddingRight: 5,
		top: 0,
		left: 0,
		height: "100%",
		width: "45%",
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-end",
		justifyContent: "space-evenly"
	},

	valueBox: {
		position: "absolute",
		paddingLeft: 10,
		top: 0,
		left: "50%",
		height: "100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		justifyContent: "space-evenly"
	},


}))

export default function LayerCard(params) {
	const classes = useStyles();

	const modelStoreState = useModelStoreState();
	const layerInfoStore = useLayerInfoStoreState();
  const layerInfoDispatch = useLayerInfoStoreDispatch();

	const layer_info = layerInfoStore[params.layerID]

	// Extract Parameters
	const layer_name = layer_info.layer_name;
	const layer_type = layer_info.layer_type;
	const layer_params = layer_info.layer_params;

	///////////////////////////////////////////////
	// Helper functions for Extracting Params
	///////////////////////////////////////////////
	const extract_input_params = () => {
		
		const dataset_label = "Dataset Name"
		const dataset_value = layer_params.dataset_name

		const shape_label = "Dataset Shape"
		const shape_value = layer_params.shape

		const labels_label = 'Dataset Labels'
		const labels_value = layer_params.labels

		return {
			labels: [dataset_label, shape_label, labels_label],
			values: [dataset_value, shape_value, labels_value]
		}
	}

	const extract_conv_params = () => {
		
		const window_label = "Window Shape"
		const window_value = `${layer_params.window.width} x ${layer_params.window.height} x ${layer_params.window.channels}`

		const stride_label = "Window Stride"
		const stride_value = `X: ${layer_params.stride.x}, Y: ${layer_params.stride.x}`

		const activation_label = 'Activation';
		const activation_value = layer_params.activation;

		const reg_label = 'Regularization'
		const reg_value = layer_params.regularization;

		return {
			labels: [window_label, stride_label, activation_label, reg_label],
			values: [window_value, stride_value, activation_value, reg_value]
		}
	}

	const extract_pool_params = () => {

		const window_label = "Window Shape"
		const window_value = `${layer_params.window.width} x ${layer_params.window.height} x ${layer_params.window.channels}`

		const stride_label = "Window Stride"
		const stride_value = `X: ${layer_params.stride.x}, Y: ${layer_params.stride.x}`

		const pooling_label = "Pooling"
		const pooling_value = layer_params.pooling


		return {
			labels: [window_label, stride_label, pooling_label],
			values: [window_value, stride_value, pooling_value]
		}
	}

	const extract_full_params = () => {
		
		const output_label = "Output Units"
		const output_value = layer_params.output.units;

		const activation_label = 'Activation';
		const activation_value = layer_params.activation;

		const reg_label = 'Regularization'
		const reg_value = layer_params.regularization;


		return {
			labels: [output_label, activation_label, reg_label],
			values: [output_value, activation_value, reg_value]
		}
	}

	var label_value_obj;
	var labels, values;
	switch (layer_type) {
		case ("input_layer"): {
			label_value_obj = extract_input_params();
			break;
		}
		case ("conv_layer"): {
			label_value_obj = extract_conv_params();
			break;
		}
		case ("pool_layer"): {
			label_value_obj = extract_pool_params();
			break;
		}
		case ("full_layer"): {
			label_value_obj = extract_full_params();
			break;
		}
		case ("model"): {
			label_value_obj = {
				'labels': ["Model Depth"],
				'values': [modelStoreState[params.layerID].layerIDs.length - 1]
			}
		}
	}

	labels = label_value_obj.labels;
	values = label_value_obj.values;

	///////////////////////////////////////////////
	// Dialog Components
	///////////////////////////////////////////////
	const edit_layer_button = (
		<Button size="small" className={classes.editButton} variant="contained"
			onClick={(event) => params.editLayer(event, params.sender_pos)}>
			Edit Layer
		</Button>
	);

	const choose_dataset_button = (
		<Button size="small" className={classes.editButton} variant="contained"
			onClick={(event) => params.chooseDataset(event)}>
			Choose Dataset
		</Button>
	);

	const edit_model_button = (
		<Button size="small" className={classes.editButton} variant="contained"
			onClick={(event) => params.editModel(event, params.layerID)}>
			View Model
		</Button>
	);

	const add_layer_button = (
		<Button size="small" className={classes.addLayerButton} variant="contained" 
			onClick={(event) => params.addChild(event, params.sender_pos)}>
			Add Layer
		</Button>
	);

	var top_button = edit_layer_button;
	if (layer_type === "input_layer") {
		top_button = choose_dataset_button;
	} else if (layer_type === "model") {
		top_button = edit_model_button;
	}
	const header = (
		<div className={classes.header}>
			<Typography variant="h6" align="center">{layer_name}</Typography>
			{top_button}
		</div>
	)

	const content_view = (
		<Paper className={(layer_type === "model") ? classes.contentBoxModel : classes.contentBox}>
			<div className={classes.labelBox}>
				{labels.map(label => (<Typography variant="body2">{label}</Typography>))}
			</div>
			<div className={classes.contentDivider}/>
			<div className={classes.valueBox}>
			{values.map(value => (<Typography variant="body2">{value}</Typography>))}
			</div>
		</Paper>
	);

	let bottom_button = add_layer_button;
	if (layer_type === "full_layer") {
		if (layer_params.last_layer) {
			bottom_button = null;
		}
	} else if (layer_type === "model") {
		bottom_button = null;
	}

	return (
		<Paper className={(layer_type === "model")? classes.rootModel: classes.root}>
			{header}
			{content_view}
			{bottom_button}
		</Paper>
	);
}