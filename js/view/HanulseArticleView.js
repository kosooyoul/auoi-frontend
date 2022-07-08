class HanulseArticleView extends HanulseOverlayView {
	static _templateArticleListPath = "./template/article-list.html";
	static _templateArticleListItemPath = "./template/article-list-item.html";
	static _templateArticleListPaginationItemPath = "./template/article-list-pagination-item.html";

	_articleElementWrap;
	_articleListElementWrap;

	_tag;
	_authorId;
	_pageIndex = 0;
	_countPerPage = 10;

	constructor() {
		super();

		this._initializeArticleView();
	}

	_initializeArticleView() {
		this._articleElementWrap = $($.parseHTML(HtmlTemplate.get(HanulseArticleView._templateArticleListPath)));
		this._articleListElementWrap = this._articleElementWrap.find("._list");
		this._articleListPaginationElementWrap = this._articleElementWrap.find("._pagination");
		this._pageElementWrap = this._articleElementWrap.find("._page");
		this._loadingElementWrap = this._articleElementWrap.find("._loading");
		
		this.addOverlayElement(this._articleElementWrap.get(0));
	}

	setTitle(title) {
		this._articleElementWrap.find("._title").text(title || "제목 없음");
	}

	setTag(tag) {
		this._tag = tag;
	}

	setAuthorId(authorId) {
		this._authorId = authorId;
	}

	load() {
		this._requestArticleList();
	}
	
	addArticleItem(articleItem) {
		const articleListItem = $($.parseHTML(HtmlTemplate.get(HanulseArticleView._templateArticleListItemPath)));

		articleListItem.one("click", () => this.hide());
		
		articleListItem.find("._no").text(articleItem.no);
		articleListItem.find("._title").text(articleItem.title);
		articleListItem.find("._author").text(articleItem.authorName);
		articleListItem.find("._created-at").text(this._formatDate(articleItem.createdAt));
		
		this._articleListElementWrap.append(articleListItem);
	}

	addPaginationItem(pageIndex, selected) {
		const paginationItem = $($.parseHTML(HtmlTemplate.get(HanulseArticleView._templateArticleListPaginationItemPath)));
		
		paginationItem.text(pageIndex + 1);
		if (selected) {
			paginationItem.css({"background-color": "rgba(0, 127, 127, 0.5)"}); 
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
				"tag": this._tag,
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
				title: article.title,
				authorId: article.authorId,
				authorName: article.authorName,
				createdAt: this._formatDate(article.createdAt),
			};
		});
		articleItems.forEach(articleItem => this.addArticleItem(articleItem));

		const pageIndex = parseInt(articleList.pageIndex);
		const countOfPage = Math.ceil(articleList.countOfTotal / articleList.countPerPage);
		const firstPageIndex = Math.max(pageIndex - 2, 0);
		const lastPageIndex = Math.min(pageIndex + 4, countOfPage - 1);

		for (let i = firstPageIndex; i <= lastPageIndex; i++) {
			this.addPaginationItem(i, i == pageIndex);
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