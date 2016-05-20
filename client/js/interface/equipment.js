class Equipment {
	constructor(config) {
		this.root = config.root;
		this.slots = config.slots || {};

		this.init();
	}
	init() {
		m.render(this.root, this.view());
	}
	view() {
		console.log('EQ:', this.slots);
		const invisible = { class: 'invisible' };
		const slots = this.slots;
		return m('tbody', { id: 'equipment' }, [
			m('tr', [
				m('td', invisible),
				m('td', { id: 'eq-head' }, slots.head? m('img', { id: slots.head.id, src: slots.head.src }) : []),
				m('td', invisible),
			]),
			m('tr', [
				m('td', { id: 'eq-ring1' }, slots.ring1? m('img', { id: slots.ring1.id, src: slots.ring1.src }) : []),
				m('td', { id: 'eq-neck' }, slots.neck? m('img', { id: slots.neck.id, src: slots.neck.src }) : []),
				m('td', { id: 'eq-ring2' }, slots.ring2? m('img', { id: slots.ring2.id, src: slots.ring2.src }) : []),
			]),
			m('tr', [
				m('td', { id: 'eq-hand-left' }, slots['hand-left']? m('img', { id: slots['hand-left'].id, src: slots['hand-left'].src }) : []),
				m('td', { id: 'eq-chest' }, slots.chest? m('img', { id: slots.chest.id, src: slots.chest.src }) : []),
				m('td', { id: 'eq-hand-right' }, slots['hand-right']? m('img', { id: slots['hand-right'].id, src: slots['hand-right'].src }) : []),
			]),
			m('tr', [
				m('td', { id: 'eq-gloves' }, slots.gloves? m('img', { id: slots.gloves.id, src: slots.gloves.src }) : []),
				m('td', { id: 'eq-pants' }, slots.pants? m('img', { id: slots.pants.id, src: slots.pants.src }) : []),
				m('td', { id: 'eq-waist' }, slots.waist? m('img', { id: slots.waist.id, src: slots.waist.src }) : []),
			]),
			m('tr', [
				m('td', invisible),
				m('td', { id: 'eq-boots' }, slots.boots? m('img', { id: slots.boots.id, src: slots.boots.src }) : []),
				m('td', invisible),
			]),
		]);
	}
	update(config) {
		switch(config.action) {
			case 1: { // put
				const element = document.createElement('img');
				element.setAttribute('id', config.id);
				element.setAttribute('src', config.src);
				doc.get('eq-' + config.slot).appendChild(element);
				break;
			}
			case 2: { // chanage
				const element = doc.get('eq-' + config.slot).firstChild;
				element.setAttribute('id', config.id);
				element.setAttribute('src', config.src);
				break;
			}
			case 3: { // remove
				const element = doc.get('eq-' + config.slot);
				element.removeChild(element.firstChild);
				break;
			}
		}
	}
}