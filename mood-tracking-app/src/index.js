import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import config from './auth_config.json';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Auth0Provider
        domain={config.domain}
        clientId={config.clientId}
        authorizationParams={{
            redirect_uri: window.location.origin,
            audience: "https://sentimate.eu.auth0.com/api/v2/",
            scope: "openid profile email read:current_user update:current_user_metadata"
        }}
        cacheLocation="localstorage"
        useRefreshTokens={true}
    >
        <App />
    </Auth0Provider>
);
