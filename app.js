if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
};

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // this parse the body
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))); // serving static assets

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user; // making user a global var that we can access
    res.locals.success = req.flash('success'); // this way we will have access to it in our templates (middleware)
    res.locals.error = req.flash('error');
    next();
});

// route handlers
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes); // delegate all the routes starts with campgrounds to another file 
app.use('/campgrounds/:id/reviews', reviewRoutes); // reviews route

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => { // this path is going to catch any unrecognitzed url
    next(new ExpressError('Page Not Found', 404));
});

// this is catch all for any error that occurs
app.use((err, req, res, next) => { // if any error is triggered the catchAsync class is going to pass the error to next and this is going to catch it
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No, Something Went Wrong!";
    res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
    console.log('serving on port 3000');
});