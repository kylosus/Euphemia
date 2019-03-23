const EuphemiaEmbed =	require('../util/EuphemiaEmbed.js');
const moment 		=	require('moment');
const { RichEmbed }	=	require('discord.js');

module.exports = member => {
	const entry = member.client.provider.get(member.guild, 'guildMemberAdd', false);

	if (!entry) {
		return;
	}

	if (entry.message && entry.channel) {
		const message = entry.message
			.replace('$MENTION$', member.toString())
			.replace('$NAME$', member.user.tag)
			.replace('$MEMBER_COUNT$', String(member.guild.memberCount))
			.replace('$AVATAR$', member.user.avatarURL || member.user.defaultAvatarURL);

		const embed = EuphemiaEmbed.build(message);

		if (embed) {
			const channel = member.guild.channels.get(entry.channel);

			if (channel) {
				channel.send([embed.content], embed);
			}
		}
	}

	if (entry.log) {
		const channel = member.guild.channels.get(entry.log);

		if (channel) {
			channel.send(new RichEmbed()
				.setColor('BLUE')
				.setTitle('✅ User joined')
				.setThumbnail(member.user.avatarURL)
				.setDescription(`${member.toString()} \`${member.user.tag}\``)
				.addField('ID', member.id, false)
				.addField('Joined server', moment(member.joinedAt).format('DD.MM.YYYY HH.MM.SS'), true)
				.addField('Joined Discord', moment(member.user.createdAt).format('DD.MM.YYYY HH.MM.SS'), false)
				.setTimestamp(member.joinedAt)
			);

			const accountAge = moment().diff(moment(member.user.createdAt), 'days');

			if (accountAge < 30) {
				channel.send(new RichEmbed()
					.setColor('DARK_RED')
					.setDescription(`**WARNING** User ${member.toString()}'s account is less than ${accountAge === 1 ? 'day' : ((accountAge + 1) + 'days')} old`)
				);
			}
		}
	}

	if (entry.automute) {
		const mutedRole = member.client.provider.get(member.guild, 'mutedRole', false);

		if (!mutedRole) {
			const role = await member.guild.createRole({
				name: `${member.client.username}-mute`,
				position: member.guild.me.highestRole.position - 1,
				permissions: 104322113
			});

			if (entry.log) {	// What
				const channel = member.guild.channels.get(entry.log);
				if (channel) {
					channel.send(new RichEmbed()
						.setColor('BLUE')
						.setTitle(`Created new role ${role.name}`)
					);
				}

				member.client.provider.set(member.guild, 'mutedRole', role.id);
				member.addRole(role);
			}
		}

		member.addRole(mutedRole);
	}
};
