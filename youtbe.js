const { google } = require('googleapis');

// Replace with your YouTube Data API credentials (API key or OAuth 2.0 credentials)
const API_KEY = 'AIzaSyBEtE0Ro3OIqAEEdd9L0LHEg85WDFGYkkY';

const youtube = google.youtube({
  version: 'v3',
  auth: API_KEY,
});

async function getChannelDataById(channelId) {
  try {
    // Get channel statistics (subscribers count)
    const channelResponse = await youtube.channels.list({
      part: 'statistics',
      id: channelId,
    });

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      throw new Error('Channel not found.');
    }

    const channelStatistics = channelResponse.data.items[0].statistics;
    const subscribersCount = parseInt(channelStatistics.subscriberCount, 10);

    // Get the channel's uploaded videos
    const videoResponse = await youtube.search.list({
      part: 'id',
      channelId: channelId,
      maxResults: 50, // Maximum number of videos to retrieve (adjust as needed)
    });

    const videoIds = videoResponse.data.items.map((item) => item.id.videoId);
    const videoIdsString = videoIds.join(',');

    // Get video statistics (likes count) for the channel's videos
    const videoStatsResponse = await youtube.videos.list({
      part: 'statistics',
      id: videoIdsString,
    });

    const videoStats = videoStatsResponse.data.items;
    const videoLikesCount = videoStats.reduce(
      (totalLikes, video) => totalLikes + parseInt(video.statistics.likeCount, 10),
      0
    );

    return { subscribersCount, videoLikesCount };
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

// Example usage:
const channelId = 'UCVvhor7edia2NkWt0FGKVIA'; // Replace with the actual channel ID
getChannelDataById(channelId)
  .then((data) => {
    console.log(`Subscribers: ${data.subscribersCount}`);
    console.log(`Total Video Likes: ${data.videoLikesCount}`);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
