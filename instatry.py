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

        totallikes = 0

        # Iterate through the user's posts and calculate the total likes
        for post in profile.get_posts():
            totallikes += post.likes

        followers = profile.followers
        engagement_rate = (totallikes / followers) * 100

        # Return the Instagram data as JSON
        return jsonify({
            'username': user,
            'total_likes': totallikes,
            'followers': followers,
            'engagement_rate': engagement_rate
        }), 200

    except instaloader.exceptions.ProfileNotExistsException:
        return jsonify({'error': 'User not found'}), 404

if __name__ == '__main__':
    app.run()

