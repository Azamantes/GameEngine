'use strict';

// --------------
// Dependencies
// --------------
const Channel = require('./channel.js');
const Character = require('./character.js');
const Guild = require('./guild.js');
const Inventory = require('./inventory.js');
const Item = require('./items/item.js');
const Location = require('./location.js');
const Team = require('./team.js');


// ------------------
// CREATE GAME WORLD
// ------------------
const Init = require('./world_init.js');

class World {
	constructor(database) {
		this.database = database;

		this.locationsCount = 0;
		this.teamsCount = 0;
		this.guildsCount = 0;
		// this.itemsCount = 0;

		this.locations = {};
		this.players = {};
		this.teams = {};
		this.guilds = {};
		this.items = {};

		Init(this);
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
	createPlayer(config, callback) {
		const userID = parseInt(config.user);
		const characterID = parseInt(config.character);
		console.log('Proba zalogowania sie jako user#' + userID + ', character#' + characterID);
		
		if(this.players[characterID]){
			console.log('Player#' + config.id + ' already exists.'); // false
			return null;
		}	

		let player = null;
		config.id = characterID;
		config.location = this.locations[1];

		config.inventory = new Inventory();

		this.database.query('SELECT c.name FROM characters c, users_characters uc WHERE uc.user = ? AND c.id = uc.character AND c.id = ?;', [userID, characterID])
		.on('result', row => {
			config.name = row.name;
			this.database.query( // LOAD PLAYER'S INVENTORY
				`SELECT ii.nr, it.id, it.name, it.img
				FROM inventories_items ii, inventories inv, items it
				WHERE ii.inventory = inv.id AND inv.character = ? AND ii.item = it.id
				ORDER BY ii.nr ASC;`,
				[characterID]
			).on('result', row => {
				console.log('Pobrano item#' + row.id);
				config.inventory.put(parseInt(row.nr), new Item({
					id: row.id,
					name: row.name,
					img: row.img,
				}));
				// config.inventory.
				// items[row.id] = new Item({
				// 	id: row.id,
				// 	nr: row.r,
				// 	name: row.name,
				// 	img: row.img,
				// });
				// config.inventory.count += 1;
			}).on('end', () => {
				// config.inventory.container = items;

				callback(new Character(config));
			});
		});
	}
	getPlayer(id) {
		return this.players[id] || null;
	}
	destroyPlayer(player) {
		if(player.online) {
			return !!console.warn('Attempt of disconnecting a player without his knowledge.');
		}

		const team = player.team;
		if(team){
			if(team.type && team.creator === player) {
				team.changeType(false); //change team to Anarchy so that people can leave
				player.leaveTeam(team);
				team.creator = null; // remove pointer, so that it doesn't persist in memory
			}
		}

		player.manageListening({ type: 'stop', channel: player.location, array: player.locationListeners });
		player.location.kick(player);
		if(player.guild) {
			player.guild.shout('status', player.name + ' went home.');
		}
		
		this.players[player.id] = null;
		console.log('Player #' + player.id + ' left the game.');
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

	// ITEMS
	createItem(config) {
		// config.id = ++this.itemsCount; // 2 ^ 64 is a huge number, no need to worry about that.
		return this.items[config.id] = new Item(config);
	}
	puItemIntoInventory(player, item) {

		this.database.query('INSERT INTO ');
	}
	// ---------------------
	// DATABASE QUERIES
	// ---------------------

};
module.exports = World;