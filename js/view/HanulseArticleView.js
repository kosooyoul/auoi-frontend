class HanulseArticleView extends HanulseView {

	_articleListView;
	_articleDetailView;
	_loadingView;

	constructor() {
		super();

		this._initializeArticleView();
	}

	_initializeArticleView() {
		this.setElement($("<div>").get(0));

		this._initializeArticleListView();
		this._initializeArticleDetailView();
		this._initializeLoadingView();
	}

	_initializeArticleListView() {
		const articleListView = new HanulseArticleListView();
		articleListView.hide();

		articleListView.setOnClickItemCallback((articleId) => {
			this._openArticleDetail(articleId)
		});

		this.addChildView(this._articleListView = articleListView);
	}

	_initializeArticleDetailView() {
		const articleDetailView = new HanulseArticleDetailView();
		articleDetailView.hide();

		articleDetailView.setOnBackCallback(() => {
			this._closeArticleDetail()
		});
		articleDetailView.setOnDeleteCallback((articleId) => {
			const messageView = new HanulseMessageView();
			messageView.setMessage("기록을 삭제할까요?\n" + articleId);

			const overlayView = new HanulseOverlayView();
			overlayView.setContentView(messageView);
			overlayView.show();
		});
		articleDetailView.setOnEditCallback((articleId) => {
			const messageView = new HanulseMessageView();
			messageView.setMessage("기록을 수정합니다.\n" + articleId);

			const overlayView = new HanulseOverlayView();
			overlayView.setContentView(messageView);
			overlayView.show();
		});

		this.addChildView(this._articleDetailView = articleDetailView);
	}

	_initializeLoadingView() {
		this.addChildView(this._loadingView = new HanulseLoadingView());
	}

	setTitle(title) {
		this._articleListView.setTitle(title);
		this._articleDetailView.setTitle(title);
	}

	load(filter) {
		this._articleListView.show();
		this._articleListView.load(filter);
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

			this._articleListView.hide();
			this._articleDetailView.show();

			this._loadingView.hide();
		});
	}

	_closeArticleDetail() {
		this._articleDetailView.hide();
		this._articleListView.show();
	}
}