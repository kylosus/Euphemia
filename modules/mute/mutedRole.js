const getMutedRole = guild => {
	const entry = guild.client.provider.get(guild, 'mutedRole', null);

	if (!entry) {
		return null;
	}

	return guild.roles.fetch(entry);
};

const setMutedRole = async (guild, role) => {
	await guild.client.provider.set(guild, 'mutedRole', role.id);
	return role;
};

const setNewMutedRole = async (guild, roleName = `${guild.client.user.username}-mute`) => {
	const role = await guild.roles.create({
		data:   {
			name:        roleName,
			position:    guild.me.roles.highest.position - 1,
			permissions: 66560 // Replace this
		},
		reason: 'Automatic muted role creation'
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

module.exports = {
	getMutedRole,
	setMutedRole,
	setNewMutedRole,
	getOrSetMutedRole
};
