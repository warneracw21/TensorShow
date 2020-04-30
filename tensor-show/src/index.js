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
import { ModelTrainStoreProvider } from './AppStores/ModelTrainStore';
import { ServeModelFileProvider } from './AppStores/ServeModelFileContext';

function App() {
  return (
    <div>
     
      <TreePosStoreProvider>
      <CurrentLayerContextProvider>
      <EditModelDialogContextProvider>
      <LayerInfoStoreProvider>
      <ModelStoreProvider>
      <ChooseDatasetDialogContextProvider>
      <EditLayerDialogContextProvider>
      <ModelTrainStoreProvider>
      <ServeModelFileProvider>
      
          <TensorShow/>

      </ServeModelFileProvider>
      </ModelTrainStoreProvider>
      </EditLayerDialogContextProvider>
      </ChooseDatasetDialogContextProvider>
      </ModelStoreProvider>
      </LayerInfoStoreProvider>
      </EditModelDialogContextProvider>
      </CurrentLayerContextProvider>
      </TreePosStoreProvider>

   </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

