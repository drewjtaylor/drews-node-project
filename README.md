# This is the node/express server created as a side project during my Nucamp class.

If you have access to Postman, you can test out this API project here: 
[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/22954547-25bfee63-e883-4bcb-a3e6-851f62719919?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D22954547-25bfee63-e883-4bcb-a3e6-851f62719919%26entityType%3Dcollection%26workspaceId%3Ddc2e3761-fe20-4fc6-8e76-fa61671c14b3)

## CI/CD update!

Originally this was a server run locally, requiring a local MongoDB server, and it was difficult to demonstrate.

No longer!

TLDR: You can test all endpoints with postman or any similar tool.

First, I set up a database on MongoDB Atlas, so it's accessible more broadly without requiring setup by anyone wanting to test it out.

Second, this code is set up to run in Goole Cloud, so it can be tested without setting up the server locally. (Additionally, this means any secrets and environment variables are safely tucked away and don't have to be shared.)

Thirdly, the Google Cloud Run is set up for continuous integration and development (CI/CD) based on pushes to the main branch of this repository. No more manually uploading code to Google Cloud!

## Description

The main goal of this server is to track events and users in MongoDB and set up endpoints for users to perform basic CRUD operations on this information.

Depending on whether or not a user is logged in, they are able to perform GET requests to retrieve event information or POST requests to make new events.

Any user set up as an "admin" can add, edit, or delete events, in addition to being able to view users.

Any user NOT set up as an admin will be able to create events and edit their own events, but nothing else.

This guide to my project is split into three main parts:
1. [Routes](#routes)
2. [Authentication](#authentication)
3. [Testing](#testing)
4. [Roadmap](#roadmap)
5. [How Was It Made](#howwasitmade)

# <a name="routes">Routes</a>

## /users
GET: Will retrieve all users (Requires admin to be signed in)

DELETE: Will clear all users (Requires admin to be signed in)

PUT: Will not have any functionality at this endpoint

POST: Used to regiser a new user by including a JSON body. The JSON body should include an email and username that hasn't been used before, a password, and an optional firstName and lastName field, such as the following:
```
{
    "email": "testemail1@example.com",
    "username": "notadmin",
    "password": "password",
    "firstName": "Joe",
    "lastName": "Schmoe"
}
```

## users/:userId

By adding the _id for the user in question to the url (i.e., https://localhost:3443/users/bigLongUser_IdHere), CRUD operations can be performed. All of these require a bearer token from an Admin.

GET: Retrieve information for specific user

DELETE: Delete a specific user

PUT: Will edit an existing user’s information, updating any fields included in the JSON body of the request.

## /events
GET: Will retrieve all events from database. (Ignore the highlighted event times for now. Just note that multiple events are returned.)

![all events retrieved using postman](./demo-screens/all-events-postman.jpg)


If the body of the request has a startDate (in JSON format) but no endDate, all events for that day are returned.

If the body of the request has a startDate and endDate, all events on or between those dates will be returned.

![limited dates returned with postman](./demo-screens/specific-date-range-events-postman.jpg)

DELETE: Clear all events from database
Requires bearer token from an Admin to be present.

POST: Create a new event
Requires a bearer token from a valid user. Does not require that user to be an admin.

The body must contain a name, description, and eventDate in JSON format. The eventDate must be a string that can be fed into <code>new Date(eventdate)</code> to create a valid javascript Date object.

## /events/:eventId
GET: Will retrieve information for the event with an _id of eventId

DELETE: Will delete a specific event. Requires a bearer token from either the creator of the event, or from an admin user.

PUT: Will edit an existing event. Also requires a bearer token from the creator or an admin.

Requires a bearer token from either the creator of the event, or from an admin user.

# <a name='authentication'>Authentication</a>

When a user us successfully logged in, a token is returned.

![user logged in](./demo-screens/token-after-log-in.jpg)

This token can be copied and entered as a Bearer Token in the header (or automatically entered using Postman's "bearer" authentication method,) causing future requests to let the server know which user is making the request.

Here is an example of using the bearer token using Postman's bearer authentication
![postman bearer token](./demo-screens/postman-bearer-token.jpg)


You can also add the header directly (this is all Postman was doing anyway). Make sure to add the header title "Authorization" with the value, "Bearer {token goes here}"
![header bearer token](./demo-screens/header-bearer-token.jpg)

# <a name='testing'>Testing</a>

In order to test endpoints, you will need to have [MongoDB](https://www.mongodb.com/try/download/community) installed globally, and you will need a program to directly test the endpoints such as [Insomnia](https://insomnia.rest/download), or [Postman](https://www.postman.com/downloads/). I used postman, so any screenshots or instructions here will assume you have the same, but any program should work as long as you know how to perform the same steps (add bearer tokens, switch between HTTP methods, etc.)

You will also need openSSL installed in order to create a development example of a certified HTTPS connection.

## If you haven't already, run <code>npm install</code> to download dependencies.

## 1. Create a folder named "data"

## 2. In the /bin folder, create a development SSL key

Navigate a terminal to the /bin folder, and enter the following:

<code>openssl req -nodes -new -x509 -keyout server.key -out server.cert</code>

If you like you can answer the prompts, but since this is just for development don't stress about it. You can even just enter all answers blank.

## 3. Start the database

From the parent folder of "data", run the following:

<code>mongod --dbpath=data</code>

Leave this terminal running. 

## 4. Create users

Now we need two users to try out our endpoints--one who is an admin and one who is not.

There are multiple ways to go about this. In this guide, I recommend creating users with Postman, then manually altering one to be an admin.


Make sure the databse is currently connected to the "data" folder.

In a separate terminal, from the root folder (where you see package.json), run:

 <code>npm start</code>

## 5. Open postman, and send a POST request to https://localhost:3443/users with the following JSON body:

```
{
    "email": "testemail1@example.com",
    "username": "notadmin",
    "password": "password",
    "firstName": "Joe",
    "lastName": "Schmoe"
}
```

Now we need to create a (soon to be) admin (noting that the email and username MUST both be different.) Send another POST request with the following:

```
{
    "email": "testemail2@example.com",
    "username": "admin",
    "password": "password",
    "firstName": "Linus",
    "lastName": "Torvalds"
}
```


Finally, since only admins can edit existing users using the API endpoints and we do not HAVE any admins yet, we have to manually alter one to be an admin.

In a separate terminal, run <code>mongo</code> to enter the Mongo CLI.

In the mongo CLI, enter <code>use formationdb</code> which is the name of this database.

Then enter the following line of code in the CLI to find the username "admin" and set it's "admin" property to true:

<code>db.users.findOneAndUpdate({ username: "admin"}, { $set: {admin: "true"}})</code>

The Mongo CLI can be closed after this.

The last thing to do is to log that user in. In Postman, submit a POST request to https://localhost:3443/users/login with the following JSON body:
```
"username": "admin",
"password": "password"
```

Copy the token that is returned. 

![user logged in](./demo-screens/token-after-log-in.jpg)

Then take that token and use it either automatically in Postman using the "Bearer Token" authorization, or by setting a header of "Authorization" with the value of "Bearer {your token goes here}"

Now any events created will automatically be assigned a "creator" with this user's _id automatically. Since it's an admin account, all API endpoints should work.

# <a name='roadmap'>Roadmap</a>

It seems a little much to call future plans for such a small project a roadmap. Nevertheless, there is still some functionality I would like to add to this project before moving on.

1. Add an "attendees" field to events, so that you could easily see who is attending what event. 
2. Add an "allowedEditor" field to events. This would allow the event creator (or an admin) to designate a third party as someone who is also allowed to make changes to the event. 
3. ~~Find a good place to host the database, and get a working example up and running so anyone looking at this project can just start trying out endpoints.~~ <span style="color: green">Done!</span>
4. Make a Postman collection so it's even easier to demonstrate.

# <a name="howwasitmade">How Was It Made</a>

## Database 

This project uses MongoDB for a database with Mongoose for object-relational mapping.

## Models

Models were created for events and users with fields set up for appropriate types. Conveniently for a database to track events, javascript Date objects can be used as a type.

## Authentication

The authenticate.js file is a module set up to hold any functionality related to logging in, or checking if a user is logged in. Frankly, I'm still wrapping my head around some of the concepts. The core of my authenticate file is coming straight from the [Passport docs](https://www.passportjs.org/docs/). Although the inner workings under the hood are still vague to me, the purpose of the functions produced here make sense.

`authenticate.getToken` is used when logging in to set up a token. This token is sent back to the user in JSON in our case, and it can be 

`authenticate.verifyUser` is from the docs. This function checks for a token in the request object, then if there is a correct token, updates the req.user object to match which ever user was logged in and created that token.

`authenticate.verifyAdmin` checks the req.user object (created by verifyUser) and whether or not they are an admin. If they are, it passes the request and response on to the next middleware. Otherwise, it sends back an error letting the user know they have to be an admin for this operation.

## Routes

A different Route was set up for events and users, and it's on these routes where all of the logic is written. The specific purpose of each is described above. Generally the server takes a request (commonly shortened to just "req"), a response to be sent back to the user ("res"), and a function called "next" used to pass on the request and response to the next middleware. Depending on the route, different things happen to the request and response, from adding a user object to request if verified as a user, or updating the response to give an appropriate error message.
