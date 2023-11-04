class HanulseCommonApis {
	static async getVisitCounts(callback) {
		const token = globalThis.localStorage.getItem("token");
		const timeDifferenceHours = -new Date().getTimezoneOffset() / 60;

		const response = await HanulseAjax.post(
			"https://apis.auoi.net/v1/visit",
			{
				"token": token,
				"timeOffsetHours": timeDifferenceHours,
			},
		);
		const visitCounts = response?.data;

		/** @deprecated */
		callback(visitCounts);

		return visitCounts;
	}

	static async getWisesaying(callback) {
		const response = await HanulseAjax.get(
			"https://apis.auoi.net/v1/wisesaying",
		);
		const wisesaying = response?.data;

		/** @deprecated */
		callback(wisesaying);

		return wisesaying;
	}

	static async getArea(name, callback) {
		const timeForCache = parseInt(Date.now() / 1000 / 60 / 60 / 24);
		let area;
	
		console.log("Load area: " + name);
		area = await HanulseAjax.get(
			"./data/" + name + ".json",
			{
				"ts": timeForCache
			},
		);

		if (area == null) {
			console.log("Failed loading area: " + name);
			area = await HanulseAjax.get(
				"./data/404.json",
				{
					"ts": timeForCache
				},
			);
		}

		/** @deprecated */
		callback(area);

		return area;
	}
}