class HanulseMediaApis {
	/*
	static async getMedia(id) {
		const response = await HanulseAjax.get(
			`https://apis.auoi.net/v1/medias/${id}`,
			{},
			HanulseAuthorizationManager.getAccessToken(),
		);
		const media = response?.data;

		return media;
	}
	*/

	static async getMediaList({lastId, count}) {
		const response = await HanulseAjax.get(
			'https://apis.auoi.net/v1/accounts/hanulse/medias',
			{
				lastId: lastId ?? undefined,
				count: count,
			},
			HanulseAuthorizationManager.getAccessToken(),
		);
		const mediaList = response?.data;

		mediaList.medias.forEach(media => {
			media.takenAt = media.takenAt ? new Date(media.takenAt): null;
			media.updatedAt = new Date(media.updatedAt);
			media.createdAt = new Date(media.createdAt);
		});

		return mediaList;
	}
}