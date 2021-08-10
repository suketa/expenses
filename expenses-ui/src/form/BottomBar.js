import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import PaidIcon from '@material-ui/icons/Paid';
import GraphIcon from '@material-ui/icons/BarChart';

const useStyles = makeStyles({
  root: {
    position: "absolute",
    bottom: 0,
    width: '100%',
  },
});

const BottomBar = ({onChangeBottomBar}) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
        onChangeBottomBar(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction label="Cost" icon={<PaidIcon />} />
      <BottomNavigationAction label="Graph" icon={<GraphIcon />} />
    </BottomNavigation>
  );
}

export default BottomBar;
