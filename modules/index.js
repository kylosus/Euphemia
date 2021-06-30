const mute = require('./mute');
const moderation = require('./moderation');

const init = async (client, db) => {
	await mute.init(client, db);
	await moderation.init(client, db);
};

module.exports = {
	init,
	mute,
	moderation,
};