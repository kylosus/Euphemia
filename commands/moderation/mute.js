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
			clientPermissions: ['MANAGE_ROLES', 'MANAGE_GUILD'],
			examples: [
				`${client.commandPrefix}mute -set <role name, or ID>`,
				`${client.commandPrefix}mute 5 @user`,
				`${client.commandPrefix}mute @user1 [@user2 @user3]`
			],
			guildOnly: true
		});
	}

	async run(message) {
		const args = message.content.split(' ');
		const input = args.slice(2).join(' ');

		if (args[1] === '-set') {
			const match = input.match(/^\d{14,}$/);

			const role = ((match, input) => {
				if (match) {
					const role = message.guild.roles.get(match[0]);
					if (role) {
						return role;
					}
				}

				const inputLow = input.toLowerCase();
				return message.guild.roles.find(role => role.name.toLowerCase().includes(inputLow)) || null;
			})(match, input);

			if (!role) {
				return message.embed(new RichEmbed()
					.setColor('RED')
					.setTitle('Role not found')
				);
			}

			if (role.position >= message.guild.me.highestRole.position) {
				return message.channel.send(new RichEmbed()
					.setColor('RED')
					.setTitle('Role cannot be assigned as the mute role because it is higher than, or equal to the bot in the role hierarchy.')
				);
			}

			message.guild.settings.set('mutedRole', role.id);

			return message.channel.send(new RichEmbed()
				.setColor('GREEN')
				.setTitle(`Mute role set to ${role.name}.`)
			);
		}

		if (!message.mentions.members.size) {
			return message.channel.send(new RichEmbed()
				.setColor('RED')
				.setTitle('Please mention members to mute')
			);
		}

		const duration = ((match) => {
			if (match) {
				return parseInt(match[0]);
			}

			return null;
		})(input.match(/\s\d+\s?/));

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
			if (member.roles.has(role.id)) {
				message.channel.send(new RichEmbed()
					.setColor('RED')
					.setDescription(`**Member ${member.toString()} is already muted**.`)
				);

				return null;
			}

			try {
				await member.addRole(role);
			} catch (error) {
				message.channel.send(new RichEmbed()
					.setColor('RED')
					.addField(`Member ${member.toString()} could not be muted.`, error.message)
				);

				return null;
			}

			guildMemberMuted(member, duration, message.member);

			// TODO: Use a database
			if (duration) {
				message.client.setTimeout((member, role, guildMemberUnmuted) => {
					member.removeRole(role).then(member => {
						// TODO: replace with Client event
						guildMemberMuted(member, duration);
						guildMemberUnmuted(member);
					});
				}, duration * 60000, member, role, guildMemberUnmuted);
			}

			return await member.toString();
		})).filter(member => member);

		if (muted.length) {
			const embed = new RichEmbed()
				.setColor('GREEN')
				.addField('Muted members', muted.join('\n'))
				.addField('Moderator', message.member.toString());

			if (duration) {
				embed.addField('Duration', `${duration} minutes`);
			}

			return message.channel.send(embed);
		}
	}
};
