import React from 'react';

// Import Custom Components
import LayerTree from './LayerTree';
import EditLayer from './Dialogs/EditLayer';


export default function TensorShow() {


  return (
    <div>
      <LayerTree/>
      <EditLayer/>
    </div>
  )
}