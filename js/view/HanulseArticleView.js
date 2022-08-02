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
				if (article) {
					this._articleDetailView.setArticle(article);
		
					this._articleListView.hide();
					this._articleDetailView.show();
				} else {
					const messageView = new HanulseMessageView();
					messageView.setMessage("선택하신 기록을 조회할 권한이 없습니다.");
		
					const overlayView = new HanulseOverlayView();
					overlayView.setContentView(messageView);
					overlayView.show();
				}

				this._loadingView.hide();
			});
		});

		this.addChildView(this._articleListView = articleListView);
	}

	_initializeArticleDetailView() {
		const articleDetailView = new HanulseArticleDetailView();
		articleDetailView.hide();

		articleDetailView.setOnDeleteCallback((article) => {
			const selectionView = new HanulseSelectionView();
			selectionView.setMessage("다음 기록을 삭제할까요?\n'" + article.subject + "'");
			selectionView.setOptions([
				{"title": "네, 삭제합니다.", "value": true},
				{"title": "아니요, 그만둘래요.", "value": false},
			]);

			const overlayView = new HanulseOverlayView();
			overlayView.setContentView(selectionView);
			overlayView.show();

			selectionView.setOnSelectOptionCallback((option) => {
				if (option.value != true) {
					return overlayView.hide();
				}

				this._requestDelete(article.id, (success) => {
					if (success) {
						this._articleDetailView.hide();
						this._articleListView.show();
						this._articleListView.load();
					} else {
						const messageView = new HanulseMessageView();
						messageView.setMessage("기록을 삭제할 수 없습니다.");
			
						const overlayView = new HanulseOverlayView();
						overlayView.setContentView(messageView);
						overlayView.show();
					}
					
					overlayView.hide();
				});
			})
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

					this._articleEditorView.hide();
					this._articleDetailView.show();
				} else {
					const messageView = new HanulseMessageView();
					messageView.setMessage("기록을 수정할 수 없습니다.");
		
					const overlayView = new HanulseOverlayView();
					overlayView.setContentView(messageView);
					overlayView.show();
				}

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
		this._articleListView.setFilter(filter);
		this._articleListView.load();
	}

	_requestArticleDetail(articleId, callback) {
		const accessToken = HanulseAuthorizationManager.getAccessToken();
		if (!accessToken) {
			return callback(null);
		}

		$.get({
			"url": "https://apis.auoi.net/v1/article",
			"dataType": "json",
			"data": {
				"articleId": articleId,
			},
			"headers": {
				"authorization": accessToken,
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

	_requestUpdate(articleId, articleChanges, callback) {
		const accessToken = HanulseAuthorizationManager.getAccessToken();
		if (!accessToken) {
			return callback(null);
		}

		if (Object.keys(articleChanges).length == 0) {
			return callback(null);
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
				"createdAt": articleChanges.createdAt,
			},
			"headers": {
				"authorization": accessToken,
			},
			"success": (response) => {
				const article = response && response.data;

				callback(article);
			},
			"error": () => {
				callback(null);
			},
		});
	}

	_requestDelete(articleId, callback) {
		const accessToken = HanulseAuthorizationManager.getAccessToken();
		if (!accessToken) {
			return callback(null);
		}

		$.post({
			"url": "https://apis.auoi.net/v1/article/delete",
			"dataType": "json",
			"data": {
				"articleId": articleId,
			},
			"headers": {
				"authorization": accessToken,
			},
			"success": (response) => {
				const result = response && response.data;

				callback(result && result.success);
			},
			"error": () => {
				callback(null);
			},
		});
	}
}