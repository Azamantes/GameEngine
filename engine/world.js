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
		info: `SELECT charName, charLocation
				FROM myCharacters
				WHERE userID = ?
					AND charID = ?;`,
		items: `SELECT * FROM myItems WHERE charID = ?;`,
		swapItemsInv: `CALL swapItemsInv(?, ?, ?);`,
		moveItemInvEq: `UPDATE characters_items ci
						SET ci.type = (
								SELECT id FROM inventory_types WHERE name = 'equipment'
							),
							ci.slot = (
								SELECT id FROM equipment_slots WHERE name = ?
							)
						WHERE ci.character = ?
							AND ci.item = ?;`,
		moveItemEqInv: `UPDATE characters_items ci
						SET ci.type = (
								SELECT id FROM inventory_types WHERE name = 'inventory'
							),
							ci.slot = ?
						WHERE ci.character = ?
							AND ci.item = ?;`,
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

		this.update = Object.freeze({
			swapItemsInv: this.swapItemsInv.bind(this),
			moveItemInvEq: this.moveItemInvEq.bind(this),
			moveItemEqInv: this.moveItemEqInv.bind(this),
		});
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
		const userID = config.user = parseInt(config.user);
		const charID = config.id = parseInt(config.character);

		console.log('Login: user #' + userID + ' as [' + charID + '].');
		if(this.players[charID]){
			console.log('Player#' + charID + ' already exists.'); // false
			return null;
		}

		config.GameUpdates = this.update;
		this.getPlayerInfo(config, callback)
			.then(this.getPlayerItems.bind(this));
	}
	getPlayerInfo(char, callback) {
		return new Promise((PASS, FAIL) => {
			this.database.query(SQL.character.info, [char.user, char.id]) // char.id === char.character
			.on('result', row => {
				char.name = row.charName;
				char.location = this.locations[row.charLocation];
				PASS([char, callback]);
			})
			.on('end', FAIL);
		});
	}
	getPlayerItems(array) {
		const char = array[0];
		const callback = array[1];
		const slotsINV = {};
		const slotsEQ = {};
		let item;

		this.database.query(SQL.character.items, [char.id])
		.on('result', row => {
			console.log('nowy item slot:', row.inventorySlot, row.equipmentSlot, row.itemSlot);
			item = new Item({
				id: row.itemID,
				name: row.itemName,
				src: row.itemImage,
				slot: row.itemSlot,
				type: row.itemType,
				model: row.itemModel,
				flags: {
					consumable: row.isConsumable,
					destructible: row.isDestructible,
					durable: row.isDurable,
					equippable: row.isEquippable,
					reusable: row.isReusable,
					stackable: row.isStackable,
					upgradable: row.isUpgradable,
				},
				material: row.itemMaterial,
			});
			switch(row.containerType) { // possibly more options later
				case 'inventory': {
					console.log('Jest inventory');
					slotsINV[~~row.inventorySlot] = item;
					break;
				}
				case 'equipment': {
					console.log('Jest equipment');
					slotsEQ[row.equipmentSlot] = item;
					break;
				}
			}
		}).on('error', error => {
			console.log('Game.createPlayer [ERROR] ::', error.message);
		}).on('end', () => {
			char.inventory = new Inventory({ slots: slotsINV });
			char.equipment = new Equipment({ slots: slotsEQ });
			console.log(char.inventory);
			console.log(char.equipment);
			callback(this.players[char.id] = new Character(char));
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
	swapItemsInv(array) {
		if(array.length !== 3) {
			return console.warn('Game.swapItemsInv array.length !== 3.');
		}

		const allNumbers = array.every(x => typeof x === 'number');
		if(!allNumbers) {
			return console.warn('Game.swapItemsInv not all array elements are numbers.');
		}
		
		console.log('Array:', array);
		this.databaseQuery(SQL.character.swapItemsInv, array);
	}
	moveItemInvEq(array) {
		if(array.length !== 3) {
			return console.warn('Game.moveItemInvEq array.length !== 3.');
		}

		console.log('Array:', array);
		this.databaseQuery(SQL.character.moveItemInvEq, array);
	}
	moveItemEqInv(array) {
		if(array.length !== 3) {
			return console.warn('Game.moveItemEqInv array.length !== 3.');
		}

		const allNumbers = array.every(x => typeof x === 'number');
		if(!allNumbers) {
			return console.warn('Game.moveItemEqInv not all array elements are numbers.');
		}
		
		console.log('Array:', array);
		this.databaseQuery(SQL.character.moveItemEqInv, array);
	}
	databaseQuery(SQL, array) {
		this.database.query(SQL, array)
		.on('error', error => {
			console.warn('Game.moveItemInvInv: [ERROR] :: ' + error.message);
		});
	}
};
module.exports = World;