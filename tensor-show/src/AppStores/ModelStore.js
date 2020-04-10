import React from 'react';

const ModelStoreStateContext = React.createContext(null);
const ModelStoreDispatchContext = React.createContext(null);

const ModelStoreProvider = ({children}) => {

	// Define Hook
	const [modelState, setModelState] = React.useReducer((state, action) => {

		switch (action.type) {
			case 'add_model': {
				state[[action.model_key]] = {
					status: 'init',
					model_name: action.model_name,
					layer_params: action.layer_params
				}

				console.log(state)
				return state;
			}

			case 'delete_model': {
				delete state[[action.model_key]]
				return state;
			}

			case 'update_status': {

				state[[action.model_key]].status = action.status
			}

			
		}

	}, {})

	return (
		<ModelStoreStateContext.Provider value={ modelState }>
			<ModelStoreDispatchContext.Provider value={ setModelState }>
				{children}
			</ModelStoreDispatchContext.Provider>
		</ModelStoreStateContext.Provider>
	)
}

const useModelStoreState = () => {
  const context = React.useContext(ModelStoreStateContext);
  if (context === undefined) {
    alert("Please place useCurrentLayerState in ModelStoreStateContext");
    return;
  } else {
    return context
  }
}

const useModelStoreDispatch = () => {
  const context = React.useContext(ModelStoreDispatchContext);
  if (context === undefined) {
    alert("Please place useCurrentLayerDispatch in ModelStoreDispatchContext");
    return;
  } else {
    return context
  }
}

export { ModelStoreProvider, useModelStoreState, useModelStoreDispatch };