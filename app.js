//let compression = require('compression');
const express = require('express');
require('dotenv').config();
const app = express()
var exphbs = require('express-handlebars');
let methodOverride = require('method-override');
let morgan = require('morgan');
const port = process.env.PORT || 3000
let db = require('./db/connection');
let passport = require('passport');
let mongoose = require('mongoose');
let session = require('express-session');
let mongoStore = require('connect-mongo')(session);
let helmet = require('helmet');

 



// body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

// method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
}))

// for basic security 

//app.use(helmet());


// app middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}

// Handlebars helpers 

let { formatDate , truncate , stripTags , editIcon ,select } = require('./helper/hbs');



// view middleware
app.engine('.hbs', exphbs({ helpers : {formatDate , truncate, stripTags, editIcon, select  } , extname :'.hbs'}));
app.set('view engine', '.hbs');

// passport config
require('./passport/passport')(passport)


// session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({mongooseConnection : mongoose.connection })
}))


// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// set global var
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
} )


// static middleware
app.use(express.static('public'))

// routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

// db connection
db.connection()




app.listen(port, () => console.log(`Example app listening on port port!`))