const { MessageEmbed, Permissions } = require('discord.js');

const ECommand = require('../../lib/ECommand');
const ArgConsts = require('../../lib/Argument/ArgumentTypeConstants');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['ban', 'b'],
			description: {
				content: 'Bans a member.',
				usage: '<member> [reason]',
				examples: ['ban @user', 'ban 275331662865367040'],
			},
			userPermissions: [Permissions.FLAGS.BAN_MEMBERS],
			clientPermissions: [Permissions.FLAGS.BAN_MEMBERS],
			args: [
				{
					id: 'ids',
					type: ArgConsts.IDS,
					message: 'Please mention users to ban'
				},
				{
					id: 'reason',
					type: ArgConsts.TEXT,
					optional: true,
					default: () => 'No reason provided'
				},
			],
			guildOnly: true,
			nsfw: false,
			ownerOnly: false,
			rateLimited: false,
			fetchMembers: false,
			cached: false
		});
	}

	async run(message, args) {
		const result = {p: [], f: [], reason: args.reason};

		await Promise.all(args.ids.map(async id => {
			const member = message.guild.members.resolve(id);

			if (member && !member.bannable) {
				return result.f.push({id, reason: 'Member too high in the hierarchy'});
			}

			try {
				await message.guild.members.ban(id,{
					days: 0,
					reason: args.reason
				});
			} catch (err) {
				return result.f.push({id, reason: err.message || 'Unknown error'});
			}

			result.p.push(id);
		}));

		return result;
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

		return message.channel.send(new MessageEmbed()
			.setColor(color)
			.addField('Banned', result.p.map(p => `<@${p}>`).join(' ') || '~')
			.addField('Failed', result.f.map(p => `<@${p.id}> - ${p.reason}`).join('\n') || '~')
			.addField('Moderator', message.member.toString(), true)
			.addField('Reason', result.reason || '~', true)
		);
	}
};
