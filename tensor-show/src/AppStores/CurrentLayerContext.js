import React from 'react';

const CurrentLayerStateContext = React.createContext(null);
const CurrentLayerDispatchContext = React.createContext(null);

const CurrentLayerContextProvider = ({children}) => {

	// Define Hook
	const [currentLayer, setCurrentLayer] = React.useState({
                                                sender_pos: {
                                                    row: 0,
                                                    group: 0,
                                                    slot: 0
                                                }});

	return (
		<CurrentLayerStateContext.Provider value={ currentLayer }>
			<CurrentLayerDispatchContext.Provider value={ setCurrentLayer }>
				{children}
			</CurrentLayerDispatchContext.Provider>
		</CurrentLayerStateContext.Provider>
	)
}

const useCurrentLayerState = () => {
  const context = React.useContext(CurrentLayerStateContext);
  if (context === undefined) {
    alert("Please place useCurrentLayerState in CurrentLayerStateContext");
    return;
  } else {
    return context
  }
}

const useCurrentLayerDispatch = () => {
  const context = React.useContext(CurrentLayerDispatchContext);
  if (context === undefined) {
    alert("Please place useCurrentLayerDispatch in CurrentLayerDispatchContext");
    return;
  } else {
    return context
  }
}

export { CurrentLayerContextProvider, useCurrentLayerState, useCurrentLayerDispatch };