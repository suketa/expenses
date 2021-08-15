import React, {useContext} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles'
import { Auth } from 'aws-amplify';
import { SetAuthStateContext } from '../context'

const useStyles = makeStyles((thema) => ({
  toolbar: {
    justifyContent: 'flex-end'
  }
}));

const onClickSignOut = (setAuthState) => {
  Auth.signOut()
    .then((response) => {
      setAuthState(null);
    })
    .catch((error)  => {
      console.log(error)
    });
}

export default function MenuBar() {
  const classes = useStyles();
  const setAuthState = useContext(SetAuthStateContext);
  return (
    <div>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          v0.1.0
          <Button color="inherit" onClick={() =>onClickSignOut(setAuthState)}>SIGN OUT</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
