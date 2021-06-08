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

	async run(message, args) {
		// const args = message.content.split(' ');
		// const arg = args.slice(2).join(' ');

		if (args.split(' ')[1] === '-set') {
			// Look for id
			const match = args.match(/^\d{7,}$/);

			const role = ((match, input) => {
				if (match) {
					const role = message.guild.roles.get(match[0]);
					if (role) {
						return role;
					}
				}

				// Look for role name
				const inputLow = input.toLowerCase();
				return message.guild.roles.find(role => role.name.toLowerCase().includes(inputLow)) || null;
			})(match, args);

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

		// const members = args.match(/\d{7,}/g);
		// if (!members.length) {
		// 	return message.channel.send(new RichEmbed()
		// 		.setColor('RED')
		// 		.setTitle('Please mention members to mute')
		// 	);
		// }

		const members = ((match) => {
			if (!match) {
				return message.channel.send(new RichEmbed()
					.setColor('RED')
					.setTitle('Please mention members to mute')
				);
			}

			return match.map(m =>message.guild.members.get(m)).filter(m => m);
		})(args.match(/\d{7,}/g));

		const duration = ((match) => {
			if (!match) {
				return null;
			}

			return parseInt(match[0]);
		})(args.match(/\d{1,3}/));

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
				.addField('Reason', error.message)
			);
		}

		if (created) {
			message.channel.send(new RichEmbed()
				.setColor('BLUE')
				.setTitle(`Created new muted role ${role.name}.`)
			);
		}

		const muted = await Promise.all(members.map(async member => {
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
					.addField(`Member ${member.user.tag} could not be muted.`, error.message)
				);

				// This doesn't return properly and breaks
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
		}).filter(m => m));

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
