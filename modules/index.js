const mute =  require('./mute');

const init = async (client, db) => {
	await mute.init(client, db);
};

module.exports = {
	mute,
	init
};