class HanulseArticleApis {
	static async getArticle(articleId, callback) {
		const response = await HanulseAjax.get(
			"https://apis.auoi.net/v1/article",
			{
				"articleId": articleId,
			},
			HanulseAuthorizationManager.getAccessToken(),
		);
		const article = response?.data;

		/** @deprecated */
		callback(article);

		return article;
	}

	static async requestArticleList(filter, options, callback) {
		const response = await HanulseAjax.get(
			"https://apis.auoi.net/v1/article/search",
			{
				"tags": filter.tags,
				"ownerId": filter.ownerId,
				"authorId": filter.authorId,
				"pageIndex": options.pageIndex,
				"countPerPage": options.countPerPage,
			},
			HanulseAuthorizationManager.getAccessToken(),
		);
		const articleList = response?.data;

		/** @deprecated */
		callback(articleList);

		return articleList;
	}

	static async updateArticle(articleId, articleChanges, callback) {
		const accessToken = HanulseAuthorizationManager.getAccessToken();
		if (!accessToken) {
			return callback(null);
		}

		const response = await HanulseAjax.post(
			"https://apis.auoi.net/v1/article/update",
			{
				"articleId": articleId,
				"subject": articleChanges.subject,
				"content": articleChanges.content,
				"links": articleChanges.links,
				"tags": articleChanges.tags,
				"contentType": articleChanges.contentType,
				"readableTarget": articleChanges.readableTarget,
				"createdAt": articleChanges.createdAt,
			},
			HanulseAuthorizationManager.getAccessToken(),
		);
		const article = response?.data;

		/** @deprecated */
		callback(article);

		return article;
	}

	static async deleteArticle(articleId, callback) {
		const accessToken = HanulseAuthorizationManager.getAccessToken();
		if (!accessToken) {
			return callback(null);
		}

		const response = await HanulseAjax.post(
			"https://apis.auoi.net/v1/article/delete",
			{
				"articleId": articleId,
			},
			HanulseAuthorizationManager.getAccessToken(),
		);	
		const success = response?.data?.success || false;

		/** @deprecated */
		callback(success);

		return success;
	}

	static async createArticle(articleFields, callback) {
		const accessToken = HanulseAuthorizationManager.getAccessToken();
		if (!accessToken) {
			return callback(null);
		}

		const response = await HanulseAjax.post(
			"https://apis.auoi.net/v1/article/register",
			{
				"ownerId": articleFields.ownerId,
				"subject": articleFields.subject,
				"content": articleFields.content,
				"links": articleFields.links,
				"tags": articleFields.tags,
				"contentType": articleFields.contentType,
				"readableTarget": articleFields.readableTarget,
				"createdAt": articleFields.createdAt,
			},
			HanulseAuthorizationManager.getAccessToken(),
		)
		const article = response?.data;

		/** @deprecated */
		callback(article);

		return article;
	}
}