const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const EuphemiaEmbed = require('../../util/EuphemiaEmbed.js');

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
    };

    async run(message) {
        let args = message.content.split(' ');
        if (args.length === 1) {
            return;
        } else {
            if (args[1].startsWith('{')) {
                const embed = EuphemiaEmbed.build(args.splice(1).join(' '));
                return message.channel.send([embed.content], embed);
            } else {
                return message.channel.send(args.splice(1).join(' '));
            }
        }
    }
}