export const fixConstant = s => {
	return (s.charAt(0) + s.slice(1).toLowerCase()).replace('/_/g', ' ');
};

export const capitalize = s => {
	return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};
