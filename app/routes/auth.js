//import authcontroller
var authController = require('../controllers/authcontroller.js');
 
//define the signup route
module.exports = function(app, passport) {
 //added a route for sign up
    app.get('/signup', authController.signup);
 //added a route for sign in
    app.get('/signin', authController.signin);

// //added a route for userdb
//     app.get('/userdatabase', function(req, res) {
//         res.sendFile(path.join(__dirname, "../public/views/userdatabase"))
//     })

 //add a route for posting to signup
    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/dashboard',
            failureRedirect: '/signup'
        }
    ));
 //if not logged in should be redirected to sign in
    app.get('/dashboard', isLoggedIn, authController.dashboard);
 
    app.get('/logout', authController.logout);
 
    app.post('/signin', passport.authenticate('local-signin', {
            successRedirect: '/dashboard',
 
            failureRedirect: '/signin'
        }
 
    ));
 
 //========================================
 //------CUSTOM MIDDLEWARE----------------
 //=========================================
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/signin');
 
    }
 
}