const express = require('express');
const eventRouter = express.Router();
const authenticate = require('../authenticate');
const Event = require('../models/Event');
const User = require('../models/User');


eventRouter.route('/')
.get((req, res, next) => {
    console.log("Get Events triggered");
    // if (req.body.beginDate) { // Requires a beginDate and optional endDate formatted this way: '2022-10-05'
        console.log('There is a req.body.beginDate')
        const beginDate = new Date(req.body.beginDate);
        // const beginDate = '2000-01-01';
        
        // If only a start date is passed, all events for a single day are returned
        const endDate = req.body.endDate ? 
        new Date(req.body.endDate) : 
        new Date(`${req.body.beginDate}T23:59`);
        // const endDate = '3000-12-31';
        
        Event.find({eventDate: { 
            $gte: beginDate, 
            $lte: endDate
        }}).sort({eventDate: 1})
        .populate('creator')
        .then(events => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(events)
        })
        .catch(err => next(err))
    // } else {
    //     console.log(req.body)
    //     Event.find()
    //     .sort({eventDate: 1})
    //     .populate('creator')
    //     .then(events => {
    //         res.statusCode = 200;
    //         res.setHeader('Content-Type', 'application/json');
    //         res.json(events)
    //     })
    //     .catch(err => next(err))
    // }
})
.post(
    authenticate.verifyUser, 
    (req, res, next) => {
        const {name, description, eventDate} = req.body;
        if (name && description && eventDate){
            Event.create({name, description, eventDate, creator: req.user._id})
            .then(event => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(event)
            })
            .catch(err => next(err))
        } else {
            const err = new Error('The body for an added event MUST include a name, description, and eventDate');
            err.statusCode = 400;
            return next(err)
        }
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /events\nif you would like to edit an event, send a POST to /events/eventID')
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    Event.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response)
    })
    .catch(err => next(err))
});

eventRouter.route('/:eventId')
.get((req, res, next) => {
    Event.findById(req.params.eventId)
    .then(event => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/json');
        res.json(event)
    })
    .catch(err => next(err))
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /events/${req.params.eventId}.\nAdd an event by sending a POST request to /events`)
})
// Put request checks for a user to be signed in. Then if the creator is the user, or if the user is an admin, it updates
.put(authenticate.verifyUser, (req, res, next) => {
    Event.findById(req.params.eventId)
    .then(event => {
        if (event.creator.equals(req.user._id) || req.user.admin) {
            if (req.body.description) {event.description = req.body.description};
            if (req.body.name) {event.name = req.body.name};
            if (req.body.eventDate) {event.eventDate = new Date(req.body.eventDate)};
            event.save();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/json')
            res.json(event)
        } else {
            const err = new Error('You must be an admin or the creator of the event to make changes');
            return next(err)
        };
    })
    .catch(err => next(err));
})

// Event creators, or any admin user may delete events.
.delete(authenticate.verifyUser, (req, res, next) => {
    Event.findById(req.params.eventId)
    .then(event => {
        if (event.creator.equals(req.user._id) || req.user.admin) {
            Event.findByIdAndDelete(req.params.eventId)
            .then(event => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/json')
                res.json(event)
            })
            .catch(err => next(err))
        } else {
            const err = new Error('You must be an admin or the creator of an event to delete it.');
            return next(err)
        }
    })
    .catch(err => next(err))
})

// Logged in user can register as an attendee of an event or remove attendance
eventRouter.route('/register/:eventId')
.get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /events/register.')
})
.post(authenticate.verifyUser, (req, res, next) => {
    Event.findByIdAndUpdate(
        req.params.eventId,
        {$addToSet: { attendees: req.user._id}},
        {new: true, useFindAndModify: false}
    )
    .then(event => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/json');
        res.json(event)
    })
    .catch(err => next(err))
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Event.findByIdAndUpdate(
        req.params.eventId,
        {$pull: {attendees: req.user._id}},
        {new: true, useFindAndModify: false}
    )
    .then(event => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/json');
        res.json( {message: 'You have been removed from the event', event})
    })
    .catch(err => next(err))
})

// Gracefully handle errors
eventRouter.use((err, req, res, next) => {
    res.statusCode = err.statusCode || 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({
        success: false,
        status: res.statusCode,
        message: err.message
    })
})

module.exports = eventRouter;