import React from 'react';

// Import Styles
// import { useSVGStyles } from './styles';

import LayerCardSVG from './SVGComponents/LayerCardSVG';

// Import Contexts
import { useSVGCardStoreState, useSVGCardStoreDispatch } from './SVGCardStore';

///////////////////////////////////////////////////////////
// TensorShow App
///////////////////////////////////////////////////////////

export default function TensorShow() {

	// Enter into SVGCardContext
	const cardStoreState = useSVGCardStoreState();
	const cardStoreDispatch = useSVGCardStoreDispatch();

	// Helper function to use in onMouseClick and onMouseOver
	const checkActiveConnections = (connPos, senderPos) => {
		let parent = cardStoreState[senderPos.row][senderPos.column];
		return !(parent.activeConnections[connPos])
	}

	const onMouseClickRivet = ({connPos, senderPos}) => {
		if (checkActiveConnections(connPos, senderPos)) {
			cardStoreDispatch({type: 'add', senderPos: senderPos, connPos: connPos})	
		}
	}

	const onMouseOverRivet = ({connPos, action, senderPos}) => {
		switch (action) {
			case ('over'): {
				console.log('over')
				break
			}
			case ('out'): {
				console.log('out')
				break
			}
			default: {
				console.log('default')
			}
		}
	}

	///////////////////////////////////////////////////
	// Build Card Tree
	///////////////////////////////////////////////////
	// 1) Iterate over keys in cardStoreState
	// 2) Build a rendered layercard with stored params
	var CardTree = [];
	let columnCards;
	let params;
	for (var i=0; i<cardStoreState.length; i++) {
		columnCards = cardStoreState[i];
		for (var j=0; j<columnCards.length; j++) {
			params = columnCards[j];
			console.log("HERE")
			CardTree.push(
					<LayerCardSVG
					key={`${i}${j}`}
					x={params.x} y={params.y} senderPos={{row: i, column: j}} layerName={`${i}${j}`}
					onMouseClickRivet={onMouseClickRivet} 
					onMouseOverRivet={onMouseOverRivet}
					/>
			)
		}
	}

	return (
		<svg x={100} y={0} width={2000} height={1000}>
			{CardTree}
		</svg>
		)
}