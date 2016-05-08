// const Game = new World();

// Locations
// const l1 = Game.createLocation({ name: 'Wioska' });
// const l2 = Game.createLocation({ name: 'Miasto' });

// Players
// const p1 = Game.createPlayer({ id: 1, name: 'Zenek', location: 1, team: null, guild: 0 });
// const p2 = Game.createPlayer({ id: 2, name: 'Edek', location: 1, team: null, guild: 0 });

// console.time('start');
// var i = 1e1;
// while(--i + 1) {
// 	Game.createPlayer({ id: i, name: 'Player#' + i, location: 1, team: null, guild: 0 });
// }
// console.timeEnd('start');

// p1.createTeam({ type: false });
// p2.joinTeam(p1);
// p1.changeTeamType(true);
// p1.kickOutFromTeam(p2);

// p1.enterLocation(2);
// p2.enterLocation(2);

// -----------------
// ALIASES
// -----------------
const doc = document;
doc.get = doc.getElementById;

class User {
	constructor() {

	}
	addMessage(value) {
		const element = doc.createElement('div');
		element.textContent = value;
		this.messageCenter.appendChild(element);
	}
};
User.prototype.messageCenter = doc.get('messages');
const user = new User();




const websocket = new WebSocket('ws://127.0.0.1:8080');
WebSocket.prototype.sendJSON = function(data){
	websocket.send(JSON.stringify(data));
};

doc.get('connect').addEventListener('click', function() {
	const id = doc.get('playerID').value;
	const name = doc.get('playerName').value;
	const location = doc.get('playerLocation').value;
	if(!id) return addMessage('ID is invalid.');
	if(!name) return addMessage('Name is invalid.');
	if(!location) return addMessage('Location is invalid.');

	websocket.sendJSON({
		event: 'connect',
		config: {
			id,
			name,
			location,
			guild: null,
			team: null
		}
	});
});
websocket.onmessage = function(object){
	const data = JSON.parse(object.data);
	user.addMessage(data.message);
	// User[data.event](data);
};
window.addEventListener('beforeunload', function(){
	websocket.sendJSON({ event: 'disconnect' });
	websocket.close();
});

