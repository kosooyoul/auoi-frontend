class HanulseArticleApis {
	constructor() {

	}

	static getArticle(articleId, callback) {
		const accessToken = HanulseAuthorizationManager.getAccessToken();

		$.get({
			"url": "https://apis.auoi.net/v1/article",
			"dataType": "json",
			"data": {
				"articleId": articleId,
			},
			"headers": {
				"authorization": accessToken,
			},
			"success": (response) => {
				const article = response && response.data;
	
				callback(article);
			},
			"error": () => {
				callback(null);
			}
		});
	}

	static updateArticle(articleId, articleChanges, callback) {
		const accessToken = HanulseAuthorizationManager.getAccessToken();
		if (!accessToken) {
			return callback(null);
		}

		$.post({
			"url": "https://apis.auoi.net/v1/article/update",
			"dataType": "json",
			"data": {
				"articleId": articleId,
				"subject": articleChanges.subject,
				"content": articleChanges.content,
				"links": articleChanges.links,
				"tags": articleChanges.tags,
				"contentType": articleChanges.contentType,
				"readableTarget": articleChanges.readableTarget,
				"createdAt": articleChanges.createdAt,
			},
			"headers": {
				"authorization": accessToken,
			},
			"success": (response) => {
				const article = response && response.data;

				callback(article);
			},
			"error": () => {
				callback(null);
			},
		});
	}

	static deleteArticle(articleId, callback) {
		const accessToken = HanulseAuthorizationManager.getAccessToken();
		if (!accessToken) {
			return callback(null);
		}

		$.post({
			"url": "https://apis.auoi.net/v1/article/delete",
			"dataType": "json",
			"data": {
				"articleId": articleId,
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

	static createArticle(articleFields, callback) {
		const accessToken = HanulseAuthorizationManager.getAccessToken();
		if (!accessToken) {
			return callback(null);
		}

		$.post({
			"url": "https://apis.auoi.net/v1/article/register",
			"dataType": "json",
			"data": {
				"subject": articleFields.subject,
				"content": articleFields.content,
				"links": articleFields.links,
				"tags": articleFields.tags,
				"contentType": articleFields.contentType,
				"readableTarget": articleFields.readableTarget,
				"createdAt": articleFields.createdAt,
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