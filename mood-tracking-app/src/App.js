import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './components/auth0/LoginButton';
import LogoutButton from "./components/auth0/LogoutButton";
import WelcomeUser from "./components/auth0/WelcomeUser";
import MoodSelector from './components/moodtracking/MoodSelector';
import SubmitButton from './components/moodtracking/SubmitButton';
import Calendar from './components/moodtracking/Calendar';
import { AppBar, Toolbar, Typography, Container, CircularProgress, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
import config from './config.json'; // Config file with backend endpoint

function App() {
    const { isAuthenticated, user, getAccessTokenSilently, error, logout, isLoading } = useAuth0();
    const [selectedMood, setSelectedMood] = useState(null);
    const [moodData, setMoodData] = useState([]);
    const [supportiveMessage, setSupportiveMessage] = useState('');
    const [newSupportiveMessage, setNewSupportiveMessage] = useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchMoodData = async () => {
                try {
                    const token = await getAccessTokenSilently();
                    const response = await axios.get(config.backendEndpoint, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setMoodData(response.data);
                } catch (error) {
                    console.error('Error fetching mood data:', error);
                }
            };
            fetchMoodData();
        }
    }, [isAuthenticated, getAccessTokenSilently]);

    const handleMoodSelect = (index) => {
        setSelectedMood(index);
    };

    const handleSubmit = async () => {
        if (selectedMood !== null) {
            try {
                const token = await getAccessTokenSilently();
                const timezoneOffset = new Date().getTimezoneOffset(); // Get timezone offset in minutes
                await axios.post(
                    config.backendEndpoint,
                    { mood: selectedMood },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Timezone-Offset': timezoneOffset
                        }
                    }
                );

                // Fetch the updated mood data
                const response = await axios.get(config.backendEndpoint, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMoodData(response.data);
            } catch (error) {
                console.error('Error submitting mood:', error);
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    logout({ returnTo: window.location.origin });
                }
            }
        }
    };

    const fetchSupportiveMessage = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.get(`${config.supportiveMessageEndpoint}/random`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSupportiveMessage(response.data.content); // Extract the 'content' field from the response
            setOpen(true);
        } catch (error) {
            console.error('Error fetching supportive message:', error);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSupportiveMessageChange = (event) => {
        setNewSupportiveMessage(event.target.value);
    };

    const handleSupportiveMessageSubmit = async () => {
        if (newSupportiveMessage.trim() !== '') {
            try {
                const token = await getAccessTokenSilently();
                await axios.post(config.supportiveMessageEndpoint,
                    { content: newSupportiveMessage },
                    { headers: { Authorization: `Bearer ${token}` } });
                setNewSupportiveMessage('');
                alert('Supportive message submitted successfully.');
            } catch (error) {
                console.error('Error submitting supportive message:', error);
                alert('Error submitting supportive message.');
            }
        }
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    if (!isAuthenticated) {
        return (
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <Typography variant="h2" align="center" gutterBottom>
                    Welcome to Sentimate
                </Typography>
                <Typography variant="h6" align="center" paragraph>
                    Please log in to track your mood.
                </Typography>
                <LoginButton />
            </Container>
        );
    }

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
            <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4 }}>
                <WelcomeUser />
                <Calendar moodData={moodData} />
                <MoodSelector onSelect={handleMoodSelect} />
                <SubmitButton onSubmit={handleSubmit} />
                <Button variant="contained" color="primary" onClick={fetchSupportiveMessage} sx={{ marginTop: 2 }}>
                    Get Supportive Message
                </Button>
                <TextField
                    label="Write a Supportive Message"
                    variant="outlined"
                    fullWidth
                    value={newSupportiveMessage}
                    onChange={handleSupportiveMessageChange}
                    sx={{ marginTop: 2 }}
                />
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSupportiveMessageSubmit}
                    sx={{ marginTop: 2 }}
                >
                    Submit Supportive Message
                </Button>
            </Container>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Supportive Message</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {supportiveMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <pre>{JSON.stringify({ isAuthenticated, user, error, selectedMood }, null, 2)}</pre>
        </div>
    );
}

export default App;
