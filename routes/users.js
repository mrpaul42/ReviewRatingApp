const express = require('express');
const router = express.Router();
const catchAsync = require('../utility/catchAsync');

const passport = require('passport');
const userControl = require('../controllers/user');

router.route('/register')
    .get(userControl.renderRegister)
    .post(catchAsync(userControl.signUp));

router.route('/login')
    .get(userControl.renderLogin)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),userControl.Login);

router.get('/logout',userControl.LogOut);

module.exports = router;