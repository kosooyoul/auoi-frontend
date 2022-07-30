class HanulseArticleListView extends HanulseView {
	static _templateArticleListPath = "./template/article-list.html";
	static _templateArticleListItemPath = "./template/article-list-item.html";
	static _templateArticleListPaginationItemPath = "./template/article-list-pagination-item.html";

	_articleListElementWrap;
	_articleListPaginationElementWrap;
	_pageElementWrap;
	_loadingElementWrap;

	_filter = {
		tags: null,
		authorId: null,
	};

	_pageIndex = 0;
	_countPerPage = 10;

	_onClickItemCallback;

	constructor() {
		super();

		this._initializeArticleListView();
	}

	_initializeArticleListView() {
		this.setElement($.parseHTML(HtmlTemplate.get(HanulseArticleListView._templateArticleListPath)));

		this._titleElementWrap = $(this.findChildElement("._title"));
		this._articleListElementWrap = $(this.findChildElement("._list"));
		this._articleListPaginationElementWrap = $(this.findChildElement("._pagination"));
		this._pageElementWrap = $(this.findChildElement("._page"));
		this._loadingElementWrap = $(this.findChildElement("._loading"));
	}

	setOnClickItemCallback(onClickItemCallback) {
		this._onClickItemCallback = onClickItemCallback;
	}

	setTitle(title) {
		this._titleElementWrap.text(title || "제목 없음");
	}

	load(filter) {
		this._filter.tags = filter.tags;
		this._filter.authorId = filter.authorId;
		this._requestArticleList();
	}
	
	_addArticleItem(articleItem) {
		const articleListItem = $($.parseHTML(HtmlTemplate.get(HanulseArticleListView._templateArticleListItemPath)));

		articleListItem.on("click", () => {
			if (this._onClickItemCallback) {
				this._onClickItemCallback(articleItem.id);
			}
		});
		
		articleListItem.find("._no").text(articleItem.no);
		articleListItem.find("._subject").text(articleItem.subject);
		articleListItem.find("._author").text(articleItem.authorName);
		articleListItem.find("._created-at").text(this._formatDate(articleItem.createdAt));
		
		this._articleListElementWrap.append(articleListItem);
	}

	_addPaginationItem(pageIndex, selected) {
		const paginationItem = $($.parseHTML(HtmlTemplate.get(HanulseArticleListView._templateArticleListPaginationItemPath)));
		
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
		this._invisibleArticleList();
		this._showLoading();
		$.get({
			"url": "https://apis.auoi.net/v1/article/search",
			"dataType": "json",
			"data": {
				"tags": this._tags,
				"authorId": this._authorId,
				"pageIndex": this._pageIndex,
				"countPerPage": this._countPerPage
			},
			"success": (response) => {
				const articleList = response && response.data;
	
				if (articleList) {
					this._hideLoading();
					this._clearArticleList();
					this._updateArticleList(articleList);
				}
			}
		});
	}

	_updateArticleList(articleList) {
		const firstArticleNo = articleList.countOfTotal - (articleList.countPerPage * articleList.pageIndex);
		const articleItems = articleList.articles.map((article, index) => {
			return {
				id: article.id,
				no: firstArticleNo - index,
				subject: article.title,
				authorId: article.authorId,
				authorName: article.authorName,
				createdAt: this._formatDate(article.createdAt),
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