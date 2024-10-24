class HanulseMediaApis {
	static async getGroupList({lastId, count}) {
		const response = await HanulseAjax.get(
			'https://apis.auoi.net/v1/accounts/hanulse/groups',
			{
				lastId: lastId ?? undefined,
				count: count,
			},
			HanulseAuthorizationManager.getAccessToken(),
		);
		const groupList = response?.data;

		groupList.groups.forEach(group => {
			group.updatedAt = new Date(group.updatedAt);
			group.createdAt = new Date(group.createdAt);
		});

		return groupList;
	}

	static async getGroupMediaList({groupSid, lastId, count}) {
		let url;
		if (groupSid) {
			url = `https://apis.auoi.net/v1/accounts/hanulse/groups/${groupSid}/medias`;
		} else {
			url = `https://apis.auoi.net/v1/accounts/hanulse/medias`;
		}

		const response = await HanulseAjax.get(
			url,
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

	/*
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
	*/
}