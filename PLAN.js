// ---------------------------------
// GAME WORLD
// ---------------------------------
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
// CHANNEL
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
// LOCATION
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
// TEAM
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
// CHARACTER
// ---------------------------------
Character(Object config)
	id : Number
	name : String
	alignment : Number
	
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
	startLiving() : Boolean
		check === true -> set up listeners
	
	// ---------
	// TEAM
	// ---------
	createTeam() : Boolean
		attemps to create team
	joinTeam(Character player) : Boolean
		attempts to join team of [player]
	leaveTeam() : Boolean
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
	enterLocation(Number locationID) : Boolean	
		attempts to enter location with given [locationID]
		stops listening to current location (leave)
	

Listeners:
	locationChat(String value) : Boolean
	listenTeam(String value) : Boolean
	listenTeamStatus(String value) : Boolean



// ---------------------------------
// GUILD
// ---------------------------------
Guild(Object config)
	id : Number
	name : String
	creator : Number
	members : Object[] -> { id: Number, status: Boolean }
	ranks : Object -> { id: Number, rank: String } // list of possible ranks
	membersRanks : Object // maps members -> their ranks
	invitations : Object
	invitationsCount : Number
	money : Number

Functions:
	invite(Character allegedCreator, Character player) : Boolean
	sendInvitation(Characterp player) :  === Team.prototype.sendInvitation
	acceptInvitation(Number number) :  === Team.prototype.acceptInvitation
	refuseInvitation(Number number) :  === Team.prototype.refusetInvitation
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
// ITEM
// ---------------------------------
Item(Object config)
	id : Number
	name : String
	model : Number // models are subclasses
	type : Number // what exactly type of item from the subclass
	// model weapon -> types [sword, mace, chains, staff] etc.
	quality : Number
	grade : Number
	weight : Number
	slot : Number // only EQ
	effects : Effect[] // only consumables, EQ and maybe some knowledge scrolls/papers
	skills : Skill[]
	flags : Number // bit flags
		1. consumable // can you eat/use it? scrolls, food
		2. destructible // can you destroy/disassemble it?
		3. durable // 1 -> has durability, 0 -> no durability
		4. equippable // can you put it in an EQ slot? helm, shield, weapon etc.
		5. reusable // if I consume it, will it disappear? food yes, teleportation runes nope.
		6. stackable // can you stack it? like potions or some cloth/skin/gems
		7. upgradable // can you upgrade it? like in Mu Online from +0 to +11/+13/+15

	requiredStats : Object[] -> { stat: String, value: Number } // or Number[] ...? 
	usableBy : Number // bit flag...
	material : Number // stone, cloth, some rare dust etc.

Functions:
	isConsumable() : Boolean
	isDestructible() : Boolean
	isDurable() : Boolean
	isEquippable() : Boolean
	isReusable() : Boolean
	isStackable() : Boolean
	isUpgradable() : Boolean
	...
	toString : String // this will be overriden be specific item classes
	to powinna byc jedyna funkcja.
	itemy powinny generalnie byc jedynie glupimi obiektami nie wiedzacymi nic o otaczajacym ich swiecie
	inventory powinno wykonywac zarzadzanie itemami, wlacznie z ich stackowaniem

// ---------------------------------
// ITEM SUBCLASSES ... "SUBCLASSES" ... "...CLASSES..." ... yeah...
// ---------------------------------
Armor(Object config) extends Item(Object config) // rings, necklaces etc also count as armor
	upgrade : Number
	durability : Number
	durability_max : Number
	set: Number // sets of items, like Phoenix Set, Sphinx Set, Great Dragon set (Mu Online)
	slot : Number
		always the same as type
	possible types {
		helm
		necklace
		shoulder // ?
		armor
		gloves
		waist
		pants
		boots
		ring
	}
		

Weapon(Object config) extends Item(Object config)
	upgrade : Number
	durability : Number
	durability_max : Number
	slot : Number (always hand slot)
	type : Number
		sword // (1 or 2-handed)
		mace // (1 or 2-handed)
		shield // (1)
		chain // (1 handed)
		staff // (1 or 2-handed) // yes, there will be 1-handed staves too
		hammer // (1 or 2-handed)
		morgenstern/flail // (1 handed)
		(and maybe something else)...

gdzie wstawic type? do Itemu czy poszczegolnych podklas? i tak wszystkie itemy musza miec jakis typ
chodzi tylko o to, ze rozne klasy beda roznie interpretowaly te typy, wiec jak item ma typ 2 to
dla broni moze to byc miecz a dla tools jakis kilof.

Container(Object config) extends Item(Object config) // kontener na klejnoty, kolczana na strzaly etc.
	type : Number // tu tez beda typy... czy torba na gemy, ziola, czy kolczan na strzaly etc.
	capacity : Number // how many items
	weight : Number // how much can a bag contain before it "tears apart"
Miscellaneous(Object config) extends Item(Object config) // itemy bez konkretnego przeznaczenia, obrazki, statuetki etc.
	...
Material(Object config) extends Item(Object config) // np. papier do pisania, ruda srebra, rosliny etc.
	type : Number
Projectile(Object config) extends Item(Object config) // strzaly, belty etc.
	
	max_stack : Number
Tool(Object config) extends Item(Object config) // narzedzia typu kilof, nozyk zielarza etc.
Usable(Object config) extends Item(Object config) // any item you can "use", food, potions, books
	type : Number
		food
		potion
		book
		scroll
		map
		etc.


// ---------------------------------
Inventory(Object config)
	owner : Character
	capacity : Number
	// if item exists then this.items[item.id] = true; after removal just set it to false.
	pointer : Object -> { Number id : Number containerIndex }
	container : Item[]

Functions:
	action(Number id1, Number id2) : void // ???
		ta funkcja wykonywana jest za kazdym razem gdy gracz sprobuje przeciagnac item z jednego slotu
		do innego.
		w tej funkcji bedzie zapadac decyzja co zrobic.
		beda tu wykonywane wszystkki potrzebne sprawdzenia etc.

	put(Item item) : Boolean
		attempts to put a new item into the inventory
	
	take(Number id) : Item
		returns reference to item and removes it from inventory

	get(Number id) : Item
		returns reference to item
	
	has(Number id) : Boolean
		does it have certain item?
	
	swap(Number id1, Number id2) : Boolean // ?
		swaps 2 items (assuming that inventory will be grid-based and you will be able to organize it visually)

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