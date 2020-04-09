import React from 'react';

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
      case 'delete': {
        delete state[[action.layerID]];
        return state;
      }
      case 'update': {
        state[[action.layerID]] = Object.assign({}, state[[action.layerID]], action.layer_info);
        return state;
      }
    }
  }, {
    "000": {
      layer_name: 'Input Layer',
      layer_type: 'input_layer',
      parent_pos: 'root',
      layer_params: {
        dataset_name: "",
        train_set_shape: "",
        test_set_shape: ""
      }
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