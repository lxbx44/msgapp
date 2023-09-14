const express = require('express');
const router = express.Router();
const db = require('./../utils/db');


router.post('/', async (req, res) => {
    const usrF = req.body.pendingUsername;
    const currentUserID = req.cookies.userId;

    db.query(
        'SELECT id FROM users WHERE username = ?',
        [usrF],
        (error, results) => {
            if (error) {
                return res.redirect('/friends');
            }

            if (results.length === 0) {
                return res.redirect('/friends');
            }

            const friendUserID = results[0].id;

            db.query(
                'UPDATE friends SET status = ? WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)',
                ['rejected', currentUserID, friendUserID, friendUserID, currentUserID],
                (error, results) => {
                    if (error) {
                        return res.redirect('/friends');
                    }

                    db.query(
                        'DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)',
                        [currentUserID, friendUserID, friendUserID, currentUserID],
                        (error, results) => {
                            if (error) {
                                console.error('Error deleting friend request:', error);
                            }
                            return res.redirect('/friends');
                        }
                    );
                }
            );
        }
    );
});



module.exports = router;

