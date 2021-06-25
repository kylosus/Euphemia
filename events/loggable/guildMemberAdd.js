const { MessageEmbed }	= require('discord.js');
const moment			= require('moment');

const { replaceTokens }	= require('../util');

module.exports = member => {
	(entry => {
		if (!entry.channel || !entry.message) {
			return;
		}

		const channel = member.guild.channels.resolve(entry.channel);

		if (!channel) {
			return;
		}

		return channel.send(
			replaceTokens(entry.message.content),
			new MessageEmbed(replaceTokens(entry.message.embed))
		);
	})(member.client.provider.get(member.guild, 'welcome', {channel: null, message: null}));

	(entry => {
		if (!entry.guildMemberAdd) {
			return;
		}

		const channel = member.guild.channels.resolve(entry.guildMemberAdd);

		if (!channel) {
			return;
		}

		channel.send(new MessageEmbed()
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
			return channel.send(new MessageEmbed()
				.setColor('DARK_RED')
				.setDescription(`**WARNING** User ${member.toString()}'s account is less than ${accountAge === 1 ? 'day' : ((accountAge + 1) + 'days')} old`)
			);
		}
	})(member.client.provider.get(member.guild, 'log', {guildMemberAdd: null}));

	// eslint-disable-next-line no-unused-vars
	(entry => {
		// if (!entry) {
		//
		// }
	})(member.client.provider.get(member.guild, 'automute', false));


	// soon

	// const mutedRole = member.client.provider.get(member.guild, 'mutedRole', false);

	// if (!mutedRole) {
	// 	const role = await member.guild.createRole({
	// 		name: `${member.client.username}-mute`,
	// 		position: member.guild.me.highestRole.position - 1,
	// 		permissions: 104322113
	// 	});
	//
	// 	if (entry.log) {	// What
	// 		const channel = member.guild.channels.get(entry.log);
	// 		if (channel) {
	// 			channel.send(new RichEmbed()
	// 				.setColor('BLUE')
	// 				.setTitle(`Created new role ${role.name}`)
	// 			);
	// 		}
	//
	// 		member.client.provider.set(member.guild, 'mutedRole', role.id);
	// 		member.addRole(role);
	// 	}
	// }
	//
	// member.addRole(mutedRole);
};


