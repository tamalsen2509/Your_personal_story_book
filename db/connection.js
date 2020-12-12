require('dotenv').config();
let mongoose = require('mongoose');


exports.connection = async () => {
    try {
        await   mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })    
        console.log('connected to mongoDB!')
    } catch (error) {
        throw new Error(error)
    }
}

