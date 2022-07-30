class HanulseArticleWriterView extends HanulseOverlayView {
	static _templatePath = "./template/article-writer.html";

	_elementWrap;
	_subjectInputElementWrap;
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
		this._subjectInputElementWrap = this._elementWrap.find("._subject-input");
		this._contentInputElementWrap = this._elementWrap.find("._content-input");
		this._linkInputElementWrap = this._elementWrap.find("._link-input");
		this._tagsInputElementWrap = this._elementWrap.find("._tags-input");
		this._createdAtInputElementWrap = this._elementWrap.find("._created-at-input");
		this._saveButtonElementWrap = this._elementWrap.find("._save-button");
		this._loadingElementWrap = this._elementWrap.find("._loading");

		this._subjectInputElementWrap.on("keydown", (evt) => {
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

		setTimeout(() => this._subjectInputElementWrap.focus());

		this.addOverlayElement(this._elementWrap.get(0));
	}

	setTags(tags) {
		// this._tagsInputElementWrap.val(tags.join(", "));
	}

	setTitle(title) {
		this._elementWrap.find("._title").text(title);
	}

	_save() {
		const subject = this._subjectInputElementWrap.val().trim();
		const content = this._contentInputElementWrap.val().trim();
		const link = this._linkInputElementWrap.val().trim();
		const links = link? [link]: [];
		const tags = this._tagsInputElementWrap.val().trim().split(/[,\s#]/g).map(tag => tag.trim()).filter(tag => !!tag);
		if (subject.length == 0) {
			return this._subjectInputElementWrap.focus();
		}
		if (content.length == 0) {
			return this._contentInputElementWrap.focus();
		}
		const createdAtString = this._createdAtInputElementWrap.val().trim();
		const createdAt = new Date(createdAtString);

		const articleFields = {}
		articleFields.subject = subject;
		articleFields.content = content;
		articleFields.links = links;
		articleFields.tags = tags;
		if (isNaN(createdAt) == false) {
			articleFields.createdAt = createdAt;
		}

		this._requestSave(articleFields);
	}

	_requestSave(articleFields) {
		if (this._saveRequested) {
			return;
		}

		const accessToken = HanulseAuthorizationManager.getAccessToken();
		if (!accessToken) {
			return;
		}

		this._saveRequested = true;

		this._showLoading();
		$.post({
			"url": "https://apis.auoi.net/v1/article/register",
			"dataType": "json",
			"data": {
				"subject": articleFields.subject,
				"content": articleFields.content,
				"links": articleFields.links,
				"tags": articleFields.tags,
				"createdAt": articleFields.createdAt,
			},
			"headers": {
				"authorization": accessToken,
			},
			"success": (response) => {
				const result = response && response.data;

				if (result) {
					this._hideLoading();
					this.hide();
				} else {
					this._hideLoading();
				}

				this._loginRequested = false;
			},
			"error": () => {
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