const CircularList = require('./CircularList');

const FORWARD_EMOJI = '➡';
const BACKWARD_EMOJI = '⬅';

const register = async (message, generator, args) => {
	// const firstEmbed = await generator(args[0])
	// 	.setFooter(`1/${args.length}`);

	const current = await args.current;

	const firstEmbed = await generator(current)
		.setFooter(`1/${args.length}`);

	const botMessage = await message.channel.send(firstEmbed);

	if (args.length === 1) {
		return;
	}

	// const argsList = new CircularList(args);
	const argsList = args;

	botMessage.react(BACKWARD_EMOJI).then(() => {
		botMessage.react(FORWARD_EMOJI);
	});

	// Overriding cached message entry
	botMessage.pagination = {generator, args: argsList};
};

module.exports = {
	BACKWARD_EMOJI,
	FORWARD_EMOJI,
	register
};
