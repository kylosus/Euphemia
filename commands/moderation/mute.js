const { Command }					= require('discord.js-commando');
const { RichEmbed }					= require('discord.js');
const guildMemberMuted				= require('../../events/guildMemberMuted');
const guildMemberUnmuted			= require('../../events/guildMemberUnmuted');
const EuphemiaUnifiedGuildFunctions	= require('../../util/EuphemiaUnifiedGuildFunctions.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            group: 'moderation',
            memberName: 'mute',
            description: 'Mutes mentioned users for a given amount of minutes',
            userPermissions: ['MANAGE_ROLES'],
            examples: [`${client.commandPrefix}mute 5 @user`, `${client.commandPrefix}mute @user1 @user2 @user3]`],
            guildOnly: true
        });
    }

   async run(message) {
        const args = message.content.split(' ');
        if (args[1] === 'set') {
            const input = message.content.substring(10);
            const role =  message.guild.roles.find(val => val.name == input);
            if (role) {
                return setRole(message, this.client.provider, message.guild, role);
            } else if (/^\d+$/.test(args[1])) {
                const role =  message.guild.roles.find(val => val.id === args[1]);
                if (role) {
                    return setRole(message, message.client.provider, message.guild, role);
                }
            } else {
                return message.embed(new RichEmbed()
                    .setColor('ORANGE')
                    .setTitle('Role not found')
                );
            }
        } else if (!message.mentions.members.size) {
            return message.embed(new RichEmbed()
                .setColor('ORANGE')
                .setTitle('Please mention members to mute')
            );
        } else {
            let timeout;
            if (/^\d+$/.test(args[1])) {
                timeout = parseInt(args[1]);
            }
            const role = checkAndCreateRole(message);
            const body = `has been muted` + (timeout? ` for ${timeout} minutes` : ``);
            message.mentions.members.tap(member => {
                if (member.roles.has(role.id)) {
                    return message.embed(new RichEmbed()
                        .setColor('ORANGE')
                        .setDescription(`**Member ${member.toString()} is already muted**.`)
                    )
                }
            });
        }
    }
};

function setRole(message, provider, guild, role) {
    if (role.position >= guild.me.highestRole.position) {
        return message.channel.send(new RichEmbed()
            .setColor('ORANGE')
            .setTitle('Role cannot be assigned as the mute role because it is higher than, or equal to the bot in the hierarchy.')
        );
    }
    provider.set(guild, 'mutedRole', role.id);
    return message.channel.send(new RichEmbed()
        .setColor('GREEN')
        .setTitle(`Mute role set to ${role.name}.`)
    );
};
			const match = input.match(/^\d{14,}$/);
		const [error, role, created] = await (async (guild) => {
			const role = await EuphemiaUnifiedGuildFunctions.GetMutedRole(guild);

			if (!role) {
				return EuphemiaUnifiedGuildFunctions.FindOrSetMutedRole(guild);
			}

			return [null, role];
		})(message.guild);

		if (error) {
			return message.channel.send(new RichEmbed()
				.setColor('RED')
				.addField('Muted role does not exist and could not be created.',
					`Please set it manually using ${message.guild.commandPrefix}${this.name} -set <role name, or ID>`
				)
				.addField('Reasont', error.message)
			);
		}

		if (created) {
			message.channel.send(new RichEmbed()
				.setColor('BLUE')
				.setTitle(`Created new muted role ${role.name}.`)
			);
		}
		const muted = await Promise.all(message.mentions.members.map(async member => {
			try {
				await member.addRole(role);
			} catch (error) {
				message.channel.send(new RichEmbed()
					.setColor('RED')
					.addField(`Member ${member.toString()} could not be muted.`, error.message)
				);

				return null;
			}
			// TODO: Use a database
						// TODO: replace with Client event
};
