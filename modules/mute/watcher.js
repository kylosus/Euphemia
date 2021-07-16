const db = require('./db');

const INTERVAL = 60000;	// 1 minute

const muteExpire = client => {
	client.setInterval(async () => {
		const result = await db.getExpired();

		await Promise.all(result.map(async r => {
			db.remove(r.guild, r.member).then();

			const guild = client.guilds.cache.get(r.guild);

			if (!guild) {
				return;
			}

			const member = await guild.members.fetch(r.member);

			if (!member) {
				return;
			}

			const mutedRole = member.roles.cache.get(r.mutedRole);

			if (!mutedRole) {
				return;
			}

			await member.roles.remove(mutedRole, 'Mute expired');

			client.emit('muteExpired', member);
		}));
	}, INTERVAL);
};

const onMemberAdd = async client => {
	client.on('guildMemberAdd', async m => {
		const result = await db.getMutedRoleIfNotExpired(m.id);

		if (!result) {
			return;
		}

		try {
			await m.roles.add(result.mutedRole);
			client.emit('guildMemberMuted', m, result.expires, 'Unexpired automute on member join');
		} catch (err) {
			client.emit('notice', `idk man ${err.message}`);
		}
	});
};

const init = async client => {
	client.once('ready', () => muteExpire(client));
	await onMemberAdd(client);
};

module.exports = {
	init
};
