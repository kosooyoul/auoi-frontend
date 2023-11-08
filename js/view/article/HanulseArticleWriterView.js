class HanulseArticleWriterView {
	static #TEMPLATE_PATH = "./template/article/article-writer.html";

	_titleElementWrap;
	_subjectInputElementWrap;
	_contentInputElementWrap;
	_linkInputElementWrap;
	_tagsInputElementWrap;
	_contentTypeInputElementWrap;
	_readableTargetInputElementWrap;
	_createdAtInputElementWrap;
	_saveButtonElementWrap;
	_loadingElementWrap;

	#loadingView;

	_ownerId;
	_onSaveCallback;

	#rootElement;

	constructor() {

	}

	async build() {
		await this._initializeArticleWriterView();

		return this;
	}

	getElement() {
		return this.#rootElement.get();
	}

	async _initializeArticleWriterView() {
		this.#rootElement = await HtmlHelper.createFromUrl(HanulseArticleWriterView.#TEMPLATE_PATH);

		this._titleElementWrap = $(this.#rootElement.find("._title").get());
		this._subjectInputElementWrap = $(this.#rootElement.find("._subject-input").get());
		this._contentInputElementWrap = $(this.#rootElement.find("._content-input").get());
		this._linkInputElementWrap = $(this.#rootElement.find("._link-input").get());
		this._tagsInputElementWrap = $(this.#rootElement.find("._tags-input").get());
		this._contentTypeInputElementWrap = $(this.#rootElement.find("._content-type-input").get());
		this._readableTargetInputElementWrap = $(this.#rootElement.find("._readable-target-input").get());
		this._createdAtInputElementWrap = $(this.#rootElement.find("._created-at-input").get());
		this._saveButtonElementWrap = $(this.#rootElement.find("._save-button").get());
		this._loadingElementWrap = $(this.#rootElement.find("._loading").get());

		this._saveButtonElementWrap.on("click", async () => {
			this.#loadingView.show();

			const article = await HanulseArticleApis.createArticle(this._getFields());
			if (article) {
				if (this._onSaveCallback) {
					this._onSaveCallback();
				}
			} else {
				const messageView = await new HanulseMessageView({
					"message": "기록을 저장할 수 없습니다.",
				}).build();

				const overlayView = new HanulseOverlayView();
				overlayView.setContentView(messageView);
				overlayView.show();
			}

			this.#loadingView.hide();
		});

		this._initializeLoadingView();

		setTimeout(() => this._subjectInputElementWrap.focus());
	}

	async _initializeLoadingView() {
		this.#loadingView = await new HanulseLoadingView().build();
		this.#rootElement.append(this.#loadingView.getElement());
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

	setOwner(owner) {
		this._ownerId = owner;
	}

	_getFields() {
		const subject = this._subjectInputElementWrap.val().trim();
		const content = this._contentInputElementWrap.val().trim();
		const link = this._linkInputElementWrap.val().trim();
		const links = link? [link]: [];
		const tags = this._tagsInputElementWrap.val().trim().split(/[,\s#]/g).map(tag => tag.trim()).filter(tag => !!tag);
		const contentType = this._contentTypeInputElementWrap.val().trim();
		const readableTarget = this._readableTargetInputElementWrap.val().trim();
		const createdAtString = this._createdAtInputElementWrap.val().trim();
		const createdAt = new Date(createdAtString);

		if (subject.length == 0) return this._subjectInputElementWrap.focus();
		if (content.length == 0) return this._contentInputElementWrap.focus();

		const articleFields = {};
		articleFields.ownerId = this._ownerId;
		articleFields.subject = subject;
		articleFields.content = content;
		articleFields.links = links;
		articleFields.tags = tags;
		articleFields.contentType = contentType;
		articleFields.readableTarget = readableTarget;
		if (isNaN(createdAt) == false) articleFields.createdAt = createdAt;

		return articleFields;
	}
}