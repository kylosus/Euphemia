const { MessageEmbed, Permissions } = require('discord.js');

const ECommand = require('../../lib/ECommand');
const ArgConsts = require('../../lib/Argument/ArgumentTypeConstants');



module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['unmute'],
			description: {
				content: 'Unmutes mentioned users',
				usage: '<member1> [member2 ...]',
				examples: ['unmute @Person1', 'unmute @Person1 @Person2']
			},
			userPermissions: [Permissions.FLAGS.MANAGE_ROLES],
			clientPermissions: [Permissions.FLAGS.MANAGE_ROLES, Permissions.FLAGS.MANAGE_GUILD],
			args: [
				{
					id: 'members',
					type: ArgConsts.MEMBERS,
					message: 'Please mention members to unmute'
				}
			],
			guildOnly: true,
			nsfw: false,
			ownerOnly: false,
			rateLimited: false,
			fetchMembers: false,
			cached: false,
		});
	}

	async run(message, args) {
		const result = {p: [], f: []};

		const entry = await message.client.provider.get(message.guild, 'mutedRole');

		if (!entry) {
			// Will take care of this later
			throw 'Muted role not found';
		}

		const mutedRole = message.guild.roles.resolve(entry);

		if (!mutedRole) {
			throw 'I cannot mute. Muted role has been deleted';
		}

		await Promise.all(args.members.map(async m => {
			// Look up other roles that remove message send permissions
			if (!mutedRole.members.has(m.id)) {
				return result.f.push({member: m, reason: 'Not muted'});
			}

			try {
				await m.roles.remove(mutedRole, args.reason);
			} catch (error) {
				return result.f.push({member: m, reason: error.message});
			}

			result.p.push(m);

			this.client.emit('guildMemberUnuted', m, args.duration, message.member);
		}));

		return result;

		// const role = EuphemiaUnifiedGuildFunctions.GetMutedRole(message.guild);
		//
		// if (!role) {
		// 	return message.channel.send(new RichEmbed()
		// 		.setColor('RED')
		// 		.setTitle('Muted role not found')
		// 	);
		// }
		//
		// if (!message.mentions.members.size) {
		// 	return message.channel.send(new RichEmbed()
		// 		.setColor('RED')
		// 		.setTitle('Please mention members to unmute')
		// 	);
		// }
		//
		// // Use a database
		// const unmuted = Promise.all(message.mentions.members.map(async member => {
		// 	if (!member.roles.has(role.id)) {
		// 		message.channel.send(new RichEmbed()
		// 			.setColor('RED')
		// 			.setDescription(`**Member ${member.toString()} is not muted**`)
		// 		);
		//
		// 		return null;
		// 	}
		//
		// 	try {
		// 		await member.removeRole(role);
		// 	} catch (error) {
		// 		message.channel.send(new RichEmbed()
		// 			.setColor('RED')
		// 			.addField(`Could not unmute ${member.toString()}`, error.message)
		// 		);
		//
		// 		return null;
		// 	}
		//
		// 	guildMemberUnmuted(member);
		// 	return member.toString();
		// })).filter(member => member);
		//
		// return message.channel.send(new RichEmbed()
		// 	.setColor('GREEN')
		// 	.addField('Unmuted members', unmuted.join('\n'))
		// 	.addField('Moderator', message.member.toString())
		// );
	}

	async ship(message, result) {
		const color = ((res) => {
			if (!res.f.length) {
				return 'GREEN';
			}

			if (res.p.length) {
				return 'ORANGE';
			}

			return 'RED';
		})(result);

		const embed = new MessageEmbed()
			.setColor(color);

		if (result.p.length) {
			embed.addField('Unmuted', result.p.map(p => p.toString()).join(' '));
		}

		if (result.f.length) {
			embed.addField('Failed', result.f.map(f => `${f.member.toString()} - ${f.reason}`).join('\n'));
		}

		return message.channel.send(embed);
	}
};
