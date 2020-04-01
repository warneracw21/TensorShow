import React from 'react';
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

const TreePosStoreStateContext = React.createContext(null);
const TreePosStoreDispatchContext = React.createContext(null);

////////////////////////////////////////////////////////////////////////
// Set Constants
////////////////////////////////////////////////////////////////////////
const SLOT_HEIGHT = 300;
const SLOT_WIDTH = 250;

const ROW_INIT = 0;
const ROW_DIFF = 300;



const updateRow= (tree, row_pos) => {

  // Declare Variables  
  var group_keys, slot_keys;
  var group_key_ind, slot_key_ind;
  var group_key, slot_key;

  ////////////////////////////////////////////////////////////////////////
  // 1) Update Group Width
  ////////////////////////////////////////////////////////////////////////
  // Iterate over groups in row
  group_keys = Object.keys(tree.rows[row_pos].groups);
  var running_width;
  for (group_key_ind=0; group_key_ind<group_keys.length; group_key_ind++) {
    running_width = 0;
    group_key = group_keys[group_key_ind];
    slot_keys = Object.keys(tree.rows[row_pos].groups[group_key].slots)

    // Iterate over slots in group
    for (slot_key_ind=0; slot_key_ind<slot_keys.length; slot_key_ind++) {
      slot_key = slot_keys[slot_key_ind];
      running_width += tree.rows[row_pos].groups[group_key].slots[slot_key].disp.width;
    }

    // Update group width
    tree.rows[row_pos].groups[group_key].disp.width = running_width;
  }

  ////////////////////////////////////////////////////////////////////////
  // 2) Update Groups Offset
  ////////////////////////////////////////////////////////////////////////
  var running_offset = 0;

  // Iterate over groups in row
  group_keys = Object.keys(tree.rows[row_pos].groups);
  for (group_key_ind=0; group_key_ind<group_keys.length; group_key_ind++) {
    group_key = group_keys[group_key_ind];

    // 1) Update width with current running offset
    tree.rows[row_pos].groups[group_key].disp.x = running_offset;

    // 2) Add this groups width to running offset
    running_offset += tree.rows[row_pos].groups[group_key].disp.width;
  }

  ////////////////////////////////////////////////////////////////////////
  // 3) Update Row Width
  ////////////////////////////////////////////////////////////////////////
  // Set the row width to the running total of the group offsets
  tree.rows[row_pos].disp.width = running_offset;

  console.log(JSON.parse(JSON.stringify(tree)))

  return tree;

}

const propogateWidth = (PositionTree, row_position) => {

 
  // Pull Child Position Attributes
  const child_row_pos = row_position;

  // Calculate Parent Position Attributes
  const parent_row_pos = child_row_pos - 1;


  let new_tree = { ...PositionTree };

  var group_key_ind, slot_key_ind;
  var group_key, slot_key;
  var slot_keys;
  var child_group, child_slot, parent_group, parent_slot;

  

  ////////////////////////////////////////////////////////////////////////
  // 1) Update Child Slot Offsets
  ////////////////////////////////////////////////////////////////////////
  // Update slot offsets (iterate over slot widths)
  const child_group_keys = Object.keys(new_tree.rows[child_row_pos].groups);

  // Iterate over groups in child row
  var running_offset;
  for (group_key_ind=0; group_key_ind<child_group_keys.length; group_key_ind++) {
    running_offset = 0;
    group_key = child_group_keys[group_key_ind];
    slot_keys = Object.keys(new_tree.rows[child_row_pos].groups[group_key].slots)

    for (slot_key_ind=0; slot_key_ind<slot_keys.length; slot_key_ind++) {
      slot_key = slot_keys[slot_key_ind];

      // 1) Update width with current running offset
      new_tree.rows[child_row_pos].groups[group_key].slots[slot_key].disp.x = running_offset;

      // 2) Add this groups width to running offset
      running_offset += new_tree.rows[child_row_pos].groups[group_key].slots[slot_key].disp.width;

    }
  }


  ////////////////////////////////////////////////////////////////////////
  // 2) Update Child Row
  ////////////////////////////////////////////////////////////////////////
  // a) Update group width
  // b) Update groups offset
  // c) Update row width
  new_tree = updateRow(new_tree, child_row_pos);

  ////////////////////////////////////////////////////////////////////////
  // BASE CASE: Child Row is already 0
  ////////////////////////////////////////////////////////////////////////
  if (parent_row_pos == -1) {
    // console.log("Returning")
    return new_tree;
  }

  // ////////////////////////////////////////////////////////////////////////
  // // 3) Update Parent Slot Width Offsets
  // ////////////////////////////////////////////////////////////////////////
  for (group_key_ind=0; group_key_ind<child_group_keys.length; group_key_ind++) {
    group_key = child_group_keys[group_key_ind];
    child_group = new_tree.rows[child_row_pos].groups[group_key]

    // Find parent slot
    group_key = child_group.sender_group;
    slot_key = child_group.sender_slot;

    // Set parent slot width
    new_tree.rows[child_row_pos - 1].groups[group_key].slots[slot_key].disp.width = child_group.disp.width


  }

  return propogateWidth(new_tree, parent_row_pos); 
}



