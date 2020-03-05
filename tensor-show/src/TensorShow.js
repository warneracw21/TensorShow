import React from 'react';

// Import Styles
// import { useSVGStyles } from './styles';

import LayerCardSVG from './SVGComponents/LayerCardSVG';

// Import Contexts
import { useCardPosStoreState, useCardPosStoreDispatch } from './AppStores/CardPosStore';

///////////////////////////////////////////////////////////
// TensorShow App
///////////////////////////////////////////////////////////

export default function TensorShow() {

  // Enter into CardPosContext
  const cardPosState = useCardPosStoreState();
  const cardPosDispatch = useCardPosStoreDispatch();

  const onMouseClickRivet = (event, sender_pos) => {
    event.preventDefault()
    console.log("CLICK CLICK FUCKING CLICKED")
    cardPosDispatch({type: 'add_child', sender_pos: sender_pos})
    return;
  }

  const onMouseOverRivet = ({conn_pos, action, sender_pos}) => {
  }

  /////////////////////////////////////////////////////////
  // REMEMBER: cardPosState keys are all integers, 
  // so it is more precise to iterate in order
  /////////////////////////////////////////////////////////

  // Iterate over the cardPosState
  let style;
  let row_key, group_key, slot_key;
  let group_keys, slot_keys;
  let row, group, slot, disp;
  let row_svg, group_svg, slot_svg;
  let group_count, slot_count;

  // Iterate over all rows
  var row_svgs = []
  const pos_tree = {...cardPosState}
  console.log(pos_tree)
  const row_keys = Object.keys(pos_tree.rows);
  const row_count = row_keys.length;
  for (var i=0; i<row_count; i++) {

    // Iterate over all groups, add group_svg to group_svgs
    var group_svgs = []
    row_key = row_keys[i]
    row = pos_tree.rows[row_key]
    group_keys = Object.keys(row.groups)
    group_count = group_keys.length;
    for (var j=0; j<group_count; j++) {

      // Iterate over all slots, add slot_svg to slot_svgs
      var slot_svgs = []
      group_key = group_keys[j]
      group = row.groups[group_key]

      slot_keys = Object.keys(group.slots)
      slot_count = slot_keys.length;
      for (var k=0; k<slot_count; k++) {

        // Render slot_svg, add to slot_svgs
        slot_key = slot_keys[k]
        slot = group.slots[slot_key];
        disp = slot.disp;

        // Render or placeholder
        if (slot.render) {
          style = {
            position: 'absolute',
            top: disp.y + disp.height*0.05,
            left: disp.x + disp.width*0.05,
            height: disp.height*0.80,
            width: disp.width*0.80,
            backgroundColor: "#FF0000",
            border: '1px solid black'
          }
          slot_svg = (
            <div style={style} key={`${row_key}${group_key}${slot_key}`}>
              <LayerCardSVG
                onMouseOverRivet={onMouseOverRivet}
                onMouseClickRivet={onMouseClickRivet}
                sender_pos={{row: i, group: group_key, slot: k}}
                layerName={`${i}${j}${k}`}
              />
            </div>
            )
          slot_svgs.push(slot_svg)
        }
      }

      // Render group_svg, add to group_svgs
      disp = group.disp;
      style = {
          position: 'absolute',
          top: disp.y + disp.height*0.05,
          left: disp.x + disp.height*0.05,
          height: disp.height*0.9,
          width: disp.width*0.9,
          // backgroundColor: "#00FF00",
          border: '2px solid black'
        }
      group_svg = (
        <div style={style} key={`${row_key}${group_key}`}>
          {slot_svgs}
        </div>
        )
      group_svgs.push(group_svg)

    }

    // Render row_svg, add to row_svgs
    disp = row.disp;
    style = {
          position: 'absolute',
          top: disp.y,
          left: disp.x,
          height: disp.height,
          width: disp.width,
          // backgroundColor: "#0000FF",
          border: '5px dashed black'
        }
    row_svg = (
      <div style={style} key={`${row_key}`}>
          {group_svgs}
      </div>
      )
    row_svgs.push(row_svg)
  }

  const TreeSVG = (
    <div x={0} y={0} width={10000} height={10000}>
      {row_svgs}
    </div>
  )

  return (<div>{TreeSVG}</div>)
}