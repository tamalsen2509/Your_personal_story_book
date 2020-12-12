
let express = require('express');
let router = express.Router();
let { ensureAuth, ensureGuest } = require('../middleware/auth');
let Story = require('../model/strory');



// show add page
//@route story get request to add form

router.get('/add', ensureAuth , (req, res) => {
    res.render('stories/add')   
})


//@route /story post  request 

router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id 
        await Story.create(req.body)
        res.redirect('/dashboard')

    } catch (err) {
        throw new Error(err)
        res.render('error/500')
    }   
})

// get route to display all stories 

router.get('/', ensureAuth , async (req, res) => {
   
    try {
        let stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
        res.render('stories/index', {
            stories,
        } )
    } catch (err) {
        throw new Error (err)
    }
})


// user stories
// routes get /stories/user/:userId

router.get('/user/:userId', ensureAuth , async (req, res) => {
    try {
        let stories = await Story.find({ 
            user: req.params.userId,
            status:'public'
        }).populate('user')
            .lean()
        
        res.render('stories/index', {
            stories
        })
    } catch (err) {
        throw new Error(err);
        res.render ('error/500')
    }
})



// show edit page
//@route story patch request to edit form

router.get('/edit/:id', ensureAuth , async(req, res) => {
    let story = await Story.findOne({
        _id: req.params.id
    }).lean()

    if (!story) {
        return res.render('error/404')
    }
    
    if (story.user != req.user.id) {
        res.redirect('/stories')
    } else {
        res.render('stories/edit', {
            story
        } )
    }

})

// route to view all stories 
// @route get/stories/:id
router.get('/:id', ensureAuth , async(req, res) => {
       try {
           let story = await Story.findById(req.params.id)
               .populate('user')
               .lean()
           if (!story) {
                return res.render('error/404')
           }
           res.render('stories/show', {
               story
           })
       } catch (err) {
           throw new Error(err)
           res.render('error/500')
       }
})


// router put request path : put/stories/:id
router.put('/:id', ensureAuth, async (req, res) => {    
    try {
        let story = await Story.findById(req.params.id).lean();
    if (!story) {
        return res.render('error/404')
    }
    if (story.user != req.user.id) {
        res.redirect('/stories')
    } else {
        story = await Story.findOneAndUpdate({
            _id: req.params.id
        }, req.body, {
                new: true,
                runValidators: true
        })
        res.redirect('/dashboard')
    }    
    } catch (err) {
        throw new Error(err)
        return res.render('error/500')
    }    
})

// route to delete post
// route= delete / stories/:id 

router.delete('/:id', ensureAuth, async (req, res) => {    
    try {
        await Story.remove({_id : req.params.id})
        res.redirect('/dashboard')
    } catch (err) {
        throw new Error(err)
        return res.render('error/500')
    }    
})






module.exports = router