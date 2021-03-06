/////////////////////////////////////////////////
// Layer Tree
/////////////////////////////////////////////////
import React from 'react';

// Import Custom Components
import LayerCard from './LayerCard';

/////////////////////////////////////////////////
// Set Up Contexts
/////////////////////////////////////////////////
import { useTreePosStoreState } from '../AppStores/TreePosStore';
import { useLayerInfoStoreState } from '../AppStores/LayerInfoStore';

///////////////////////////////////////////////////////////
// LayerTree
///////////////////////////////////////////////////////////
export default function LayerTree(params) {

  ////////////////////////////////////////////////
  // Subscribe to Tree Contexts
  ////////////////////////////////////////////////
  const cardPosState = useTreePosStoreState();
  const layerInfoStoreState = useLayerInfoStoreState();

  // Get Component Methods
  const addChild = params.addChild;
  const editLayer = params.editLayer;
  const editModel = params.editModel;
  const chooseDataset = params.chooseDataset;


  // Iterate over the cardPosState
  let style;
  let row_key, group_key, slot_key;
  let group_keys, slot_keys;
  let row, group, slot, disp;
  let row_svg, group_svg, slot_svg;
  let group_count, slot_count;

  // layer_info
  let layer_info;

  // bezier curve variables
  var start_point, end_point;
  var bezier_points = [];
  var next_group_subkey;
  var tmp_slot_keys, tmp_slot;
  var tmp_group;

  var canvas_elements = []

  // Iterate over all rows
  var row_svgs = []
  const pos_tree = {...cardPosState}
  const row_keys = Object.keys(pos_tree.rows);
  const row_count = row_keys.length;
  for (var i=0; i<row_count; i++) {

    // Iterate over all groups, add group_svg to group_svgs
    var group_svgs = []
    row_key = parseInt(row_keys[i], 10)
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
        style = {
          position: 'absolute',
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          top: disp.y,
          left: disp.x,
          height: disp.height,
          width: disp.width,
          textAlign: 'center',
        }

        if (slot.render) {

          // Add Generic Layer Card
          slot_svg = (
            <div style={style} key={`${row_key}${group_key}${slot_key}`}>
              <LayerCard
                layerID={`${row_key}${group_key}${slot_key}`}
                addChild={addChild}
                editLayer={editLayer}
                editModel={editModel}
                chooseDataset={chooseDataset}
                sender_pos={{row: row_key, group: group_key, slot: slot_key}}
              />
            </div>
          );

          slot_svgs.push(slot_svg)
          
          // Check if next row exists
          if (pos_tree.rows[row_key + 1] !== undefined) {

            if (pos_tree.rows[row_key + 1].groups[`${group_key}${slot_key}`] !== undefined) {
            
              // Instantiate the canvas
              var canv_params = {
                start_y: pos_tree.rows[row_key].disp.y + 200,
                end_y: pos_tree.rows[row_key + 1].disp.y,
                start_x: group.disp.x + slot.disp.x,
                end_x: group.disp.x + slot.disp.x + slot.disp.width
              }

              // Calculate points for Bezier Curves in this canvas
              var bezier_points = [];
              start_point = [(canv_params.end_x - canv_params.start_x) / 2, 0];

              // Calculate entities for next row, group and slots
              tmp_group = pos_tree.rows[row_key + 1].groups[`${group_key}${slot_key}`];
              if (tmp_group === undefined) {
                console.log(row_key, group_key, slot_key)
              }
              tmp_slot_keys = Object.keys(tmp_group.slots);

              // Iterate over slots, find if renderable, if so, add end_pos
              for (var q=0; q<tmp_slot_keys.length; q++) {
                tmp_slot = tmp_group.slots[tmp_slot_keys[q]];
                if (tmp_slot.render) {
                  end_point = [
                      tmp_slot.disp.x + tmp_slot.disp.width / 2,
                      canv_params.end_y - canv_params.start_y
                    ]; 

                  // Draw Bezier Curve
                  bezier_points.push(
                    <path stroke="black" strokeWidth={4} fill="transparent" d={
                      `
                      M ${start_point[0]} ${start_point[1]}
                      C ${start_point[0]} ${start_point[1] + 50}, ${end_point[0]} ${end_point[1] - 50},
                      ${end_point[0]} ${end_point[1]}
                      `
                    }/>)
                }
              }

              canvas_elements.push(
                <div
                  style={{
                    position: "absolute",
                    left: canv_params.start_x,
                    top: canv_params.start_y,
                    width: canv_params.end_x - canv_params.start_x,
                    height: canv_params.end_y - canv_params.start_y,
                  }}>
                  <svg 
                    height={canv_params.end_y - canv_params.start_y}
                    width={canv_params.end_x - canv_params.start_x}>
                    {bezier_points}
                  </svg>
                </div>
              )

            }
          }
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
          // border: '2px solid black'
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
          zIndex: 100,
          position: 'absolute',
          top: disp.y,
          left: disp.x,
          height: disp.height,
          width: disp.width,
          // backgroundColor: "#0000FF",
          // border: '5px dashed black'
        }
    row_svg = (
      <div style={style} key={`${row_key}`}>
          {group_svgs}
      </div>
      )
    row_svgs.push(row_svg)
  }

  const TreeSVG = (
    <div>
      {row_svgs}
    </div>
  )

  return (
    <div style={{
      position: "absolute", 
      width: "98%", 
      height:"98%"
    }}>
      {TreeSVG}
      {canvas_elements}
    </div>
    )
}