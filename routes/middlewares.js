const authenticateUser = (req, res, next) => {
    const username = req.cookies.username;
    const name = req.cookies.name;

    if (!username || !name) {
        return res.redirect('/');
    }

    next();
};

const redAppIfLogin = (req, res, next) => {
    const username = req.cookies.username;
    const name = req.cookies.name;

    if (username || name) {
        return res.redirect('/app')
    }
    next();
};


module.exports = {
    authenticateUser,
    redAppIfLogin
};
