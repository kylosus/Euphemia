const {MessageEmbed} = require('discord.js');

const {ECommand, StringDoctor: {capitalize}} = require('../../lib');

class ModerationCommand extends ECommand {
	constructor(client, {actionName = (() => { throw 'Moderation commands need an actionName option'; })(), ...options}) {
		super(client, options);

		this.actionName = actionName.toUpperCase();

		if (!this.args.find(arg => arg.id === 'reason')) {
			throw 'Need reason argument in Moderation Commands';
		}
	}

	async ship(message, result) {
		const embed = new MessageEmbed()
			.setColor(result.getColor())
			.setTitle(`${capitalize(this.aliases[0])} command executed`);

		if (result.aux) {
			embed.setDescription(result.aux.toString());
		}

		embed.addField('Passed', result.passed.map(r => `<@${r.id}>`).join(' ') || '~');

		if (result.failed.length) {
			embed.addField('Failed', result.failed.map(r => `<@${r.id}>`).join(' '));
		}

		embed.addField('Moderator', message.member.toString(), true);
		embed.addField('Reason', result?.reason ?? '*No reason provided*', true);

		return message.channel.send(embed);
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

module.exports = ModerationCommand;
