const World = class WORLD {
	constructor() {
		this.locationsCount = 0;
		this.playerCount = 0;

		this.locations = {};
		this.players = {};
		this.playerTeams = {};

		this.channels = {};
		// this.playerTeamsCount = 0; // what for..?
	}
	// LOCATIONS
	createLocation(config = {}) {
		const isConfig = Check.this(config) === Check.object;
		if(!isConfig) {
			console.error('Invalid location config given.');
			return null;
		}
		const exists_already = !!this.locations[config.name];
		if(exists_already) {
			console.error('Such location already exists.');
			return null;
		}
		config.id = ++this.locationCount;
		const location = new Location(config);
		
		// insert { key: location.name, value: index }
		this.locations[location.id] = location;
		return location;
	}
	getLocation(id = -1) {
		const index = this.locationIndexes[id];
		return Check.this(index) === Check.number ? this.locations[index] : null;
	}
	//PLAYERS
	createPlayer(config = {}) {
		const isConfig = Check.this(config) === Check.object;
		if(!isConfig) {
			console.error('Invalid character given.');
			return null;
		}

		const exists_already = !!this.playerIndexes[config.name];
		if(exists_already) {
			console.error('Such player already exists.');
			return null;
		}

		const isLocation = Check.this(config.location) === Check.number && ~~config.location > 0;
		if(isLocation) {
			let index = this.locationIndexes[config.location]; // config.location ma byc liczba
			config.location = this.locations[index];
		} else console.log(config.location);

		config.id = ++this.playerCount;
		const player = new Character(config);

		// insert { key: location.name, value: index }
		this.playerIndexes[player.id] = this.players.push(player) - 1;
		return player;
	}
	getPlayer(id = -1) {
		const index = this.playerIndexes[id];
		return Check.this(index) === Check.number? this.players[index] : null;
	}
	// TEAMS
	createTeam(config = {}) {
		const team = new Team(config);
		this.playerTeams.push(team);
		return team;
	}
	destroyTeam(team) {
		const isTeam = team instanceof Team;
		if(!isTeam){
			return false;
		}

		return true;
	}
	addPlayerTeam(players = []) {
		const isArray = Array.isArray(players);
		if(!isArray){
			console.error('Invalid playerlist given.');
			return null;
		}
		try {
			const isTeam = this.isValidPlayerTeam(players);
			if(!isTeam){
				console.error('Invalid team given.');
				return null;
			}
		} catch(error){
			console.log(error);
			return null;
		}
		this.notifyTeamPlayers(players);
		const team = new Team(players);
		this.playerTeams.push(team);
		return team;
	}
	isValidPlayerTeam(players = []) {
		const length = players.length;
		let i = -1;		
		let result = true;
		while(++i < length){
			if(players[i].constructor === Character){
				continue;
			} else return false;
		}
		return result;
	}
	notifyTeamPlayers(players = []) {
		const length = players.length;
		let player, i = -1;
		while(++i < length){
			player = players[i];
			if(player.team === null){
				player.team = null;
			} else console.log(player.name + ' jest juz w jakims teamie i nie moze dolaczyc do nowego.');
		}
		return true;
	}
	// CHANNELS
	addChannel(name = null) {
		const isString = Check.this(name) === Check.string;
		if(!isString) {
			return null;
		}
		
		const exists_already = !!this.channelIndexes[name];
		if(exists_already) {
			console.error('Such channel already exists.');
			return null;
		}
		
		const channel = new Channel(name);

		// insert { key: location.name, value: index }
		this.channelIndexes[name] = this.channels.push(channel) - 1;
		return channel;
	}
	getChannel(name) {
		const index = this.channels[name];
		return Check.this(index) === Check.string? this.channels[name] : null;
	}
	// GUILDS
	addGuild() {

	}
};