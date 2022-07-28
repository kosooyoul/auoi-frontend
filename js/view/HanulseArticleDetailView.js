class HanulseArticleDetailView extends HanulseView {
	static _templateArticleDetailPath = "./template/article-detail.html";

	_rootElementWrap;
	_subjectElementWrap;
	_authorElementWrap;
	_contentElementWrap;
	_linksElementWrap;
	_tagsElementWrap;
	_updatedAtElementWrap;
	_createdAtElementWrap;
	_loadingElementWrap;

	_articleId;

	_onBackCallback;

	constructor() {
		super();

		this._initializeArticleDetailView();
	}

	_initializeArticleDetailView() {
		this._rootElementWrap = $($.parseHTML(HtmlTemplate.get(HanulseArticleDetailView._templateArticleDetailPath)));
		this._subjectElementWrap = this._rootElementWrap.find("._subject");
		this._authorElementWrap = this._rootElementWrap.find("._author");
		this._contentElementWrap = this._rootElementWrap.find("._content");
		this._linksElementWrap = this._rootElementWrap.find("._links");
		this._tagsElementWrap = this._rootElementWrap.find("._tags");
		this._updatedAtElementWrap = this._rootElementWrap.find("._updated-at");
		this._createdAtElementWrap = this._rootElementWrap.find("._created-at");
		this._loadingElementWrap = this._rootElementWrap.find("._loading");
		
		this._rootElementWrap.find("._back-button").on("click", () => {
			if (this._onBackCallback) {
				this._onBackCallback();
			}
		});

		/*
		_articleDetail.find("._delete-button").on("click", () => {
			const messageView = new HanulseMessageView();
			messageView.setMessage("기록을 삭제할까요?");

			const overlayView = new HanulseOverlayView();
			overlayView.setContentView(messageView);
			overlayView.setOnHideCallback(() => {
				this._articleDetailElementWrap.empty().hide();
				this._showArticleList();
			});
			overlayView.show();
		});

		_articleDetail.find("._edit-button").on("click", () => {
			this._articleDetailElementWrap.empty().hide();
			this._showArticleList();
		});
		*/
	}

	getElement() {
		return this._rootElementWrap.get(0);
	}
	
	setOnBackCallback(onBackCallback) {
		this._onBackCallback = onBackCallback;
	}

	setTitle(title) {
		this._rootElementWrap.find("._title").text(title || "제목 없음");
	}

	setArticleId(articleId) {
		this._articleId = articleId;
	}

	load() {
		this._requestArticleDetail();
	}

	_requestArticleDetail() {
		const accessToken = HanulseAuthorizationManager.getAccessToken();
		if (!accessToken) {
			return;
		}

		this._showLoading();
		this._clearArticleDetail();
		$.get({
			"url": "https://apis.auoi.net/v1/article",
			"dataType": "json",
			"data": {
				"articleId": this._articleId
			},
			"headers": {
				"authorization": accessToken
			},
			"success": (response) => {
				const article = response && response.data;
	
				if (article) {
					this._hideLoading();
					this._updateArticleDetail(article);
				}
			}
		});
	}

	_clearArticleDetail() {
		this._subjectElementWrap.text("");
		this._authorElementWrap.text("");
		this._contentElementWrap.text("");
		this._tagsElementWrap.empty();
		this._linksElementWrap.empty();
		this._updatedAtElementWrap.text("");
		this._createdAtElementWrap.text("");
	}

	_updateArticleDetail(article) {
		const articleItem = {
			id: article.id,
			subject: article.title,
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
		articleItem.tags.forEach(tag => this._tagsElementWrap.append($("<a href=\"javascript:void(0)\" class=\"tag\">").text(tag)));
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

	_showLoading() {
		this._loadingElementWrap.fadeIn();
	}
	
	_hideLoading() {
		this._loadingElementWrap.stop().fadeOut();
	}
}