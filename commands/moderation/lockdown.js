const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'lockdown',
            group: 'moderation',
            memberName: 'lockdown',
            description: 'Automatically mutes every new member on join',
            userPermissions: ['MANAGE_GUILD'],
            guildOnly: true
        });
    }

   async run(message) {
       const entry = message.client.provider.get(message.guild, 'guildMemberAdd', false);
       if (!entry) {
			message.client.provider.set(message.guild, 'guildMemberAdd', {automute: true}).then(entry => {
				sendNotification(message, 'Enabled')
			});
       } else if (!entry.hasOwnProperty('automute')) {
			entry.automute = true;
			message.client.provider.set(message.guild, 'guildMemberAdd', entry).then(entry => {
        		sendNotification(message, 'Enabled');
            });
       } else {
		   if (entry.automute) {
				entry.automute = false;
				message.client.provider.set(message.guild, 'guildMemberAdd', entry).then(entry => {
					sendNotification(message, 'Disabled');
				});
			} else {
				entry.automute = true;
                message.client.provider.set(message.guild, 'guildMemberAdd', entry).then(entry => {
                    sendNotification(message, 'Enabled');
                });
			}
		}
    }
};

function sendNotification(message, text) {
    return message.embed(new RichEmbed()
        .setColor('DARK_RED')
        .setTitle(`${text} automute on new member join.`)
    );
};
