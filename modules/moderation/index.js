const db = require('./db');

const init = async (client, _db) => {
	await db.init(client, _db);
};

module.exports = {
	init,
	ModerationCommand: require('./ModerationCommand'),
};
