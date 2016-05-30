'use strict';

// --------------
// Dependencies
// --------------
const Channel = require('./channel.js');
const Inventory = require('./inventory.js');
const ThrowError = require('./team.js').Error;


class Character {
	constructor(config = {}) {
		this.connection = config.connection; // for handling socket connection

		this.id = config.id;
		this.name = config.name;
		this.alignment = 0;
		
		// this.inventory = new Inventory({
		// 	owner: this
		// });
		this.inventory = config.inventory;
		this.equipment = config.equipment;
		// this.inventory = new Inventory({
		// 	slots: config.inventory,
		// 	owner: this,
		// });

		// this.inventory = new Inventory(config.inventory);
		// console.log('jest nowe inventory', this.inventory);
		// this.equipment = new Equipment();
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
			status: this.listenTeamMemberStatus.bind(this),
		};
		this.locationListeners = ['chat', 'status'];
		this.teamListeners = ['team'];

		this.update = config.GameUpdates;

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
			return ThrowError('There is no team to join.');
		}
		const joined = player.team.join(this);
		if(!joined) return false;
		this.manageListening({ type: 'start', channel: this.team, array: this.teamListeners });
		return true;
	}
	leaveTeam() {
		if(this.team === null){
			return ThrowError('You are not in a team.');
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
			return ThrowError('You are not in a team.');
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
			return ThrowError('You are not in a team.');
		}
		this.team.kick(this, player);
		return true;
	}
	receiveInvitation(invitation) { // this is going to send invitation via websocket
		this.invitations.push(invitation);
		this.invite(invitation); // send via websocket
	}
	invite(invitation) { // this is going to be called on the client side and return acceptance or refusal
		const decision = !!window.confirm(invitation.message); //show prompt on the client side
		if(decision) invitation.accept(invitation.number);
		else invitation.refuse(invitation.number);
	}

	// ---------- 
	// LOCATION
	// ----------
	appearInLocation() {
		if(this.location === null) return;
		this.location.enter(this);
		this.location.listen('chat', this.listeners.chat);
		this.location.shout('chat', 'Welcome!');
		console.log('location listeners:', this.location.events);
	}
	enterLocation(id) {
		const location = this.world.getLocation(id);
		if(location === null) {
			return ThrowError('There is no such location.');
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
					return ThrowError('Given channel is not valid.');
				}
				
				while(++i < length) {
					box = array[i];
					channel.listen(box, this.listeners[box]);
				} break;
			}
			case 'swap': {
				const channel_1 = config.channel_1;
				const channel_2 = config.channel_2;
				const areChannels = channel_1 instanceof Channel && channel_2 instanceof Channel;
				if(!areChannels) {
					return ThrowError('Given channels are not valid.');
				}
				
				while(++i < length) {
					box = array[i];
					channel_1.delete(box, this.listeners[box]);
					channel_2.listen(box, this.listeners[box]);
				} break;
			}
			case 'stop': {
				const channel = config.channel;
				const isChannel = channel instanceof Channel;
				if(!isChannel) {
					return ThrowError('Given channel is not valid.');
				}
				
				while(++i < length) {
					box = array[i];
					channel.delete(box, this.listeners[box]);
				} break;
			}
		}
		return true;
	}

	// ----------
	// GUILD
	// ----------
	createTeam(config) {
		if(this.guild !== null) console.warn('Player#' + this.id + ' is in a team already.');
		config.creator = this;
		this.team = this.world.createTeam(config);
		this.manageListening({ type: 'start', channel: this.team, array: this.teamListeners });
	}
	inviteToGuild(player) {
		if(this.guild === null) {
			return ThrowError('You are no in a guild.');
		}
		this.guild.invite(this, player);
	}
	leaveGuild() {
		if(this.guild === null){
			return ThrowError('You are not in a guild.');
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
		this.connection.unicast({
			event: 'chat',
			message: this.location.name + value
		});
	}
	listenTeam(message) {
		this.connection.unicast({
			event: 'team:chat',
			message: this.team.name + message
		});
	}
	listenTeamMemberStatus(message) {
		this.connection.unicast({
			event: 'team:membersStatus',
			message: message
		});
	}

	// ----------
	// CONTAINER ITEM MANAGEMENT
	// ----------
	moveItems(config) {
		const check = { eq: 'equipment', inv: 'inventory' };
		let [typeFrom, slotFrom] = config.from.split('#');
		let [typeTo, slotTo] = config.to.split('#');

		// const arrayFrom = config.from.split('#');
		// const arrayTo = config.to.split('#');
		// const typeFrom = arrayFrom[0];
		// const slotFrom = ~~arrayFrom[1];
		// const typeTo = arrayTo[0];
		// const slotTo = arrayTo[1];

		
		if(!check[typeFrom] || !check[typeTo]) {
			config.failure();
		}

		console.log('[Player.swapItems]: OK, passed the check.');

		const permutation = typeFrom + ':' + typeTo;
		let moved = false;
		console.log(`Mamy sytuacje ${permutation}.`);
		switch(permutation) {
			case 'inv:inv': {
				moved = this.inventory.swap(~~slotFrom, ~~slotTo);
				if(moved) { // perform database query to update it.
					this.update.swapItemsInv([this.id, ~~slotFrom, ~~slotTo]);
				}
				break;
			}
			case 'inv:eq': {

				moved = this.moveItem({
					slotFrom, slotTo,
					typeFrom: check[typeFrom],
					typeTo: check[typeTo],
				});
				if(moved) {
					const itemID = this[check[typeTo]].get(slotTo).id;
					console.log('To jest slotTo:', slotTo);
					this.update.moveItemInvEq([slotTo, this.id, itemID]);
				}
				
				break;
			}
			case 'eq:inv': {
				moved = this.moveItem({
					slotFrom, slotTo,
					typeFrom: check[typeFrom],
					typeTo: check[typeTo],
				});
				if(moved) {
					const itemID = this[check[typeTo]].get(slotTo).id;
					console.log('To jest slotTo:', slotTo);
					this.update.moveItemEqInv([~~slotTo, this.id, itemID]);
				}

				break;
			}
			default: {
				console.log('Switch default.');
			}
		}
		
		// console.log(!!this[check[typeFrom]].slots[slotFrom], !!this[check[typeTo]].slots[slotFrom]);
		console.log('moved:', moved);
		return moved;
	}
	moveItem(config) {
		const containerFrom = this[config.typeFrom]; // inventory or requipment
		const containerTo = this[config.typeTo]; // inventory or requipment

		let hasItem = containerFrom.has(config.slotFrom);
		if(!hasItem) {
			console.log(config.typeFrom, 'nie ma itemu w slocie', config.slotFrom);
			return false;
		}

		let isAvailable = containerTo.isFree(config.slotTo);
		if(!isAvailable) {
			console.log(config.typeTo, ' ma zajety slot', config.slotTo);
			return false;
		}

		const item = containerFrom.take(config.slotFrom);
		const succeeded = containerTo.put(item, config.slotTo);
		if(!succeeded) {
			console.log('Nie udalo sie wstawic itemu do', config.typeTo);
			containerFrom.put(item, config.slotFrom);
			return false;
		}

		return true;
	}
};
module.exports = Character;