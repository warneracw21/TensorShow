import React from 'react';
import ReactDOM from 'react-dom';

// Import Custom Components
import TensorShow from './TensorShow';

// Import Contexts
import { TreePosStoreProvider } from './AppStores/TreePosStore';
import { DialogContextProvider } from './AppStores/DialogContext';
import { CurrentLayerContextProvider } from './AppStores/CurrentLayerContext';
import { LayerInfoStoreProvider } from './AppStores/LayerInfoStore';

function App() {
  return (
    <div>
     
      <TreePosStoreProvider>
      <CurrentLayerContextProvider>
      <DialogContextProvider>
      <LayerInfoStoreProvider>
      
          <TensorShow/>

      </LayerInfoStoreProvider>
      </DialogContextProvider>
      </CurrentLayerContextProvider>
      </TreePosStoreProvider>

   </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

