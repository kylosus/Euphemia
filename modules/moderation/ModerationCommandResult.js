class ModerationCommandResult {
	constructor(reason = null, aux = null) {
		// use ids
		this.passed = [];
		this.failed = [];
		this.aux = aux;
		this.reason = reason;
	}

	addPassed(p) {
		this.passed.push({id: p?.id ?? p});
	}

	addFailed(id, reason) {
		this.failed.push({id: id?.id ?? id, reason});
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

module.exports = ModerationCommandResult;