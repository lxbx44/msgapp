const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('login', { error: null });
});

router.post('/', (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    (error, results) => {
      if (error) {
        console.error('Error logging in:', error);
        return res.render('login', { error: 'Login failed' });
      }

      if (results.length === 0) {
        return res.render('login', { error: 'Invalid credentials' });
      }

      const user = results[0];

      bcrypt.compare(password, user.password, (error, isMatch) => {
        if (error) {
          console.error('Error comparing passwords:', error);
          return res.render('login', { error: 'Login failed' });
        }

        if (!isMatch) {
          return res.render('login', { error: 'Invalid credentials' });
        }

          return res.redirect('/app');
      });
    }
  );

});

module.exports = router;

