let express = require('express');
let router = express.Router();
let passport = require('passport');


// get request to google /auth/google/

router.get('/google',
    passport.authenticate('google', {scope : ['profile']} )
)


// route for callback 
// get request to /auth/google/callback
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/'
    }),
    (req,res) => {
       res.redirect('/dashboard') 
    }
)


// logout router 
// /auth/logout
router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')    
})



module.exports = router