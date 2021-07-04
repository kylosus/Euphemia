module.exports = class {
	constructor(array) {
		this._array = array;
		this._current = 0;
		this._end = array.length - 1;
	}

	next() {
		if (this._current < this._end) {
			this._current++;
			return this._array[this._current];
		}

		this._current = 0;
		return this._array[this._current];
	}

	previous() {
		if (this._current === 0) {
			this._current = this._end;
			return this._array[this._current];
		}

		this._current--;
		return this._array[this._current];
	}

	get current() {
		return this._array[this._current];
	}

	get currentIndex() {
		return this._current;
	}

	get length() {
		return this._array.length;
	}
};