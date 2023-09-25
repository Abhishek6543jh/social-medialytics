const express = require('express');
const { google } = require('googleapis');

const app = express();
const port = 3030;

// Replace 'YOUR_YOUTUBE_DATA_API_KEY_HERE' with your actual API key
const API_KEY = 'AIzaSyBEtE0Ro3OIqAEEdd9L0LHEg85WDFGYkkY';

const youtube = google.youtube({
  version: 'v3',
  auth: API_KEY,
});

function roundToDecimal(number, decimalPlaces) {
  return parseFloat(number.toFixed(decimalPlaces));
}

app.get('/channelData/:channelId', async (req, res) => {
  const channelId = req.params.channelId;

  try {
    // Get channel data including the title
    const channelResponse = await youtube.channels.list({
      part: 'snippet,statistics',
      id: channelId,
    });

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      throw new Error('Channel not found.');
    }

    const channelSnippet = channelResponse.data.items[0].snippet;
    const channelStatistics = channelResponse.data.items[0].statistics;
    const subscribersCount = parseInt(channelStatistics.subscriberCount, 10);
    const channelName = channelSnippet.title; // Extract the channel name

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

    const totalCommentsCount = videoStats.reduce(
      (totalComments, video) => totalComments + parseInt(video.statistics.commentCount, 10),
      0
    );

    // Calculate average post likes and round off to 2 decimal places
    const averagePostLikes = roundToDecimal(totalLikesCount / videoStats.length, 2);
  
    // Calculate average post comments and round off to 2 decimal places
    const averagePostComments = roundToDecimal(totalCommentsCount / videoStats.length, 2);

    // Calculate engagement rate and round off to 2 decimal places
    const engagementRate = roundToDecimal((averagePostLikes / subscribersCount) * 1000, 2);

    const responseData = {
      channelName, // Include the channel name in the response
      subscribersCount,
      averagePostLikes,
      averagePostComments,
      engagementRate,
      numberOfPosts: videoStats.length,
    };
    res.json(responseData);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
