const express = require('express');
const morgan = require('morgan');
const eventRouter = require('./routes/eventsRouter');
const userRouter = require('./routes/usersRouter');

const hostname = 'localhost';
const port = 3000;

// Anywhere after this line, "app" means "using express"
const app = express();


// Set up Morgan middleware logging in dev mode
app.use(morgan('dev'));

// Set up json middleware for dealing with JSON data
app.use(express.json());

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