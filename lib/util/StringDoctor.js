const fixConstant = s => {
	return (s.charAt(0) + s.slice(1).toLowerCase()).replace('/_/g', ' ');
};

const capitalize = s => {
	return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

const wrap = s => {
	return '`' + s + '`';
};

module.exports = {
	fixConstant,
	capitalize,
	wrap
};
