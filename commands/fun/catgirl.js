const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const rp = require('request-promise');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'catgirl',
            group: 'fun',
            memberName: 'catgirl',
            description: 'Returns a random catgirl.',
            aliases: ['neko'],
            nsfw: true,
            guildOnly: true
        });
    }

    async run(message) {
        const embed = new RichEmbed();

        const options = {
            uri: 'https://nekos.moe/api/v1/random/image?count=1',
            json: true
        };

       await rp(options)
            .then(response => {
                embed.setImage('https://nekos.moe/image/' + response.images[0].id)
                    .setColor(global.BOT_DEFAULT_COLOR);
            })
            .catch(error => {
                embed.setColor('RED')
                    .addField('An error occurred', error.toString(), false)
            });

        return message.channel.send(embed);
    }
};
