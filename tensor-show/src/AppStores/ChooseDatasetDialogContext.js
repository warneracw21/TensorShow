import React from 'react';

const ChooseDatasetDialogStateContext = React.createContext(null);
const ChooseDatasetDialogDispatchContext = React.createContext(null);

const ChooseDatasetDialogContextProvider = ({children}) => {

	// Define Hook
	const [openDialog, setOpenDialog] = React.useState({open: false});

	return (
		<ChooseDatasetDialogStateContext.Provider value={ openDialog }>
			<ChooseDatasetDialogDispatchContext.Provider value={ setOpenDialog }>
				{children}
			</ChooseDatasetDialogDispatchContext.Provider>
		</ChooseDatasetDialogStateContext.Provider>
	)
}

const useChooseDatasetDialogState = () => {
  const context = React.useContext(ChooseDatasetDialogStateContext);
  if (context === undefined) {
    alert("Please place useDialogState in ChooseDatasetDialogStateContext");
    return;
  } else {
    return context
  }
}

const useChooseDatasetDialogDispatch = () => {
  const context = React.useContext(ChooseDatasetDialogDispatchContext);
  if (context === undefined) {
    alert("Please place useDialogDispatch in ChooseDatasetDialogDispatchContext");
    return;
  } else {
    return context
  }
}

export { ChooseDatasetDialogContextProvider, useChooseDatasetDialogState, useChooseDatasetDialogDispatch };