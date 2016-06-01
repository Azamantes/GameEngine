'use strict';

class Equipment {
	constructor(root) {
		this.root = root;
		this.slots = {};

		this.init();
	}
	init() {
		m.render(this.root, this.view());
	}
	view() {
		console.log('EQ:', this.slots);
		const invisible = m('td', { class: 'invisible' });
		const slots = this.slots;
		return m('tbody', { id: 'equipment' }, [
			m('tr', [
				invisible,
				m('td', { id: 'eq#head' }, slots.head? m('img', { src: slots.head.src }) : []),
				invisible,
			]),
			m('tr', [
				m('td', { id: 'eq#ring1' }, slots.ring1? m('img', { src: slots.ring1.src }) : []),
				m('td', { id: 'eq#neck' }, slots.neck? m('img', { src: slots.neck.src }) : []),
				m('td', { id: 'eq#ring2' }, slots.ring2? m('img', { src: slots.ring2.src }) : []),
			]),
			m('tr', [
				m('td', { id: 'eq#hand-left' }, slots['hand-left']? m('img', { src: slots['hand-left'].src }) : []),
				m('td', { id: 'eq#chest' }, slots.chest? m('img', { src: slots.chest.src }) : []),
				m('td', { id: 'eq#hand-right' }, slots['hand-right']? m('img', { src: slots['hand-right'].src }) : []),
			]),
			m('tr', [
				m('td', { id: 'eq#palms' }, slots.palms? m('img', { src: slots.palms.src }) : []),
				m('td', { id: 'eq#legs' }, slots.pants? m('img', { src: slots.legs.src }) : []),
				m('td', { id: 'eq#waist' }, slots.waist? m('img', { src: slots.waist.src }) : []),
			]),
			m('tr', [
				invisible,
				m('td', { id: 'eq#feet' }, slots.feet? m('img', { src: slots.feet.src }) : []),
				invisible,
			]),
		]);
	}
	update(config) {
		switch(config.action) {
			case 1: { // put
				const element = document.createElement('img');
				element.setAttribute('id', config.id);
				element.setAttribute('src', config.src);
				doc.get('eq#' + config.slot).appendChild(element);
				break;
			}
			case 2: { // chanage
				const element = doc.get('eq#' + config.slot).firstChild;
				element.setAttribute('id', config.id);
				element.setAttribute('src', config.src);
				break;
			}
			case 3: { // remove
				const element = doc.get('eq#' + config.slot);
				element.removeChild(element.firstChild);
				break;
			}
		}
	}
}