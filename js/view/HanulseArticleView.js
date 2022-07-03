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
			paginationItem.css({"background-color": "rgba(255, 255, 255, 0.5)"}); 
		} else {
			paginationItem.one("click", () => {
				this._pageIndex = pageIndex;
				this.clearArticleItems();
				this.clearPaginationItem();
				this._requestArticleList();
			});
		}
		
		this._articleListPaginationElementWrap.append(paginationItem);
	}

	clearArticleItems() {
		this._articleListElementWrap.empty();
	}

	clearPaginationItem() {
		this._articleListPaginationElementWrap.empty();
	}

	_requestArticleList() {
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

		const countOfPage = Math.ceil(articleList.countOfTotal / articleList.countPerPage);
		const firstPageIndex = Math.max(articleList.pageIndex - 2, 0);
		const lastPageIndex = Math.min(articleList.pageIndex + 4, countOfPage - 1);

		for (let i = firstPageIndex; i <= lastPageIndex; i++) {
			this.addPaginationItem(i, i == articleList.pageIndex);
		}
	}

	_formatDate(dateString) {
		const date = new Date(dateString);
		const year = ("000" + date.getFullYear()).slice(-4);
		const month = ("0" + (date.getMonth() + 1)).slice(-2);
		const dom = ("0" + date.getDate()).slice(-2);
		return year + "-" + month + "-" + dom;
	}
	
	_showLoading() {
		this._loadingElementWrap.show();
	}
	
	_hideLoading() {
		this._loadingElementWrap.hide();
	}
}