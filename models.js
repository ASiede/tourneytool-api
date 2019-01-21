"use strict"

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const playerSchema = mongoose.Schema({
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	skillLevel: {
		type: String,
		required: true,
	},
	position: {
		type: String,
		required: true,
	},
	gender: {
		type: String
	},
});

const teamSchema = mongoose.Schema({
	color: {
		type: String,
		required: true,
	},
	players: [playerSchema]
});

playerSchema.virtual('fullname') 
	.get(function() {
		return this.firstname + ' ' + this.lastname;
	});

playerSchema.methods.serialize = function() {
	return {
		id: this._id,
		name: this.fullname,
		email: this.email,
		skillLevel: this.skillLevel,
		position: this.position,
		gender: this.gender
	};
};

const Player = mongoose.model('Player', playerSchema);
const Team = mongoose.model('Team', teamSchema);

module.exports = { Player, Team }

