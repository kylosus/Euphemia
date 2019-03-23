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

	async run(message) {
		const args = message.content.split(' ').slice(1);
		if (!args.length) {
			return message.reply('Say what?');
		} else {
			const body = args.join(' ');
			if (body.startsWith('{')) {
				if (EuphemiaEmbed.validate(body)) {
					const embed = EuphemiaEmbed.build(body);
					return message.channel.send([embed.content], embed);
				}
			} else {
				return message.channel.send(body);
			}
		}
	}
};
