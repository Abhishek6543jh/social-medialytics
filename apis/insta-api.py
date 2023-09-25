from flask import Flask, request, jsonify
import instaloader

app = Flask(__name__)

@app.route('/instadata', methods=['GET'])
def get_instagram_data():
    # Get the Instagram username from the query parameter
    user = request.args.get('username')

    # Check if the 'username' parameter is provided
    if not user:
        return jsonify({'error': 'Username parameter is missing'}), 400

    try:
        # Create an Instaloader instance
        L = instaloader.Instaloader()

        # Replace 'username' with the actual Instagram username
        profile = instaloader.Profile.from_username(L.context, user)

        total_likes = 0
        total_comments = 0
        total_posts = 0
        followers = profile.followers

        # Iterate through the user's posts and calculate total likes, comments, and count of posts
        for post in profile.get_posts():
            total_likes += post.likes
            total_comments += post.comments
            total_posts += 1

        engagement_rate = ((total_likes + total_comments) / (total_posts * followers)) * 100

        # Round off the engagement rate to two decimal places
        engagement_rate = round(engagement_rate, 2)

        # Return the Instagram data as JSON
        return jsonify({
            'username': user,
            'total_likes': total_likes,
            'total_comments': total_comments,
            'total_posts': total_posts,
            'followers': followers,
            'engagement_rate': engagement_rate
        }), 200

    except instaloader.exceptions.ProfileNotExistsException:
        return jsonify({'error': 'User not found'}), 404

if __name__ == '__main__':
    app.run()
