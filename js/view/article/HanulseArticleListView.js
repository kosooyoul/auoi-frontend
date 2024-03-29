class HanulseArticleListView extends HanulseView {
	static _templateArticleListPath = "./template/article/article-list.html";
	static _templateArticleListItemPath = "./template/article/article-list-item.html";
	static _templateArticleListPaginationItemPath = "./template/article/article-list-pagination-item.html";

	_articleListElementWrap;
	_articleListPaginationElementWrap;
	_pageElementWrap;
	_loadingElementWrap;

	_filter = {
		tags: null,
		ownerId: null,
		authorId: null,
	};

	_pageIndex = 0;
	_countPerPage = 10;

	_onClickArticleItemCallback;

	constructor() {
		super();
	}

	async load() {
		await this._initializeArticleListView();
	}

	async _initializeArticleListView() {
		this.setElement(HtmlHelper.createHtml(await HtmlTemplate.fetch(HanulseArticleListView._templateArticleListPath)).get());

		this._titleElementWrap = $(this.findChildElement("._title"));
		this._articleListElementWrap = $(this.findChildElement("._list"));
		this._articleListPaginationElementWrap = $(this.findChildElement("._pagination"));
		this._pageElementWrap = $(this.findChildElement("._page"));
		this._loadingElementWrap = $(this.findChildElement("._loading"));
	}

	setOnClickArticleItemCallback(onClickArticleItemCallback) {
		this._onClickArticleItemCallback = onClickArticleItemCallback;
	}

	setTitle(title) {
		this._titleElementWrap.text(title || "제목 없음");
	}

	setFilter(filter) {
		this._filter.tags = filter.tags;
		this._filter.ownerId = filter.owner;
		this._filter.authorId = filter.author;
	}

	updateItem(articeId, article) {
		const articleListItem = $(this.findChildElement("[data-id=" + articeId + "]"));

		articleListItem.find("._subject").text(article.subject);
		articleListItem.find("._author").text(article.authorName);
		articleListItem.find("._created-at").text(this._formatDate(article.createdAt));
	}

	loadList() {
		this._requestArticleList();
	}
	
	async _addArticleItem(articleItem) {
		const articleListItem = $($.parseHTML(await HtmlTemplate.fetch(HanulseArticleListView._templateArticleListItemPath)));

		articleListItem.attr("data-id", articleItem.id);
		articleListItem.find("._no").text(articleItem.no);
		articleListItem.find("._subject").text(articleItem.subject);
		articleListItem.find("._author").text(articleItem.authorName);
		articleListItem.find("._created-at").text(this._formatDate(articleItem.createdAt));

		if (articleItem.readable == false) {
			articleListItem.css({"color": "rgb(144, 144, 144)"})
		} else {
			articleListItem.on("click", () => {
				if (this._onClickArticleItemCallback) {
					this._onClickArticleItemCallback(articleItem.id);
				}
			});
		}

		this._articleListElementWrap.append(articleListItem);
	}

	async _addPaginationItem(pageIndex, selected) {
		const paginationItem = $($.parseHTML(await HtmlTemplate.fetch(HanulseArticleListView._templateArticleListPaginationItemPath)));
		
		paginationItem.text(pageIndex + 1);
		if (selected) {
			paginationItem.css({"background-color": "rgba(127, 127, 127, 0.5)"}); 
		} else {
			paginationItem.one("click", () => {
				this._pageIndex = pageIndex;
				this._requestArticleList();
			});
		}
		
		this._articleListPaginationElementWrap.append(paginationItem);
	}

	_requestArticleList() {
		const options = {
			"pageIndex": this._pageIndex,
			"countPerPage": this._countPerPage,
		}

		this._invisibleArticleList();
		this._showLoading();
		HanulseArticleApis.requestArticleList(this._filter, options, (articleList) => {
			if (articleList == null) {
				return;
			}

			this._hideLoading();
			this._clearArticleList();
			this._updateArticleList(articleList);
		});
	}

	_updateArticleList(articleList) {
		const firstArticleNo = articleList.countOfTotal - (articleList.countPerPage * articleList.pageIndex);
		const articleItems = articleList.articles.map((article, index) => {
			return {
				id: article.id,
				no: firstArticleNo - index,
				subject: article.subject,
				authorId: article.authorId,
				authorName: article.authorName,
				readable: article.readable,
				createdAt: article.createdAt,
			};
		});
		articleItems.forEach(articleItem => this._addArticleItem(articleItem));

		const pageIndex = parseInt(articleList.pageIndex);
		const countOfPage = Math.ceil(articleList.countOfTotal / articleList.countPerPage);
		const firstPageIndex = Math.max(pageIndex - 3, 0);
		const lastPageIndex = Math.min(pageIndex + 3, countOfPage - 1);

		for (let i = firstPageIndex; i <= lastPageIndex; i++) {
			this._addPaginationItem(i, i == pageIndex);
		}

		this._pageElementWrap.text(pageIndex + 1);
	}

	_formatDate(dateString) {
		const date = new Date(dateString);
		const year = ("000" + date.getFullYear()).slice(-4);
		const month = ("0" + (date.getMonth() + 1)).slice(-2);
		const dom = ("0" + date.getDate()).slice(-2);
		return year + "-" + month + "-" + dom;
	}
	
	_invisibleArticleList() {
		this._articleListElementWrap.children().css({"visibility": "invisible"});
		this._articleListPaginationElementWrap.children().css({"visibility": "invisible"});
	}

	_hideArticleList() {
		this._articleListElementWrap.hide();
		this._articleListPaginationElementWrap.hide();
	}

	_showArticleList() {
		this._articleListElementWrap.show();
		this._articleListPaginationElementWrap.show();
	}

	_clearArticleList() {
		this._articleListElementWrap.empty();
		this._articleListPaginationElementWrap.empty();
	}

	_showLoading() {
		this._loadingElementWrap.fadeIn();
	}
	
	_hideLoading() {
		this._loadingElementWrap.stop().fadeOut();
	}
}