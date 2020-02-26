import React from 'react';

const SVGCardStoreStateContext = React.createContext(null);
const SVGCardStoreDispatchContext = React.createContext(null);

const SVGCardStoreProvider = (params) => {

	// Set up State and Reducer for SVGCardContext
	const [cardStoreState, cardStoreDispatch] = React.useReducer((state, action) => {

		switch (action.type) {
			
			// Add new card to Store
			case ('add'): {

				var newState = [...state]

				const senderRow = action.senderPos.row;
				const senderColumn = action.senderPos.column;

				// Is there another row in the model yet?
				if (newState[senderRow + 1] === undefined) {
					newState[senderRow + 1] = []
				}

				// Set active connection in parent
				newState[senderRow][senderColumn].activeConnections[action.connPos] = true

				// Column ID will be 1 more then length of next column from row
				const column = newState[senderRow + 1].length
				const row = action.senderPos.row + 1


				const params = {
					x: 50 + column*250,
					y: 50 + row*300,
					activeConnections: [false, false, false, false]
				};

				newState[row][column] = params;

				console.log(newState)
				return newState;

				}
			default: {
				console.log('default')
			}
			}
		}, 

		[
			[
				{x: 650, y:100, activeConnections: [false, false, false, false]}
			]
		] 
	
	)

	return (
		<SVGCardStoreStateContext.Provider value={ cardStoreState }>
			<SVGCardStoreDispatchContext.Provider value ={ cardStoreDispatch }>
				{params.children}
			</SVGCardStoreDispatchContext.Provider>
		</SVGCardStoreStateContext.Provider>
	)
}

const useSVGCardStoreState = () => {
	const context = React.useContext(SVGCardStoreStateContext);
	if (context === undefined) {
		alert("Please place useSVGCardStoreState in SVGCardStoreProvider");
		return;
	} else {
		return context
	}
}

const useSVGCardStoreDispatch = () => {
	const context = React.useContext(SVGCardStoreDispatchContext);
	if (context === undefined) {
		alert("Please place useSVGCardStoreState in SVGCardStoreProvider");
		return;
	} else {
		return context
	}
}


export { SVGCardStoreProvider, useSVGCardStoreState, useSVGCardStoreDispatch }

