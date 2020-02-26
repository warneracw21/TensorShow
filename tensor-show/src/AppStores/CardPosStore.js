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



const calcGroupWidth = (state, currRow, currGroup) => {

  const data = state[currRow][currGroup]
  const groupWidth = data.reduce((acc, curr) => (acc + curr.width));




}

const calcRowWidth = () => {

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
                }
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
        const newState = {...state};

        // Grab Row and Group from Sender
        const sender_row = action.senderPos.row;
        const sender_group = action.senderPos.group;
        const sender_slot = action.senderPos.slot;

        // Find Row and Group in State
        const parent_row = newState.rows[sender_row];
        const parent_group = parent_row.groups[sender_group];
        const parent_slot = parent_group.slots[sender_slot];

        // Add child to data structure
        // Are we creating a new row?
        if (newState.rows[sender_row + 1] === undefined) {
          newState.rows[sender_row + 1] = {}
          newState.rows[sender_row + 1] = { disp: {}, groups: {0: {disp: {}, slots: {}}} }
        }

        // REMEMBER: the sender slot is the same as the receiver group
        console.log(newState)
        const child_row = newState.rows[sender_row + 1]
        const child_group = child_row.groups[sender_slot]

        // Get slot key for child
        const group_slot_keys = Object.keys(child_group.slots)
        const child_slot_key = group_slot_keys.length;

        // Add child to correct slot
        child_group.slots[child_slot_key] = {
          disp: {
            x: 0,
            y: 0,
            height: SLOT_HEIGHT,
            width: SLOT_WIDTH + SLOT_PADDING
          }
        }

        // 1) Propogate changes: Adjust parent slot width
        // a) sum together the width of all slots in CHILD GROUP corresponding to PARENT SLOT
        const child_slot_keys = Object.keys(child_group.slots)
        let slot_key;
        var child_group_width = 0;
        for (var key_ind=0; key_ind<child_slot_keys.length; key_ind++) {
          console.log("HERE")
          slot_key = child_slot_keys[key_ind];
          child_group_width += child_group.slots[slot_key].disp.width

        } 
        // b) adjust PARENT SLOT width to be the same as CHILD_GROUP width
        newState.rows[sender_row].groups[sender_group].slots[sender_slot] = child_group_width;

        // 2) Propogate changes: Adjust parent group width
        // a) sum together the width of all slots in CHILD GROUP corresponding to PARENT SLOT
        const child_slot_keys = Object.keys(child_group.slots)
        let slot_key;
        var child_group_width = 0;
        for (var key_ind=0; key_ind<child_slot_keys.length; key_ind++) {
          console.log("HERE")
          slot_key = child_slot_keys[key_ind];
          child_group_width += child_group.slots[slot_key].disp.width

        } 
        // b) adjust PARENT SLOT width to be the same as CHILD_GROUP width
        newState.rows[sender_row].groups[sender_group].slots[sender_slot] = child_group_width;



        






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

