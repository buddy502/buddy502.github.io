const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3030;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
console.log(client_id);
console.log(client_secret);
console.log(redirect_uri);

const AUTHORIZE_URL = "https://accounts.spotify.com/authorize";

// Route to redirect user to Spotify for authorization
app.get('/auth/spotify', (req, res) => {
    // Ensure redirect_uri is encoded
    const url = `${AUTHORIZE_URL}?client_id=${client_id}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirect_uri)}` +
        `&show_dialog=true` +
        `&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read playlist-read-private`;

    console.log("Redirecting to Spotify authorization:", url);
    res.redirect(url);
});

// Callback route to handle Spotify's redirect
app.get('/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code',
            }).toString(),
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(client_id + ':' + client_secret).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const accessToken = response.data.access_token;
        res.json({ accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).send('Authentication failed');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
