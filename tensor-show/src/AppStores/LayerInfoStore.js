import React from 'react';
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

const LayerInfoStoreStateContext = React.createContext(null);
const LayerInfoStoreDispatchContext = React.createContext(null);

const LayerInfoStoreProvider = ({children}) => {

	// Define Hook
	const [layerInfoStoreState, layerInfoStoreDispatch] = React.useReducer((state, action) => {

    switch (action.type) {
      case 'add': {
        state[[action.layerID]] = action.layer_info;
        return state;
      }
    }
  }, {
    [Base64.stringify(sha256(0))]: {
      layer_name: 'Input Layer',
      layer_type: 'input_layer',
      layer_params: {}
    }
  })

	return (
		<LayerInfoStoreStateContext.Provider value={ layerInfoStoreState }>
			<LayerInfoStoreDispatchContext.Provider value={ layerInfoStoreDispatch }>
				{children}
			</LayerInfoStoreDispatchContext.Provider>
		</LayerInfoStoreStateContext.Provider>
	)
}

const useLayerInfoStoreState = () => {
  const context = React.useContext(LayerInfoStoreStateContext);
  if (context === undefined) {
    alert("Please place useCurrentLayerState in LayerInfoStoreStateContext");
    return;
  } else {
    return context
  }
}

const useLayerInfoStoreDispatch = () => {
  const context = React.useContext(LayerInfoStoreDispatchContext);
  if (context === undefined) {
    alert("Please place useCurrentLayerDispatch in LayerInfoStoreDispatchContext");
    return;
  } else {
    return context
  }
}

export { LayerInfoStoreProvider, useLayerInfoStoreState, useLayerInfoStoreDispatch };