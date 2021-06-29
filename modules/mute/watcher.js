const db = require('./db');

const INTERVAL = 2000;

const muteExpire = async client => {
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
};

const init = async client => {
	await muteExpire(client);
	await onMemberAdd(client);
};

module.exports = {
	init
};
