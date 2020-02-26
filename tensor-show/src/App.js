import React from 'react';

// Import styles
import { useStyles } from './styles';

// Import Custom Components
import TensorShow from './TensorShow';

// Import Contexts
import { SVGCardStoreProvider } from './SVGCardStore';

function App() {
  const classes = useStyles();

  return (

    <div className={classes.app}>
    	<SVGCardStoreProvider>
    		<TensorShow/>
    	</SVGCardStoreProvider>
   </div>
  );
}

export default App;
