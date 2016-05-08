const Location = class LOCATION extends Channel {
	constructor(config = {}) {
		super(config);
		this.id = config.id;
		this.players = {};
	}
	enter(player) {
		const isPlayer = player instanceof Character;
		if(!isPlayer) {
			return !!console.warn('This is not a player.');
		}
		
		const isHereAlready = !!this.players[player.id];
		if(isHereAlready) {
			return !!console.warn('This player is already in this location.');
		}

		this.shout('chat', 'New player: ' + player.name);
		return this.players[player.id] = true;
	}
	leave(player) {
		const isPlayer = player instanceof Character;
		if(!isPlayer) {
			return !!console.warn('This is not a player.');
		}

		const isHere = !!this.players[player.id];
		if(!isHere) {
			return !!console.warn('This player is not in this location.');
		}
		this.players[player.id] = null;
		return true;
	}
	kick(player) { // no checking, just kick him out (called from inside Game object)
		this.players[player.id] = null;
		return true;
	}
};