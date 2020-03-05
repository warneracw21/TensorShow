///////////////////////////////////////////////////////////
// Module for specifying styles 
///////////////////////////////////////////////////////////
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  app: {
    flexGrow: 1
  }


}));

const useSVGStyles = () => ({

  circleRed: {
    fill: 'red'
  },
  circleYellow: {
    fill: 'yellow'
  }
})

export { useStyles, useSVGStyles }