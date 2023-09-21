import instaloader
import sys
user=sys.argv[1]
# Create an Instaloader instance
L = instaloader.Instaloader()
# Replace 'username' with the actual Instagram username
profile = instaloader.Profile.from_username(L.context, user)
totallikes=0
# Iterate through the user's posts and print the likes count
for post in profile.get_posts():
    totallikes=totallikes+ post.likes
print(totallikes)
print(profile.followers)
engagement_rate = (totallikes / profile.followers) * 100
# Print the result
print(f"Engagement Rate: {engagement_rate:.2f}%")
