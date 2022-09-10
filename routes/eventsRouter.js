const express = require('express');
const eventRouter = express.Router();
const authenticate = require('../authenticate');
const Event = require('../models/Event');


eventRouter.route('/')
.get((req, res) => {
    Event.find()
    // .populate('creator')
    .then(events => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(events)
    })
    .catch(err => next(err))
})
.post(authenticate.verifyUser, (req, res) => {
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