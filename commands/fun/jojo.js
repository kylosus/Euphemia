const jojo = require('./jojo.js.json');
const { Command }	= require('discord.js-commando');
const { RichEmbed }	= require('discord.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'jojo',
            group: 'fun',
            memberName: 'jojo',
            description: 'Replies with a random JoJo quote.',
            aliases: ['duwang'],
            throttling: {
                usages: 1,
                duration: 15
            }
        });
    }

   async run(message) {
        return message.embed(new RichEmbed()
            .setColor('RANDOM')
            .setTitle(jojo[Math.floor(Math.random()*jojo.length)])
        );
    }
};