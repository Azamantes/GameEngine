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
		if(this.players[config.id]){
			console.error('Player#' + config.id + ' already exists.'); // false
			return null;
		}
		config.world = this;
		config.location = this.locations[config.location] || null;
		config.team = this.teams[config.team] || null;
		config.guild = this.guilds[config.guild] || null;

		return this.players[config.id] = new Character(config); // returns player
	}
	getPlayer(id) {
		return this.players[id] || null;
	}
	destroyPlayer(player) {
		if(this.player.online) {
			return !!console.warn('Attempt of disconnecting a player without his knowledge.');
		}

		const team = player.team;
		if(team.type && team.creator === player) {
			team.changeType(false); //change team to Anarchy so that people can leave
			player.leaveTeam(team);
			team.creator = null; // remove pointer, so that it doesn't persist in memory
		}

		const location = player.location;
		player.manageListening({ type: 'stop', channel: location, array: player.listeners.chat });
		location.kick(player);
		
		player.guild.shout('status', player.name + ' went home.');
		this.players[player] = null;
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
// World.prototype.Channel = require('./channel.js');
// World.prototype.Character = Character;
// World.prototype.Guild = require('./guild.js');
// World.prototype.Location = require('./location.js');
// World.prototype.Team = require('./team.js');
module.exports = World;