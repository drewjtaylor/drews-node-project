const express = require('express');

const userRouter = express.Router();


userRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all users to you');
})
.post((req, res) => {
    const userName = req.body.name;
    const userDescription = req.body.description;
    res.end(`Will update the users with the following:\nUser name: ${userName}\nUser description: ${userDescription}`)
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /users')
})
.delete((req, res) => {
    res.end('Deleting all users');
});

module.exports = userRouter;