class Util {

	constructor() {
		throw new Error("This class may not be instantiated.");
	}

	static regExpEsc(str) {
		return str.replace(Util.REGEXPESC, "\\$&");
	}

}

Util.wait = require("util").promisify(setTimeout);

Util.REGEXPESC = /[-/\\^$*+?.()|[\]{}]/g;

module.exports = Util;
