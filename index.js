const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000; // You can choose any available port
const usr = "ravitechseries"; // Replace with the desired Instagram username

app.get('/instafetch', async (req, res) => {
  try {
    // Replace with the actual URL of your Flask server
    const flaskServerUrl = 'http://localhost:5050/instadata?username=' + usr;

    const response = await fetch(flaskServerUrl);
    if (response.ok) {
      const jsonData = await response.json();
      res.json(jsonData);
    } else {
      res.status(response.status).json({ error: 'Failed to fetch Instagram data from Flask server' });
    }
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({ error: 'An error occurred while fetching Instagram data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
