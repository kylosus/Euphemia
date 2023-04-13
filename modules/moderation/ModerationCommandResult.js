import { Colors } from 'discord.js';

export default class ModerationCommandResult {
	constructor(reason = null, aux = null, duration = '') {
		// use ids
		this.passed   = [];
		this.failed   = [];
		this.aux      = aux;
		this.duration = duration;
		this.reason   = reason;
	}

	addPassed(p) {
		// this.passed.push({ id: p?.id ?? p });
		this.passed.push({ id: p?.id ?? p, toString: () => p.toString() });
	}

	addFailed(f, reason) {
		// this.failed.push({ id: id?.id ?? id, reason });
		this.failed.push({ id: f?.id ?? f, reason, toString: () => f.toString() });
	}

	getColor(good = Colors.Green, warn = Colors.Orange, bad = Colors.Red) {
		if (!this.failed.length) {
			return good;
		}

		if (this.passed.length) {
			return warn;
		}

		return bad;
	}
}
