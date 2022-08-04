class HanulseArticleWriterView extends HanulseView {
	static _templatePath = "./template/article-writer.html";

	_titleElementWrap;
	_subjectInputElementWrap;
	_contentInputElementWrap;
	_linkInputElementWrap;
	_tagsInputElementWrap;
	_createdAtInputElementWrap;
	_saveButtonElementWrap;
	_loadingElementWrap;

	_loadingView;

	_onSaveCallback;

	constructor() {
		super();

		this._initializeArticleWriterView();
	}

	_initializeArticleWriterView() {
		this.setElement(HtmlHelper.createHtml(HtmlTemplate.get(HanulseArticleWriterView._templatePath)).get());

		this._titleElementWrap = $(this.findChildElement("._title"));
		this._subjectInputElementWrap = $(this.findChildElement("._subject-input"));
		this._contentInputElementWrap = $(this.findChildElement("._content-input"));
		this._linkInputElementWrap = $(this.findChildElement("._link-input"));
		this._tagsInputElementWrap = $(this.findChildElement("._tags-input"));
		this._createdAtInputElementWrap = $(this.findChildElement("._created-at-input"));
		this._saveButtonElementWrap = $(this.findChildElement("._save-button"));
		this._loadingElementWrap = $(this.findChildElement("._loading"));

		this._saveButtonElementWrap.on("click", () => {
			this._loadingView.show();
			HanulseArticleApis.createArticle(this._getFields(), (article) => {
				if (article) {
					if (this._onSaveCallback) {
						this._onSaveCallback();
					}
				} else {
					const messageView = new HanulseMessageView();
					messageView.setMessage("기록을 저장할 수 없습니다.");
		
					const overlayView = new HanulseOverlayView();
					overlayView.setContentView(messageView);
					overlayView.show();
				}

				this._loadingView.hide();
			});
		});

		this._initializeLoadingView();

		setTimeout(() => this._subjectInputElementWrap.focus());
	}

	_initializeLoadingView() {
		this.addChildView(this._loadingView = new HanulseLoadingView());
	}

	setOnSaveCallback(onSaveCallback) {
		this._onSaveCallback = onSaveCallback;
	}

	setTags(tags) {
		this._tagsInputElementWrap.val(tags.join(", "));
	}

	setTitle(title) {
		this._titleElementWrap.text(title || "제목 없음");
	}

	_getFields() {
		const subject = this._subjectInputElementWrap.val().trim();
		const content = this._contentInputElementWrap.val().trim();
		const link = this._linkInputElementWrap.val().trim();
		const links = link? [link]: [];
		const tags = this._tagsInputElementWrap.val().trim().split(/[,\s#]/g).map(tag => tag.trim()).filter(tag => !!tag);
		const createdAtString = this._createdAtInputElementWrap.val().trim();
		const createdAt = new Date(createdAtString);

		if (subject.length == 0) return this._subjectInputElementWrap.focus();
		if (content.length == 0) return this._contentInputElementWrap.focus();

		const articleFields = {}
		articleFields.subject = subject;
		articleFields.content = content;
		articleFields.links = links;
		articleFields.tags = tags;
		if (isNaN(createdAt) == false) articleFields.createdAt = createdAt;

		return articleFields;
	}
}