const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

const db = require('./../utils/db');

const UPLOADS_FOLDER = path.join(__dirname, '..', 'public', 'uploads');

router.post('/', async (req, res) => {
    const pfpCookies = req.cookies.pfp;

    if (pfpCookies != 'null') {
        const username = req.cookies.username;

        try {
            const prevProfileImagePath = path.join(UPLOADS_FOLDER, pfpCookies);

            fs.unlink(prevProfileImagePath, (err) => {
                if (err) console.error('Error deleting previous profile picture:', err);
            });

            await db.query('UPDATE users SET pfp_path = ? WHERE username = ?', [null, username]);

            res.clearCookie('pfp')
            res.cookie('pfp', 'null')

            res.redirect('/app');

        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ error: 'Failed to update profile' });
        }
    } else {
        res.redirect('/app')
    }
});

module.exports = router;

