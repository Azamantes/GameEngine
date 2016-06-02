'use strict';

class Chat {
	constructor(channel, send, nodes) {
		this.channel = channel;
		this.send = send;
		this.root = nodes.root;
		this.input = nodes.input;

		this.listener = this.keydown.bind(this);

		this.input.addEventListener('keydown', this.keydown.bind(this));
		this.channel.listen('ws: chat', this.write.bind(this));
	}
	keydown(event) {
		// event.preventDefault();
		if(event.keyCode === 13) {
			this.send({
				event: 'chat',
				data: event.target.value,
			});
			console.log('wyslalem websocketa');
			event.target.value = '';
		}
	}
	write(message) {
		const node = doc.createElement('div');
		node.textContent = message;
		this.root.appendChild(node);
	}
}