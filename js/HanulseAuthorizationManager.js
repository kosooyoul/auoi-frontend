class HanulseAuthorizationManager {
	static _loginButton;
	static bindLoginButton(selector) {
		this._loginButton = $(selector);
		this._initLoginButtonEvent();
		this._updateLoginButtonStatus();
		this.me(me => this._updateLoginButtonLabel(me && me.username));
	}

	static _initLoginButtonEvent() {
		this._loginButton.on("click", (evt) => {
			const loginView = new HanulseLoginView();
			this.targetQualityRatio = 0.2;
			loginView.setOnHideCallback(() => {
				this.targetQualityRatio = 1;
			});
			loginView.show();
		});
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

	static saveAuthorization(accessToken, refreshToken) {
		window.localStorage.setItem("_at", accessToken);
		window.localStorage.setItem("_rt", refreshToken);
		this._updateLoginButtonStatus();
		this.me(me => this._updateLoginButtonLabel(me && me.username));
	}

	static clearAuthorization() {
		window.localStorage.removeItem("_at");
		window.localStorage.removeItem("_rt");
		this._updateLoginButtonStatus();
		this._updateLoginButtonLabel();
	}

	static signIn(email, password, callback) {
		$.post({
			"url": "https://apis.auoi.net/v1/account/sign-in",
			"dataType": "json",
			"data": {
				"email": email,
				"password": password
			},
			"success": (response) => {
				const authorization = response && response.data;
	
				if (authorization) {
					this.saveAuthorization(authorization["accessToken"], authorization["refreshToken"]);
				}

				callback && callback(!!authorization);
			},
			"error": () => {
				callback && callback(null);
			}
		});
	}

	static me(callback) {
		const accessToken = window.localStorage.getItem("_at");
		$.get({
			"url": "https://apis.auoi.net/v1/account/me",
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