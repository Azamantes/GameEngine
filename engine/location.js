'use strict';

// --------------
// Dependencies
// --------------
const Channel = require('./channel.js');
const Character = require('./character.js');

const Location = class LOCATION extends Channel {
	constructor(config = {}) {
		super(config);
		this.id = config.id;
		this.players = config.players;
	}
	enter(player, events, listeners) {
		const isPlayer = player instanceof Character;
		if(!isPlayer) {
			return !!console.warn('This is not a player.');
		}
		
		const isHereAlready = !!this.players[player.id];
		if(isHereAlready) {
			return !!console.warn('This player is already in this location.');
		}

		events.map(event => this.listen(event, listeners[event]));
		this.shout('chat', 'New player: ' + player.name);
		player.location = this;
		return this.players[player.id] = true;
	}
	leave(player, events, listeners) {
		const isPlayer = player instanceof Character;
		if(!isPlayer) {
			return !!console.warn('This is not a player.');
		}

		const isHere = !!this.players[player.id];
		if(!isHere) {
			return !!console.warn('This player is not in this location.');
		}
		
		this.players[player.id] = null;
		events.map(event => this.delete(event, listeners[event]));
		return true;
	}
	kick(player, events, listeners) { // no checking, just kick him out (called from inside Game object)
		this.players[player.id] = null;
		events.map(event => this.delete(event, listeners[event]));
	}
};

module.exports = Location;