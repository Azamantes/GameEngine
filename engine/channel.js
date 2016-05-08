const Channel = class CHANNEL {
	constructor(config) {
		this.name = '[' + config.name + ']: ';
		this.events = {};
	}
	listen(event, listener) {
		const isListener = Check.this(listener) === Check.function;
		if(!isListener) {
			console.error('Provided listener is not a function.');
			return false;
		}

		const isArray = Array.isArray(this.events[event]);
		if(!isArray) {
			this.events[event] = [];
		}
		
		this.events[event].push(listener);
		return true;
	}
	shout(event, message) {
		const isArray = Array.isArray(this.events[event]);
		if(!isArray) {
			return false;
		}
		
		const array = this.events[event];
		let i = array.length;
		while(--i + 1) array[i](message);
		return true;
	}
	delete(event, listener) {
		const array = this.events[event];
		if(!Array.isArray(array)){
			return false;
		}

		const length = array.length;
		let i = -1;
		while(++i < length){
			if(array[i] === listener){
				this.events[event].splice(i, 1);
				return true;
			}
		}
		return false;
	}
};