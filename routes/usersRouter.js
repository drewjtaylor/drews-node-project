const express = require('express');
const userRouter = express.Router();


userRouter.route('/')
.get((req, res, next) => {
    res.statusCode = 200;
    res.end('Will send all users to you');
})
.post((req, res, next) => {
    res.statusCode = 200;
    const userName = req.body.name;
    const userDescription = req.body.description;
    res.end(`Will update the users with the following:\nUser name: ${userName}\nUser description: ${userDescription}`)
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /users')
})
.delete((req, res, next) => {
    res.statusCode = 200;
    res.end('Deleting all users');
});

// Routes for dealing with single user
userRouter.route('/:userId')
.get((req, res, next) => {
    res.statusCode = 200;
    res.end('Will send a single user to you');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /users')
})
.put((req, res, next) => {
    res.statusCode = 403;
    // Update Single document defined by userId
    res.end('PUT operation not supported on /users/' + req.params.userId)
})
.delete((req, res, next) => {
    res.statusCode = 200;
    res.end('Delete a single user with id: ' + req.params.userId);
});

module.exports = userRouter;