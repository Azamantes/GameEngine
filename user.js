'use strict';

// --------------
// Utilities
// --------------
const regexp = /['"]/g;
function clearJSON(string) {
	return string.replace(regexp, '');
}
function getNumber(string) {
	return ~~string.replace(regexp, '');
}

// --------------
// Dependencies
// --------------
const Check = require('./engine/check.js');


var Game = null;

function Init(object) {
	Game = object;
}

class User {
	constructor(config) {
		this.connected = false;
		this.socket = config.socket;
		this.player = null;
	}
	handleMessage(data) { // when 'production-ready' this has to be in try-catch
		// try {
			this.execute(data);
		// } catch(error) {
			// console.warn(error.message);
		// }
	}
	execute(object) {
		const data = JSON.parse(object);
		const event = data.event;
		if(!this.events.has(event)) { // not listed in the User.prototype.events
			console.warn(event, 'not listed in the User.prototype.events.');
			return false;
		}
		if(this[event]) {
			this[event](data);
			return true;
		}
		if(this.player[event]) {
			this.player[event](data);
			return true;
		}
		return false;
	}
	unicast(data) { // void
		if(!Check.this(data) === Check.object){
			console.log('user.unicast -> data is not an object.');
		}
		this.socket.send(JSON.stringify(data));
	}

	// -------------------------------------
	// WEBSOCKET LISTENERS (allowed events)
	// -------------------------------------
	connect(data) {
		if(this.connected) return;
		if(Check.this(data) !== Check.object){
			console.log('user.connect -> data is not an object.');
		}

		// very basic and primitive character init


		data.config.connection = this;
		Game.createPlayer(data.config, this.setPlayer.bind(this));
	}
	disconnect() {
		if(this.player) {
			this.player.online = false;
			Game.destroyPlayer(this.player);
			this.player = null;
		}
		console.log('disconnecting...');
		this.socket.terminate();
		// try { this.socket.terminate(); } catch(error) {}
	}

	// ----------------
	// USER INTERFACE
	// ----------------
	setPlayer(myCharacter) {
		if(myCharacter === null) {
			console.log('Nie udalo sie stworzyc postaci. (null)');
			this.disconnect();
		}
		this.player = myCharacter;
		if(this.player === null) { // refuse connection, player already exists.
			return this.disconnect();
		}
		
		this.connected = true;
		this.sendInitCharacterInformation();
	}
	sendInitCharacterInformation() {
		// console.log('wysle equipment:', thisequipment);
		this.unicast({
			event: 'equipment',
			data: this.player.equipment.slots
		});
		// console.log('wysle inventory:', inventory);
		this.unicast({
			event: 'inventory',
			data: this.player.inventory.slots
		});
		
	}
	showMyCharacter() {
		console.log(this.player);
	}
	getInventory() {
		if(this.player === null) {
			return;
		}
		console.log('ok');
		this.unicast({
			event: 'inventory',
			data: this.player.inventory,
		});
	}
	showInventory() {
		if(this.player === null) {
			console.log('sorry');
			return;
		}
		this.player.inventory.show();
	}
	createItem(config = {}) {
		const created = this.player.inventory.put(Game.createItem({}));
		if(!created) {
			console.warn('[' + this.player.id + ']: Could not create item.');
		}
	}
	containerDragDrop(data) {
		// console.log(data);
		
		// jakie sa mozliwosci:
		// - inv :: inv
		// - inv :: eq
		// - eq :: eq
		// - eq :: inv

		const swapped = this.player.moveItems({
			from: data.from,
			to: data.to,
		});

		this.unicast({
			event: 'dragdrop',
			data: swapped? 'Success' : 'Failure',
		});

		// const config = {
		// 	player: this.player,
		// 	from: data.from,
		// 	to: data.to,
		// 	success: (function() { // success
		// 		this.unicast({
		// 			event: 'dradrop',
		// 			message: 'success',
		// 		});
		// 	}).bind(this),
		// 	failure: (function() { // failure
		// 		this.unicast({
		// 			event: 'dradrop',
		// 			message: 'Failure',
		// 		});
		// 	}).bind(this)
		// };

		// wykonuja ta funkcje, tam robie database query i jak sie uda to wykonuje sukces, jak nie to failure
		// Game.playerDragDrop(config);

		// const switched = this.inventory.switch(slotFrom, slotTo);
		// if(!switched) {

		// }
		// this.unicast({
		// 	event: ''
		// });
	}
};
User.prototype.events = new Set([
	// to allow only certain actions. You may want to keep some methods unaccesible from outside
	'connect',
	'disconnect',
	'showMyCharacter',
	'createItem',
	'getInventory',
	'showInventory',
	'inventoryMoveItem',
	'containerDragDrop',
]);
User.prototype.Game = null;
module.exports = { User, Init };

// if you want to add some functionality you have to do the following:
// - create method in the appropriate class
// - add method to User class to expand player's interface
// - add event to User.prototype.events, so that it's not ignored