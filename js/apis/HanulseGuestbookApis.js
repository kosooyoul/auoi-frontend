class HanulseGuestbookApis {
	constructor() {

	}

	static getGuestbook(guestbookId, callback) {
		const accessToken = HanulseAuthorizationManager.getAccessToken();

		$.get({
			"url": "https://apis.auoi.net/v1/guestbook",
			"dataType": "json",
			"data": {
				"guestbookId": guestbookId,
			},
			"headers": {
				"authorization": accessToken,
			},
			"success": (response) => {
				const guestbook = response && response.data;
	
				callback(guestbook);
			},
			"error": () => {
				callback(null);
			},
		});
	}

	static requestGuestbookList(filter, options) {
		const accessToken = HanulseAuthorizationManager.getAccessToken();

		$.get({
			"url": "https://apis.auoi.net/v1/guestbook/search",
			"dataType": "json",
			"data": {
				"ownerId": filter.ownerId,
				"pageIndex": options.pageIndex,
				"countPerPage": options.countPerPage,
			},
			"headers": {
				"authorization": accessToken,
			},
			"success": (response) => {
				const guestbookList = response && response.data;

				callback(guestbookList);
			},
			"error": () => {
				callback(null);
			},
		});
	}

	static updateGuestbook(guestbookId, guestbookChanges, callback) {
		const accessToken = HanulseAuthorizationManager.getAccessToken();
		if (!accessToken) {
			return callback(null);
		}

		$.post({
			"url": "https://apis.auoi.net/v1/guestbook/update",
			"dataType": "json",
			"data": {
				"guestbookId": guestbookId,
				"content": guestbookChanges.content,
				"createdAt": guestbookChanges.createdAt,
			},
			"headers": {
				"authorization": accessToken,
			},
			"success": (response) => {
				const guestbook = response && response.data;

				callback(guestbook);
			},
			"error": () => {
				callback(null);
			},
		});
	}

	static deleteGuestbook(guestbookId, callback) {
		const accessToken = HanulseAuthorizationManager.getAccessToken();
		if (!accessToken) {
			return callback(null);
		}

		$.post({
			"url": "https://apis.auoi.net/v1/guestbook/delete",
			"dataType": "json",
			"data": {
				"guestbookId": guestbookId,
			},
			"headers": {
				"authorization": accessToken,
			},
			"success": (response) => {
				const result = response && response.data;

				callback(result && result.success);
			},
			"error": () => {
				callback(null);
			},
		});
	}

	static createGuestbook(guestbookFields, callback) {
		const accessToken = HanulseAuthorizationManager.getAccessToken();
		if (!accessToken) {
			return callback(null);
		}

		$.post({
			"url": "https://apis.auoi.net/v1/guestbook/register",
			"dataType": "json",
			"data": {
				"ownerId": guestbookFields.ownerId,
				"content": guestbookFields.content,
				"createdAt": guestbookFields.createdAt,
			},
			"headers": {
				"authorization": accessToken,
			},
			"success": (response) => {
				const result = response && response.data;

				callback(result);
			},
			"error": () => {
				callback(null);
			},
		});
	}
}