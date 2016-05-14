'use strict';


function Init(Game) {
	Game.createLocation({ name: 'Wioska' });
	Game.createLocation({ name: 'Miasto' });
	Game.connectDatabase();
}


module.exports = Init;