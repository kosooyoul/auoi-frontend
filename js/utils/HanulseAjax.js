class HanulseAjax {
	static async html(url) {
		try {
			const response = await fetch(url);

			return await response.text();
		} catch {
			return null;
		}
	}

	static async get(endpoint, params, authorization) {
		const permissionKey = sessionStorage.getItem('pk');
		const url = params? endpoint + this.#toQueryString(params) : endpoint;

		try {
			const response = await fetch(url, {
				"method": "GET",
				"dataType": "json",
				"headers": {
					"authorization": authorization,
					"permission-key": permissionKey,
				},
			});

			return await response.json();
		} catch {
			return null;
		}
	}

	static async rawPost(endpoint, params, authorization) {
		const permissionKey = sessionStorage.getItem('pk');
		const response = await fetch(endpoint, {
			"method": "POST",
			"dataType": "json",
			"body": JSON.stringify(params),
			"headers": {
				"authorization": authorization,
				"permission-key": permissionKey,
				"content-type": "application/json",
			},
		});

		return response;
	}

	static async post(endpoint, params, authorization) {
		const permissionKey = sessionStorage.getItem('pk');
		const response = await fetch(endpoint, {
			"method": "POST",
			"dataType": "json",
			"body": JSON.stringify(params),
			"headers": {
				"authorization": authorization,
				"permission-key": permissionKey,
				"content-type": "application/json"
			},
		});

		try {
			return response.json();
		} catch {
			return null;
		}
	}

	static async patch(endpoint, params, authorization) {
		const permissionKey = sessionStorage.getItem('pk');
		const response = await fetch(endpoint, {
			"method": "PATCH",
			"dataType": "json",
			"body": JSON.stringify(params),
			"headers": {
				"authorization": authorization,
				"permission-key": permissionKey,
				"content-type": "application/json",
			},
		});

		try {
			return response.json();
		} catch {
			return null;
		}
	}

	static async delete(endpoint, params, authorization) {
		const permissionKey = sessionStorage.getItem('pk');
		const response = await fetch(endpoint, {
			"method": "DELETE",
			"dataType": "json",
			"body": JSON.stringify(params),
			"headers": {
				"authorization": authorization,
				"permission-key": permissionKey,
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