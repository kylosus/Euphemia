const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const moment = require('moment');

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
        return message.embed(new RichEmbed()
            .setDescription(`⏳ ${moment().diff(moment(message.createdAt), 'milliseconds')}`)
            .setColor(message.member? message.member.displayColor : [233, 91, 169]));
    }
};