// import { EmbedBuilder } from 'discord.js';

// const ONE_DAY = 86400;	// seconds

const onMemberAdd = client => {
	client.on('guildMemberAdd', async member => {
		if (!member.guild.autokick) {
			return;
		}

		// const inviteURL = await (async guild => {
		// 	if (guild.vanityURLCode) {
		// 		return `https://discord.gg/${guild.vanityURLCode}`;
		// 	}
		//
		// 	try {
		// 		// Why is there a warning here?
		// 		const invite = await guild.invites.create(guild.channels.cache.first(), {
		// 			temporary: false,
		// 			maxAge:    ONE_DAY,
		// 			maxUses:   0,	// Unlimited
		// 			unique:    false,
		// 			reason:    'Autokick invite'
		// 		});
		//
		// 		return invite.url;
		// 	} catch (err) {
		// 		return null;
		// 	}
		// })(member.guild);
		//
		// await member.send({
		// 	embeds: [new EmbedBuilder()
		// 		.setColor(Colors.DARK_RED')
		// 		.setTitle(`You have been kicked automatically from ${member.guild.name}`)
		// 		.setDescription(`
		// 			We are currently being raided.
		// 			Please join back later. Sorry for the inconvenience.
		//
		// 			${inviteURL ?? ''}
		// 		`)
		// 	]
		// });

		return await member.kick();
	});
};

export const init = client => {
	onMemberAdd(client);
};
