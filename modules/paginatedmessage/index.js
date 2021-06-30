const watcher = require('./watcher');

const init = async (client) => {
	await watcher.init(client);
};

module.exports = {
	init,
	PaginatedMessage: require('./EuphemiaPaginatedMessage')
};
