const express = require('express');
const router = express.Router();
const db = require('./../utils/db')

const auth = require('./auth')

router.get('/', auth, (req, res) => {
    const username = req.cookies.username;
    const name = req.cookies.name;
    const email = req.cookies.email;
    const userId = req.cookies.userId;
    const error = req.query.error;

    db.query(
        'SELECT u.username, u.pfp_path, u.name FROM friends AS f JOIN users AS u ON (f.friend_id = u.id) WHERE f.user_id = ? AND f.status = ?',
        [userId, 'accepted'],
        (error, results) => {
            if (error) {
                console.error('Error fetching friends:', error);
                res.status(500).send('Failed to fetch friends');
            } else {
                db.query(
                    'SELECT u.username, u.pfp_path, u.name FROM friends AS f JOIN users AS u ON (f.user_id = u.id) WHERE f.friend_id = ? AND f.status = ?',
                    [userId, 'accepted'],
                    (error2, results2) => {
                        if (error2) {
                            console.error('Error fetching friends:', error);
                            res.status(500).send('Failed to fetch friends');
                        } else {
                            const allResults = results.concat(results2);
                            const seen = {};

                            const uniqueResults = allResults.filter((friend) => {
                                if (friend.username === username) return false; // Exclude current user
                                if (seen[friend.username]) return false; // Exclude duplicates
                                seen[friend.username] = true;
                                return true;
                            });
                            console.log(results.length)
                            res.render('friends', { username, name, email, userId, error, friends: uniqueResults })
                        }
                    }
                )
            }
        }
    )
});

module.exports = router;

