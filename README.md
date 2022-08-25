# This is the node/express server created as a project during my Nucamp class.

It should accompany the website created for Formation Church with the ability to track upcoming events and has a list of admin/staff as users who will be allowed to change those events.

# Routes

## /events
GET: Will retrieve all events from database

DELETE: Clear all events from database

PUT: Will not have any functionality at this endpoint

POST: Create a new event

## /events/:eventId
GET: Will retrieve a specific event from database

DELETE: Will delete a specific event

PUT: Will edit an existing event

POST: No functionality at this endpoint

## /users
GET: Will retrieve all users

DELETE: Will clear all users

PUT: Will not have any functionality at this endpoint

POST: Create a new user

## users/userId
GET: Retrieve information for a specific user

DELETE: Delete a specific user

PUT: Will edit an existing user’s information

POST: No functionality at this endpoint