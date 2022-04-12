import { getMutedRole } from '../mute/index.js';

const onMemberAdd = client => {
	client.on('guildMemberAdd', async member => {
		const entry = member.client.provider.get(member.guild, 'lockdown', false);

		if (!entry) {
			return;
		}

		const role = await mutedRole.getMutedRole(member.guild);

		if (!role) {
			return;
		}

		await member.roles.add(role).catch(err => client.emit('error', err));
	});
};

export const init = client => {
	onMemberAdd(client);
};
