// exports.FindOrSetMutedRole = async (guild, roleName = `${guild.client.user.username}-mute`) => {
// 	const role = guild.roles.find(r => r.name === roleName);
//
// 	if (role) {
// 		return [null, role];
// 	}
//
// 	try {
// 		const role = await guild.createRole({
// 			name: roleName,
// 			position: guild.me.highestRole.position - 1,
// 			permissions: 66560
// 		});
//
// 		guild.settings.set('mutedRole', role.id);
// 		return [null, role, true];
// 	} catch (error) {
// 		return [error, null];
// 	}
// };

// exports.GetMutedRole = async guild => {
// 	const entry = await guild.settings.get('mutedRole', false);
//
// 	if (!entry) {
// 		return null;
// 	}
//
// 	return guild.roles.get(entry);
// };