class HanulseArticleDetailView extends HanulseView {
	static _templateArticleDetailPath = "./template/article-detail.html";

	_titleElementWrap;
	_scrollboxElementsWrap;
	_subjectElementWrap;
	_authorElementWrap;
	_contentElementWrap;
	_linksElementWrap;
	_tagsElementWrap;
	_updatedAtElementWrap;
	_createdAtElementWrap;
	_loadingElementWrap;
	_deleteButtonElementWrap;
	_editButtonElementWrap;
	_backButtonElementWrap;

	_onBackCallback;
	_onDeleteCallback;
	_onEditCallback;

	_article;

	constructor() {
		super();

		this._initializeArticleDetailView();
	}

	_initializeArticleDetailView() {
		this.setElement(HtmlHelper.createHtml(HtmlTemplate.get(HanulseArticleDetailView._templateArticleDetailPath)).get());

		this._titleElementWrap = $(this.findChildElement("._title"));
		this._scrollboxElementsWrap = $(this.findChildElements(".scrollbox"));
		this._subjectElementWrap = $(this.findChildElement("._subject"));
		this._authorElementWrap = $(this.findChildElement("._author"));
		this._contentElementWrap = $(this.findChildElement("._content"));
		this._linksElementWrap = $(this.findChildElement("._links"));
		this._tagsElementWrap = $(this.findChildElement("._tags"));
		this._updatedAtElementWrap = $(this.findChildElement("._updated-at"));
		this._createdAtElementWrap = $(this.findChildElement("._created-at"));
		this._loadingElementWrap = $(this.findChildElement("._loading"));
		this._deleteButtonElementWrap = $(this.findChildElement("._delete-button"));
		this._editButtonElementWrap = $(this.findChildElement("._edit-button"));
		this._backButtonElementWrap = $(this.findChildElement("._back-button"));

		this._deleteButtonElementWrap.on("click", () => {
			if (this._onDeleteCallback) {
				this._onDeleteCallback(this._article);
			}
		});
		this._editButtonElementWrap.on("click", () => {
			if (this._onEditCallback) {
				this._onEditCallback(this._article);
			}
		});
		this._backButtonElementWrap.on("click", () => {
			if (this._onBackCallback) {
				this._onBackCallback();
			}
		});
	}

	setOnDeleteCallback(onDeleteCallback) {
		this._onDeleteCallback = onDeleteCallback;
	}

	setOnEditCallback(onEditCallback) {
		this._onEditCallback = onEditCallback;
	}

	setOnBackCallback(onBackCallback) {
		this._onBackCallback = onBackCallback;
	}

	setTitle(title) {
		this._titleElementWrap.text(title || "제목 없음");
	}

	setArticle(article) {
		this._updateArticleDetail(this._article = article);
	}

	onShow() {
		this._scrollboxElementsWrap.scrollTop(0);
	}

	_updateArticleDetail(article) {
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
			createdAt: this._formatDateTime(article.createdAt)
		};

		this._subjectElementWrap.text(articleItem.subject);
		this._authorElementWrap.text(articleItem.authorName);
		this._contentElementWrap.text(articleItem.content);
		this._tagsElementWrap.empty();
		articleItem.tags.forEach(tag => this._tagsElementWrap.append($("<a href=\"javascript:void(0)\" class=\"tag\">").text(tag)));
		this._linksElementWrap.empty();
		articleItem.links.forEach(link => this._linksElementWrap.append($("<a href=\"" + link + "\" class=\"link\" target=\"_blank\">").text(link)));
		this._updatedAtElementWrap.text(articleItem.updatedAt);
		this._createdAtElementWrap.text(articleItem.createdAt);
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
}