let express = require('express');
let router = express.Router();
let { ensureAuth, ensureGuest } = require('../middleware/auth');
let Story = require('../model/strory');



router.get('/', ensureGuest , (req, res) => {
    res.render('login', {
        layout : 'login'
    })   
})

router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        let stories = await Story.find({ user: req.user.id }).lean();
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })



    } catch (err) {
        throw new Error(err);
        res.render('error/500')
    }    
})





module.exports = router