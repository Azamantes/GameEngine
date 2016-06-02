const doc = document;
doc.get = doc.getElementById;

doc.get('logout').addEventListener('click', function(event) {
	event.preventDefault();
	window.location.href = 'logout.php';
});



const player = new Player('Player#1', {
	inventory: doc.get('table-inventory'),
	equipment: doc.get('table-equipment'),
	chat: doc.get('chat'),
	chatInput: doc.get('chat_input'),
	stats: doc.get('character_stats'),
});

player.shout('stats: init', [
	['HP', 100, 100],
	['Mana', 100, 100],
]);

// class Klasa {
// 	constructor() {

// 	}
// 	get abc() {
// 		return this.x;
// 	}
// 	set abc(value) {
// 		this.x = value;
// 	}
// }
// const x = new Klasa;

