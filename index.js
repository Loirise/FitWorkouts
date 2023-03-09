require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('passport-local');
const MongoStore = require('connect-mongo');

const ExpressError = require('./utils/ExpressError');
const trainingplanRoutes = require('./routes/trainingplans');
const userRoutes = require('./routes/users');
const User = require('./models/user');

const app = express();
const db = mongoose.connection;

/* env */
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/fitworkouts'
const secret = process.env.SECRET || 'supersecretstuff123!'

/* connect to mongodb */
mongoose.set('strictQuery', false);
mongoose.connect(dbUrl)
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database connected');
});


app.engine('ejs', ejsMate);
app.set('view enginge', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static('public')); /* this makes styles.css work */

/* session store */
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on('error', function(e){
    console.log("SESSION STORE ERROR", e)
});

/* session */
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));

/* passport session */
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* flash */
app.use(flash());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


/* express router */
app.use('/trainingplans', trainingplanRoutes);
app.use('/', userRoutes);


/* routes */
app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
    const { statusCode=500 } = err;
    if(!err.message) err.message = 'Error. Something went wrong!';
    res.status(statusCode).render('error.ejs', { err })
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});


