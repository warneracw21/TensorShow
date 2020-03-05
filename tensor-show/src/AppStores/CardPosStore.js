import React from 'react';

const CardPosStoreStateContext = React.createContext(null);
const CardPosStoreDispatchContext = React.createContext(null);


// Description of data structure
// const store = [
  
//   // Row 1
//   [

//     // Group 1
//     [

//       // Slot 1
//       {
//         x: x_position
//         y: y_position

//         // All slots should have the same height and width
//         height: slot_height,
//         width: slot_width
//       }
//     ]
//   ]
// ]

// Slot height will always be the same
// Slot width:
//    IF LEAF: slot width is constsnt
//    IF NODE: slot width is same as group width of group below

// Group height will always be the same
// Group width will be calculated as sum of slot widths + padding

// Row height will always be the same
// Row width will be calculated as the sum of group widths + padding

// SET UI CONSTANTS
const WINDOW_HEIGHT = window.screen.height;
const WINDOW_WIDTH = window.screen.width;

const SLOT_HEIGHT = 300;
const SLOT_WIDTH = 250;
const SLOT_PADDING = 0;

const ROW_INIT = 0;
const ROW_DIFF = 300;



const updateRow= (tree, position) => {

  // Define Variables
  var key_ind;
  var running_width, running_offset;
  let slot_key, group_key;

  const row_pos = position.row;
  const group_pos = position.group;
  const slot_pos = position.slot;

  ////////////////////////////////////////////////////////////////////////
  // 1) Update Group Width
  ////////////////////////////////////////////////////////////////////////
  // Iterate over slots in this group
  const this_group = tree.rows[row_pos].groups[group_pos];
  running_width = 0;
  const slot_keys = Object.keys(this_group.slots);
  for (key_ind=0; key_ind<slot_keys.length; key_ind++) {
    slot_key = slot_keys[key_ind];
    running_width += this_group.slots[slot_key].disp.width;
  }
  tree.rows[row_pos].groups[group_pos].disp.width = running_width;

  ////////////////////////////////////////////////////////////////////////
  // 2) Update Groups Offset
  ////////////////////////////////////////////////////////////////////////
  // Iterate over all groups in this row
  const this_row = tree.rows[row_pos];
  running_offset = 0;
  const group_keys = Object.keys(this_row.groups);
  for (key_ind=0; key_ind<group_keys.length; key_ind++) {
    group_key = group_keys[key_ind];
    // console.log("Group Key:", group_key)

    // 1) Update width with current running offset
    tree.rows[row_pos].groups[group_key].disp.x = running_offset;

    // 2) Add this groups width to running offset
    running_offset += this_row.groups[group_key].disp.width;
  }

  ////////////////////////////////////////////////////////////////////////
  // 3) Update Row Width
  ////////////////////////////////////////////////////////////////////////
  // Set the row width to the running total of the group offsets
  tree.rows[row_pos].disp.width = running_offset;

  return tree;

}

