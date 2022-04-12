import { getExpired, remove, getMutedRoleIfNotExpired } from './db.js';

const INTERVAL = 60000;	// 1 minute

const muteExpire = client => {
	client.setInterval(async () => {
		const result = await getExpired();

		await Promise.all(result.map(async r => {
			remove(r.guild, r.member);

			const guild = client.guilds.cache.get(r.guild);

			if (!guild) {
				return;
			}

			const member = await guild.members.fetch(r.member).catch(() => null);

			if (!member) {
				return;
			}

			const mutedRole = member.roles.cache.get(r.mutedRole);

			if (!mutedRole) {
				return;
			}

			await member.roles.remove(mutedRole, 'Mute expired').catch(console.error);
		}));
	}, INTERVAL);
};

const onMemberAdd = async client => {
	client.on('guildMemberAdd', async m => {
		const result = await getMutedRoleIfNotExpired(m.id);

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

export {
	init
};
