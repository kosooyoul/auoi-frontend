class HanulseGuestbookApis {
	static async getGuestbook(guestbookId, callback) {
		const response = await HanulseAjax.get(
			`https://apis.auoi.net/v1/guestbooks/${guestbookId}`,
			{},
			HanulseAuthorizationManager.getAccessToken(),
		);
		const guestbook = response?.data;

		/** @deprecated */
		callback?.(guestbook);

		return guestbook;
	}

	static async requestGuestbookList(filter, options, callback) {
		const response = await HanulseAjax.get(
			"https://apis.auoi.net/v1/guestbooks/list",
			{
				"ownerId": filter.ownerId,
				"pageIndex": options.pageIndex,
				"countPerPage": options.countPerPage,
			},
			HanulseAuthorizationManager.getAccessToken(),
		);
		const guestbookList = response?.data;

		/** @deprecated */
		callback?.(guestbookList);

		return guestbookList;
	}

	static async updateGuestbook(guestbookId, guestbookChanges, callback) {
		const accessToken = HanulseAuthorizationManager.getAccessToken();
		if (!accessToken) {
			return callback?.(null);
		}

		const response = await HanulseAjax.patch(
			`https://apis.auoi.net/v1/guestbooks/${guestbookId}`,
			{
				"content": guestbookChanges.content,
				"createdAt": guestbookChanges.createdAt,
			},
			HanulseAuthorizationManager.getAccessToken(),
		);
		const guestbook = response?.data;

		/** @deprecated */
		callback?.(guestbook);

		return guestbook;
	}

	static async deleteGuestbook(guestbookId, callback) {
		const accessToken = HanulseAuthorizationManager.getAccessToken();
		if (!accessToken) {
			return callback?.(null);
		}

		const response = await HanulseAjax.delete(
			`https://apis.auoi.net/v1/guestbooks/${guestbookId}`,
			{},
			HanulseAuthorizationManager.getAccessToken(),
		);	
		const success = response?.data?.success || false;

		/** @deprecated */
		callback?.(success);

		return success;
	}

	static async createGuestbook(guestbookFields, callback) {
		const response = await HanulseAjax.post(
			"https://apis.auoi.net/v1/guestbooks",
			{
				"ownerId": guestbookFields.ownerId,
				"authorName": guestbookFields.authorName,
				"content": guestbookFields.content,
				// "createdAt": guestbookFields.createdAt,
			},
			HanulseAuthorizationManager.getAccessToken(),
		)
		const guestbook = response?.data;

		/** @deprecated */
		callback?.(guestbook);

		return guestbook;
	}
}