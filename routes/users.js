const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { checkReturnTo } = require('../middleware');
const auth = require('../controllers/auth');

router.route('/register')
    .get(auth.showRegisterPage)
    .post(wrapAsync(auth.registerUser))

router.route('/login')
    .get(auth.showLoginPage)
    .post(checkReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), auth.redirectAfterLogin)

router.post('/logout', auth.logoutUser);

module.exports = router;