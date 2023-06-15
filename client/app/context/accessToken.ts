let accessToken = '';

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

export const refreshToken = async () => {
  try {
    const response = await fetch('http://localhost:5000/refresh_token', {
      method: 'POST',
      credentials: 'include', // Required to include cookies
    });
    const data = await response.json();
    if (response.ok) {
      // If the refresh token was successful, update the access token
      setAccessToken(data.accessToken);
      return data;
    } else {
      // If the refresh token failed, log the user out
      setAccessToken('');
      // Optionally, show a message to the user that they've been logged out
    }
  } catch (error) {
    // Handle any errors that occurred during the refresh token request
    console.error(error);
  }
};
