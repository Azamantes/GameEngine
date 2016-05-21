'use strict';

// --------------
// Dependencies
// --------------
const Channel = require('./channel.js');
const Character = require('./character.js');
// const Guild = require('./guild.js');
const Equipment = require('./equipment.js');
const Inventory = require('./inventory.js');
const Item = require('./items/item.js');
const Location = require('./location.js');
// const Team = require('./team.js');

// ----------
// DATABASE QUERIES
// ----------
const SQL = {
	character: {
		info: 'SELECT charName, charLocation FROM myCharacters WHERE userID = ? AND charID = ?;',
		items: 'SELECT itemID, itemName, slotType, itemSlot, itemSlotString, itemImage FROM myItems WHERE charID = ?;',
	},
	location: {
		players: 'SELECT `character` AS charID FROM locations_characters WHERE location = ?;',
		list: 'SELECT id, name FROM locations ORDER BY id ASC;',
	},
	item: {
		put: '',
		move: '',
		delete: '',
	},
};

class World {
	constructor(database) {
		this.database = database;

		this.locations = {};
		this.players = {};
		this.teams = {};
		this.guilds = {};
		this.items = {};

		this.createLocations();
	}

	// ----------
	// LOCATIONS
	// ----------
	createLocation(locationID, locationName) {
		const players = {};
		this.database.query(SQL.location.players, [locationID])
		.on('result', (row) => {
			// players[parseInt(row.charID)] = true;
		}).on('end', () => {
			this.locations[~~locationID] = new Location({
				players: players,
				id: locationID,
				name: locationName,
			});
		});
	}
	getLocation(id) {
		return this.locations[id] || null;
	}
	createLocations() {
		this.database.query(SQL.location.list)
		.on('result', (row) => {
			this.createLocation(row.id, row.name);
		});
	}

	// ----------
	// PLAYERS
	// ----------
	createPlayer(config, callback) {
		const userID = parseInt(config.user);
		const characterID = parseInt(config.character);
		console.log('User#' + userID + ' logged in as  character#' + characterID + '.');
		
		if(this.players[characterID]){
			console.log('Player#' + config.id + ' already exists.'); // false
			return null;
		}	

		config.id = characterID;
		config.location = this.locations[1];

		const inventorySlots = {};
		const equipmentSlots = {};

		this.database.query(SQL.character.info, [userID, characterID])
		.on('result', row => {
			console.log(`GAME WORLD: wybrano nowy nick ${row.charName}`);
			config.name = row.charName;
			config.location = this.locations[row.charLocation];
			console.log('To jest name:', row.charName);
			console.log('To jest charID:', characterID);
			this.database.query(SQL.character.items, [characterID])
			.on('result', row => {
				console.log('Jest nowy item postaci#' + characterID);
				row.itemID = ~~row.itemID;
				row.slotType = ~~row.slotType;
				row.itemSlot = ~~row.itemSlot;
				if(row.slotType === 1) { // inventory
					console.log('slotType === 1', row.itemID);
					inventorySlots[row.itemSlot] = new Item({
						id: row.itemID,
						name: row.itemName,
						src: row.itemImage,
					});
				} else if(row.slotType === 2) { // equipment
					console.log('slotType === 2', row.itemID);
					equipmentSlots[row.itemSlotString] = new Item({
						id: row.itemID,
						name: row.itemName,
						src: row.itemImage,
					});
				}
			}).on('errur', error => {
				console.log('Game.createPlayer [ERROR] ::', error.message);
			}).on('end', () => {
				const character = new Character(config);
				character.inventory = new Inventory({ slots: inventorySlots });
				character.equipment = new Equipment({ slots: equipmentSlots });
				this.players[character.id] = character;
				callback(character);
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
	switchPlayerContainerSlots(player, config, callback) {
		// potrzebna procedura
		if(config.from.container === 'inv' && config.to.container === 'inv') { // player tries to switch items inside inventory alone
			// po prostu zamien slot1 z slot2
			player.inventory.switch(config.from.slot, config.to.slot);
		} else if(config.from.container === 'inv' && config.to.container === 'eq') { // look first if condition...
			// need to update stats
			const item = player.inventory.take(config.from.slot); // remove item from inventory
			player.equipment.put(config.to.slot, item); // put this item into equipment slot
		} else if(config.from.container === 'eq' && config.to.container === 'eq') { // look first if condition...
			player.inventory.switch(config.to.item, config.to.item);
		} else if(config.from.container === 'eq' && config.to.container === 'inv') { // look first if condition...
			// need to update stats
		}
	}
};
module.exports = World;