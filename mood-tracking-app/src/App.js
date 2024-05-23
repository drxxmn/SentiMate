// App.js
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';
import LogoutButton from "./LogoutButton";
import UserProfile from "./UserProfile";


function App() {
    const { loginWithRedirect, logout, isAuthenticated, user, error } = useAuth0();

    return (
        <div className="App">
            <header className="App-header">
                <LoginButton></LoginButton>
                <LogoutButton></LogoutButton>
                <UserProfile></UserProfile>
            </header>
            <pre>{JSON.stringify({ isAuthenticated, user, error }, null, 2)}</pre>
        </div>
    );
}

export default App;
