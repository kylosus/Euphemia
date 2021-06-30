const {ECommand} = require('../../lib');

class ModerationCommand extends ECommand {
	constructor(client, {actionName = (() => { throw 'Moderation commands need an actionName option'; })(), ...options}) {
		super(client, options);

		this.actionName = actionName.toUpperCase();

		if (!this.args.find(arg => arg.id === 'reason')) {
			throw 'Need reason argument in Moderation Commands';
		}
	}

	async execute(message, args) {
		const parsedArgs = await this.parser.parse(message, args);
		const result = await this.run(message, parsedArgs);

		// The reason should be null reeeeeee
		// should?
		console.log(`The reason is ${parsedArgs.reason}`);
		// save the result to db

		const reply = await this.ship(message, result);
		this.hooks.forEach(h => h(reply));
		return reply;
	}
}

module.exports = {
	ModerationCommand
};
