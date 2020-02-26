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

const SLOT_HEIGHT = 250;
const SLOT_WIDTH = 250;
const SLOT_PADDING = 100;

const ROW_INIT = 50;
const ROW_DIFF = 200;



const propogateWidth = (PositionTree, slot, child_position, begin_position) => {

  // Start pulling attributes
  const child_row_pos = child_position.row;
  const child_group_pos = child_position.group;
  const child_slot_pos = child_position.slot;

  ////////////////////////////////////////////////////////////////////////
  // FIRST RECURSION
  ////////////////////////////////////////////////////////////////////////
  // Add the slot to the child_position
  if (begin_position.row === child_position.row) {
    PositionTree.rows[child_row_pos].groups[child_group_pos].slots[child_slot_pos] = slot
  }

  ////////////////////////////////////////////////////////////////////////
  // STEP 1: UPDATE CHILD GROUP width
  ////////////////////////////////////////////////////////////////////////
  const child_group = PositionTree.rows[child_row_pos].groups[child_group_pos];
  
  // Iterate over the SLOT keys and SUM the width of each SLOT to get GROUP width
  let slot_key;
  var group_width = 0;
  const child_slot_keys = Object.keys(child_group.slots)
  for (var key_ind=0; key_ind<child_slot_keys.length; key_ind++) {
    slot_key = child_slot_keys[key_ind];
    group_width += child_group.slots[slot_key].disp.width
  }

  // Set CHILD GROUP width
  PositionTree.rows[child_row_pos].groups[child_group_pos].disp.width = group_width;


  ////////////////////////////////////////////////////////////////////////
  // STEP 2: UPDATE CHILD ROW width
  ////////////////////////////////////////////////////////////////////////

  // Iterate over the GROUP keys and SUM the width of each GROUP to get ROW width
  const child_row = PositionTree.rows[child_row_pos];
  let group_key;
  var row_width = 0;
  const child_group_keys = Object.keys(child_row.groups)
  for (key_ind=0; key_ind<child_group_keys.length; key_ind++) {
    group_key = child_group_keys[key_ind];
    row_width += child_row.groups[group_key].disp.width
  }

  // Set CHILD ROW width
  PositionTree.rows[child_row_pos].disp.width = row_width;


  ////////////////////////////////////////////////////////////////////////
  // BASE CASE: Child Row is already 0
  ////////////////////////////////////////////////////////////////////////
  const parent_row_pos = child_row_pos - 1;
  if (parent_row_pos == -1) {
    console.log(PositionTree)
    return PositionTree;
  }


  ////////////////////////////////////////////////////////////////////////
  // STEP 3: UPDATE PARENT SLOT width
  ////////////////////////////////////////////////////////////////////////
  const parent_group_pos = slot.group_path[slot.group_path.length - 2]
  const parent_slot_pos = child_group_pos
  PositionTree.rows[parent_row_pos].groups[parent_group_pos].slots[parent_slot_pos].disp.width = group_width


  ////////////////////////////////////////////////////////////////////////
  // STEP 3: Call Recursion
  ////////////////////////////////////////////////////////////////////////
  const parent_position = {row: parent_row_pos, group: parent_group_pos, slot: parent_slot_pos}
  propogateWidth(PositionTree, slot, parent_position, begin_position)

}



const CardPosStoreProvider = (params) => {

  const init_card_pos = {
    rows: {
      0: {
        disp: {
          x: 200,
          y: 50,
          height: 200,
          width: 200
        },
        groups: {
          0: {
            disp: {
              x: 0,
              y: 0,
              height: 200,
              width: 200
            },
            slots: {
              0: {
                disp: {
                  x: 0,
                  y: 0,
                  height: 200,
                  width: 200
                },
                group_path: [0]
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
        const sender_row = action.senderPos.row;
        const sender_group = action.senderPos.group;
        const sender_slot = action.senderPos.slot;

        // Find Row and Group in State
        const parent_row = new_state.rows[sender_row];
        const parent_group = parent_row.groups[sender_group];
        const parent_slot = parent_group.slots[sender_slot];

        // Add child to data structure
        // Are we creating a new row?
        if (new_state.rows[sender_row + 1] === undefined) {
          new_state.rows[sender_row + 1] = {}
          new_state.rows[sender_row + 1] = { disp: {}, groups: {0: {disp: {}, slots: {}}} }
        }

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
          group_path: child_group_path
        }

        new_state = propogateWidth({...new_state}, slot, {...slot_position}, slot_position);
        console.log(new_state)

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

