import React from 'react';
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';


// Import Styles
// import { useSVGStyles } from './styles';

// Import Custom Components
import LayerCardSVG from './SVGComponents/LayerCardSVG';

// Import Contexts
import { useTreePosStoreState, useTreePosStoreDispatch } from './AppStores/TreePosStore';
import { useDialogDispatch } from './AppStores/DialogContext';
import { useCurrentLayerDispatch } from './AppStores/CurrentLayerContext';
import { useLayerInfoStoreState } from './AppStores/LayerInfoStore';

///////////////////////////////////////////////////////////
// TensorShow App
///////////////////////////////////////////////////////////

export default function LayerTree() {

  // Enter into CardPosContext
  const cardPosState = useTreePosStoreState();
  const cardPosDispatch = useTreePosStoreDispatch();

  const dialogDispatch = useDialogDispatch();
  const currentLayerDispatch = useCurrentLayerDispatch();

  const layerInfoStoreState = useLayerInfoStoreState();

  // Initialize Data Structure on UseEffect launch
  React.useEffect(() => {
    cardPosDispatch({type: 'init'})
  }, [])

  const addChild = (event, sender_pos) => {
    event.preventDefault()
    

    // Step 1 (Create Hash)
    // const hash = Base64.stringify(sha256(new Date, Math.random()*10000000));
    const hash = Math.random()*1000000;
    console.log(hash)

    // Step 2 (Set currently selected Layer to hash)
    currentLayerDispatch({hash: hash, sender_pos: sender_pos});

    // Step 3 (Set dialogDispatch)
    dialogDispatch(true);
    return;
  }

  // Initialize Dialog Hook
  const [open, setOpen] = React.useState(false);
  const editLayer = (event) => {
    event.preventDefault();
    dialogDispatch(true);
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

  // layer_info
  let layer_info;

  // Iterate over all rows
  var row_svgs = []
  const pos_tree = {...cardPosState}
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
            top: disp.y,
            left: disp.x,
            height: disp.height,
            width: disp.width,
            justifyContent: 'center',
            backgroundColor: "#FF0000",
          }

          layer_info = layerInfoStoreState[slot.hash]
          slot_svg = (
            <div style={style} key={`${row_key}${group_key}${slot_key}`}>
              <LayerCardSVG
                addChild={addChild}
                editLayer={editLayer}
                sender_pos={{row: i, group: group_key, slot: slot_key}}
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
          top: disp.y,
          left: disp.x,
          height: disp.height,
          width: disp.width,
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