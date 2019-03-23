const { Command }	= require('discord.js-commando');
const { RichEmbed }	= require('discord.js');
const pjson			= require('../../package.json');
let cache;

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            group: 'bot',
            memberName: 'help',
            description: 'Lists available commands',
            examples: [`${client.commandPrefix}help`, `${client.commandPrefix}help ping`]
        });
    }

    async run(message) {

        const args = message.content.split(' ');
        if (args.length === 1) {

            if (cache) {
                return message.channel.send(cache)
            } else {

                const embed = new RichEmbed()
                    .setTitle(`${message.client.user.username} commands`)
                    .setThumbnail(message.client.user.avatarURL || message.client.user.defaultAvatarURL)
                    .setColor(global.BOT_DEFAULT_COLOR)
                    .addBlankField()
                    .setFooter(`♥ Made with love by ${packageJSON.author}`);

                this.client.registry.groups.forEach(group => {
                    embed.addField(group.name, group.commands.map(command => `**${command.name}**: ${command.description}`).join('\n'));
                    embed.addBlankField();
                });

                cache = embed;
                return message.channel.send(cache);
            }

        } else {

            const result = message.client.registry.commands.get(args[1]);
            if (!result) {
                return message.channel.send(new RichEmbed()
                    .setColor('RED')
                    .setTitle('Command not found')
                );
            } else {
                const embed = new RichEmbed()
                    .setTitle(`Command name: ${result.name}`)
                    .setThumbnail(message.client.user.avatarURL || message.client.user.defaultAvatarURL)
                    .setColor(global.BOT_DEFAULT_COLOR)
                    .setDescription(result.description);

                if (result.aliases.length > 0) {
                    embed.addField('Aliases', result.aliases.join('\n'), false)
                }
                if (result.examples) {
                    embed.addField('Examples', '```' + result.examples.join('\n') + '```', false);
                }

                return message.channel.send(embed);
            }
        }
    }
}
