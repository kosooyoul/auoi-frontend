class HanulseArticleView extends HanulseView {

	_articleListView;
	_articleDetailView;
	_articleEditorView;
	_loadingView;

	constructor() {
		super();

		this._initializeArticleView();
	}

	_initializeArticleView() {
		this.setElement($("<div>").get(0));

		this._initializeArticleListView();
		this._initializeArticleDetailView();
		this._initializeArticleEditorView();
		this._initializeLoadingView();
	}

	_initializeArticleListView() {
		const articleListView = new HanulseArticleListView();
		articleListView.hide();

		articleListView.setOnClickItemCallback((articleId) => {
			this._loadingView.show();
			this._requestArticleDetail(articleId, (article) => {
				this._articleDetailView.setArticle(article);
	
				this._articleListView.hide();
				this._articleDetailView.show();
	
				this._loadingView.hide();
			});
		});

		this.addChildView(this._articleListView = articleListView);
	}

	_initializeArticleDetailView() {
		const articleDetailView = new HanulseArticleDetailView();
		articleDetailView.hide();

		articleDetailView.setOnDeleteCallback((articleId) => {
			const messageView = new HanulseMessageView();
			messageView.setMessage("기록을 삭제할까요?\n" + articleId);

			const overlayView = new HanulseOverlayView();
			overlayView.setContentView(messageView);
			overlayView.show();
		});
		articleDetailView.setOnEditCallback((article) => {
			this._articleEditorView.setArticle(article);
			
			this._articleDetailView.hide();
			this._articleEditorView.show();
		});
		articleDetailView.setOnBackCallback(() => {
			this._articleDetailView.hide();
			this._articleListView.show();
		});

		this.addChildView(this._articleDetailView = articleDetailView);
	}

	_initializeArticleEditorView() {
		const articleEditorView = new HanulseArticleEditorView();
		articleEditorView.hide();

		articleEditorView.setOnSaveCallback((articleId, articleChanges) => {
			this._loadingView.show();
			this._requestUpdate(articleId, articleChanges, (article) => {
				if (article) {
					this._articleListView.updateItem(article.id, article);
					this._articleDetailView.setArticle(article);
				}

				this._articleEditorView.hide();
				this._articleDetailView.show();

				this._loadingView.hide();
			});
		});
		articleEditorView.setOnCancelCallback(() => {
			this._articleEditorView.hide();
			this._articleDetailView.show();
		});

		this.addChildView(this._articleEditorView = articleEditorView);
	}

	_initializeLoadingView() {
		this.addChildView(this._loadingView = new HanulseLoadingView());
	}

	setTitle(title) {
		this._articleListView.setTitle(title);
		this._articleDetailView.setTitle(title);
		this._articleEditorView.setTitle(title);
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
					callback(article);
				}
			}
		});
	}

	_requestUpdate(articleId, articleChanges, callback) {
		const accessToken = HanulseAuthorizationManager.getAccessToken();
		if (!accessToken) {
			return;
		}

		if (Object.keys(articleChanges).length == 0) {
			callback(null);
		}

		$.post({
			"url": "https://apis.auoi.net/v1/article/update",
			"dataType": "json",
			"data": {
				"articleId": articleId,
				"subject": articleChanges.subject,
				"content": articleChanges.content,
				"links": articleChanges.links,
				"tags": articleChanges.tags,
				"createdAt": articleChanges.createdAt
			},
			"headers": {
				"authorization": accessToken
			},
			"success": (response) => {
				const article = response && response.data;

				callback(article);
			},
			"error": () => {
				callback(null);
			}
		});
	}
}