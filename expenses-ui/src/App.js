import './App.css';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { useState, useEffect } from 'react';
import { UserContext } from './context'
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import New from './form/New';
import MenuBar from './form/MenuBar';

const App = () => {
  const [authState, setAuthState] = useState();
  const [user, setUser] = useState();

  useEffect(() =>   {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, []);

  return authState === AuthState.SignedIn && user ? (
      <div className="App">
        <MenuBar />
        <header className="App-header">
          <UserContext.Provider value={user}>
            <New />
          </UserContext.Provider>
          <AmplifySignOut />
        </header>
      </div>
  ) : ( <AmplifyAuthenticator /> );
};

export default App;
