'use strict';

// --------------
// Dependencies
// --------------
const Channel = require('./channel.js');
const Team = require('./team.js');

const Guild = class GUILD extends Channel { // extends Team
	constructor(config = {}) {
		super(config);

		this.id = config.id;
		this.name = config.name;
		this.creator = config.creator;

		// here it must have only player IDs, because you cannot pre-create players
		// too much trouble, just store their IDs you got from the database
		this.members = config.members;
		this.ranks = {}; // number -> string
		this.membersRanks = {};
		this.invitationCount = 0;
		this.invitations = {};
		this.money = 0;

		this.listeners = {
			accept: this.acceptInvitation.bind(this),
			refuse: this.refuseInvitation.bind(this),
		};
	}
	// Same as in the Team class... but not all were copied.
	invite(allegedCreator, player) {
		if(player.guild !== null) {
			return Guild.Error('memberAlready');
		}
		if(this.type && this.creator !== allegedCreator) {
			return Guild.Error('creator');
		}
		if(~this.members.indexOf(player)) { // same as members.indexOf(player) !== -1
			return !!console.warn(player.name + ' is in this guild already.');
		}
		return this.sendInvitation(player);
	}
	generateInvitation() {
		return 'You have received guild invitation from ' + this.creator.name + '.\nDo you accept it?';
	}
	leave(player) {
		if(this.type && this.creator === player){
			return Guild.Error('leave');
		}
		return !!this.removeMember(player);
	}
	kick(allegedCreator, player) { // player interface
		if(!this.type || this.creator !== allegedCreator) {
			return Guild.Error('kick');
		}
		return this.removeMember(player, true);
	}
	addMember(player, listeners) {
		this.members.push(player);
		player.guild = this;
		this.shout('chat', this.name + player.name + ' joined.');
	}
	removeMember(player, kicked = false) {
		this.members.splice(this.members.indexOf(player), 1);
		player.guild = null;
		this.shout('chat', this.name + player.name + kicked? ' was kicked away.' : ' left.');
	}

	// Unique to Guild
	assignRank(player, rank) {
		if(this.creator === player) {
			return Guild.Error('assign');
		}

		const isMember = !!this.members[player.id];
		if(!isMember) {
			return Guild.Error(player.name + ' is not a member of this guild.');
		}

		const rankExists = !!this.ranks[rank];
		if(!rankExists) {
			return Guild.Error(this.errors.rank);
		}

		this.membersRanks[player.id] = rank;
		this.shout('chat', player.name = ' was assigned rank [' + this.ranks[rank] + '].');
	}
	donate(player, money = 0) {
		const isMember = !!this.members[player.id];
		if(!isMember) {
			return Guild.Error('member');
		}
		player.money -= money;
		this.money += money;
		this.shout('log', player.name + ' donated ' + money + ' money.');
	}
};
Guild.Error = Team.Error;
Guild.prototype.sendInvitation = Team.prototype.sendInvitation;
Guild.prototype.acceptInvitation = Team.prototype.acceptInvitation;
Guild.prototype.refuseInvitation = Team.prototype.refuseInvitation;
Guild.prototype.errors = {
	creator: 'You are no the guild creator. You cannot change its type.',
	member: 'You are not a member of this guild.',
	memberAlready: 'This player is in a guild already.',
	kick: 'You cannot kick out players from this guild.',
	leave: `You cannot leave your own guild.`,
	assign: 'You cannot assign rank to yourself.',
	rank: `This guild doesn't have such rank.`,
};

module.exports = Guild;