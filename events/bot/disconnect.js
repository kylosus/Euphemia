module.exports = event => {
	console.log(`Disconnected with code ${event.code}\nReason: ${event.reason}`);
};
