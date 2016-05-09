'use strict';

// --------------
// SERVER CONFIG
// --------------
const Server = require('ws').Server;
const websocket = new Server({
	port: 8080
});

// ------------------
// CREATE GAME WORLD
// ------------------
const Check = require('./engine/check.js');
const World = require('./engine/world.js');
const Game = new World();

Game.createLocation({ name: 'Wioska' });
Game.createLocation({ name: 'Miasto' });


// -------------------
// HANDLE CONNECTIONS
// -------------------
websocket.on('connection', (ws) => {
	var user = new User({ socket: ws });

	ws.on('message', user.handleMessage.bind(user));
	ws.on('close', function(a, b) {
		user.disconnect();
	});
});

const User = class USER {
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
		console.log('nowe polaczenie?', object);
		this.events.has(event) && this[event](data);
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

		data.config.connection = this;
		this.player = Game.createPlayer(data.config);
		if(this.player === null) { // refuse connection, player already exists.
			console.log('rozlaczam');
			return this.disconnect();
		}
		
		this.connected = true;
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
	showMyCharacter() {
		console.log(this.player);
	}
};
User.prototype.events = new Set([
	'connect',
	'disconnect',
	'showMyCharacter'
]);


// UTILITIES
const regexp = /['"]/g;
function clearJSON(string) {
	return string.replace(regexp, '');
}
function getNumber(string) {
	return ~~string.replace(regexp, '');
}