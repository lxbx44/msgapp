const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

const db = require('./../utils/db');

const UPLOADS_FOLDER = path.join(__dirname, '..', 'public', 'uploads');

router.post('/', async (req, res) => {
    // Check if the file was uploaded
    if (req.files && req.files.profileImage) {
        const username = req.cookies.username;

        const profileImage = req.files.profileImage;
        const uniqueFileName = `${uuidv4().replace(/%/g, "")}.png`;
        const profileImagePath = path.join(UPLOADS_FOLDER, uniqueFileName); // Construct the output file path

        try {
            const metadata = await sharp(profileImage.data).metadata();
            const originalWidth = metadata.width;
            const originalHeight = metadata.height;

            if (originalWidth === originalHeight) {
                await sharp(profileImage.data)
                    .toFile(profileImagePath)

            } else if (originalWidth < originalHeight) {
                const left = 0;
                const top = Math.floor((originalHeight - originalWidth) / 2);

                await sharp(profileImage.data)
                    .extract({ left, top, width: originalWidth, height: originalWidth })
                    .toFile(profileImagePath);

            } else if (originalWidth > originalHeight) {
                const left = Math.floor((originalWidth - originalHeight) / 2);
                const top = 0;

                await sharp(profileImage.data)
                    .extract({ left, top, width: originalHeight, height: originalHeight })
                    .toFile(profileImagePath);
            }


            const prevProfilePathResult = req.cookies.pfp;

            if (prevProfilePathResult !== null) {
                const prevProfileImagePath = path.join(UPLOADS_FOLDER, prevProfilePathResult);
                fs.unlink(prevProfileImagePath, (err) => {
                    if (err) console.error('Error deleting previous profile picture:', err);
                });
            }
            
            await db.query('UPDATE users SET pfp_path = ? WHERE username = ?', [uniqueFileName, username]);

            res.clearCookie('pfp')
            res.cookie('pfp', uniqueFileName)

            res.redirect('/app');

        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ error: 'Failed to update profile' });
        }
    } else {
        const { newName, newEmail } = req.body;

        const username = req.cookies.username;
        const nameCookie = req.cookies.name;
        const emailCookie = req.cookies.email;

        if (nameCookie !== newName && emailCookie !== newEmail) {
            try {
                await db.query('UPDATE users SET name = ?, email = ? WHERE username = ?', [newName, newEmail, username]);

                res.clearCookie('name');
                res.cookie('name', newName);

                res.clearCookie('email');
                res.cookie('email', newEmail);

                res.redirect('/app');

            } catch (error) {
                console.error('Error updating profile:', error);
                res.status(500).json({ error: 'Failed to update profile' });
            }
        } else if (nameCookie !== newName && emailCookie === newEmail) {
            try {
                await db.query('UPDATE users SET name = ? WHERE username = ?', [newName, username]);

                res.clearCookie('name');
                res.cookie('name', newName);

                res.redirect('/app');

            } catch (error) {
                console.error('Error updating profile:', error);
                res.status(500).json({ error: 'Failed to update profile' });
            }
        
        } else if (nameCookie === newName && emailCookie !== newEmail) {
            try {
                await db.query('UPDATE users SET email = ? WHERE username = ?', [newEmail, username]);

                res.clearCookie('email');
                res.cookie('email', newEmail);

                res.redirect('/app');

            } catch (error) {
                console.error('Error updating profile:', error);
                res.status(500).json({ error: 'Failed to update profile' });
            }
        } else {
            res.redirect('/app')
        }
    }
});

module.exports = router;

