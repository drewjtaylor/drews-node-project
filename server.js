const express = require('express');
const morgan = require('morgan');
const eventRouter = requrie ('./routes/eventsRouter');
const userRouter = require('./routes/usersRouter');

const hostname = 'localhost';
const port = 3000;

// Anywhere after this line, "app" means "using express"
const app = express();


// Sets up Morgan middleware logging in dev mode
app.use(morgan('dev'));
// Sets up json middleware for dealing with JSON data
app.use(express.json());

app.use('/events', eventRouter);
app.use('/users', userRouter)

// app.get('/campsites/:campsiteId', (req, res) => {
//     res.end(`Will send details fo the campsite: ${req.params.campsiteId} to you`)  // This is how you access fluid variables from the URL. req.params.thing-after-colon
// })

// app.post('/campsites/:campsiteId', (req, res) => {
//     res.statusCode = 403;
//     res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`)
// });

// app.put('/campsites/:campsiteId', (req, res) => {
//     res.write(`Updating the campsite: ${req.params.campsiteId}\n`);
//     res.end(`Will update the campsite: ${req.body.name} with description: ${req.body.description}`)
// })


// app.delete('/campsites/:campsiteId', (req, res) => {
//     res.end(`Deleting campsite:  ${req.params.campsiteId}`);
// });

// Essentially means, "static files are served at THIS FOLDER + /public".
app.use(express.static(__dirname + '/public'));


// Sets up a code block to work with the request (req) and response (res) in a default scenario (i.e., localhost:3000 with no additional /public or anything)
app.use((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>')
});



// Starts the server listening, and logs that it started
app.listen(port, hostname, () => {
    console.log(`server runnning at http://${hostname}:${port}`)
})