const propogateWidth = (PositionTree, slot, child_position, begin_position, group_path) => {

  // FIRST STEP (HACK) REDUCE group_path by one element before indexing it
  const new_group_path = group_path.slice(0, group_path.length - 1)

  // Pull Child Position Attributes
  const child_row_pos = child_position.row;
  const child_group_pos = child_position.group;
  const child_slot_pos = child_position.slot;

  // Calculate Parent Position Attributes
  const parent_row_pos = child_row_pos - 1;
  const parent_group_pos = new_group_path[new_group_path.length - 1]
  const parent_slot_pos = child_group_pos;

  let new_tree = { ...PositionTree };

  ////////////////////////////////////////////////////////////////////////
  // FIRST RECURSION
  ////////////////////////////////////////////////////////////////////////
  // Add the slot to the child_position
  if (begin_position.row === child_position.row) {
    new_tree.rows[child_row_pos].groups[child_group_pos].slots[child_slot_pos] = slot
    // Update slot offsets (iterate over slot widths)
    const child_group = new_tree.rows[child_row_pos].groups[child_group_pos];
    const slot_keys = Object.keys(child_group.slots);
    var running_offset = 0;
    var slot_key;
    var key_ind;
    for (key_ind=0; key_ind<slot_keys.length; key_ind++) {
      slot_key = slot_keys[key_ind];

    // 1) Update width with current running offset
    new_tree.rows[child_row_pos].groups[child_group_pos].slots[slot_key].disp.x = running_offset;

    // 2) Add this groups width to running offset
    running_offset += child_group.slots[slot_key].disp.width;
  }
  }

  ////////////////////////////////////////////////////////////////////////
  // 1) Update Child Row
  ////////////////////////////////////////////////////////////////////////
  // a) Update group width
  // b) Update groups offset
  // c) Update row width
  // console.log("Updating Child Row")
  new_tree = updateRow(new_tree, child_position);

  ////////////////////////////////////////////////////////////////////////
  // BASE CASE: Child Row is already 0
  ////////////////////////////////////////////////////////////////////////
  if (parent_row_pos == -1) {
    // console.log("Returning")
    return new_tree;
  }

  ////////////////////////////////////////////////////////////////////////
  // 2) Update Parent Slot Information
  ////////////////////////////////////////////////////////////////////////
  // a) Update slot width (update parent slot corresponding to new group)
  const child_group_width = new_tree.rows[child_row_pos].groups[child_group_pos].disp.width;
  console.log("Parent Group Path:", new_group_path)
  console.log("Parent Row Position:", parent_row_pos)
  console.log("Parent Group Position:", parent_group_pos)
  console.log(new_tree.rows[parent_row_pos].groups)
  new_tree.rows[parent_row_pos].groups[parent_group_pos].slots[parent_slot_pos].disp.width = child_group_width;
  // b) Update slot offsets (iterate over slot widths)
  const parent_group = new_tree.rows[parent_row_pos].groups[parent_group_pos];
  const slot_keys = Object.keys(parent_group.slots);
  var running_offset = 0;
  var slot_key;
  var key_ind;
  for (key_ind=0; key_ind<slot_keys.length; key_ind++) {
    slot_key = slot_keys[key_ind];

    // 1) Update width with current running offset
    new_tree.rows[parent_row_pos].groups[parent_group_pos].slots[slot_key].disp.x = running_offset;

    // 2) Add this groups width to running offset
    running_offset += parent_group.slots[slot_key].disp.width;
  }

  ////////////////////////////////////////////////////////////////////////
  // 2) Update Parent Row
  ////////////////////////////////////////////////////////////////////////
  const parent_position = {
    row: parent_row_pos,
    group: parent_group_pos,
    slot: parent_slot_pos
  }
  // console.log("Updating Parent Row")
  new_tree = updateRow(new_tree, parent_position);

  return propogateWidth(new_tree, slot, parent_position, begin_position, new_group_path); 
}

const calculateTotalGroupWidth = (PositionTree, row) => {
  let total_width = 0;
  let group_key;
  const group_keys = Object.keys(PositionTree.rows[row].groups)
  for (var i=0; i<group_keys.length; i++) {
    group_key = group_keys[i];
    total_width += PositionTree.rows[row].groups[group_key].disp.width;
  }
  return total_width;
}



