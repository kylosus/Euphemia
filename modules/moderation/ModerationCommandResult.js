export default class ModerationCommandResult {
	constructor(reason = null, aux = null) {
		// use ids
		this.passed = [];
		this.failed = [];
		this.aux    = aux;
		this.reason = reason;
	}

	addPassed(p) {
		// this.passed.push({ id: p?.id ?? p });
		this.passed.push({ id: p?.id ?? p, toString: () => p.toString() });
	}

	addFailed(f, reason) {
		// this.failed.push({ id: id?.id ?? id, reason });
		this.failed.push({ id: f?.id ?? f, reason, toString: () => f.toString() });
	}

	getColor(good = 'GREEN', warn = 'ORANGE', bad = 'RED') {
		if (!this.failed.length) {
			return good;
		}

		if (this.passed.length) {
			return warn;
		}

		return bad;
	}
}
