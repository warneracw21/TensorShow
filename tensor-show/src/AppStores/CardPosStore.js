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

const propogateWidth = (PositionTree, slot, child_position, begin_position, group_path, slot_path) => {

 
  // Pull Child Position Attributes
  const child_row_pos = child_position.row;
  const child_group_pos = child_position.group;
  const child_slot_pos = child_position.slot;

  // Calculate Parent Position Attributes
  const parent_row_pos = child_row_pos - 1;
  const parent_group_pos = group_path[group_path.length - 1]
  const parent_slot_pos = slot_path[slot_path.length - 1];

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
  console.log("Parent Group Path:", group_path)
  console.log("Parent Slot Path:", slot_path)
  console.log("Parent Row Position:", parent_row_pos)
  console.log("Parent Group Position:", parent_group_pos)
  console.log("Parent Slot Position:", parent_slot_pos)
  console.log(new_tree)
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

   // Reduce the group and slot paths by 1
  const new_group_path = group_path.slice(0, group_path.length - 1);
  const new_slot_path = slot_path.slice(0, slot_path.length - 1);


  return propogateWidth(new_tree, slot, parent_position, begin_position, new_group_path, new_slot_path); 
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
          width: SLOT_WIDTH
        },
        groups: {
          0: {
            disp: {
              x: 0,
              y: 0,
              height: SLOT_HEIGHT,
              width: SLOT_WIDTH
            },
            slots: {
              0: {
                disp: {
                  x: 0,
                  y: 0,
                  height: SLOT_HEIGHT,
                  width: SLOT_WIDTH
                },
                group_path: [],
                slot_path: [],
                active_connections: [false, false, false, false],
                render: true
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
        console.log("ADDING CHILD")

        // Make deep copy of old state
        var new_state = {...state};

        // Grab Row and Group from Sender
        const parent_row_pos = action.sender_pos.row;
        const parent_group_pos = action.sender_pos.group;
        const parent_slot_pos = action.sender_pos.slot;

        console.log(action.sender_pos)


        // Find Row, Group and Slot of Parent in State
        const parent_row = new_state.rows[parent_row_pos];
        const parent_group = parent_row.groups[parent_group_pos];
        const parent_slot = parent_group.slots[parent_slot_pos];
        
        // Get history
        const parent_group_path = parent_slot.group_path;
        const parent_slot_path = parent_slot.slot_path;

        // Calculate new group key
        const child_group_key = `${parent_row_pos}${parent_group_pos}${parent_slot_pos}`
        console.log(child_group_key)


        // Add child to data structure
        // Are we creating a new row?
        if (new_state.rows[parent_row_pos + 1] === undefined) {
          console.log("Adding New Row")
          new_state.rows[parent_row_pos + 1] = {
            disp: {
              x: 0,
              y: ROW_INIT + (parent_row_pos + 1)*ROW_DIFF,
              width: SLOT_WIDTH,
              height: SLOT_HEIGHT
            },
            groups: {}
          }
        }



    















        // Are we creating a new group
        // 1) for each group in parent row
          // 2 for each slot in the group
            // each slot should have a group with a slot
              // if the group id already exists, skip
              // else, make new group with one slot
        if (new_state.rows[parent_row_pos + 1].groups[parent_row_pos] === undefined) {
          console.log("Adding New Group")

          let group_key;
          const parent_group_keys = Object.keys(new_state.rows[parent_row_pos].groups)
          let parent_slot_keys;
          let parent_group_key, parent_slot_key;
          let tmp_parent_group, tmp_parent_slot;

          // Iterate over Parent Group Keys
          for (var i=0; i<parent_group_keys.length; i++) {
            parent_group_key = parent_group_keys[i];
            tmp_parent_group = new_state.rows[parent_row_pos].groups[parent_group_key];
            parent_slot_keys = Object.keys(tmp_parent_group.slots)

            // Iterate over slot keys in the parent group
            for (var j=0; j<parent_slot_keys.length; j++) {
              parent_slot_key = parent_slot_keys[j];
              tmp_parent_slot = new_state.rows[parent_row_pos].groups[parent_group_key].slots[parent_slot_key];
              
              // Calculate Group Key ROW|GROUP|SLOT
              group_key = `${parent_row_pos}${parent_group_key}${parent_slot_key}`;
              console.log(group_key)

              // Check if this key is in the child row's groups
              if (!(new_state.rows[parent_row_pos + 1].groups[group_key] === undefined)) {
                
                // Check if this group is the one we need to be in
                continue

              }
              console.log("...adding group with one slot")

              // Add a new group with one slot
              new_state.rows[parent_row_pos + 1].groups[group_key] = {
                disp: {
                  x: 0,
                  y: 0,
                  width: SLOT_WIDTH,
                  height: SLOT_HEIGHT
                },
                slots: {
                  0: {
                    disp: {
                      x: 0,
                      y: 0,
                      width: SLOT_WIDTH,
                      height: SLOT_HEIGHT
                    },
                    group_path: [...tmp_parent_slot.group_path, parent_group_key],
                    slot_path: [...tmp_parent_slot.slot_path, parent_slot_key],
                    active_connections: [false, false, false, false],
                    render: false
                  }
                }
              }
            }
          }
          console.log("State after adding new group:", new_state)
        }





          // for (var k=0; k<=sender_slot; k++) {

          //   if (!(new_state.rows[sender_row + 1].groups[k] === undefined)) {
          //     continue
          //   }

          //   new_state.rows[sender_row + 1].groups[k] = {
          //     disp: {
          //       x: 0,
          //       y: 0,
          //       width: SLOT_WIDTH,
          //       height: SLOT_HEIGHT
          //     },
          //     slots: {

          //     }
          //   }
          // }
        // }
          
          // // Calculate total offset for new group
          // // 1) add parent group offset
          // // 2) add parent slot offset
          // let new_group_offset = 0;
          // new_group_offset = new_state.rows[sender_row].groups[sender_group].disp.x;
          // new_group_offset += new_state.rows[sender_row].groups[sender_group].slots[sender_slot].disp.x;
          // console.log("New Group Offset:", new_group_offset)


  


        // REMEMBER: the sender slot is the same as the receiver group
        const child_row = new_state.rows[parent_row_pos + 1]
        const child_group = child_row.groups[child_group_key]

        // Get slot key for child
        const group_slot_keys = Object.keys(child_group.slots);
        let child_slot_pos;
        if (group_slot_keys.length === 0) {
          child_slot_pos = 0
        } else {
          child_slot_pos = group_slot_keys.length;
        }

        // Get group path and slot_path histories
        const child_group_path = [...parent_group_path, parent_group_pos]
        const child_slot_path = [...parent_slot_path, parent_slot_pos]

        // Prepare arguments for propogation
        const slot_position = {
          row: parent_row_pos + 1, 
          group: child_group_key, 
          slot: child_slot_pos
        }

        const slot = {
          disp: {
            x: 0,
            y: 0,
            height: SLOT_HEIGHT,
            width: SLOT_WIDTH + SLOT_PADDING
          },
          group_path: child_group_path,
          slot_path: child_slot_path,
          active_connections: [false, false, false, false],
          render: true
        }

        // Propogate changes after adding new slot
        new_state = propogateWidth(
          {...new_state}, 
          slot, 
          {...slot_position}, 
          {...slot_position}, 
          child_group_path, 
          child_slot_path
        );
        
        console.log("Done Updating State")
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

