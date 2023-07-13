const express = require('express');
const router = express.Router();
const catchAsync = require('../utitlities/CatchAsync');

const passport = require('passport')
const { storeReturnTo } = require('../middleware/loginMiddleware');

const userController = require('../controller/userController');
//route
router.route('/register')
    .get(userController.renderRegister)
    .post(catchAsync(userController.createUser));


router.route('/login')
    .get(userController.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.userLogin)

// this stopped working
// router.get('/logout',(req,res)=>{
//     req.logout();
//     req.flash('success','Successfully Logged Out!')
//     res.redirect('/campgrounds')
// })

//req.logout now requires a callback function
router.get('/logout', userController.userLogout);


module.exports = router; 