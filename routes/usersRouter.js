const express = require('express');
const userRouter = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const authenticate = require('../authenticate');
const User = require('../models/User');


userRouter.route('/')
.get((req, res, next) => {
    User.find()
    .then(users => {
        if (!users) {
            return
        };
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(users)
    })
    .catch(err => next(err))
})
.post((req, res, next) => {
    User.register(
        new User({username: req.body.username, email: req.body.email}),
        req.body.password,
        (err, user) => {
            if (err) {
                console.log('mark3');
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
                console.log('There was an error registering new user');
                return next(err)
            } else {
                if (req.body.firstName) {
                    user.firstName = req.body.firstName
                };
                if (req.body.lastName) {
                    user.lastName = req.body.lastName
                };
                user.save(err => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({err: err});
                        return next(err)
                    };
                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, status: 'Registration successful'});
                    })
                })
            }
        }
    )
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /users')
})
.delete((req, res, next) => {
    res.statusCode = 200;
    res.end('Deleting all users');
});

// Routes for dealing with single user
userRouter.route('/:userId')
.get(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
    res.statusCode = 200;
    res.end('Will send a single user to you');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /users/' + req.params.userId)
})
.put(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
    User.findByIdAndUpdate(req.params.userId, 
        {
            $set: req.body
        },
    {
        new: true
    })
    .then(user => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    })
    .catch(err => next(err))
})
.delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
    res.statusCode = 200;
    res.end('Delete a single user with id: ' + req.params.userId);
});

module.exports = userRouter;