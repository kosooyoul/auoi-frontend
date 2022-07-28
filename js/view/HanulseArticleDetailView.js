class HanulseArticleDetailView extends HanulseOverlayView {
	static _templateArticleDetailPath = "./template/article-detail.html";

	_articleId;

	constructor() {
		super();

		this._initializeArticleDetailView();
	}

	_initializeArticleDetailView() {
		this._articleDetailElementWrap = this._articleElementWrap.find("._detail");
		
		this.addOverlayElement(this._articleDetailElementWrap.get(0));
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

		this._hideArticleList();
		this._showLoading();
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

	_updateArticleDetail(article) {
		const articleItem = {
			id: article.id,
			title: article.title,
			content: article.content,
			authorId: article.authorId,
			authorName: article.authorName,
			links: article.links,
			attachments: article.attachments,
			tags: article.tags,
			updatedAt: article.updatedAt && this._formatDateTime(article.updatedAt),
			createdAt: this._formatDateTime(article.createdAt)
		};
		
		const _articleDetail = $($.parseHTML(HtmlTemplate.get(HanulseArticleView._templateArticleDetailPath)));
		_articleDetail.find("._title").text(articleItem.title);
		_articleDetail.find("._author").text(articleItem.authorName);
		_articleDetail.find("._content").text(articleItem.content);
		_articleDetail.find("._updated-at").text(articleItem.updatedAt);
		_articleDetail.find("._created-at").text(articleItem.createdAt);

		this._articleDetailElementWrap.append(_articleDetail);

		const tagsElementWrap = _articleDetail.find("._tags");
		articleItem.tags.forEach(tag => tagsElementWrap.append($("<a href=\"javascript:void(0)\" class=\"tag\">").text(tag)));

		const linksElementWrap = _articleDetail.find("._links");
		articleItem.links.forEach(link => linksElementWrap.append($("<a href=\"" + link + "\" class=\"link\" target=\"_blank\">").text(link)));

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

		_articleDetail.find("._back-button").on("click", () => {
			this._articleDetailElementWrap.empty().hide();
			this._showArticleList();
		});
		this._articleDetailElementWrap.show();
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