const TreePosReducer = (state, action) => {

  switch (action.type) {
    case ('init'): {
      console.log("INITIALIZATION")
      return state;
    }
    
    case ('add_child'): {
      console.log("ADDING CHILD")

      // Make deep copy of old state
      var new_state = {...state};

      // Grab Row and Group from Sender
      const parent_row_pos = action.sender_pos.row;
      const parent_group_pos = action.sender_pos.group;
      const parent_slot_pos = action.sender_pos.slot;

      // Find Row, Group and Slot of Parent in State
      const parent_row = new_state.rows[parent_row_pos];
      const parent_group = parent_row.groups[parent_group_pos];
      const parent_slot = parent_group.slots[parent_slot_pos];
      
      // Get history
      const parent_group_path = parent_slot.group_path;
      const parent_slot_path = parent_slot.slot_path;

      // Calculate Child Keys
      const child_row_pos = parent_row_pos + 1;
      const child_group_pos = `${parent_group_pos}${parent_slot_pos}`;
      const child_slot_pos = action.sender_pos.connection;


      //////////////////////////////////////////////////////
      // Are we adding a new row?
      //////////////////////////////////////////////////////
      if (new_state.rows[parent_row_pos + 1] === undefined) {
        console.log("ADDING NEW ROW")
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

      //////////////////////////////////////////////////////
      // Are we adding a new group?
      // 1) for each group in parent row
        // 2 for each slot in the group
          // each slot should have a group with a slot
            // if the group id already exists, skip
            // else, make new group with one slot
      //////////////////////////////////////////////////////
      const parent_row_keys = Object.keys(new_state.rows)

      let group_key;
      let parent_group_keys, parent_slot_keys;
      let parent_row_key, parent_group_key, parent_slot_key;
      let tmp_parent_row, tmp_parent_group, tmp_parent_slot;

      // Iterate over all rows to get a parent row
      for (var i=0; i<parent_row_keys.length - 1; i++) {
        parent_row_key = parseInt(parent_row_keys[i], 10);
        tmp_parent_row = new_state.rows[parent_row_key];
        parent_group_keys = Object.keys(tmp_parent_row.groups)


        // Iterate over Parent Group Keys
        for (var j=0; j<parent_group_keys.length; j++) {
          parent_group_key = parent_group_keys[j];
          tmp_parent_group = new_state.rows[parent_row_key].groups[parent_group_key];
          parent_slot_keys = Object.keys(tmp_parent_group.slots)

          // Iterate over slot keys in the parent group
          for (var k=0; k<parent_slot_keys.length; k++) {
            parent_slot_key = parent_slot_keys[k];
            tmp_parent_slot = new_state.rows[parent_row_key].groups[parent_group_key].slots[parent_slot_key];
            
            // Calculate Group Key ROW|GROUP|SLOT
            group_key = `${parent_group_key}${parent_slot_key}`;
            console.log(parent_row_key, parent_group_key, parent_slot_key)
            console.log(group_key)
            console.log(JSON.parse(JSON.stringify(new_state)))

            // Check if this key is in the child row's groups
            // // We do not want to create a new group if we do not have to
            if (!(new_state.rows[parent_row_key + 1].groups[group_key] === undefined)) {
              continue
            }

            // Add a new group with one slot
            console.log("ADDING NEW GROUP")
            new_state.rows[parent_row_key + 1].groups[group_key] = {
              disp: {
                x: 0,
                y: 0,
                width: SLOT_WIDTH,
                height: SLOT_HEIGHT
              },
              sender_group: parent_group_key,
              sender_slot: parent_slot_key,
              slots: {
                0: {
                  disp: {
                    x: 0,
                    y: 0,
                    width: SLOT_WIDTH,
                    height: SLOT_HEIGHT
                  },
                  active_connections: [false, false, false, false],
                  render: false
                }
              }
            }
          }
        }
      }


      //////////////////////////////////////////////////////
      // Calculate Child Position
      //////////////////////////////////////////////////////
      const child_row = new_state.rows[child_row_pos]
      const child_group = child_row.groups[child_group_pos]

      // Prepare arguments for propogation
      const slot_position = {
        row: child_row_pos, 
        group: child_group_pos, 
        slot: child_slot_pos
      }

      const slot = {
        disp: {
          x: 0,
          y: 0,
          height: SLOT_HEIGHT,
          width: SLOT_WIDTH
        },
        active_connections: [],
        render: true,
        hash: action.hash
      }


      //////////////////////////////////////////////////////
      // Add Child Node to State
      //////////////////////////////////////////////////////
      new_state.rows[child_row_pos].groups[child_group_pos].slots[child_slot_pos] = slot

      // Add the child connection position to parent
      new_state.rows[parent_row_pos].groups[parent_group_pos].slots[parent_slot_pos].active_connections.push(child_slot_pos)


      //////////////////////////////////////////////////////
      // Propogate changes after adding new slot
      //////////////////////////////////////////////////////
      new_state = propogateWidth(
        {...new_state}, 
        parent_row_keys.length - 1, 
      );
      
      return new_state

    }
    default: { return state };
  }

}

const TreePosStoreProvider = (params) => {

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
                active_connections: [],
                render: true,
                hash: Base64.stringify(sha256(0))
              }
            }
          }
        }
      },
    }
  }

  const [treePosStoreState, treePosStoreDispatch] = React.useReducer((state, action) => TreePosReducer(state, action), init_card_pos);

  return (
    <TreePosStoreStateContext.Provider value={ treePosStoreState }>
      <TreePosStoreDispatchContext.Provider value ={ treePosStoreDispatch }>
        {params.children}
      </TreePosStoreDispatchContext.Provider>
    </TreePosStoreStateContext.Provider>
  )
}




const useTreePosStoreState = () => {
  const context = React.useContext(TreePosStoreStateContext);
  if (context === undefined) {
    alert("Please place useSVGCardStoreState in TreePosStoreStateContext");
    return;
  } else {
    return context
  }
}

const useTreePosStoreDispatch = () => {
  const context = React.useContext(TreePosStoreDispatchContext);
  if (context === undefined) {
    alert("Please place useSVGCardStoreState in TreePosStoreDispatchContext");
    return;
  } else {
    return context
  }
}


export { TreePosStoreProvider, useTreePosStoreState, useTreePosStoreDispatch }

