const express = require('express');

const eventRouter = express.Router();


// Routing method acts as a catch-all for any HTTP verb
// As with all routing methods, takes 2 parameters(path, function-to-do-when-called)
eventRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();  // passes control to the next routing method after this one. Otherwise it would stop here, and not go further
})
.get((req, res) => { //"next" not included because there should be no more instructions after this step)
    res.end('Will send all events to you');
})
.post((req, res) => {
    const name = req.body.name; // This is how we get information out of the request. req.body.whatever-will-be-submitted
    const description = req.body.description;
    const date = req.body.date;
    res.end(`Will update the events with the following:\nEvent name: ${name}\nEvent description: ${description}\nEvent date: ${Date(date)}`)
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /events')
})
.delete((req, res) => {
    res.end('Deleting all events');
});

// Route = /events/:eventId for targeting specific events. put/delete should require authentication
eventRouter.route('/:eventId')
.get((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/json')
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /events/' + req.params.eventId)
})
.put((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/json')
})
.delete((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/json')
})

module.exports = eventRouter;