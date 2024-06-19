// WelcomeUser.js
import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Avatar, Box } from '@mui/material';

const WelcomeUser = () => {
    const { user, isAuthenticated } = useAuth0();

    useEffect(() => {
        if (user) {
            console.log('User:', user);
        }
    }, [user]);

    if (!isAuthenticated || !user) {
        return null;
    }

    const getNameToDisplay = () => {
        if (user.given_name) {
            return user.given_name;
        } else if (user.name && !user.name.includes('@')) {
            return user.name;
        } else {
            return user.nickname || user.email || 'User';
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'inherit'
            }}
        >
            {user.picture && (
                <Avatar
                    alt={getNameToDisplay()}
                    src={user.picture}
                    sx={{ width: 100, height: 100, marginBottom: 2 }}
                />
            )}
            <Typography variant="h4">
                Welcome, {getNameToDisplay()}!
            </Typography>
        </Box>
    );
};

export default WelcomeUser;
