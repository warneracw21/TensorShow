import React from 'react';

// Import styles
import { useStyles } from './styles';

// Import Custom Components
import TensorShow from './TensorShow';

// Import Contexts
import { TreePosStoreProvider } from './AppStores/TreePosStore';
import { DialogContextProvider } from './AppStores/DialogContext';
import { CurrentLayerContextProvider } from './AppStores/CurrentLayerContext';
import { LayerInfoStoreProvider } from './AppStores/LayerInfoStore';

function App() {
  const classes = useStyles();

  return (
    <div className={classes.app}>
     
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

export default App;
