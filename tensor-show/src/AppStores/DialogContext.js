import React from 'react';

const DialogStateContext = React.createContext(null);
const DialogDispatchContext = React.createContext(null);

const DialogContextProvider = ({children}) => {

	// Define Hook
	const [openDialog, setOpenDialog] = React.useState(false);

	return (
		<DialogStateContext.Provider value={ openDialog }>
			<DialogDispatchContext.Provider value={ setOpenDialog }>
				{children}
			</DialogDispatchContext.Provider>
		</DialogStateContext.Provider>
	)
}

const useDialogState = () => {
  const context = React.useContext(DialogStateContext);
  if (context === undefined) {
    alert("Please place useDialogState in DialogStateContext");
    return;
  } else {
    return context
  }
}

const useDialogDispatch = () => {
  const context = React.useContext(DialogDispatchContext);
  if (context === undefined) {
    alert("Please place useDialogDispatch in DialogDispatchContext");
    return;
  } else {
    return context
  }
}

export { DialogContextProvider, useDialogState, useDialogDispatch };