class HanulseArticleEditorView extends HanulseView {
	static _templatePath = "./template/article-editor.html";

	_titleElementWrap;
	_subjectInputElementWrap;
	_contentInputElementWrap;
	_linkInputElementWrap;
	_tagsInputElementWrap;
	_createdAtInputElementWrap;
	_saveButtonElementWrap;
	_cancelButtonElementWrap;
	_loadingElementWrap;

	_onSaveCallback;
	_onCancelCallback;

	_article;

	constructor() {
		super();

		this._initializeArticleEditorView();
	}

	_initializeArticleEditorView() {
		this.setElement($.parseHTML(HtmlTemplate.get(HanulseArticleEditorView._templatePath)));

		this._titleElementWrap = $(this.findChildElement("._title"));
		this._subjectInputElementWrap = $(this.findChildElement("._subject-input"));
		this._contentInputElementWrap = $(this.findChildElement("._content-input"));
		this._linkInputElementWrap = $(this.findChildElement("._link-input"));
		this._tagsInputElementWrap = $(this.findChildElement("._tags-input"));
		this._createdAtInputElementWrap = $(this.findChildElement("._created-at-input"));
		this._saveButtonElementWrap = $(this.findChildElement("._save-button"));
		this._cancelButtonElementWrap = $(this.findChildElement("._cancel-button"));
		this._loadingElementWrap = $(this.findChildElement("._loading"));

		this._saveButtonElementWrap.on("click", () => {
			if (this._onSaveCallback) {
				this._onSaveCallback(this._article.id, this._getChanges());
			}
		});
		this._cancelButtonElementWrap.on("click", () => {
			if (this._onCancelCallback) {
				this._onCancelCallback();
			}
		});

		setTimeout(() => this._subjectInputElementWrap.focus());
	}

	setOnSaveCallback(onSaveCallback) {
		this._onSaveCallback = onSaveCallback;
	}

	setOnCancelCallback(onCancelCallback) {
		this._onCancelCallback = onCancelCallback;
	}

	setTitle(title) {
		this._titleElementWrap.text(title || "제목 없음");
	}

	setArticle(article) {
		this._updateArticle(this._article = article);
	}

	_updateArticle(article) {
		const articleItem = {
			id: article.id,
			subject: article.subject,
			content: article.content,
			authorId: article.authorId,
			authorName: article.authorName,
			links: article.links,
			attachments: article.attachments,
			tags: article.tags,
			updatedAt: article.updatedAt && this._formatDateTime(article.updatedAt),
			createdAt: this._formatDateTime(article.createdAt),
		};

		this._subjectInputElementWrap.val(articleItem.subject);
		this._contentInputElementWrap.val(articleItem.content);
		this._tagsInputElementWrap.val(articleItem.tags.join(" "));
		this._linkInputElementWrap.val(articleItem.links[0]);
		this._createdAtInputElementWrap.val(articleItem.createdAt);
	}

	_formatDateTime(dateString) {
		const date = new Date(dateString);
		const year = ("000" + date.getFullYear()).slice(-4);
		const month = ("0" + (date.getMonth() + 1)).slice(-2);
		const dom = ("0" + date.getDate()).slice(-2);
		const hours = ("0" + date.getHours()).slice(-2);
		const minutes = ("0" + date.getMinutes()).slice(-2);
		const seconds = ("0" + date.getSeconds()).slice(-2);
		return year + "-" + month + "-" + dom + " " + hours + ":" + minutes + ":" + seconds;
	}

	_getChanges() {
		const subject = this._subjectInputElementWrap.val().trim();
		const content = this._contentInputElementWrap.val().trim();
		const link = this._linkInputElementWrap.val().trim();
		const links = link? [link]: [];
		const tags = this._tagsInputElementWrap.val().trim().split(/[,\s#]/g).map(tag => tag.trim()).filter(tag => !!tag);
		const createdAtString = this._createdAtInputElementWrap.val().trim();
		const createdAt = new Date(createdAtString);

		if (subject.length == 0) return this._subjectInputElementWrap.focus();
		if (content.length == 0) return this._contentInputElementWrap.focus();

		const changes = {};
		if (this._article.subject != subject) changes.subject = subject;
		if (this._article.content != content) changes.content = content;
		if (this._isEqual(this._article.links, links) == false) changes.links = links;
		if (this._isEqual(this._article.tags, tags) == false) changes.tags = tags;
		if (this._isEqual(new Date(this._article.createdAt), createdAt) == false) {
			if (isNaN(createdAt) == false) {
				changes.createdAt = createdAt;
			}
		}

		return changes;
	}

	_isEqual(obj1, obj2) {
		return JSON.stringify(obj1) == JSON.stringify(obj2);
	}
}