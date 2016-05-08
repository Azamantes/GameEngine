const World = class WORLD {
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
		config.location = this.locations[config.location];
		config.team = this.teams[config.team] || null;
		config.guild = this.guilds[config.guild] || null;

		return this.players[config.id] = new Character(config); // returns player
	}
	getPlayer(id) {
		return this.players[id] || null;
	}
	
	// TEAMS
	createTeam(config) {
		config.id = ++this.teamsCount; // 2 ^ 64 is a huge number, no need to worry about that.
		return this.teams[config.id] = new Team(config);
	}
	destroyTeam(team) {
		this.teams[team.id] = undefined;
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