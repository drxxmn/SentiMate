import React, {useEffect} from 'react';
import { useAuth0 } from '@auth0/auth0-react';



const Profile = () => {
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

    console.log("isAuthenticated:", isAuthenticated);
    console.log("isLoading:", isLoading);
    console.log("user:", user);

    useEffect(() => {
        const getToken = async () => {
            if(isAuthenticated){
                let token;
                try{
                    token = await getAccessTokenSilently({
                        authorizationParams: {
                            audience: 'https://sentimate.eu.auth0.com/api/v2/',
                            scope: 'read:current_user'
                        }
                    });
                }
                catch(error){
                    console.log("Token failure: " + error);
                }
                console.log("Successfully received token: " + token);
                return token;
            }
        }
        getToken();
    }, [getAccessTokenSilently, user?.sub])

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        isAuthenticated && user && (
            <div>
                <img src={user.picture} alt={user.name} />
                <h2>{user.name}</h2>
                <p>{user.email}</p>
            </div>
        )
    );
};

export default Profile;
