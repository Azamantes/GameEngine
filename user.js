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

		
		// gracze beda potrzebowali kanalu do komunikacji miedzy soba, nie wszystko bedzie na caly swiat szlo
		// prywatne wiadomosci, handel, duele etc. beda interakcja typu gracz-gracz 1v1
		// kazdy gracz musi byc kanalem sam w sobie
		// trzeba jeszcze czyscic te zbindowane funkcje gdy gracz zerwie polaczenie z serwerem 
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


		data.config.socketSend = this.unicast.bind(this);
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
		this.unicast({
			event: 'equipment',
			data: this.player.equipment.slots
		});
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
		const swapped = this.player.moveItems({
			from: data.from,
			to: data.to,
		});

		this.unicast({
			event: 'dragdrop',
			data: swapped? 'Success' : 'Failure',
		});
	}
	chatInput(message) {
		// tu trzeba obsluzyc jakos te wszystkie komendy z czatu
		// prywatne wiadomosci
		// globalne wiadomosci
		// gildyjne wiadomosci
		// grupowe wiadomosci
		// + komendy typu zapros gracza do grupy/gildii, wywal etc.
	}
	chat(data) {

		console.log('To jest chat:', data);

		const message = data.data;
		// console.log(`Chat: '${message}'`);

		if(!message) {
			return;
		}

		const isString = Check.this(message) === Check.string;
		if(!isString) {
			return;
		}

		switch(message[0]) {
			case '/': { // command

			}
			case '@': { // command
				const [name, string] = message.slice(2).split('` ');
				console.log(`Name: ${name}`);
				console.log(`String: ${string}`);
				Game.shout(`player: ${name}`, {
					event: 'chat',
					data: `from [${this.player.name}]: ${string}`,
				});
				this.unicast({
					event: 'chat',
					data: `to [${name}]: ${string}`,
				});
				break;
			}
			default: { // normal message
				console.log('normal message:', message);
				this.player.chatMessage(message);
			}
		}
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
	'chat',
]);

module.exports = { User, Init };

// if you want to add some functionality you have to do the following:
// - create method in the appropriate class
// - add method to User class to expand player's interface
// - add event to User.prototype.events, so that it's not ignored