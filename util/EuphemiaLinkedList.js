module.exports = class {
	constructor(array) {
		this._array = array;
		this._current = array[0];
		this._head = 0;
		this._tail = array.length - 1;
	}

	next() {
		if (this._head !== this._tail) {
			this._head++;
			this._current = this._array[this._head];
			return this._current;
		}
	}

	previous() {
		if (this._head !== 0) {
			this._head--;
			this._current = this._array[this._head];
			return this._current;
		}
	}

	getCurrentIndex() {
		return this._head + 1;
	}

	getSize() {
		return this._tail + 1;
	}
};