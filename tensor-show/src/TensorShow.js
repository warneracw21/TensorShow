import React from 'react';

// Import Styles
import { useSVGStyles } from './styles';

import LayerCardSVG from './SVGComponents/LayerCardSVG';

///////////////////////////////////////////////////////////
// TensorShow App
///////////////////////////////////////////////////////////

export default function TensorShow() {

	const onMouseClickRivet = ({pos, sender}) => {
		console.log(pos)
	}

	const onMouseOverRivet = ({pos, action, sender}) => {
		switch (action) {
			case ('over'): {
				console.log('over')
				break
			}
			case ('out'): {
				console.log('out')
				break
			}
		}
	}


	return (
		<div>
			<LayerCardSVG x={200} y={200} 
				layerName="Input Layer" 
				layerType="Input" 
				onMouseClickRivet={onMouseClickRivet} 
				onMouseOverRivet={onMouseOverRivet}/>
		</div>
		)
}