import React from 'react';

// Import Styles
// import { useSVGStyles } from './styles';

import LayerCardSVG from './SVGComponents/LayerCardSVG';

// Import Contexts
import { useSVGCardStoreState, useSVGCardStoreDispatch } from './AppStores/SVGCardStore';
import { useCardPosStoreState, useCardPosStoreDispatch } from './AppStores/CardPosStore';

///////////////////////////////////////////////////////////
// TensorShow App
///////////////////////////////////////////////////////////

export default function TensorShow() {

  // Enter into SVGCardContext
  const cardStoreState = useSVGCardStoreState();
  const cardStoreDispatch = useSVGCardStoreDispatch();

  // Enter into CardPosContext
  const cardPosState = useCardPosStoreState();
  const cardPosDispatch = useCardPosStoreDispatch();


  // Helper function to use in onMouseClick and onMouseOver
  const checkActiveConnections = (connPos, senderPos) => {
    let parent = cardStoreState[senderPos.row][senderPos.group];
    return !(parent.activeConnections[connPos])
  }

  const onMouseClickRivet = ({connPos, senderPos}) => {
    if (checkActiveConnections(connPos, senderPos)) {
      cardStoreDispatch({type: 'add', senderPos: senderPos, connPos: connPos})
      cardPosDispatch({type: 'add_child', senderPos: senderPos, connPos: connPos})
    }
  }

  const onMouseOverRivet = ({connPos, action, senderPos}) => {

    if (!(checkActiveConnections(connPos, senderPos))) {
      return;
    }

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
      CardTree.push(
          <LayerCardSVG
          key={`${i}${j}`}
          x={params.x} y={params.y} senderPos={{row: i, group: j, slot: 0}} layerName={`${i}${j}`}
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