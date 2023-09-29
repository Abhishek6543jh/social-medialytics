const express = require('express');
const axios = require('axios'); // Import axios for making HTTP requests
const ejs = require('ejs');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from a 'public' directory (create this directory and put your CSS and JS files there)
app.use(express.static('public'));

// Define a route for the root path that renders the form

app.get('/', (req, res) => {
  res.render('index.ejs');
});

// Handle the POST request for data submission
// Handle the POST request for data submission
app.post('/dataobtain', async (req, res) => {
    const instagramUsername = req.body.instagramUsername;
    const youtubeChannelId = req.body.youtubeChannelId;
  
    try {
      // Fetch data from Instagram API
      const instagramResponse = await axios.get(`http://127.0.0.1:5000/instadata?username=${instagramUsername}`);
      const instagramData = instagramResponse.data;
  
      // Fetch data from YouTube API
      const youtubeResponse = await axios.get(`http://localhost:3030/channelData/${youtubeChannelId}`);
      const youtubeData = youtubeResponse.data;
  
      // Set .locals to make data available to the EJS template
      res.locals.instagramData = instagramData;
      res.locals.youtubeData = youtubeData;
  
      // Render the EJS template with the fetched data
      res.render('index.ejs');
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: error.message });
    }
  });
  
// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
