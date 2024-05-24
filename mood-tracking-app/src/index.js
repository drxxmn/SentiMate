// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import config from './auth_config.json';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <Auth0Provider
        domain={config.domain}
        cacheLocation='localstorage'
        useRefreshTokens={true}
        clientId={config.clientId}
        authorizationParams={{
            redirect_uri: window.location.origin,
            audience: "https://sentimate.eu.auth0.com/api/v2/",
            scope: "openid profile email read:current_user update:current_user_metadata"
        }}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </Auth0Provider>
);
