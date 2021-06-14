const fixConstant = s => {
	return (s.charAt(0) + s.slice(1).toLowerCase()).replace('/_/g', ' ');
};

module.exports = {
	fixConstant,
};
