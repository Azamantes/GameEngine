const Game = new World();

// Locations
const l1 = Game.createLocation({ name: 'Wioska' });
const l2 = Game.createLocation({ name: 'Miasto' });

// Players
const p1 = Game.createPlayer({ id: 1, name: 'Zenek', location: 1, team: null, guild: 0 });
const p2 = Game.createPlayer({ id: 2, name: 'Edek', location: 1, team: null, guild: 0 });


p1.createTeam({ type: false });
p2.joinTeam(p1);
p1.changeTeamType(true);
p1.kickOutFromTeam(p2);

p1.enterLocation(2);
p2.enterLocation(2);