const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            group: 'utility',
            memberName: 'ping',
            description: 'Replies with average ping.'
        });
    }

   async run(message) {
        const embed = new RichEmbed()
            .setDescription(`⏳ ${this.client.ping.toFixed(2)}`)
            .setColor(message.member.displayColor);
        return message.embed(embed);
    }
};