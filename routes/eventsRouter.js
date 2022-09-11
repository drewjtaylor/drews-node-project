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
.post(
    // authenticate.verifyUser, 
    // authenticate.verifyAdmin,
    (req, res, next) => {
        const {name, description, eventDate} = req.body;
        if (name && description && eventDate){
            // res.write(`The author's id is ${req.user._id}`);
            res.end(`Will add the following event:\nEvent name: ${name}\nEvent description: ${description}\nEvent date: ${Date(eventDate)}`)
        } else {
            const err = new Error('Every event MUST include a name, description, and eventDate');
            err.statusCode = 400;
            return next(err)
        }
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