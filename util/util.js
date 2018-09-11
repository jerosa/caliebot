class Util {

	constructor() {
		throw new Error("This class may not be instantiated.");
	}

	static regExpEsc(str) {
		return str.replace(Util.REGEXPESC, "\\$&");
	}

	static randomInt(max, min) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

}

Util.wait = require("util").promisify(setTimeout);

Util.REGEXPESC = /[-/\\^$*+?.()|[\]{}]/g;

module.exports = Util;
