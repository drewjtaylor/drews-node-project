const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const eventRouter = require('./routes/eventsRouter');
const userRouter = require('./routes/usersRouter');
const config = require('./config');
const dotenv = require('dotenv').config()


const hostname = '127.0.0.1'; // Was 'localhost', but needs specific IP for deployment on GCloud
const port = 8080;

const externalDbConnection = process.env.MONGOURI;

// Configure and connect to Mongoose
// If you are using a local mongodb database, you will need to update the config.js file
const url = externalDbConnection || config.mongoUrl;
const connect = mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
});


connect.then(
    () => console.log(`Connected correctly to the ${externalDbConnection ? 'MongoDB Atlas ' : 'local MongoDB '} server`),
    err => console.log(err)
)


const app = express();

// Set up Morgan middleware logging in dev mode
app.use(morgan('dev'));


// Redirect non-secure requests to https
// app.all('*', (req, res, next) => {
//     if (req.secure) {
//         return next();
//     } else {
//         const secureUrl = `https://${req.hostname}:${app.get('secPort')}${req.url}`;
//         console.log(`Redirecting to: ${secureUrl}`);
//         res.redirect(308, secureUrl);
//     }
// });

// Set up json middleware for dealing with JSON data
app.use(express.json());

// Set up passprt
app.use(passport.initialize());

// Route references
app.use('/events', eventRouter);
app.use('/users', userRouter)

// Essentially means, "static files are served at THIS FOLDER + /public".
app.use(express.static(__dirname + '/public'));


// Set up a code block to work with the request (req) and response (res) in a default scenario (i.e., localhost:3000 with no additional /public or anything)
app.use((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>')
});


// Start the server listening, and logs that it started
app.listen(port, hostname, () => {
    console.log(`server runnning at http://${hostname}:${port}`)
})

module.exports = app;