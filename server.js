"use strict";

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
// const passport = require('passport');
const cors = require('cors');
require('dotenv').config();

const bodyParser = require('body-parser');

// const { router: usersRouter } = require('./users');
// const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require("./config");
const { Player, Team } = require('./models');

const jsonParser = bodyParser.json();
const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('common'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// passport.use(localStrategy);
// passport.use(jwtStrategy);

// app.use('/users', usersRouter);
// app.use('/auth/', authRouter);

//include this as middleware for anything that for which you must be an authorized user
// const jwtAuth = passport.authenticate('jwt', { session: false });


//Post to register user as a player
app.post('/players', jsonParser, (req, res) => {
	// Check for required fields
	const requiredFields = ['firstname', 'lastname', 'email', 'skillLevel', 'position'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	// Create Player
	Player
		.create({
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			email: req.body.email,
			skillLevel: req.body.skillLevel,
			position: req.body.position,
			gender: req.body.gender
		})
		.then(player => res.status(201).json(player.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({ message: 'Internal server error' });
        })

});

//Get request for all players
app.get('/players', jsonParser, (req, res) => {
	Player
		.find()
		.then(players => {
			res.json({
				players: players.map(player => player.serialize())
			})
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({ message: 'Internal server error' });
        })
})


let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl, { useNewUrlParser: true },
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};

module.exports = { app, runServer, closeServer}