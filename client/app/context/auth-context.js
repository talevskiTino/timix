import React from 'react';

export default React.createContext({
    userId: null,
    token: null,
    login: (token, userId, tokenExpiration, role) => {},
    logout: () => {},
    role: null
})