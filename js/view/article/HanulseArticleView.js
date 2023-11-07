class HanulseArticleView extends HanulseView {

	#articleListView;
	#articleDetailView;
	#articleEditorView;
	#loadingView;

	constructor() {
		super();
	}

	async load() {
		this.setElement($("<div>").get(0));

		await this.#loadArticleListView();
		await this.#loadArticleDetailView();
		await this.#loadArticleEditorView();
		await this.#loadLoadingView();
	}

	async #loadArticleListView() {
		this.#articleListView = new HanulseArticleListView();

		await this.#articleListView.load();
		this.#articleListView.hide();

		this.#articleListView.setOnClickArticleItemCallback((articleId) => this.#onClickArticleItemCallback(articleId));

		this.addChildView(this.#articleListView);
	}

	async #loadArticleDetailView() {
		this.#articleDetailView = new HanulseArticleDetailView();

		await this.#articleDetailView.load();
		this.#articleDetailView.hide();

		this.#articleDetailView.setOnDeleteCallback((article) => this.#onDeleteArticleCallback(article));
		this.#articleDetailView.setOnEditCallback((article) => {
			this.#articleEditorView.setArticle(article);
			
			this.#articleDetailView.hide();
			this.#articleEditorView.show();
		});
		this.#articleDetailView.setOnBackCallback(() => {
			this.#articleDetailView.hide();
			this.#articleListView.show();
		});

		this.addChildView(this.#articleDetailView);
	}

	async #loadArticleEditorView() {
		this.#articleEditorView = new HanulseArticleEditorView();

		await this.#articleEditorView.load();
		this.#articleEditorView.hide();

		this.#articleEditorView.setOnSaveCallback((articleId, articleChanges) => this.#onSaveArticleCallback(articleId, articleChanges));
		this.#articleEditorView.setOnCancelCallback(() => {
			this.#articleEditorView.hide();
			this.#articleDetailView.show();
		});

		this.addChildView(this.#articleEditorView);
	}

	async #loadLoadingView() {
		const loadingView = new HanulseLoadingView();

		await loadingView.load(() => {
			this.addChildView(this.#loadingView = loadingView);
		});
	}

	setTitle(title) {
		this.#articleListView.setTitle(title);
		this.#articleDetailView.setTitle(title);
		this.#articleEditorView.setTitle(title);
	}

	loadList(filter) {
		this.#articleListView.show();
		this.#articleListView.setFilter(filter);
		this.#articleListView.loadList();
	}

	async #onClickArticleItemCallback(articleId) {
		this.#loadingView.show();

		const article = await HanulseArticleApis.getArticle(articleId);
		if (article) {
			this.#articleDetailView.setArticle(article);

			this.#articleListView.hide();
			this.#articleDetailView.show();
		} else {
			const messageView = await new HanulseMessageView({
				"message": "선택하신 기록을 조회할 권한이 없습니다.",
			}).build();

			const overlayView = new HanulseOverlayView();
			overlayView.setContentView(messageView);
			overlayView.show();
		}

		this.#loadingView.hide();
	}

	async #onDeleteArticleCallback(article) {
		const selectionView = await new HanulseSelectionView({
			"message": `다음 기록을 삭제할까요?\n' ${article.subject}'`,
			"options": [
				{"title": "네, 삭제합니다.", "value": true},
				{"title": "아니요, 그만둘래요.", "value": false},
			],
			"onSelectedListener": async (option) => {
				if (option.value != true) {
					return overlayView.hide();
				}
	
				const success = await HanulseArticleApis.deleteArticle(article.id);
				if (success) {
					this.#articleDetailView.hide();
					this.#articleListView.show();
					this.#articleListView.loadList();
				} else {
					const messageView = await new HanulseMessageView({
						"message": "기록을 삭제할 수 없습니다.",
					}).build();

					const overlayView = new HanulseOverlayView();
					overlayView.setContentView(messageView);
					overlayView.show();
				}
				
				overlayView.hide();
			},
		}).build();

		const overlayView = new HanulseOverlayView();
		overlayView.setContentView(selectionView);
		overlayView.show();
	}

	async #onSaveArticleCallback(articleId, articleChanges) {
		this.#loadingView.show();

		const article = await HanulseArticleApis.updateArticle(articleId, articleChanges);
		if (article) {
			this.#articleListView.updateItem(article.id, article);
			this.#articleDetailView.setArticle(article);

			this.#articleEditorView.hide();
			this.#articleDetailView.show();
		} else {
			const messageView = await new HanulseMessageView({
				"message": "기록을 수정할 수 없습니다.",
			}).build();

			const overlayView = new HanulseOverlayView();
			overlayView.setContentView(messageView);
			overlayView.show();
		}

		this.#loadingView.hide();
	}
}