import CircularList from './CircularList.js';

export default class CircularListGenerator extends CircularList {
	constructor(array, length, nextGen, previousGen) {
		super(array);
		this._first        = nextGen();
		this._current      = this._first;
		this._currentIndex = 0;
		this._length       = length;
		this._end          = this._length - 1;
		this._next         = nextGen;
		this._previous     = previousGen;
	}

	next() {
		if (this._currentIndex < this._end) {
			this._current = this._next();
			this._currentIndex++;
			return this._current;
		}

		return this._current;
	}

	previous() {
		if (this._currentIndex === 0) {
			return this._current;
		}

		this._currentIndex--;
		this._current = this._previous();
		return this._current;
	}

	get current() {
		return this._current;
	}

	get currentIndex() {
		return this._currentIndex;
	}

	get length() {
		return this._length;
	}
}
