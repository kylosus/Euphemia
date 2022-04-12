export default event => {
	console.warn(`Disconnected with code ${event.code}\nReason: ${event.reason}`);
};
