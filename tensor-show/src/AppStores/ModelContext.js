import React from 'react';

const ModelStateContext = React.createContext(null);
const ModelDispatchContext = React.createContext(null);

const CurrentLayerContextProvider = ({children}) => {

	// Define Hook
	const [modelState, setModelState] = React.useReducer((state, action) => {

		switch (action.type) {
			
		}

	}, {
		'models': [],
		'training_models': [],
		'trained_models': []

	})