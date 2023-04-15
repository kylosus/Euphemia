const BOT_ID                          = '425520602208796673';
const VOICE_CHANNEL_ID                = '293343835122171924';
const MUSIC_CHANNEL_ID                = '293342449131061248';
const PARTY_CATEGORY_ID               = '1095725848054734919';
const REGULAR_CATEGORY_ID             = '372325226010116096';
const VOICE_CHANNEL_NAME              = 'Music 🎵';
const MUSIC_CHANNEL_REGULAR_POSITION  = 2;
const PARTY_CATEGORY_PARTY_POSITION   = 2;
const PARTY_CATEGORY_REGULAR_POSITION = 10;

// Init can handle all this

let INTERVAL_ID = null;

const INTERVAL_MINUTES = 15;
const MILLISECOND      = 60 * 1000;

const voiceStateUpdate = async (oldState, newState) => {
	// Ignore bot
	if (newState.id === BOT_ID) {
		return;
	}

	// Newly joined channel
	if (newState.channel?.id === VOICE_CHANNEL_ID && !oldState.channel) {
		const voiceChannel = newState.channel;

		// Not enough members
		if (voiceChannel.members.size < 2) {
			return;
		}

		// Enough members. Move up
		const partyCategory = voiceChannel.guild.channels.cache.get(PARTY_CATEGORY_ID);
		const musicChannel  = voiceChannel.guild.channels.cache.get(MUSIC_CHANNEL_ID);

		partyCategory.setPosition(PARTY_CATEGORY_PARTY_POSITION);

		await voiceChannel.setParent(partyCategory, { lockPermissions: false });
		await musicChannel.setParent(partyCategory, { lockPermissions: false });

		// Start the count
		let currentHours = 0;

		if (INTERVAL_ID) {
			return;
		}

		INTERVAL_ID = setInterval(() => {
			currentHours += (INTERVAL_MINUTES / 60);
			currentHours = currentHours.toFixed(2);

			const timeString = (() => {
				// Less than an hour, show minutes
				if (currentHours < 1) {
					return `${currentHours * 60} minutes`;
				}

				return `${currentHours} hours`;
			})();

			voiceChannel.setName(`[${timeString}] ${VOICE_CHANNEL_NAME}`).catch(console.error);
		}, INTERVAL_MINUTES * MILLISECOND);
	}

	// Left the channel
	if (oldState.channel?.id === VOICE_CHANNEL_ID && !newState.channel) {
		const voiceChannel = oldState.channel;

		// Enough members
		if (voiceChannel.members.size > 1) {
			return;
		}

		// Not enough members. Move down
		const regularCategory = voiceChannel.guild.channels.cache.get(REGULAR_CATEGORY_ID);
		const partyCategory   = voiceChannel.guild.channels.cache.get(PARTY_CATEGORY_ID);
		const musicChannel    = voiceChannel.guild.channels.cache.get(MUSIC_CHANNEL_ID);

		await voiceChannel.setParent(regularCategory, { lockPermissions: false });
		await musicChannel.setParent(regularCategory, { lockPermissions: false });

		await musicChannel.setPosition(MUSIC_CHANNEL_REGULAR_POSITION);
		await partyCategory.setPosition(PARTY_CATEGORY_REGULAR_POSITION);

		// Stop the count
		clearInterval(INTERVAL_ID);
		INTERVAL_ID = null;

		await voiceChannel.setName(VOICE_CHANNEL_NAME);
	}
};

export const init = client => {
	// client.on('ready', ready);
	client.on('voiceStateUpdate', voiceStateUpdate);
};
