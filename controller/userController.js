const User = require('../models/user');


//redirect to user registration page
module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

//create new user
module.exports.createUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Successfully Logged in!');
            res.redirect('/campgrounds');
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register')
    }

}

//redirect to login page
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

//login user
module.exports.userLogin = (req, res) => {

    req.flash('success', 'Welcome back');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl)
}

// logout user
module.exports.userLogout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Successfully Logged Out!');
        res.redirect('/campgrounds');
    });
}
