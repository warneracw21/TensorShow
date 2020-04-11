import React from 'react';

// Import Styling Tools
import { makeStyles } from '@material-ui/core/styles';

// Import Components
import {
	Paper,
	Button,
	Typography
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		height: 275,
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
	contentDivider: {
		position: 'absolute',
		left: "47.5%",
		top: 10,
		borderLeft: '2px solid black',
		height: 130
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

	const labels = ["Window Size", "Stride Size", "Activation", "Regularization"]
	const values = ["500 x 100 x 132", "X: 25, Y: 30", "Sigmoid", "Regularization"]

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
			onClick={(event) => params.editModel(event)}>>
			Choose Dataset
		</Button>
	);

	const add_layer_button = (
		<Button size="small" className={classes.addLayerButton} variant="contained" 
			onClick={(event) => params.addChild(event, params.sender_pos)}>
			Add Layer
		</Button>
	);

	const header = (
		<div className={classes.header}>
			<Typography variant="h6" align="center">{params.layerName}</Typography>
			{(params.layerType === "input_layer") ? choose_dataset_button: edit_layer_button}
		</div>
	)

	const content_view = (
		<Paper className={classes.contentBox}>
			<div className={classes.labelBox}>
				{params.labels.map(label => (<Typography variant="body2">{label}</Typography>))}
			</div>
			<div className={classes.contentDivider}/>
			<div className={classes.valueBox}>
			{params.values.map(value => (<Typography variant="body2">{value}</Typography>))}
			</div>
		</Paper>
	);

	return (
		<Paper className={classes.root}>
			{header}
			{content_view}
			{(params.addChild === undefined) ? null: add_layer_button}
		</Paper>
	);
}