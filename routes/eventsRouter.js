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
    const eventName = req.body.name; // This is how we get information out of the request. req.body.whatever-will-be-submitted
    const eventDescription = req.body.description;
    res.end(`Will update the events with the following:\nEvent name: ${eventName}\nEvent description: ${eventDescription}`)
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /events')
})
.delete((req, res) => {
    res.end('Deleting all events');
});

module.exports = eventRouter;