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
}