class HanulseArticleView extends HanulseView {

	_rootElementWrap;

	_articleListView;
	_articleDetailView;

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
		this._articleDetailViewElementWrap = $(this._articleDetailView.getElement());

		this._rootElementWrap.append(this._articleListViewElementWrap);
		this._rootElementWrap.append(this._articleDetailViewElementWrap);
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

	_openArticleDetail(articleId) {
		this._rootElementWrap.children().hide();
		this._articleDetailViewElementWrap.show();

		this._articleDetailView.setArticleId(articleId);
		this._articleDetailView.load();
	}

	_closeArticleDetail() {
		this._rootElementWrap.children().hide();
		this._articleListViewElementWrap.show();
	}
}