class HanulseCommonApis {
	constructor() {

	}

	static getVisitCounts(callback) {
		const token = localStorage.getItem("token");
		const timeDifferenceHours = -new Date().getTimezoneOffset() / 60;

		$.post({
			"url": "https://apis.auoi.net/v1/visit",
			"dataType": "json",
			"data": {
				"token": token,
				"timeOffsetHours": timeDifferenceHours,
			},
			"success": function(response) {
				const data = response && response.data;

				callback(data);
			},
			"error": () => {
				callback(null);
			},
		});
	}

	static getWisesaying(callback) {
		$.get({
			"url": "https://apis.auoi.net/v1/wisesaying",
			"dataType": "json",
			"success": function(response) {
				const wisesaying = response && response.data;
	
				callback(wisesaying);
			},
			"error": () => {
				callback(null);
			},
		});
	}

	static getArea(name, callback) {
		console.log("Load area: " + name);

		const timeForCache = parseInt(Date.now() / 1000 / 60 / 60 / 24);

		$.ajax({
			"url": "./data/" + name + ".json?ts=" + timeForCache,
			"dataType": "json",
			"success": (data) => {
				callback(data);
			},
			"error": () => {
				console.log("Failed loading area: " + name);

				this.getArea("404", callback);
			}
		});
	}
}