let mongoose = require('mongoose');



let storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body:    {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        dufault: 'public',
        enum:['public', 'private']
        
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'       
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports= mongoose.model('Story', storySchema)