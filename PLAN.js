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
	kick(Character player) : void
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
	
	sendInvitation(Character player) : Boolean
		sends invitation to the [player]
	
	acceptInvitation(Number number) : void
		callback to call upon invitation acceptance
	
	refuseInvitation(Number number) : void
		callback to call upon invitation refusal
	
	join(Character player) : Boolean
		attempts to let the [player] join
	
	leave(Character player) : Boolean
		attempts to let the [player] leave
	
	kick(Character player_1, Character player_2) : Boolean
		attempts to kick [player_2] out of the team
	
	addMember(Character player, Function[] listeners) : void
		adds [player] to the memberlist and cached his [listeners]

	removeMember(Character player) : void
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

Functions:
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
	receiveInvitation(Object invitation) : void // this is a generic function, works with any invitation, as long as it has the 2 properties (message, number) and 2 callbacks (accept, refuse)
		caches invitation and sends it via websocket to the client, so that he can see it
	invite(Object invitation) : void // this is actually on the client side, not in the engine on the server
	
	// ---------
	// LOCATION
	// ---------
	enter location(Number locationID) : Boolean	
		attempts to enter location with given [locationID]
		stops listening to current location (leave)
	

Listeners:
	locationChat(String value) : Boolean
	listenTeam(String value) : Boolean
	listenTeamStatus(String value) : Boolean



// ---------------------------------
Guild(Object config)
	id : Number
	name : String
	creator : Number
	members : Object[] { id: Number, status: Boolean }
	ranks : Object // list of possible ranks
	membersRanks : Object // maps members -> their ranks
	invitations : Object
	invitationsCount : Number
	money : Number

Functions:
	invite(Character allegedCreator, Character player) : Boolean
	sendInvitation(Characterp player) : Boolean (always true) === Team.prototype.sendInvitation
	acceptInvitation(Number number) : Boolean (always true) === Team.prototype.acceptInvitation
	refuseInvitation(Number number) : Boolean (always true) === Team.prototype.refusetInvitation
	leave(Character player) : Boolean
		attempts to let the [player] leave
	
	kick(Character player_1, Character player_2) : Boolean
		attempts to kick [player_2] out of the team
	
	addMember(Character player, Function[] listeners) : void
		adds [player] to the memberlist and cached his [listeners]

	removeMember(Character player) : void
		removes [player] from memberlist and stops listening to his callbacks

	assignRank(Character player, Number rank) : Boolean
		attempts to assign [rank] to the [player]

	donate(Character player, Number money) : Boolean
		attempts to let [player] donate [money] of gold to the guild treasure house

// ---------------------------------
Item(Object config)
	id : Number
	name : String
	type : Number // armor, neutral, potion, weapon etc.
	quality : Number
	grade : Number
	// upgrade : Number // only EQ
	weight : Number
	slot : Number // only EQ
	effects : Effect[] // only consumables, EQ and maybe some knowledge scrolls/papers
	skills : Skill[]
	// durability : Number // only EQ
	// durability_max : Number
	flags : Number // bit flags
		destructible // can you disassemble it?
		// only EQ has durability
		durable // 1 -> has durability, 0 -> no durability
		stackable // can you stack it? like potions or some cloth/skin/gems
		consumable // can you eat/use it? scrolls, food
		reusable // if I consume it, will it disappear? food yes, teleportation runes nope.
		equippable // can you put it in an EQ slot? helm, shield, weapon etc.
		upgradable // can you upgrade it? like in Mu Online from +0 to +11/+13/+15

	requiredStats : Object[] -> { stat: String, value: Number } // or Number[] ...? 
	usableBy : Number // bit flag...
	material : Number // stone, cloth, some rare dust etc.

Functions:
	...
	toString : String // this will be overriden be specific item classes


// ---------------------------------
// ITEM CLASSES
// ---------------------------------



// ---------------------------------
Inventory(Object config)
	owner : Character
	capacity : Number
	// if item exists then this.items[item.id] = true; after removal just set it to false.
	items : Object -> { id : Number -> Boolean}
	container : Item[]

Functions:
	get(Number id) : Item
		returns reference to item
	take(Number id) : Item
		returns reference to item and removes it from inventory
	has(Number id) : Boolean
		does it have certain item?
	list() : Item[]
		returns list of items

// ---------------------------------
Equipment(Object config)
	owner : Character
	slots : Object -> { slot: String, item: Item }// or Number[] ?

Functions:
	equip(String slot, Item item) : Boolean
		if slot if free then puts item in it -> true, else -> false
	unequip(String slot) : Item
		takes off item from given [slot] and returns it
	isOccupied(String slot) : Boolean
		is given slot occupied or can you put item in it?

// ---------------------------------
Shop(Object config)
	
Functions:
	...

// ---------------------------------
Effect(Object config)
	...
Functions:
	...