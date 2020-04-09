import React from 'react';

const EditLayerDialogStateContext = React.createContext(null);
const EditLayerDialogDispatchContext = React.createContext(null);

const EditLayerDialogContextProvider = ({children}) => {

	// Define Hook
	const [openDialog, setOpenDialog] = React.useState({open: false});

	return (
		<EditLayerDialogStateContext.Provider value={ openDialog }>
			<EditLayerDialogDispatchContext.Provider value={ setOpenDialog }>
				{children}
			</EditLayerDialogDispatchContext.Provider>
		</EditLayerDialogStateContext.Provider>
	)
}

const useEditLayerDialogState = () => {
  const context = React.useContext(EditLayerDialogStateContext);
  if (context === undefined) {
    alert("Please place useDialogState in EditLayerDialogStateContext");
    return;
  } else {
    return context
  }
}

const useEditLayerDialogDispatch = () => {
  const context = React.useContext(EditLayerDialogDispatchContext);
  if (context === undefined) {
    alert("Please place useDialogDispatch in EditLayerDialogDispatchContext");
    return;
  } else {
    return context
  }
}

export { EditLayerDialogContextProvider, useEditLayerDialogState, useEditLayerDialogDispatch };