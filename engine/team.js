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
	}
	invite(allegedCreator, player) { // player interface
		if(player.team !== null) {
			return !!console.warn('This player is in a team already.');
		}
		if(this.type && this.creator !== allegedCreator) {
			return !!console.warn('You are not the team leader and thus cannot invite people.');
		}
		if(~this.members.indexOf(player)) {
			return !!console.warn(player.name + ' is in your team already.');
		}
		return this.sendInvitation(player);
	}
	sendInvitation(player) {
		const number = ++this.invitationCount;
		this.invitations[number] = player;
		player.receiveInvitation({
			number,
			message: 'You have received team invitation from ' + this.creator.name + '.\nDo you accept it?',
			accept: this.acceptInvitation.bind(this),
			refuse: this.refuseInvitation.bind(this)
		});
		return true;
	}
	acceptInvitation(number) { // player interface
		const player = this.invitations[number];
		this.addMember(player);
		console.log(player.name + ' joined team.');
		this.invitations[number] = null;
		return true;
	}
	refuseInvitation(number) { // player interface
		const player = this.invitations[number];
		console.log(player.name + ' refused team invitation.');
		this.invitations[number] = null;
		return true;
	}
	join(player) { // player interface
		if(this.type){
			return !!console.warn('You cannot join Leadership without invitation.');
		}
		return this.addMember(player);
	}
	leave(player) {
		if(this.members.length === 1) {
			return !!this.removeMember(player);
		}
		if(this.type && this.creator === player){
			return !!console.warn(`You cannot leave your people without telling them who's going to be the leader now.`);
		} else if(this.type && this.creator !== player) {
			return !!console.warn('You cannot leave Leadership on your own.');
		}
		return !!this.removeMember(player);
	}
	kick(allegedCreator, player) { // player interface
		if(!this.type || this.creator !== allegedCreator) {
			return !!console.warn('You cannot kick out players from this team.');
		}
		return this.removeMember(player);
	}
	addMember(player, listeners) {
		this.members.push(player);
		player.team = this;
		this.shout('chat', this.name + player.name + ' joined.');
		return true;
	}
	removeMember(player) {
		this.members.splice(this.members.indexOf(player), 1);
		player.team = null;
		this.shout('chat', this.name + player.name + ' left.');
		return true;
	}
	passLeadership(allegedCreator, player) {
		if(this.creator !== allegedCreator) {
			return !!console.warn('You are not the team leader.');
		}
		if(~this.members.indexOf(player)) {
			return !!console.warn('This player is not in your team.');
		}
		if(this.creator !== allegedCreator && !this.type) {
			return !!console.warn('You cannot pass leadership in an Anarchy Team.');
		}
		this.creator = player;
		this.shout('leader changed', 'Team become Leadership. New leader: ' + player.name);
		return true;
	}
	changeType(player, type) {
		if(this.creator !== player) {
			return !!console.warn('You are no the team leader. You cannot change its type.');
		}
		if(this.type === !!type) {
			return true;
			// return !!console.log(`Team type didn't change.`);
		};
		this.type = !!type;
		this.shout('type changed', 'New team type: ' + (type? 'Leadership.' : 'Anarchy.'));
		return true;
	}
};
Team.prototype.texts = {
	
};