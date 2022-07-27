class HanulseArticleWriterView extends HanulseOverlayView {
	static _templatePath = "./template/article-writer.html";

	_elementWrap;
	_titleInputElementWrap;
	_contentInputElementWrap;
	_linkInputElementWrap;
	_tagsInputElementWrap;
	_createdAtInputElementWrap;
	_saveButtonElementWrap;
	_loadingElementWrap;

	_saveRequested;

	constructor() {
		super();

		this._initializeArticleWriterView();
	}

	_initializeArticleWriterView() {
		this._elementWrap = $($.parseHTML(HtmlTemplate.get(HanulseArticleWriterView._templatePath)));
		this._titleInputElementWrap = this._elementWrap.find("._title-input");
		this._contentInputElementWrap = this._elementWrap.find("._content-input");
		this._linkInputElementWrap = this._elementWrap.find("._link-input");
		this._tagsInputElementWrap = this._elementWrap.find("._tags-input");
		this._createdAtInputElementWrap = this._elementWrap.find("._created-at-input");
		this._saveButtonElementWrap = this._elementWrap.find("._save-button");
		this._loadingElementWrap = this._elementWrap.find("._loading");

		this._titleInputElementWrap.on("keydown", (evt) => {
			if (evt.which == 13) {
				this._contentInputElementWrap.focus();
				return false;
			}
		});
		this._linkInputElementWrap.on("keydown", (evt) => {
			if (evt.which == 13) {
				this._tagsInputElementWrap.focus();
				return false;
			}
		});
		this._tagsInputElementWrap.on("keydown", (evt) => {
			if (evt.which == 13) {
				this._save()
				return false;
			}
		});
		this._saveButtonElementWrap.on("click", () => this._save());
		setTimeout(() => this._titleInputElementWrap.focus());

		this.addOverlayElement(this._elementWrap.get(0));
	}

	setTags(tags) {
		// this._tagsInputElementWrap.val(tags.join(", "));
	}

	setTitle(title) {
		this._elementWrap.find("._title").text(title);
	}

	_save() {
		const title = this._titleInputElementWrap.val().trim();
		const content = this._contentInputElementWrap.val().trim();
		const link = this._linkInputElementWrap.val().trim();
		const links = link? [link]: [];
		const tags = this._tagsInputElementWrap.val().trim().split(/[,\s#]/g).map(tag => tag.trim()).filter(tag => !!tag);
		if (title.length == 0) {
			return this._titleInputElementWrap.focus();
		}
		if (content.length == 0) {
			return this._contentInputElementWrap.focus();
		}
		const createdAtString = this._createdAtInputElementWrap.val().trim();
		const createdAt = new Date(createdAtString);

		this._requestSave(title, content, links, tags, createdAt);
	}

	_disableInputs() {
		if (this._loginLayerElementWrap) {
			this._loginLayerElementWrap.css({ "pointer-events": "none" });
			this._emailInputElementWrap.attr("disabled", true);
			this._passwordInputElementWrap.attr("disabled", true);
		}
		if (this._logoutLayerElementWrap) {
			this._logoutLayerElementWrap.css({ "pointer-events": "none" });
		}
	}

	_enableInputs() {
		if (this._loginLayerElementWrap) {
			this._loginLayerElementWrap.css({ "pointer-events": "all" });
			this._emailInputElementWrap.removeAttr("disabled");
			this._passwordInputElementWrap.removeAttr("disabled");
		}
		if (this._logoutLayerElementWrap) {
			this._logoutLayerElementWrap.css({ "pointer-events": "all" });
		}
	}

	_clearInputs() {
		this._emailInputElementWrap.val("");
		this._passwordInputElementWrap.val("");
	}

	_requestSave(title, content, links, tags, createdAt) {
		if (this._saveRequested) {
			return;
		}

		const accessToken = HanulseAuthorizationManager.getAccessToken();
		if (!accessToken) {
			return;
		}

		this._saveRequested = true;

		this._disableInputs();
		this._showLoading();
		$.post({
			"url": "https://apis.auoi.net/v1/article/register",
			"dataType": "json",
			"data": {
				"title": title,
				"content": content,
				"links": links,
				"tags": tags,
				"createdAt": createdAt
			},
			"headers": {
				"authorization": accessToken
			},
			"success": (response) => {
				const result = response && response.data;

				if (result) {
					this._hideLoading();
					this.hide();
				} else {
					this._enableInputs();
					this._hideLoading();
				}

				this._loginRequested = false;
			},
			"error": () => {
				this._enableInputs();
				this._hideLoading();

				this._loginRequested = false;
			}
		});
	}

	_showLoading() {
		this._loadingElementWrap.fadeIn();
	}

	_hideLoading() {
		this._loadingElementWrap.stop().fadeOut();
	}
}