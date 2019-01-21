"use strict";


const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const expect = chai.expect;

const {Player, Team} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

const seedPlayers = require('../db/players');


chai.use(chaiHttp);

// const { router: authRouter, localStrategy, jwtStrategy } = require('../auth');
// const passport = require('passport');
// passport.use(localStrategy);
// passport.use(jwtStrategy);
// const jwtAuth = passport.authenticate('jwt', { session: false });

//Seeding player data
function seedPlayerData() {
	console.info('seeding player data');
	return Player.insertMany(seedPlayers);
}

function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}

describe('Trips API resource', function() {
	this.timeout(15000);

	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
    	return seedPlayerData();
  	});

  	afterEach(function() {
    	return tearDownDb();
  	});

	after(function() {
		return closeServer();
	});

	//POST endpoint for players
	describe('POST enpoint', function() {
		it('should register a new player', function() {
			const playerData = {"firstname": "Tobin", "lastname": "Heath", "email": "tobs@gmail.com", "skillLevel": "advanced", "position": "field", "gender": "female"}
			return chai.request(app)
				.post('/players')
				.send(playerData)
				.then(function(res) {
					expect(res).to.have.status(201);
					expect(res).to.be.json;
          			expect(res.body).to.be.a('object');
          			expect(res.body.id).to.not.be.null;
          			expect(res.body.email).to.equal(playerData.email);
				});
		});
	});
});














