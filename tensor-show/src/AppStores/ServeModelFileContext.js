import React from 'react';

const ServeModelFileStateContext = React.createContext(null);
const ServeModelFileDispatchContext = React.createContext(null);

const ServeModelFileProvider = ({children}) => {

	// Define Hook
	const [modelFile, setModelFile] = React.useState(null);

	return (
		<ServeModelFileStateContext.Provider value={ modelFile }>
			<ServeModelFileDispatchContext.Provider value={ setModelFile }>
				{children}
			</ServeModelFileDispatchContext.Provider>
		</ServeModelFileStateContext.Provider>
	)
}

const useServeModelFileState = () => {
  const context = React.useContext(ServeModelFileStateContext);
  if (context === undefined) {
    alert("Please place useCurrentLayerState in CurrentLayerStateContext");
    return;
  } else {
    return context
  }
}

const useServeModelFileDispatch = () => {
  const context = React.useContext(ServeModelFileDispatchContext);
  if (context === undefined) {
    alert("Please place useCurrentLayerDispatch in CurrentLayerDispatchContext");
    return;
  } else {
    return context
  }
}

export { ServeModelFileProvider, useServeModelFileState, useServeModelFileDispatch };