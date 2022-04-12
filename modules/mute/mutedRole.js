import { Permissions } from 'discord.js';

const getMutedRole = guild => {
	const entry = guild.client.provider.get(guild, 'mutedRole', null);

	if (!entry) {
		return null;
	}

	return guild.roles.fetch(entry);
};

const setMutedRole = async (guild, role) => {
	// TODO: update channel overrides
	await guild.client.provider.set(guild, 'mutedRole', role.id);
	return role;
};

const setNewMutedRole = async (guild, roleName = `${guild.client.user.username}-mute`) => {
	const permissions = new Permissions(Permissions.DEFAULT);
	permissions.remove(Permissions.FLAGS.SEND_MESSAGES);
	permissions.remove(Permissions.FLAGS.SEND_MESSAGES_IN_THREADS);

	const role = await guild.roles.create({
		name:     roleName,
		position: guild.me.roles.highest.position - 1,
		permissions,
		reason:   'Automatic muted role creation'
	});

	return setMutedRole(guild, role);
};

const getOrSetMutedRole = async (guild /*, roleName = `${guild.client.user.username}-mute` */) => {
	const role = await getMutedRole(guild);

	if (!role) {
		return setNewMutedRole(guild);
	}

	return role;
};

export {
	getMutedRole,
	setMutedRole,
	setNewMutedRole,
	getOrSetMutedRole
};
