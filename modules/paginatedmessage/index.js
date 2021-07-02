const watcher = require('./watcher');

const init = async (client) => {
	await watcher.init(client);
};

module.exports = {
	init,
	CircularList: require('./CircularList'),
	CircularListGenerator: require('./CircularListGenerator'),
	PaginatedMessage: require('./EuphemiaPaginatedMessage')
};
