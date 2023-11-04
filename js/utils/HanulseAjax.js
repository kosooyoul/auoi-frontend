class HanulseAjax {
	static async get(endpoint, params, authorization) {
		const url = params? endpoint + this.#toQueryString(params) : endpoint;

		try {
			const response = await fetch(url, {
				"method": "get",
				"dataType": "json",
				"headers": { "authorization": authorization },
			});

			return await response.json();
		} catch {
			return null;
		}
	}

	static async post(endpoint, params, authorization) {
		const response = await fetch(endpoint, {
			"method": "post",
			"dataType": "json",
			"body": JSON.stringify(params),
			"headers": {
				"authorization": authorization,
				"content-type": "application/json"
			},
		});

		try {
			return response.json();
		} catch {
			return null;
		}
	}

	static #toQueryString(data) {
		return "?" + Object.keys(data).reduce((keyPairStrings, key) => {
			if (data[key] !== undefined) {
				keyPairStrings.push(key + "=" + encodeURIComponent(data[key]));
			}
			return keyPairStrings;
		}, []).join("&");
	}
}