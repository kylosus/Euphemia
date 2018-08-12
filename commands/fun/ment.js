const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const ment = require('./ment.js.json');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'ment',
            group: 'fun',
            memberName: 'ment',
            description: 'Replies with a random MENT dialogue.',
            throttling: {
                usages: 1,
                duration: 15
            }
        });
    }

   async run(message) {
        return message.embed(new RichEmbed()
            .setColor('RANDOM')
            .setTitle(ment[Math.floor(Math.random()*ment.length)])
        );
    }
};