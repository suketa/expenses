import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((thema) => ({
  toolbar: {
    justifyContent: 'flex-end'
  }
}));


export default function MenuBar() {
  const classes = useStyles();
  return (
    <div>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Button color="inherit">SIGN OUT</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
