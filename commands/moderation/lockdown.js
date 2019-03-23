const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'lockdown',
            group: 'moderation',
            memberName: 'lockdown',
            description: 'Automatically mutes every new member on join',
            userPermissions: ['MANAGE_ROLES'],
            guildOnly: true
        });
    }

	async run(message) {
		const entry = message.client.provider.get(message.guild, 'guildMemberAdd', false);

		if (!entry) {
			await message.client.provider.set(message.guild, 'guildMemberAdd', { automute: true });
			return _sendNotification(message, 'Enabled');
		}
			entry.automute = true;
			await message.client.provider.set(message.guild, 'guildMemberAdd', entry);
			return _sendNotification(message, 'Enabled');
		}
    }
};

    return message.embed(new RichEmbed()
        .setColor('DARK_RED')
        .setTitle(`${text} automute on new member join.`)
    );
		if (entry.automute) {
			entry.automute = false;
			await message.client.provider.set(message.guild, 'guildMemberAdd', entry);
			return _sendNotification(message, 'Disabled');
		} else {
			entry.automute = true;
			await message.client.provider.set(message.guild, 'guildMemberAdd', entry);
			_sendNotification(message, 'Enabled');
};
function _sendNotification(message, text) {
