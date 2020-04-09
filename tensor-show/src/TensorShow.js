import React from 'react';

// Import Material-UI Components
import CssBaseline from '@material-ui/core/CssBaseline';

// Import Custom Components
import LayerTree from './Components/LayerTree';
import AppBar from './Components/Header';
import EditLayer from './Components/EditLayer';
import EditModel from './Components/EditModel';

// Import Contexts
import { useEditLayerDialogDispatch } from './AppStores/EditLayerDialogContext';
import { useEditModelDialogDispatch } from './AppStores/EditModelDialogContext';
import { useCurrentLayerDispatch } from './AppStores/CurrentLayerContext';
import { useLayerInfoStoreState, useLayerInfoStoreDispatch } from './AppStores/LayerInfoStore';
import { useModelStoreDispatch } from './AppStores/ModelStore';


export default function TensorShow() {

  // Subscribe to Contexts
  const dialogDispatch = useEditLayerDialogDispatch();
  const editModelDispatch = useEditModelDialogDispatch();
  const currentLayerDispatch = useCurrentLayerDispatch();
  
  const layerInfoStoreState = useLayerInfoStoreState();
  const layerInfoStoreDispatch = useLayerInfoStoreDispatch();

  const modelStoreDispatch = useModelStoreDispatch();


  ////////////////////////////////////////////////
  // Add Model
  ////////////////////////////////////////////////
  const addModel = ({parent_pos, model_name, model_key}) => {

    // Calculate the layers in the model
    var model_layers = []
    let tmp_parent_pos = parent_pos;
    let tmp_layer_key, tmp_layer_info;

    // Walk up tree to root
    while (tmp_parent_pos !== "root") {

      tmp_layer_key = `${tmp_parent_pos.row}${tmp_parent_pos.group}${tmp_parent_pos.slot}`
      tmp_layer_info = layerInfoStoreState[tmp_layer_key]
      tmp_parent_pos = tmp_layer_info.parent_pos;

      model_layers.push(tmp_layer_key);
    }

    
    // Get Layer Parameters
    var layer_params = model_layers.map(layer_pos_key => {

      layerInfoStoreDispatch({
        type: 'add_to_model',
        layerID: layer_pos_key,
        model_key: model_key
      })

      return layerInfoStoreState[layer_pos_key]
    });

    layer_params.reverse()

    // Update the ModelStore
    modelStoreDispatch({
      type: 'add_model', 
      model_key: model_key,
      model_name: model_name,
      layer_params: layer_params
    })



    // Call Save Model Route on API
    const url = 'http://0.0.0.0:5000/' + 'save'
    const fetchData = async () => {

      try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
              message: "TensorShow is Awesome",
              modelKey: model_key,
              modelLayers: layer_params
            })
          }).then((resp) => {
            console.log(resp.json())
            return resp.json()
          })
      } catch (error) {
      }
      
    }
    fetchData();


  }

  ////////////////////////////////////////////////
  // Add Child
  ////////////////////////////////////////////////
  const addChild = (event, sender_pos) => {
    event.preventDefault()
    
    // Set the current layer (the sender to dialog)
    currentLayerDispatch({sender_pos: sender_pos});

    // Open Dialog
    dialogDispatch({open: true, dialog_type: "add"});
    return;
  }

  ////////////////////////////////////////////////
  // Edit Layer
  ////////////////////////////////////////////////
  const editLayer = (event, sender_pos) => {
    event.preventDefault();

    // Set the current layer (the sender to dialog)
    currentLayerDispatch({sender_pos: sender_pos});

    // Open Dialog
    dialogDispatch({open: true, dialog_type: "edit"})
  }

  ////////////////////////////////////////////////
  // Edit Model
  ////////////////////////////////////////////////
  const editModel = (event, model_key) => {
    event.preventDefault();

    console.log(model_key)
    // Open Dialog
    editModelDispatch({open: true, model_key: model_key})

    console.log("Edit Model")
  }




  return (
    <div>
    	<CssBaseline/>
    	<AppBar/>
    	<div style={{position: "absolute", top: "10%"}}>
      	<LayerTree addChild={addChild} editLayer={editLayer} editModel={editModel}/>
      	<EditLayer addModel={addModel}/>
        <EditModel/>
      </div>
    </div>
  )
}