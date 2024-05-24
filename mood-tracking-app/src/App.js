import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';
import LogoutButton from "./LogoutButton";
import WelcomeUser from "./WelcomeUser";
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';

function App() {
    const { isAuthenticated, user, error } = useAuth0();

    console.log('User:', user);
    console.log('Is Authenticated:', isAuthenticated);
    console.log('Error:', error);

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Sentimate
                    </Typography>
                    {isAuthenticated ? <LogoutButton /> : <LoginButton />}
                </Toolbar>
            </AppBar>
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                {isAuthenticated ? (
                    <WelcomeUser />
                ) : (
                    <Typography variant="h6">Please log in to continue.</Typography>
                )}
            </Container>
            <pre>{JSON.stringify({ isAuthenticated, user, error }, null, 2)}</pre>
        </div>
    );
}

export default App;
