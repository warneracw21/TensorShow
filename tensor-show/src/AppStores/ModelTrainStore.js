import React from 'react';

const ModelTrainStoreStateContext = React.createContext(null);
const ModelTrainStoreDispatchContext = React.createContext(null);

const ModelTrainStoreProvider = ({children}) => {

	// Define Hook
	const [modelTrainState, setModelTrainState] = React.useReducer((state, action) => {

		switch (action.type) {
			case ('add_model'): {
				state[action.model_key] = {
					metrics: {
						accuracy: [],
						loss: []
					},
					status: "training",
					progress: 0,
				}
			}
			case ("update_accuracy"): {
				state[action.model_key].metrics["accuracy"].push(action.accuracy)
			}
			case ("update_loss"): {
				state[action.model_key].metrics["loss"].push(action.loss)
			}
			case ("update_progress"): {
				state[action.model_key].progress = action.progress
			}
			case ("update_status"): {
				state[action.model_key].status = action.status
			}
		}

	}, {})

	return (
		<ModelTrainStoreStateContext.Provider value={ modelTrainState }>
			<ModelTrainStoreDispatchContext.Provider value={ setModelTrainState }>
				{children}
			</ModelTrainStoreDispatchContext.Provider>
		</ModelTrainStoreStateContext.Provider>
	)
}

const useModelTrainStoreState = () => {
  const context = React.useContext(ModelTrainStoreStateContext);
  if (context === undefined) {
    alert("Please place useModelTrainStoreState in ModelTrainStoreStateContext");
    return;
  } else {
    return context
  }
}

const useModelTrainStoreDispatch = () => {
  const context = React.useContext(ModelTrainStoreDispatchContext);
  if (context === undefined) {
    alert("Please place useModelTrainStoreDispatch in ModelTrainStoreDispatchContext");
    return;
  } else {
    return context
  }
}

export { ModelTrainStoreProvider, useModelTrainStoreState, useModelTrainStoreDispatch };