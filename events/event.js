const botEventHandler 		= event => require(`./bot/${event}`);
const serverEventHandler	= event => require(`../events/${event}`);

module.exports = client => {
	client.on('ready', () => botEventHandler('ready')(client));
	client.on('error', error => botEventHandler('error')(error));
	client.on('reconnecting', () => botEventHandler('reconnecting'));
	client.on('disconnect', event => botEventHandler('disconnect')(event));
	client.on('guildCreate', guild => botEventHandler('guildCreate')(guild));
	client.on('guildMemberAdd', member => serverEventHandler('guildMemberAdd')(member));
	client.on('guildMemberRemove', member => serverEventHandler('guildMemberRemove')(member, client));
	client.on('guildMemberUpdate', (oldMember, newMember) => serverEventHandler('guildMemberUpdate')(oldMember, newMember, client));
	client.on('guildBanAdd', (guild, user) => serverEventHandler('guildBanAdd')(guild, user));
	client.on('guildBanRemove', (guild, user) => serverEventHandler('guildBanRemove')(guild, user));
	client.on('messageDelete', message => serverEventHandler('messageDelete')(message));
	client.on('messageUpdate', (oldMessage, newMessage) => serverEventHandler('messageUpdate')(oldMessage, newMessage));
	client.on('userUpdate', (oldUser, newUser) => serverEventHandler('userUpdate')(oldUser, newUser));
	client.on('message', botEventHandler('message'));
	client.on('commandRun', () => client.messageStats.commands++);
	client.on('commandBlocked', (message, reason) => botEventHandler('commandBlocked')(message, reason));
};
