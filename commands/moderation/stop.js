const {MessageEmbed, Permissions} = require('discord.js');

const ECommand = require('../../lib/ECommand');
const ArgConsts = require('../../lib/Argument/ArgumentTypeConstants');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['stop'],
			description: {
				content: 'Denies Send Message permissions for @everyone in specified channels.',
				usage: '[#channel]',
				examples: ['stop', 'stop #channel'],
			},
			userPermissions: [Permissions.FLAGS.MANAGE_ROLES],
			clientPermissions: [Permissions.FLAGS.MANAGE_ROLES],
			args: [
				{
					id: 'channels',
					type: ArgConsts.CHANNELS,
					optional: true,
					default: m => [m.channel]
				},
				{
					id: 'toggle',
					type: ArgConsts.WORD,
					optional: true,
					default: () => 'on'
				},
				{
					id: 'reason',
					type: ArgConsts.TEXT,
					optional: true,
					default: () => null
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
		const toggle = args.toggle !== 'on';
		const result = {p: [], f: [], toggle};

		await Promise.all(args.channels.map(async c => {
			try {
				await c.updateOverwrite(message.guild.id, {SEND_MESSAGES: toggle});
			} catch (err) {
				return result.f.push({channel: c, reason: err.message || 'Unknown error'});
			}

			result.p.push(c);
		}));
		
		return result;

		// if (arg.toLowerCase().startsWith('off')) {
		// 	await message.channel.overwritePermissions(everyone, { 'SEND_MESSAGES': true });
		//
		// 	return message.channel.send(new RichEmbed()
		// 		.setColor('GREEN')
		// 		.setTitle('Channel unlocked')
		// 	);
		// }
		//
		// const channel = await message.channel.overwritePermissions(everyone, { 'SEND_MESSAGES': false }, 'Euphemia stop command');
		//
		// // TODO: TRY-CATCH THIS
		// await channel.overwritePermissions(
		// 	message.member.roles
		// 		.filter(role => role.hasPermission('MANAGE_GUILD'))
		// 		.first() || message.author, { 'SEND_MESSAGES': true }, 'Euphemia stop command'
		// );
		//
		// return channel.send(new RichEmbed()
		// 	.setColor('RED')
		// 	.setTitle('Channel locked down')
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
			embed.addField(`${result.toggle ? 'Allowed' : 'Denied'} message sending permissions in`,
				result.p.map(p => p.toString()).join(' '));
		}

		if (result.f.length) {
			embed.addField('Failed', result.f.map(f => `${f.channel.toString()} - ${f.reason}`).join('\n'));
		}

		return message.channel.send(embed);
	}
};
