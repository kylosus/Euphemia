module.exports.replaceTokens = (string, member) => {
	return string
		.replace('$MENTION$', member.toString())
		.replace('$NAME$', member.user.tag)
		.replace('$MEMBER_COUNT$', String(member.guild.memberCount))
		.replace('$AVATAR$', member.user.avatarURL || member.user.defaultAvatarURL);
};

module.exports.countNormalizer = count => {
	switch (count % 10) {
		case 1:
			return `${count}st`;
		case 2:
			return `${count}nd`;
		case 3:
			return `${count}rd`;
		default:
			return `${count}th`;
	}
};
