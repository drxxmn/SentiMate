import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './components/auth0/LoginButton';
import LogoutButton from "./components/auth0/LogoutButton";
import WelcomeUser from "./components/auth0/WelcomeUser";
import MoodSelector from './components/moodtracking/MoodSelector';
import SubmitButton from './components/moodtracking/SubmitButton';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import axios from 'axios';
import config from './config.json'; // Config file with backend endpoint

function App() {
    const { isAuthenticated, user, getAccessTokenSilently, error, logout } = useAuth0();
    const [selectedMood, setSelectedMood] = useState(null);

    const handleMoodSelect = (index) => {
        setSelectedMood(index);
    };

    const handleSubmit = async () => {
        if (selectedMood !== null) {
            try {
                const token = await getAccessTokenSilently();
                console.log('Token:', token);  // Debugging log
                const response = await axios.post(
                    config.backendEndpoint,
                    { mood: selectedMood },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log('Response:', response.data);
            } catch (error) {
                console.error('Error submitting mood:', error);
                if (error.error === 'login_required' || error.error === 'consent_required') {
                    logout({ returnTo: window.location.origin });
                }
            }
        }
    };

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
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
                {isAuthenticated ? (
                    <>
                        <WelcomeUser />
                        <MoodSelector onSelect={handleMoodSelect} />
                        <SubmitButton onSubmit={handleSubmit} />
                    </>
                ) : (
                    <Typography variant="h6">Please log in to continue.</Typography>
                )}
            </Container>
            <pre>{JSON.stringify({ isAuthenticated, user, error, selectedMood }, null, 2)}</pre>
        </div>
    );
}

export default App;
