class HanulseAuthorizationManager {
	static _loginButton;

	static bindLoginButton(selector) {
		this._loginButton = $(selector);
		this._updateLoginButtonStatus();
		if (this.hasAuthorization()) {
			this.refreshSign();
		} else {
			this.clearAuthorization();
		}
	}

	static _updateLoginButtonStatus() {
		if (HanulseAuthorizationManager.hasAuthorization()) {
			this._loginButton.addClass("on");
		} else {
			this._loginButton.removeClass("on");
		}
	}

	static _updateLoginButtonLabel(label) {
		this._loginButton.text(label || "Anonymous");
	}

	static hasAuthorization() {
		return !!window.localStorage.getItem("_at");
	}

	static getAccessToken() {
		return window.localStorage.getItem("_at");
	}

	static saveAuthorization(accessToken, refreshToken, accessTokenExpiresIn) {
		window.localStorage.setItem("_at", accessToken);
		window.localStorage.setItem("_rt", refreshToken);
		window.localStorage.setItem("_exp", accessTokenExpiresIn);
		this._updateLoginButtonStatus();
		this.me(me => this._updateLoginButtonLabel(me && me.username));
		if (accessTokenExpiresIn && accessTokenExpiresIn.getTime()) {
			setTimeout(() => this.refreshSign(), Math.max(accessTokenExpiresIn - Date.now(), 60000));
		}
	}

	static clearAuthorization() {
		window.localStorage.removeItem("_at");
		window.localStorage.removeItem("_rt");
		window.localStorage.removeItem("_exp");
		this._updateLoginButtonStatus();
		this._updateLoginButtonLabel();
	}

	static signIn(email, password, callback) {
		$.post({
			"url": "https://apis.auoi.net/v1/accounts/sign/in",
			"dataType": "json",
			"data": {
				"email": email,
				"password": password
			},
			"success": (response) => {
				if (response == null || response.data == null) {
					return callback(false)
				}

				const { sign, me } = response.data;
	
				if (sign) {
					this.saveAuthorization(sign["accessToken"], sign["refreshToken"], new Date(sign["accessTokenExpiresIn"]));
				} else {
					this.clearAuthorization();
				}

				callback && callback(!!sign);
			},
			"error": () => {
				this.clearAuthorization();

				callback && callback(null);
			}
		});
	}

	static refreshSign(callback) {
		const accessToken = window.localStorage.getItem("_at");
		const refreshToken = window.localStorage.getItem("_rt");
		$.post({
			"url": "https://apis.auoi.net/v1/accounts/sign/refresh",
			"dataType": "json",
			"data": {
				"refreshToken": refreshToken
			},
			"headers": {
				"authorization": accessToken
			},
			"success": (response) => {
				if (response == null || response.data == null) {
					return callback(false)
				}

				const { sign, me } = response.data;
	
				if (sign) {
					this.saveAuthorization(sign["accessToken"], sign["refreshToken"], new Date(sign["accessTokenExpiresIn"]));
				} else {
					this.clearAuthorization();
				}

				callback && callback(!!sign);
			},
			"error": () => {
				this.clearAuthorization();

				callback && callback(null);
			}
		});
	}

	static me(callback) {
		const accessToken = window.localStorage.getItem("_at");
		$.get({
			"url": "https://apis.auoi.net/v1/accounts/me",
			"dataType": "json",
			"headers": {
				"authorization": accessToken
			},
			"success": (response) => {
				const me = response && response.data;
	
				callback && callback(me);
			},
			"error": () => {
				callback && callback(null);
			}
		});
	}
}