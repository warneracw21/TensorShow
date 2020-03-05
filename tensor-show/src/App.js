import React from 'react';

// Import styles
import { useStyles } from './styles';

// Import Custom Components
import TensorShow from './TensorShow';

// Import Contexts
import { CardPosStoreProvider } from './AppStores/CardPosStore';

function App() {
  const classes = useStyles();

  // Get window dimensions
  console.log(window.screen)

  return (

    <div className={classes.app}>
      <CardPosStoreProvider>
        <TensorShow/>
      </CardPosStoreProvider>
   </div>
  );
}

export default App;
