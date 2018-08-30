const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const rp = require('request-promise');
const uri = 'https://nekos.moe/api/v1/random/image?count=1&nsfw='

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'catgirl',
            group: 'fun',
            memberName: 'catgirl',
            description: 'Returns a random catgirl.',
            aliases: ['neko'],
            guildOnly: true
        });
    }

    async run(message) {
        const embed = new RichEmbed();

        const options = {
            uri: `${uri}${message.channel.nsfw}`,
            json: true
        };

       await rp(options)
            .then(response => {
                embed.setImage('https://nekos.moe/image/' + response.images[0].id)
                    .setColor(message.member.displayColor);
            })
            .catch(error => {
                embed.setColor('RED')
                    .addField('An error occurred', error.toString(), false)
            });

        return message.channel.send(embed);
    }
};
