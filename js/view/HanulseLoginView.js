class HanulseLoginView extends HanulseOverlayView {
	static _templatePath = "./template/login.html";

	_elementWrap;
	_loginLayerElementWrap;
	_logoutLayerElementWrap;
	_emailInputElementWrap;
	_passwordInputElementWrap;
	_loginButtonElementWrap;
	_logoutButtonElementWrap;
	_loadingElementWrap;

	_loginRequested = false;

	constructor() {
		super();

		this._initializeLoginView();
	}

	async _initializeLoginView() {
		this._elementWrap = $($.parseHTML(await HtmlTemplate.fetch(HanulseLoginView._templatePath)));
		this._loadingElementWrap = this._elementWrap.find("._loading");

		if (HanulseAuthorizationManager.hasAuthorization()) {
			this._logoutLayerElementWrap = this._elementWrap.find("._logout-layer");
			this._logoutButtonElementWrap = this._elementWrap.find("._logout-button");
			this._logoutButtonElementWrap.on("click", (evt) => this._logout());
			this._logoutLayerElementWrap.show();
		} else {
			this._loginLayerElementWrap = this._elementWrap.find("._login-layer");
			this._emailInputElementWrap = this._elementWrap.find("._email-input");
			this._passwordInputElementWrap = this._elementWrap.find("._password-input");
			this._loginButtonElementWrap = this._elementWrap.find("._login-button");

			this._emailInputElementWrap.on("keydown", (evt) => {
				if (evt.which == 13) {
					this._login();
					return false;
				}
			});
			this._passwordInputElementWrap.on("keydown", (evt) => {
				if (evt.which == 13) {
					this._login();
					return false;
				}
			});
			this._loginButtonElementWrap.on("click", (evt) => this._login());

			this._loginLayerElementWrap.show();
			setTimeout(() => this._emailInputElementWrap.focus());
		}

		this.addOverlayElement(this._elementWrap.get(0));
	}

	_login() {
		const email = this._emailInputElementWrap.val().trim();
		const password = this._passwordInputElementWrap.val();
		if (email.length == 0) {
			return this._emailInputElementWrap.focus();
		}
		if (password.length == 0) {
			return this._passwordInputElementWrap.focus();
		}

		this._requestLogin(email, password);
	}

	_logout() {
		HanulseAuthorizationManager.clearAuthorization();
		this._showMessageView("로그아웃 완료!\n또 놀러오세요~ ^^", () => this.hide());
	}

	_disableInputs() {
		if (this._loginLayerElementWrap) {
			this._loginLayerElementWrap.css({"pointer-events": "none"});
			this._emailInputElementWrap.attr("disabled", true);
			this._passwordInputElementWrap.attr("disabled", true);
		}
		if (this._logoutLayerElementWrap) {
			this._logoutLayerElementWrap.css({"pointer-events": "none"});
		}
	}

	_enableInputs() {
		if (this._loginLayerElementWrap) {
			this._loginLayerElementWrap.css({"pointer-events": "all"});
			this._emailInputElementWrap.removeAttr("disabled");
			this._passwordInputElementWrap.removeAttr("disabled");
		}
		if (this._logoutLayerElementWrap) {
			this._logoutLayerElementWrap.css({"pointer-events": "all"});
		}
	}

	_clearInputs() {
		this._emailInputElementWrap.val("");
		this._passwordInputElementWrap.val("");
	}

	_requestLogin(email, password) {
		if (this._loginRequested) {
			return;
		}

		this._loginRequested = true;

		this._disableInputs();
		this._showLoading();
		HanulseAuthorizationManager.signIn(email, password, success => {
			if (success) {
				this._hideLoading();
				this.hide();
			} else {
				this._clearInputs();
				this._enableInputs();
				this._hideLoading();
				this._showMessageView("로그인이 실패했어요!\n다시 확인하시고 입력해주세요");
			}

			this._loginRequested = false;
		})
	}

	_showLoading() {
		this._loadingElementWrap.fadeIn();
	}
	
	_hideLoading() {
		this._loadingElementWrap.stop().fadeOut();
	}

	async _showMessageView(message, onHideCallback) {
		const messageView = await new HanulseMessageView({
			"message": message,
		}).build();

		const overlayView = new HanulseOverlayView();
		overlayView.setContentView(messageView);
		overlayView.setOnHideCallback(onHideCallback);
		overlayView.show();
	}
}