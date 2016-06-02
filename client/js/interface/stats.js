'use strict';

class Stats {
	constructor(channel, send, root) {
		this.channel = channel;
		this.send = send;
		this.root = root;

		this.nodes = {};
		this.list = [];

		this.channel.listen('stats: init', this.parse.bind(this));
	}
	push(key, value) {
		this.nodes[key] = this.list.push(value) - 1;
	}
	render() {
		const fragment = document.createDocumentFragment();
		this.list.map(x => fragment.appendChild(x));
		this.root.appendChild(fragment);
	}
	parse(list) {
		const length = list.length;
		let i = -1, item;
		while(++i < length) {
			item = document.createElement('div');
			item.textContent = this.parseItem(list[i]);
			this.push(list[i][0], item);
		}
		this.render();
	}
	update(item) {
		const index = this.nodes[item[0]];
		this.list[index].textContent = this.parseItem(item);
	}
	updateMultiple(list) {
		list.map(item => this.update(item));
	}
	parseItem(item) {
		return item[0] + ': ' + item[1] + '/' + item[2];
	} 
}