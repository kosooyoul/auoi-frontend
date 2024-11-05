class HanulseBenzeneCache {
	#cache = {};

	#generateKey() {
		let key;
		do {
			key = Math.floor(Date.now() * 1000 + Math.random() * 1000).toString(16);
		} while(this.#cache[key] != null);
		return key;
	}

	asyncFunction(func, lifeTimeSecs) {
		const key = this.#generateKey();
		return async (...args) => {
			const argsKey = `${key}_${JSON.stringify(args)}`;
			if (this.#cache[argsKey]) {
				if (this.#cache[argsKey].expiresIn > Date.now()) {
					return this.#cache[argsKey].data;
				}
			}
			const data = await func.call(null, args);
			this.#cache[argsKey] = {
				data: data,
				expiresIn: Date.now() + (lifeTimeSecs || 300) * 1000,
			};
			return data;
		}
	}
}