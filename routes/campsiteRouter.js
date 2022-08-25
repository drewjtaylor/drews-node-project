const express = require('express');

const campsiteRouter = express.Router();


// Routing method acts as a catch-all for any HTTP verb
// As with all routing methods, takes 2 parameters(path, function-to-do-when-called)
campsiteRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();  // passes control to the next routing method after this one. Otherwise it would stop here, and not go further
})
.get((req, res) => { //"next" not included because there are no more instructions after this)
    res.end('Will send all campsites to you');
})
.post((req, res) => {
    const campsiteName = req.body.name; // This is how we get information out of the request. req.body.whatever-will-be-submitted
    const campsiteDescription = req.body.description;
    res.end(`Will update the campsites with the following:\nCampsite name: ${campsiteName}\nCampsite description: ${campsiteDescription}`)
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /campsites')
})
.delete((req, res) => {
    res.end('Deleting all campsites');
});

module.exports = campsiteRouter;