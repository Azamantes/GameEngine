const Character = class CHARACTER {
	constructor(config = {}) {
		this.world = config.world;

		this.id = config.id;
		this.name = config.name;
		this.alignment = 0;
		
		this.inventory = null; // new Inventory()
		this.equipment = null; // new Equipment()
		this.skillbook = null; // new Skillbook()
		this.talentTree = null; // new TalentTree()

		this.lvl = 1;
		this.experience = 0;
		this.age = 1;
		this.religion = 0;
		this.race = 0;
		this.class = 0;
		
		this.hp = 10;
		this.hp_max = 100;
		this.mana = 10;
		this.mana_max = 100;
		this.power = 1;
		this.power_min = 1;
		this.power_accumulated = 0;
		this.defence = 1;
		this.defence_min = 1;
		this.money = 0;

		// stats
		this.strength = 1;
		this.agility = 1;
		this.constitution = 1;
		this.wisdom = 1;
		this.intelligence = 1;
		this.charisma = 1;
		this.proficiencies = {
			weapons: {},
			elements: {},
			skills: {},
			professions: {},
		};

		// state
		this.mindstate = 0; // bit flags
		this.sanity = 0; //bit flags
		this.state = 0; // bit flags (stunned, frozen, slown, hastened etc.)
		this.soberness = 0;
		this.fatigue = 0;
		this.focus = 100; // 1%-100% of powerbar

		// social stuff
		this.socialstate = 0; //bit flags
		this.reputation = 0;
		this.honor = 0;
		this.team = NaN; // team ID
		this.kills = 0; // how many
		this.teacher = 0; // increase along with teaching other players skills.
		this.invitations = []; // stores random number from the invitation, because it's gonna be asynchronous.
		
		this.guild = config.guild; // guild given by the world;
		this.team = config.team; // team given by the World
		this.location = config.location; // location given by the World.

		// Cache
		this.listeners = {
			chat: this.listenChat.bind(this),
			team: this.listenTeam.bind(this),
			status: this.listenTeamStatus.bind(this),
		};
		this.locationListeners = ['chat', 'status'];
		this.teamListeners = ['team'];

		// start living :)
		this.appearInLocation();
	}
	cacheListener(event, callback) {
		this.cachedListeners[event].push(callback);
	}
	// ---------- 
	// TEAM
	// ----------
	createTeam(config) {
		if(this.team !== null) console.warn('Player#' + this.id + ' is in a team already.');
		config.creator = this;
		this.team = this.world.createTeam(config);
		this.manageListening({ type: 'start', channel: this.team, array: this.teamListeners });
	}
	joinTeam(player) {
		if(player.team === null){
			return !!console.warn('There is no team to join.');
		}
		const joined = player.team.join(this);
		if(!joined) return false;
		this.manageListening({ type: 'start', channel: this.team, array: this.teamListeners });
		return true;
	}
	leaveTeam() {
		if(this.team === null){
			return !!console.warn('You are not in a team.');
		}
		const team = this.team;
		const left = team.leave(this);
		if(!left) return false;
		this.manageListening({ type: 'stop', channel: team, array: this.teamListeners });
		if(!team.members.length) {
			this.world.destroyTeam(team);
		}
		return true;
	}
	changeTeamType(type) {
		if(this.team === null) {
			return !!console.warn('You are not in a team.');
		}
		return this.team.changeType(this, type);
	}
	passTeamLeadership(player) {
		return this.team.passLeadership(this, player);
	}
	inviteToTeam(player) {
		this.team.invite(this, player);
	}
	kickOutFromTeam(player) {
		if(this.team === null){
			return !!console.warn('You are not in a team.');
		}
		return this.team.kick(this, player);
	}
	receiveInvitation(invitation) { // this is going to send invitation via websocket
		this.invitations.push(invitation);
		this.invite(invitation); // send via websocket
		return true;
	}
	invite(invitation) { // this is going to be called on the client side and return acceptance or refusal
		const decision = !!window.confirm(invitation.message); //show prompt on the client side
		if(decision) invitation.accept(invitation.number);
		else invitation.refuse(invitation.number);
		return true;
	}
	// ---------- 
	// LOCATION
	// ----------
	appearInLocation() {
		this.location.enter(this);
		this.location.listen('chat', this.listeners.chat);
	}
	enterLocation(id) {
		const location = this.world.getLocation(id);
		if(location === null) {
			return !!console.warn('There is no such location.');
		}
		
		const allowed = location.enter(this);
		if(!allowed) return false;
		this.manageListening({ type: 'swap', channel_1: this.location, channel_2: location, array: this.locationListeners });
		this.location = location;
		return true;
	}
	manageListening(config) {
		const array = config.array;
		let box, length = array.length, i = -1;

		switch(config.type) {
			case 'start': {
				const channel = config.channel;
				const isChannel = channel instanceof Channel;
				if(!isChannel) {
					return !!console.warn('Given channel is not valid.');
				}
				
				while(++i < length) {
					box = array[i];
					channel.listen(box, this.listeners[box]);
				}
				break;
			}
			case 'swap': {
				const channel_1 = config.channel_1;
				const channel_2 = config.channel_2;
				const areChannels = channel_1 instanceof Channel && channel_2 instanceof Channel;
				if(!areChannels) {
					return !!console.warn('Given channels are not valid.');
				}
				while(++i < length) {
					box = array[i];
					channel_1.delete(box, this.listeners[box]);
					channel_2.listen(box, this.listeners[box]);
				}
				break;
			}
			case 'stop': {
				const channel = config.channel;
				const isChannel = channel instanceof Channel;
				if(!isChannel) {
					return !!console.warn('Given channel is not valid.');
				}
				
				while(++i < length) {
					box = array[i];
					channel.delete(box, this.listeners[box]);
				}
				break;
			}
		}
		return true;
	}
	// ----------
	// GUILD
	// ----------
	inviteToGuild(player) {
		if(this.guild === null) {
			return !!console.warn('You are no in a guild.');
		}
		this.guild.invite(this, player);
	}
	leaveGuild() {
		if(this.guild === null){
			return !!console.warn('You are not in a guild.');
		}
		const guild = this.team;
		const left = guild.leave(this);
		if(!left) return false;
		this.manageListening({ type: 'stop', channel: guild, array: this.guildListeners });
		return true;
	}

	// ---------- 
	// LISTENERS
	// ----------
	listenChat(value) {
		console.log(this.location.name + value);
	}
	listenTeam(message) {
		console.log(this.team.name + message);
	}
	listenTeamStatus(message) {
		console.log(message);
	}
};