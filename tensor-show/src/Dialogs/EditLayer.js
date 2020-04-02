import React from 'react';

// Import Components
import { 
	Dialog, 
	DialogTitle, 
	DialogContent, 
	DialogContentText, 
	DialogActions } from '@material-ui/core';

import {
	Button } from '@material-ui/core';

// Import Contexts
import { useTreePosStoreState, useTreePosStoreDispatch } from '../AppStores/TreePosStore';
import { useDialogState, useDialogDispatch } from '../AppStores/DialogContext';
import { useCurrentLayerState } from '../AppStores/CurrentLayerContext';
import { useLayerInfoStoreState, useLayerInfoStoreDispatch } from '../AppStores/LayerInfoStore';

// Import Constants
import {CONV, POOL, FULL} from '../constants';


const getLayerOptions = (parent_layer_type) => {
	// Given the parent layer type, what are the possible next layers
	switch (parent_layer_type) {
		case CONV: {
			return [CONV, POOL, FULL]
		}
		case POOL: {
			return [CONV, POOL, FULL]
		}
		case FULL: {
			return [FULL]
		}
	}
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

export default function EditLayer() {

	// Necessary Information
	// 1) LayerID (where do we store the new information)
	// 2) Layer Information (do we start from scratch or is there old information to update)
	// 3) Parent Type (this is how we limit what options the next layer can be)

	// Enter into the context of this dialog
	const dialogState = useDialogState();
	const dialogDispatch = useDialogDispatch();

	const currentLayerState = useCurrentLayerState();
	const new_hash = currentLayerState.hash;
	const sender_pos = currentLayerState.sender_pos;

	const treePosState = useTreePosStoreState();
	const treePosDispatch = useTreePosStoreDispatch();

	const layerInfoStoreState = useLayerInfoStoreState();
	const layerInfoStoreDispatch = useLayerInfoStoreDispatch();

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
			hash: new_hash,
		});
		// console.log("Ending Dispatch Signal")

		// Step 1) Register layerID and layer_info to LayerInfoStore
		layerInfoStoreDispatch({type: 'add', layerID: new_hash, layer_info: {layer_name: 'layer1'}})
		
		// Step 3) Close Dialoge
		dialogDispatch(false);

	}

	const handleDelete = (event) => {

		treePosDispatch({
			type: 'delete_node', 
			sender_pos: sender_pos
		});

		dialogDispatch(false);

	}

	const handleCancel = (event) => {
		event.preventDefault();
		dialogDispatch(false);

	}

	// // Pull Parameters
	// const layerID = params.layerID;
	// const layer_info = params.layer_info;

	// // Calculate necessary constants
	// let layer_params;
	// layer_params = (layer_info.params === undefined) ? null: layer_info.params;

	// let layer_type;
	// layer_type = (layer_info.layer_type === undefined) ? CONV: layer_info.layer_type;

	// const parent_type = layer_info.parent_type;
	// const next_layer_options = getLayerOptions(parent_type);

	return (
		<Dialog open={dialogState} onClose={() => dialogDispatch(false)}>
			<DialogTitle style={{display: 'inline', float: 'left'}}>EditLayer</DialogTitle>
			<DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAdd} color="primary">
          Add
        </Button>
        <Button onClick={handleDelete} color="primary">
        	Delete 
        </Button>
      </DialogActions>
		</Dialog>
	)




}
