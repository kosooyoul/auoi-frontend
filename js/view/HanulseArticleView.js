class HanulseArticleView extends HanulseView {

	_rootElementWrap;

	_articleListView;
	_articleDetailView;
	_loadingView;

	_articleListViewElementWrap;
	_articleDetailViewElementWrap;

	constructor() {
		super();

		this._initializeArticleView();
	}

	_initializeArticleView() {
		this._rootElementWrap = $("<div>");

		this._articleListView = new HanulseArticleListView();
		this._articleListView.setOnClickItemCallback((articleId) => this._openArticleDetail(articleId));
		this._articleListViewElementWrap = $(this._articleListView.getElement());

		this._articleDetailView = new HanulseArticleDetailView();
		this._articleDetailView.setOnBackCallback(() => this._closeArticleDetail());
		this._articleDetailView.setOnDeleteCallback((articleId) => {
			const messageView = new HanulseMessageView();
			messageView.setMessage("기록을 삭제할까요?\n" + articleId);

			const overlayView = new HanulseOverlayView();
			overlayView.setContentView(messageView);
			overlayView.show();
		});
		this._articleDetailView.setOnEditCallback((articleId) => {
			const messageView = new HanulseMessageView();
			messageView.setMessage("기록을 수정합니다.\n" + articleId);

			const overlayView = new HanulseOverlayView();
			overlayView.setContentView(messageView);
			overlayView.show();
		});
		this._articleDetailViewElementWrap = $(this._articleDetailView.getElement());

		this._loadingView = new HanulseLoadingView();

		this._rootElementWrap.append(this._articleListViewElementWrap);
		this._rootElementWrap.append(this._articleDetailViewElementWrap);
		this._rootElementWrap.append(this._loadingView.getElement());
	}

	getElement() {
		return this._rootElementWrap.get(0);
	}

	setTitle(title) {
		this._articleListView.setTitle(title);
		this._articleDetailView.setTitle(title);
	}

	load(filter) {
		this._rootElementWrap.children().hide();
		this._articleListViewElementWrap.show();

		this._articleListView.setTags(filter.tags);
		this._articleListView.setAuthorId(filter.authorId);
		this._articleListView.load();
	}

	_requestArticleDetail(articleId, callback) {
		const accessToken = HanulseAuthorizationManager.getAccessToken();
		if (!accessToken) {
			return;
		}

		$.get({
			"url": "https://apis.auoi.net/v1/article",
			"dataType": "json",
			"data": {
				"articleId": articleId
			},
			"headers": {
				"authorization": accessToken
			},
			"success": (response) => {
				const article = response && response.data;
	
				if (article) {
					if (callback) {
						callback(article);
					}
				}
			}
		});
	}

	_openArticleDetail(articleId) {
		this._loadingView.show();
		this._requestArticleDetail(articleId, (article) => {
			this._articleDetailView.setArticle(article);

			this._articleListViewElementWrap.hide();
			this._articleDetailViewElementWrap.show();

			this._loadingView.hide();
		});
	}

	_closeArticleDetail() {
		this._articleDetailViewElementWrap.hide();
		this._articleListViewElementWrap.show();
	}
}