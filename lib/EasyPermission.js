// DO NOT USE FOR ANYTHING OTHER THAN GETTING A NICE STRING
export const PermissionsBitField = [
	'Administrator',
	'Create Instant Invites',
	'Kick Members',
	'Ban Members',
	'Manage Channels',
	'Manage Guild',
	'Add Reactions',
	'View Audit Log',
	'Priority Speaker',
	'Stream',
	'View Channel',
	'Send Messages',
	'Send TTS Messages',
	'Manage Messages',
	'Embed Links',
	'Attach Files',
	'Read Message History',
	'Mention Everyone',
	'Use External Emojis',
	'View Guild Insights',
	'Connect',
	'Speak',
	'Mute Members',
	'Deafen Members',
	'Move',
	'Use Voice Activity Detection',
	'Change Nickname',
	'Manage Nicknames',
	'Manage Roles',
	'Manage Webhooks',
	'Manage Emojis'
];

export const resolveOne  = index => PermissionsBitField[index];
export const resolveMany = index => index.map(i => PermissionsBitField[i]);
