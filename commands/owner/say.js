const { Command }	= require('discord.js-commando');
const EuphemiaEmbed	= require('../../util/EuphemiaEmbed.js');

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'say',
			group: 'owner',
			memberName: 'say',
			description: 'Says something',
			details: 'Says something. Supports embeds',
			userPermissions: ['BAN_MEMBERS'],
			examples: [`${client.commandPrefix}say something`, `${client.commandPrefix}say {JSON}`],
			ownerOnly: true
		});
	}
	

	async run(message, arg) {
		if (!arg.length) {
			return message.reply('Say what?');
		}

		if (arg.startsWith('{')) {
			if (EuphemiaEmbed.validate(arg)) {
				const embed = EuphemiaEmbed.build(arg);
				return message.channel.send([embed.content], embed);
			}
		}

		return message.channel.send(arg);
	}
};
