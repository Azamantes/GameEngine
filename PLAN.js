GameInstance:
	locationsCount : Number
	teamsCount : Number
	guildsCount : Number

	// Objects { key: id, value: reference }
	locations : Object
	players : Object
	teams : Object
	guilds : Object

Functions:
	createLocation(Object config) : Location
	
	getLocation(Number id) : Location
	
	createPlayer(Object config) : Character
	
	getPlayer(Number id) : Character
	
	destroyPlayer(Character player) : Boolean
	
	createTeam(Object config) : Team
	
	destroyTeam(Team team) : Boolean
	
	createGuild(Object config) : Guild
	
	getGuild(Number id) : Guild

// ---------------------------------
Channel(Object config) // created by modules independently, not stored in the World object
	name : String
	events : Object

Functions:
	listen(String event, Function listener) : Boolean
		allows the [listener] to listen for the [event]
	
	shout(String event, Object message) : Boolean
		passes given message to everyone listening to [event]
	
	delete(String event, Function listener) : Boolean
		remove the [listener] from [event] list

// ---------------------------------
Location(Object config) extends Channel(Object config)
	id : Number
	nazwa : String
	players : Object
	// lista itemow do zebrania
	// lista statuł
	locations : Location[]

Functions:
	enter(Character player) : Boolean
	leave(Character player) : Boolean
	kick(Character player) : Boolean (always true)
	// notifyPlayers : 
	// powiadom wszystkich graczy o jakims zdarzeniu
	// zaktualizuj item collectible, jesli zostal zebrany

// ---------------------------------
Team(Object config) extends Channel
	id : Number
	type : Boolean (false - Anarchy, true - Leadership)
	creator : Character
	members : Character[]
	invitationCount : Number
	invitations : Object

Functions:
	invite(Character player_1, Character player_2) : Boolean
		attempts to send team invitation to the [player_2]
	
	sendInvitation(Character player) : Boolean (always true)
		sends invitation to the [player]
	
	acceptInvitation(Number number) : Boolean (always true)
		callback to call upon invitation acceptance
	
	refuseInvitation(Number number) : Boolean (always true)
		callback to call upon invitation refusal
	
	join(Character player) : Boolean
		attempts to let the [player] join
	
	leave(Character player) : Boolean
		attempts to let the [player] leave
	
	kick(Character player_1, Character player_2) : Boolean
		attempts to kick [player_2] out of the team
	
	addMember(Character player, Function[] listeners) : Boolean (always true)
		adds [player] to the memberlist and cached his [listeners]

	removeMember(Character player) : Boolean (always true)
		removes [player] from memberlist and stops listening to his callbacks

	passLeadership(Character player_1, Character player_2) : Boolean
		attempts to pass leadership from [player_1] to [player_2]
		informs whole team upon the change

	changeType(Character player, Boolean type) : Boolean
		attempts to change team type
	

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
Guild(Object config)
	id : Number id
	nazwa : String name
	creator : Number id
	lista czlonkow : Number[]
Funkcje:
	dodaj czlonka : Boolean
	usun czlonka : Boolean
	zmien wlasciciela : Boolean