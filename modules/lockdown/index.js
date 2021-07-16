const watcher = require('./watcher');

const init = client => {
	watcher.init(client);
};

module.exports = {
	init
};
