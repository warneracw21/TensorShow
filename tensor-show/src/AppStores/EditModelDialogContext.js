import React from 'react';

const EditModelDialogStateContext = React.createContext(null);
const EditModelDialogDispatchContext = React.createContext(null);

const EditModelDialogContextProvider = ({children}) => {

	// Define Hook
	const [editModelDialog, setEditModelDialog] = React.useState({open: false, model_key: null});

	return (
		<EditModelDialogStateContext.Provider value={ editModelDialog }>
			<EditModelDialogDispatchContext.Provider value={ setEditModelDialog }>
				{children}
			</EditModelDialogDispatchContext.Provider>
		</EditModelDialogStateContext.Provider>
	)
}

const useEditModelDialogState = () => {
  const context = React.useContext(EditModelDialogStateContext);
  if (context === undefined) {
    alert("Please place useCurrentLayerState in EditModelDialogStateContext");
    return;
  } else {
    return context
  }
}

const useEditModelDialogDispatch = () => {
  const context = React.useContext(EditModelDialogDispatchContext);
  if (context === undefined) {
    alert("Please place useCurrentLayerDispatch in EditModelDialogDispatchContext");
    return;
  } else {
    return context
  }
}

export { EditModelDialogContextProvider, useEditModelDialogState, useEditModelDialogDispatch };