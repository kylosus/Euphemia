export const chunk = (arr, maxLength) => {
	const res = [];

	let tmp        = [];
	let currLength = 0;

	for (const e of arr) {
		currLength += e.length;

		if (currLength > maxLength) {
			res.push(tmp);
			currLength = 0;
			tmp        = [];
		}

		tmp.push(e);
	}

	if (tmp.length) {
		res.push(tmp);
	}

	return res;
};
