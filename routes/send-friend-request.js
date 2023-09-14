const express = require('express');
const router = express.Router();
const db = require('./../utils/db');


router.post('/', async (req, res) => {
    const currentUserID = req.cookies.userId;
    const friendUsername = req.body.friendUsername;

    // Query the database to find the friend's userID based on their username
    db.query(
        'SELECT id FROM users WHERE username = ?',
        [friendUsername],
        (error, results) => {
            if (error) {
                return res.redirect('/friends?error=Failed to send friend request 1');
            }

            if (results.length === 0) {
                return res.redirect('/friends?error=User not found');
            }

            const friendUserID = results[0].id;

            db.query(
                'SELECT * FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)',
                [currentUserID, friendUserID, friendUserID, currentUserID],
                (error, results) => {
                    if (error) {
                        return res.redirect('/friends?error=Failed to send friend request 2');
                    }

                    if (currentUserID == friendUserID) {
                        return res.redirect('/friends?error=You can\'t send a friend request to yourself');
                    }

                    if (results.length > 0) {
                        const existingRequest = results[0];

                        if (existingRequest.user_id == currentUserID && existingRequest.status == 'pending') {
                            return res.redirect('/friends?error=You have already sent a friend request to this user');
                        }

                        if (existingRequest.friend_id == currentUserID && existingRequest.status == 'pending') {
                            db.query(
                                'UPDATE friends SET status = ? WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)',
                                ['accepted', currentUserID, friendUserID, friendUserID, currentUserID],
                                (error2, results2) => {
                                    if (error2) {
                                        return res.redirect('/friends?error=Failed to send friend request 3');
                                    }
                                    
                                    return res.redirect('/friends');
                                }
                            );
                        }
                    } else {
                        db.query(
                            'INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)',
                            [currentUserID, friendUserID, 'pending'],
                            (error, results) => {
                                if (error) {
                                    console.error('Error: ', error);
                                    return res.redirect('/friends?error=Failed to send friend request 4');
                                }

                                return res.redirect('/friends');
                            }
                        );
                    }
                }
            )
        }
    );
});



module.exports = router;

