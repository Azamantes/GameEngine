Swiat:
	locations { Number id: Location location }
		create
		get
	players { Number id: Character player }
		create
		destroy
	playerTeams { Number id: Team playerTeam }
		create
		destroy
	guilds { Number id: Guild guild }




// ---------------------------------
Location(Object config)
	id : Number
	nazwa : String
	players : Character Array
	// lista itemow do zebrania
	// lista statuł
	locations : Location Array
Functions:
	add player(callback) : Boolean
	remove player(callback) : Boolean
	// notifyPlayers : 
	// powiadom wszystkich graczy o jakims zdarzeniu
	// zaktualizuj item collectible, jesli zostal zebrany
// ---------------------------------
Channel(Object config) // created by modules independently, not stored in the World object
	events : Object
Functions:
	listen(String event, Function listener) : Boolean
		allows the [listener] to listen for the [event]
	forget(String event, Function listener) : Boolean
		remove the [listener] from [event] list
	shout(String event, Object message) : Boolean
		passes given message to everyone listening to [event]

// ---------------------------------
Team(Object config)
	id : Number
	type : Boolean
	creator: Number
	members : Array of Character
Functions:
	add member(Character player) : Boolean
		adds [player] to list of members
	remove member(Character player) : Boolean
		remove [player] from list of members
	pass leadership(Character player) : Boolean
		changes this.creator to [player]
	change type(Number type) : Boolean
		changes this.type to [type]

// ---------------------------------
Character(Object config)
	id : Number;
	name : String;
	alignment : Number;
	
	inventory : Inventory
	equipment : Equipment
	skillbook : Skillbook
	talentTree : TalentTree

	lvl : Number
	experience : Number;
	age : Number
	religion : Number
	race : Number
	class : Number
	
	hp : Number
	hp_max : Number
	mana : Number
	mana_max : Number
	power : Number
	power_min : Number
	power_accumulated : Number
	defence : Number
	defence_min : Number
	money : Number

	// stats
	strength : Number
	agility : Number
	constitution : Number
	wisdom : Number
	intelligence : Number
	charisma : Number
	proficiencies: Object
		weapons : Object
		elements : Object
		skills : Object
		professions : Object

	// state
	mindstate : Number // bit flags
	sanity : Number //bit flags
	state : Number // bit flags (stunned, frozen, slown, hastened etc.)
	soberness : Number
	fatigue : Number
	focus : Number // 1%-100% of powerbar

	// social stuff
	socialstate : Number //bit flags
	reputation : Number
	honor : Number
	team : Number // team ID
	kills : Number // how many
	teacher : Number // increase along with teaching other players skills. 
	
	guild : Guild // guild given by the world;
	team : Team // team given by the World
	location : Location // location given by the World.
Function:
	check : Boolean
		checks if all properties are set properly
	start living() : Boolean
		check === true -> set up listeners
	// ---------
	// TEAM
	// ---------
	create team : Boolean
		attemps to create team
	join team(Character player) : Boolean
		attempts to join team of [player]
	leave team : Boolean
		attempts to leave team
		this === this.team.creator -> has to pass leadership to someone (regardless of team type)
	changeTeamType(Boolean type) : Boolean
		attempts to change team type
	passTeamLeadership(Character player) : Boolean
		attempts to make someone else leader of the team
	inviteToTeam(Character player) : Boolean
		sends invitation to the [player]
	receiveInvitation(Object invitation) : Boolean(always true) // this is a generic function, works with any invitation, as long as it has the 2 properties (message, number) and 2 callbacks (accept, refuse)
		caches invitation and sends it via websocket to the client, so that he can see it
	invite(Object invitation) : Boolean (always true) // this is actually on the client side, not in the engine on the server



	// ---------
	// LOCATION
	// ---------
	enter location(Number locationID) : Boolean	
		attempts to enter location with given [locationID]
		stops listening to current location (leave)
	

Listeners:
	locationChat(String value) : Boolean
		console.log(value);




	// ---------------------------------
Gildia
	id : Number id
	nazwa : String name
	creator : Number id
	lista czlonkow : Number Array [id, id, id, ...]
Funkcje:
	dodaj czlonka : Boolean
	usun czlonka : Boolean
	zmien wlasciciela : Boolean