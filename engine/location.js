const Location = class LOCATION extends Channel {
	constructor(config = {}) {
		super(config);
		this.playersCache = {};
		this.players = [];
	}
	enter(player) {
		const isPlayer = player instanceof Character;
		if(!isPlayer) {
			return !!console.warn('This is not a player.');
		}
		
		const isHereAlready = !!this.playersCache[player.id];
		if(isHereAlready) {
			return !!console.warn('This player is already in this location.');
		}

		this.players.push(player);
		this.shout('chat', 'New player: ' + player.name);
		return this.playersCache[player.id] = true;
	}
	leave(player) {
		
	}
};