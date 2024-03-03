const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const initializePassport = require('./passportConfig.js');

const app = express();



initializePassport(passport);



app.use(session({
    secret : 'secret',
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});



app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set("view engine", "ejs");

app.use('/', require('./routes/routes1.js'));

// app.use('/api/', require('./routes/routes.js'));



const PORT  = process.env.PORT || 4000;

app.listen(PORT, ()=> console.log(`server is running in ${PORT}`));