const CardPosStoreProvider = (params) => {

  const init_card_pos = {
    rows: {
      0: {
        disp: {
          x: 0,
          y: 0,
          height: SLOT_HEIGHT,
          width: SLOT_WIDTH + SLOT_PADDING
        },
        groups: {
          0: {
            disp: {
              x: 0,
              y: 0,
              height: SLOT_HEIGHT,
              width: SLOT_WIDTH + SLOT_PADDING
            },
            slots: {
              0: {
                disp: {
                  x: 0,
                  y: 0,
                  height: SLOT_HEIGHT,
                  width: SLOT_WIDTH + SLOT_PADDING
                },
                group_path: [0],
                active_connections: [false, false, false, false]
              }
            }
          }
        }
      }
    }
  }




  const [cardPosStoreState, cardPosStoreDispatch] = React.useReducer((state, action) => {

    switch (action.type) {
      case ('add_child'): {

        // We need to update the container of the parent 
        // and add the child to slot list of correct group

        // Make deep copy of old state
        var new_state = {...state};

        // Grab Row and Group from Sender
        const sender_row = action.sender_pos.row;
        const sender_group = action.sender_pos.group;
        const sender_slot = action.sender_pos.slot;

        // // Check active connections of parent
        // if (new_state.rows[sender_row].groups[sender_group].slots[sender_slot].active_connections[action.conn_pos]) {
        //   return state
        // }

        // Find Row and Group in State
        const parent_row = new_state.rows[sender_row];
        const parent_group = parent_row.groups[sender_group];
        const parent_slot = parent_group.slots[sender_slot];


        // Add child to data structure
        // Are we creating a new row?
        if (new_state.rows[sender_row + 1] === undefined) {
          console.log("Adding New Row")
          new_state.rows[sender_row + 1] = {
            disp: {
              x: 0,
              y: ROW_INIT + (sender_row + 1)*ROW_DIFF,
              width: SLOT_WIDTH,
              height: SLOT_HEIGHT
            },
            groups: {}
          }
        }

        // Are we creating a new group
        // We need to add groups up until the new group (propChanges will handle offsets)
        if (new_state.rows[sender_row + 1].groups[sender_slot] === undefined) {
          console.log("Adding New Group")
          console.log("Sender Slot:", sender_slot)

          for (var k=0; k<=sender_slot; k++) {

          if (!(new_state.rows[sender_row + 1].groups[k] === undefined)) {
            continue
          }

          new_state.rows[sender_row + 1].groups[k] = {
            disp: {
              x: 0,
              y: 0,
              width: SLOT_WIDTH,
              height: SLOT_HEIGHT
            },
            slots: {}
            }
          }

        }
          
          // // Calculate total offset for new group
          // // 1) add parent group offset
          // // 2) add parent slot offset
          // let new_group_offset = 0;
          // new_group_offset = new_state.rows[sender_row].groups[sender_group].disp.x;
          // new_group_offset += new_state.rows[sender_row].groups[sender_group].slots[sender_slot].disp.x;
          // console.log("New Group Offset:", new_group_offset)


  

        // REMEMBER: the sender slot is the same as the receiver group
        const child_row = new_state.rows[sender_row + 1]
        const child_group = child_row.groups[sender_slot]

        // Get slot key for child
        const group_slot_keys = Object.keys(child_group.slots)
        const child_slot = group_slot_keys.length;

        // Get group path for slot (sender_slot is child_group)
        const child_group_path = [...parent_slot.group_path, sender_slot]


        // Prepare arguments for propogation
        const slot_position = {row: sender_row + 1, group: sender_slot, slot: child_slot}
        const slot = {
          disp: {
            x: 0,
            y: 0,
            height: SLOT_HEIGHT,
            width: SLOT_WIDTH + SLOT_PADDING
          },
          group_path: child_group_path,
          active_connections: [false, false, false, false]
        }

        new_state = propogateWidth({...new_state}, slot, {...slot_position}, {...slot_position}, child_group_path);
        return new_state

      }
    }

    return state

  }, init_card_pos);

  return (
    <CardPosStoreStateContext.Provider value={ cardPosStoreState }>
      <CardPosStoreDispatchContext.Provider value ={ cardPosStoreDispatch }>
        {params.children}
      </CardPosStoreDispatchContext.Provider>
    </CardPosStoreStateContext.Provider>
  )
}

const useCardPosStoreState = () => {
  const context = React.useContext(CardPosStoreStateContext);
  if (context === undefined) {
    alert("Please place useSVGCardStoreState in SVGCardStoreProvider");
    return;
  } else {
    return context
  }
}

const useCardPosStoreDispatch = () => {
  const context = React.useContext(CardPosStoreDispatchContext);
  if (context === undefined) {
    alert("Please place useSVGCardStoreState in SVGCardStoreProvider");
    return;
  } else {
    return context
  }
}


export { CardPosStoreProvider, useCardPosStoreState, useCardPosStoreDispatch }

      //   new_state.rows[sender_row + 1] = {
        //     disp: {
        //       x: 0,
        //       y: 50 + (200 * (sender_row + 1)),
        //       width: 0,
        //       height: 250
        //     }, 
        //     groups: {
        //       0: {
        //         disp: {
        //           x: 0,
        //           y: 0,
        //           width: 0,
        //           height: 250
        //         }, 
        //         slots: {
        //           0: {
        //             disp: {
        //               x: 0,
        //               y: 0,
        //               width: SLOT_WIDTH + SLOT_PADDING,
        //               height: SLOT_HEIGHT
        //             }
        //           },
        //           1: {
        //             disp: {
        //               x: 0,
        //               y: 0,
        //               width: SLOT_WIDTH + SLOT_PADDING,
        //               height: SLOT_HEIGHT
        //             }
        //           },
        //           2: {
        //             disp: {
        //               x: 0,
        //               y: 0,
        //               width: SLOT_WIDTH + SLOT_PADDING,
        //               height: SLOT_HEIGHT
        //             }
        //           },
        //           3: {
        //             disp: {
        //               x: 0,
        //               y: 0,
        //               width: SLOT_WIDTH + SLOT_PADDING,
        //               height: SLOT_HEIGHT
        //             }
        //           }
        //         }
        //       }
        //     } 
        //   }
        // }

