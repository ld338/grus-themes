const axios = require('axios');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Retrieve the Minecraft server IP from the environment variables
const SERVER_IP = process.env.SERVER_IP;

if (!SERVER_IP) {
    console.error('SERVER_IP environment variable is not set.');
    process.exit(1);
}

async function fetchMinecraftStatus() {
    try {
        const response = await axios.get(`https://api.mcsrvstat.us/3/${SERVER_IP}`);
        const data = response.data;

        // Extract player count and names
        const playerCount = data.players.online;
        const playerNames = data.players.list ? data.players.list.map(player => player.name) : [];

        // Return the data
        return {
            playerCount,
            playerNames,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error(`Error fetching status: ${error.message}`);
        return { error: error.message };
    }
}

app.get('/status', async (req, res) => {
    const status = await fetchMinecraftStatus();
    res.json(status);
});

app.listen(port, () => {
    console.log(`Minecraft Monitor Server running at http://localhost:${port}`);
});
