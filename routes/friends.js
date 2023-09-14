const express = require('express');
const router = express.Router();
const db = require('./../utils/db')

const auth = require('./auth')

router.get('/', auth, (req, res) => {
    const username = req.cookies.username;
    const name = req.cookies.name;
    const email = req.cookies.email;
    const userId = req.cookies.userId;
    const pfp = req.cookies.pfp;

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
                            console.error('Error fetching friends:', error2);
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

                            let fl = 0;
                            uniqueResults.forEach(()=> {
                                fl++;
                            })


                            db.query(
                                'SELECT u.username, u.pfp_path, u.name FROM friends AS f JOIN users AS u ON (f.user_id = u.id) WHERE f.friend_id = ? AND f.status = ?',
                                [userId, 'pending'],
                                (error3, results3) => {
                                    if (error3) {
                                        console.error('Error fetching friends:', error3);
                                        res.status(500).send('Failed to fetch friends');
                                    } else {
                                        const allResults2 = results.concat(results3);
                                        const seen2 = {};

                                        const uniqueResults2 = allResults2.filter((friend) => {
                                            if (friend.username === username) return false; // Exclude current user
                                            if (seen[friend.username]) return false; // Exclude duplicates
                                            seen[friend.username] = true;
                                            return true;
                                        });
                                        
                                        const error = req.query.error;

                                        let pl = 0;
                                        uniqueResults2.forEach(()=> {
                                            pl++;
                                        })
                                        res.render('friends', { username, name, email, userId, pfp, error, friends: uniqueResults, pending: uniqueResults2, fl, pl })
                                    }
                                }
                            )

                        }
                    }
                )
            }
        }
    )
});

module.exports = router;

