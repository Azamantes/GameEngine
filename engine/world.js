'use strict';

// --------------
// Dependencies
// --------------
const Channel = require('./channel.js');
const Character = require('./character.js');
const Guild = require('./guild.js');
const Location = require('./location.js');
const Team = require('./team.js');

class World {
	constructor() {
		this.locationsCount = 0;
		this.teamsCount = 0;
		this.guildsCount = 0;

		this.locations = {};
		this.players = {};
		this.teams = {};
		this.guilds = {};
	}
	
	// LOCATIONS
	createLocation(config) {
		config.id = ++this.locationsCount;
		return this.locations[config.id] = new Location(config);
	}
	getLocation(id) {
		return this.locations[id] || null;
	}
	
	//PLAYERS
	createPlayer(config) {
		config.id = ~~config.id;
		if(this.players[config.id]){
			console.error('Player#' + config.id + ' already exists.'); // false
			return null;
		}		

		config.location = ~~config.location;
		config.location = this.locations[config.location] || null;
		config.team = this.teams[config.team] || null;
		config.guild = this.guilds[config.guild] || null;
		return this.players[player.id] = new Character(config); // returns player
	}
	getPlayer(id) {
		return this.players[id] || null;
	}
	destroyPlayer(player) {
		if(this.player.online) {
			return !!console.warn('Attempt of disconnecting a player without his knowledge.');
		}

		const team = player.team;
		if(team !== null){
			if(team.type && team.creator === player) {
				team.changeType(false); //change team to Anarchy so that people can leave
				player.leaveTeam(team);
				team.creator = null; // remove pointer, so that it doesn't persist in memory
			}
		}

		player.manageListening({ type: 'stop', channel: player.location, array: player.locationListeners });
		player.location.kick(player);
		if(player.guild !== null) {
			player.guild.shout('status', player.name + ' went home.');	
		}
		
		this.players[player.id] = null;
		console.log('Player #' + this.player.id + ' left the game.');
		return true;
	}
	
	// TEAMS
	createTeam(config) {
		config.id = ++this.teamsCount; // 2 ^ 64 is a huge number, no need to worry about that.
		return this.teams[config.id] = new Team(config);
	}
	destroyTeam(team) {
		this.teams[team.id] = undefined;
		return true;
	}
	
	// GUILDS
	createGuild(config) { // this needs to be fed with data from the database during server boot
		config.id = ++this.guildsCount;
		return this.guilds[config.id] = new Guild(config);
	}
	getGuild(id) {
		return this.guilds[id] || null;
	}
};
module.exports = World;