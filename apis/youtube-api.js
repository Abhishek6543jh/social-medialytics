const express = require('express');
const { google } = require('googleapis');

const app = express();
const port = 3000;

// Replace 'YOUR_YOUTUBE_DATA_API_KEY_HERE' with your actual API key
const API_KEY = 'AIzaSyBEtE0Ro3OIqAEEdd9L0LHEg85WDFGYkkY';

const youtube = google.youtube({
  version: 'v3',
  auth: API_KEY,
});

app.get('/channelData/:channelId', async (req, res) => {
  const channelId = req.params.channelId;

  try {
    const channelResponse = await youtube.channels.list({
      part: 'statistics',
      id: channelId,
    });

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      throw new Error('Channel not found.');
    }

    const channelStatistics = channelResponse.data.items[0].statistics;
    const subscribersCount = parseInt(channelStatistics.subscriberCount, 10);

    const videoResponse = await youtube.search.list({
      part: 'id',
      channelId: channelId,
      maxResults: 50,
    });

    const videoIds = videoResponse.data.items.map((item) => item.id.videoId);
    const videoIdsString = videoIds.join(',');

    const videoStatsResponse = await youtube.videos.list({
      part: 'statistics',
      id: videoIdsString,
    });

    const videoStats = videoStatsResponse.data.items;
    const totalLikesCount = videoStats.reduce(
      (totalLikes, video) => totalLikes + parseInt(video.statistics.likeCount, 10),
      0
    );

    // Calculate average post likes
    const averagePostLikes = totalLikesCount / videoStats.length;

    // Calculate engagement rate
    const engagementRate = (averagePostLikes / subscribersCount)*1000;

    const responseData = { subscribersCount, averagePostLikes, engagementRate };
    res.json(responseData);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
