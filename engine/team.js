'use strict';

// --------------
// Dependencies
// --------------
const Channel = require('./channel.js');

const Team = class TEAM extends Channel {
	constructor(config = {}) {
		super({ name: 'Team' });
		// super('Team#' + config.id)

		this.id = config.id;
		this.type = !!config.type; // 0 - anarchy, 1 - leadership
		this.creator = config.creator;
		this.members = [this.creator];
		this.invitationCount = 0;
		this.invitations = {};

		this.listeners = {
			accept: this.acceptInvitation.bind(this),
			refuse: this.refuseInvitation.bind(this),
		};
	}
	invite(allegedCreator, player) { // player interface
		if(player.team !== null) {
			return Team.Error(this.errors.memberAlready);
		}
		if(this.type && this.creator !== allegedCreator) {
			return Team.Error(this.errors.invite);
		}
		if(~this.members.indexOf(player)) {
			return Team.Error(this.errors.memberAlready);
			// return !!console.warn(player.name + ' is in your team already.');
		}
		this.sendInvitation(player);
		return true;
	}
	sendInvitation(player) {
		const number = ++this.invitationCount;
		this.invitations[number] = player;
		player.receiveInvitation({
			number,
			message: this.generateInvitation(),
			accept: this.listeners.accept,
			refuse: this.listeners.refuse,
		});
	}
	generateInvitation() {
		return 'You have received team invitation from ' + this.creator.name + '.\nDo you accept it?';
	}
	acceptInvitation(number) { // player interface
		const player = this.invitations[number];
		this.addMember(player);
		console.log(player.name + ' joined.');
		this.invitations[number] = null;
	}
	refuseInvitation(number) { // player interface
		const player = this.invitations[number];
		console.log(player.name + ' refused invitation.');
		this.invitations[number] = null;
	}
	join(player) { // player interface
		if(this.type){
			return Team.Error(this.errors.join);
		}
		this.addMember(player);
		return true;
	}
	leave(player) {
		if(this.members.length === 1) {
			return !!this.removeMember(player);
		}
		if(this.type && this.creator === player){
			return Team.Error(this.errors.leaveLeader);
		} else if(this.type && this.creator !== player) {
			return Team.Error(this.errors.leave);
		}
		return !!this.removeMember(player);
	}
	kick(allegedCreator, player) { // player interface
		if(!this.type || this.creator !== allegedCreator) {
			return Team.Error(this.errors.kick);
		}
		this.removeMember(player);
		return true;
	}
	addMember(player, listeners) {
		this.members.push(player);
		player.team = this;
		this.shout('chat', this.name + player.name + ' joined.');
	}
	removeMember(player) {
		this.members.splice(this.members.indexOf(player), 1);
		player.team = null;
		this.shout('chat', this.name + player.name + ' left.');
	}
	passLeadership(allegedCreator, player) {
		if(this.creator !== allegedCreator) {
			return Team.Error(this.errors.leader);
		}
		if(~this.members.indexOf(player)) {
			return Team.Error(this.errors.inTeam);
		}
		if(this.creator !== allegedCreator && !this.type) {
			return Team.Error(this.errors.anarchyLeadership);
		}
		this.creator = player;
		this.shout('leader changed', 'Team become Leadership. New leader: ' + player.name);
		return true;
	}
	changeType(player, type) {
		if(this.creator !== player) {
			return Team.Error(this.errors.creator);
		}
		if(this.type === !!type) {
			return true;
			// return !!console.log(`Team type didn't change.`);
		};
		this.type = !!type;
		this.shout('type changed', 'New team type: ' + (type? 'Leadership.' : 'Anarchy.'));
		return true;
	}
	static Error(error) {
		return !!console.log(new Error(this.prototype.errors[error]));
	}
};
Team.prototype.errors = {
	inTeam: 'This player is not in your team.',
	leader: 'You are not the team leader.',
	creator: 'You are not the team leader. You cannot change its type.',
	member: 'You are not a member of this guild.',
	memberAlready: 'This player is in a team already.',
	invite: 'You are not the team leader and thus cannot invite people.',
	join: 'You cannot join Leadership without invitation.',
	kick: 'You cannot kick out players from this team.',
	leave: 'You cannot leave Leadership on your own.',
	leaveLeader: 'You cannot leave your people without telling them who\'s going to be the leader now.',
	assign: 'You cannot assign rank to yourself.',
	anarchyLeadership: 'You cannot pass leadership in an Anarchy Team.',
};
module.exports = Team;