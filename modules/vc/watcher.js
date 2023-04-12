const BOT_ID     = '425520602208796673';
const GUILD_ID   = '292277485310312448';
const CHANNEL_ID = '293343835122171924';

const INTERVAL_MINUTES = 15;
const MILLISECOND      = 60 * 1000;

// const ready = client => {
// 	const guild   = client.guilds.cache.get(GUILD_ID);
// 	const channel = guild.channels.cache.get(CHANNEL_ID);
//
// 	const channelNameBase = channel.name;
//
// 	let currentHours = 0;
//
// 	let intervalID = null;
//
// 	intervalID = setInterval((function setName() {
// 		// Check if the bot is the only member
// 		if (channel.members.size < 2) {
// 			if (!intervalID) {
// 				return setName;
// 			}
//
// 			if (channel.members.has(BOT_ID)) {
// 				clearInterval(intervalID);
// 				return;
// 			}
// 		}
//
// 		channel.setName(`[${currentHours} hours] ${channelNameBase}`).catch(console.error);
// 		currentHours += INTERVAL_MINUTES / 60;
//
// 		return setName;
// 	})(), INTERVAL_MINUTES * MILLISECOND);
// };

const voiceStateUpdate = (oldState, newState) => {
	// Ignore bot
	if (newState.id === BOT_ID) {
		return;
	}

	// Newly joined channel
	if (newState.channel?.id === CHANNEL_ID && !oldState.channel) {
		return;
	}


	// Left the channel
	if (oldState.channel?.id === CHANNEL_ID && !newState.channel) {

	}
};

export const init = client => {
	// client.on('ready', ready);
	client.on('voiceStateUpdate', voiceStateUpdate);
};
