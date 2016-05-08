const Guild = class GUILD extends Channel { // extends Team
	constructor(config = {}) {
		super(config);

		this.id = config.id;
		this.creator = config.creator;
		this.memberCache = {};
		this.members = config.members;
		this.ranks = {};
		this.membersRanks = {};
		this.invitationCount = 0;
		this.invitations = {};
		this.money = 0;
	}
	// Same as in the Team class... but not all were copied.
	broadcast(event, message) {
		const array = this.events[event];
		if(!Array.isArray(array)) return;
		let i = array.length;
		while(--i + 1) array[i](message);
		return true;
	}
	invite(allegedCreator, player) {
		if(player.guild !== null) {
			return !!console.warn('This player is in a guild already.');
		}
		if(this.type && this.creator !== allegedCreator) {
			return !!console.warn('You are not the guild creator and thus cannot invite people.');
		}
		if(this.members.indexOf(player) !== -1) {
			return !!console.warn(player.name + ' is in this guild already.');
		}
		return this.sendInvitation(player);
	}
	sendInvitation(player) {
		const number = ++this.invitationCount;
		this.invitations[number] = player;
		player.receiveInvitation({
			number,
			message: 'You have received guild invitation from ' + this.creator.name + '.\nDo you accept it?',
			accept: this.acceptInvitation.bind(this),
			refuse: this.refuseInvitation.bind(this)
		});
		return true;
	}
	acceptInvitation(number) {
		const player = this.invitations[number];
		this.addMember(player);
		console.log(player.name + ' joined guild.');
		this.invitations[number] = null;
		return true;
	}
	refuseInvitation(number) {
		const player = this.invitations[number];
		console.log(player.name + ' refused guild invitation.');
		this.invitations[number] = null;
		return true;
	}
	leave(player) {
		if(this.type && this.creator === player){
			return !!console.warn(this.texts.cannotLeave);
		}
		return !!this.removeMember(player);
	}
	kick(allegedCreator, player) { // player interface
		if(!this.type || this.creator !== allegedCreator) {
			return !!console.warn(this.texts.cannotKick);
		}
		return this.removeMember(player, true);
	}
	addMember(player, listeners) {
		this.members.push(player);
		player.team = this;
		this.broadcast('chat', this.name + player.name + ' joined.');
		return true;
	}
	removeMember(player, kicked = false) {
		this.members.splice(this.members.indexOf(player), 1);
		player.team = null;
		this.broadcast('chat', this.name + player.name + kicked? ' was kicked away.' : ' left.');
		return true;
	}
	// Unique to Guild
	assignRank(player, rank) {
		if(this.creator === player) {
			return !!console.warn(this.texts.cannotAssign);
		}

		const isMember = !!this.members[player.id];
		if(!isMember) {
			return !!console.warn(player.name + ' is not a member of this guild.');
		}
	}
	donate(player, money = 0) {
		const isMember = !!this.members[player.id];
		if(!isMember) {
			return !!console.warn('You are not a member of this guild.');
		}
		player.money -= money;
		this.money += money;
		this.shout('log', player.name + ' donated ' + money + ' money.');
	}
};
Guild.prototype.texts = {
	notGuildCreator: 'You are no the guild creator. You cannot change its type.',
	cannotKick: 'You cannot kick out players from this guild.',
	cannotLeave: `You cannot leave your own guild.`,
	cannotAssign: 'You cannot assign rank to yourself.',
};