import './App.css';
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
import { useState, useEffect } from 'react';
import { UserContext, SetAuthStateContext } from './context'
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import New from './form/New';
import Graph from './form/Graph';
import MenuBar from './form/MenuBar';
import BottomBar from './form/BottomBar';

const App = () => {
  const onChangeBottomBar = (value) => {
    setMainIndex(value);
  }

  const Screens = [<New />, <Graph />];

  const [authState, setAuthState] = useState();
  const [user, setUser] = useState();
  const [mainIndex, setMainIndex] = useState(0);

  useEffect(() =>   {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, [authState]);

  return authState === AuthState.SignedIn && user ? (
      <div className="App">
        <SetAuthStateContext.Provider value={setAuthState}>
          <MenuBar />
        </SetAuthStateContext.Provider>
        <header className="App-header">
          <UserContext.Provider value={user}>
            {Screens[mainIndex]}
          </UserContext.Provider>
        </header>
        <BottomBar onChangeBottomBar={onChangeBottomBar} />
      </div>
  ) : ( <AmplifyAuthenticator /> );
};

export default App;
