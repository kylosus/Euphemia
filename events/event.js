const botEventHandler 		= event => require(`./bot/${event}`);
const serverEventHandler	= event => require(`./loggable/${event}`);

// const botEventHandler = () => (() => {});

module.exports = client => {
	client.on('ready',				()		=> botEventHandler('ready')(client));
	client.on('error',				(e)		=> botEventHandler('error')(e));
	client.on('reconnecting',		()		=> botEventHandler('reconnecting'));
	client.on('disconnect',			(e)		=> botEventHandler('disconnect')(e));
	client.on('guildCreate',		(g)		=> botEventHandler('guildCreate')(g));
	client.on('guildMemberAdd',		(m)		=> serverEventHandler('guildMemberAdd')(m));
	client.on('guildMemberRemove',	(m)		=> serverEventHandler('guildMemberRemove')(m));
	client.on('guildMemberUpdate',	(o, n)	=> serverEventHandler('guildMemberUpdate')(o, n));
	client.on('guildBanAdd',		(g, u)	=> serverEventHandler('guildBanAdd')(g, u));
	client.on('guildBanRemove',		(g, u)	=> serverEventHandler('guildBanRemove')(g, u));
	client.on('messageDelete',		(m)		=> serverEventHandler('messageDelete')(m));
	client.on('messageUpdate',		(o, n)	=> serverEventHandler('messageUpdate')(o, n));
	client.on('userUpdate',			(o, n)	=> serverEventHandler('userUpdate')(o, n));
	// client.on('commandRun',			()		=> client.messageStats.commands++);
	// client.on('commandBlocked',	(m, r)	=> botEventHandler('commandBlocked')(m, r));
	client.on('message',					   (botEventHandler('message')));
};
