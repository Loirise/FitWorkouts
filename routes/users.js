const express = require('express');
const router = express.Router();

const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/wrapAsync');
const User = require('../models/user');
const passport = require('passport');
const { checkReturnTo } = require('../middleware');

router.get('/register', (req, res) => {
    res.render('users/register.ejs');
});

router.post('/register', wrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) { return next(err) }
            req.flash('success', 'Account created!');
            return res.redirect('/trainingplans');
        });
    } catch(e) {
        if(e.message.substring(64,69) == 'email'){
            e.message = "Email already in use."
        }
        req.flash('error', e.message);
        return res.redirect('/register');
    };
}));

router.get('/login', (req, res) => {
    res.render('users/login.ejs');
});

router.post('/login', checkReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome!')
    const redirectUrl = res.locals.returnTo || '/trainingplans';
    res.redirect(redirectUrl);
});

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
    if(err) { return next(err) };
    req.flash('success', 'Logged out');
    res.redirect('/trainingplans');
    });
});

module.exports = router;