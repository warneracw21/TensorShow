import React from 'react';
import ReactDOM from 'react-dom';

// Import Custom Components
import TensorShow from './TensorShow';

// Import Contexts
import { TreePosStoreProvider } from './AppStores/TreePosStore';
import { EditLayerDialogContextProvider } from './AppStores/EditLayerDialogContext';
import { CurrentLayerContextProvider } from './AppStores/CurrentLayerContext';
import { LayerInfoStoreProvider } from './AppStores/LayerInfoStore';
import { ModelStoreProvider } from './AppStores/ModelStore';
import { EditModelDialogContextProvider } from './AppStores/EditModelDialogContext';
import { ChooseDatasetDialogContextProvider } from './AppStores/ChooseDatasetDialogContext';

function App() {
  return (
    <div>
     
      <TreePosStoreProvider>
      <CurrentLayerContextProvider>
      <EditLayerDialogContextProvider>
      <EditModelDialogContextProvider>
      <LayerInfoStoreProvider>
      <ModelStoreProvider>
      <ChooseDatasetDialogContextProvider>
      
          <TensorShow/>

      </ChooseDatasetDialogContextProvider>
      </ModelStoreProvider>
      </LayerInfoStoreProvider>
      </EditModelDialogContextProvider>
      </EditLayerDialogContextProvider>
      </CurrentLayerContextProvider>
      </TreePosStoreProvider>

   </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

