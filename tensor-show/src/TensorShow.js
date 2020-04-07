import React from 'react';

// Import Material-UI Components
import CssBaseline from '@material-ui/core/CssBaseline';

// Import Custom Components
import LayerTree from './Components/LayerTree';
import AppBar from './Components/Header';
import EditLayer from './Components/EditLayer';


export default function TensorShow() {


  return (
    <div>
    	<CssBaseline/>
    	<AppBar/>
    	<div style={{position: "absolute", top: "10%"}}>
      	<LayerTree/>
      	<EditLayer/>
      </div>
    </div>
  )
}