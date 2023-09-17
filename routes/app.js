const express = require('express');
const router = express.Router();
const db = require('./../utils/db')

const auth = require('./auth')

router.get('/', auth, (req, res) => {
    const username = req.cookies.username;
    const name = req.cookies.name;
    const email = req.cookies.email;
    const pfp = req.cookies.pfp.replace(/\"/g, "");
    const userId = req.cookies.userId;
    


    db.query(
        'SELECT u.username, u.pfp_path, u.name FROM friends AS f JOIN users AS u ON (f.user_id = u.id) WHERE f.friend_id = ? AND f.status = ?',
        [userId, 'accepted'],
        (error2, results2) => {
            if (error2) {
                console.error('Error fetching friends:', error2);
                res.status(500).send('Failed to fetch friends');
            } else {
                const allResults = results2.concat(results2);
                const seen = {};

                const friends = allResults.filter((friend) => {
                    if (friend.username === username) return false; // Exclude current user
                    if (seen[friend.username]) return false; // Exclude duplicates
                    seen[friend.username] = true;
                    return true;
                })


                res.render('app', { name, username, pfp, email, friends })
            }
        }
    );
});

module.exports = router;
