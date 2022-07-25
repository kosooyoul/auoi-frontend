class HanulseArticleView extends HanulseOverlayView {
	static _templateArticleListPath = "./template/article-list.html";
	static _templateArticleListItemPath = "./template/article-list-item.html";
	static _templateArticleListPaginationItemPath = "./template/article-list-pagination-item.html";
	static _templateArticleDetailPath = "./template/article-detail.html";

	_articleElementWrap;
	_articleListElementWrap;

	_tags;
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
		this._articleDetailElementWrap = this._articleElementWrap.find("._detail");
		this._pageElementWrap = this._articleElementWrap.find("._page");
		this._loadingElementWrap = this._articleElementWrap.find("._loading");
		
		this.addOverlayElement(this._articleElementWrap.get(0));
	}

	setTitle(title) {
		this._articleElementWrap.find("._title").text(title || "제목 없음");
	}

	setTags(tags) {
		this._tags = tags;
	}

	setAuthorId(authorId) {
		this._authorId = authorId;
	}

	load() {
		this._requestArticleList();
	}
	
	addArticleItem(articleItem) {
		const articleListItem = $($.parseHTML(HtmlTemplate.get(HanulseArticleView._templateArticleListItemPath)));

		articleListItem.on("click", () => this._showArticleDetailView(articleItem.id));
		
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
	
	_requestArticleDetail(articleId) {
		const accessToken = HanulseAuthorizationManager.getAccessToken();
		if (!accessToken) {
			return;
		}

		this._hideArticleList();
		this._showLoading();
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
					this._hideLoading();
					this._updateArticleDetail(article);
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
		const firstPageIndex = Math.max(pageIndex - 4, 0);
		const lastPageIndex = Math.min(pageIndex + 4, countOfPage - 1);

		for (let i = firstPageIndex; i <= lastPageIndex; i++) {
			this.addPaginationItem(i, i == pageIndex);
		}

		this._pageElementWrap.text(pageIndex + 1);
	}

	_updateArticleDetail(article) {
		const articleItem = {
			id: article.id,
			title: article.title,
			content: article.content,
			authorId: article.authorId,
			authorName: article.authorName,
			links: article.links,
			attachments: article.attachments,
			tags: article.tags,
			updatedAt: article.updatedAt && this._formatDateTime(article.updatedAt),
			createdAt: this._formatDateTime(article.createdAt)
		};
		
		const _articleDetail = $($.parseHTML(HtmlTemplate.get(HanulseArticleView._templateArticleDetailPath)));
		_articleDetail.find("._title").text(articleItem.title);
		_articleDetail.find("._author").text(articleItem.authorName);
		_articleDetail.find("._content").text(articleItem.content);
		_articleDetail.find("._updated-at").text(articleItem.updatedAt);
		_articleDetail.find("._created-at").text(articleItem.createdAt);

		this._articleDetailElementWrap.append(_articleDetail);

		const tagsElementWrap = _articleDetail.find("._tags");
		articleItem.tags.forEach(tag => tagsElementWrap.append($("<a href=\"javascript:void(0)\" class=\"tag\">").text(tag)));

		const linksElementWrap = _articleDetail.find("._links");
		articleItem.links.forEach(link => linksElementWrap.append($("<a href=\"" + link + "\" class=\"link\" target=\"_blank\">").text(link)));

		_articleDetail.find("._back-button").on("click", () => {
			this._articleDetailElementWrap.empty().hide();
			this._showArticleList();
		});
		this._articleDetailElementWrap.show();
	}

	_formatDate(dateString) {
		const date = new Date(dateString);
		const year = ("000" + date.getFullYear()).slice(-4);
		const month = ("0" + (date.getMonth() + 1)).slice(-2);
		const dom = ("0" + date.getDate()).slice(-2);
		return year + "-" + month + "-" + dom;
	}
	
	_formatDateTime(dateString) {
		const date = new Date(dateString);
		const year = ("000" + date.getFullYear()).slice(-4);
		const month = ("0" + (date.getMonth() + 1)).slice(-2);
		const dom = ("0" + date.getDate()).slice(-2);
		const hours = ("0" + date.getHours()).slice(-2);
		const minutes = ("0" + date.getMinutes()).slice(-2);
		const seconds = ("0" + date.getSeconds()).slice(-2);
		return year + "-" + month + "-" + dom + " " + hours + ":" + minutes + ":" + seconds;
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
	
	_showArticleDetailView(articleId) {
		this._requestArticleDetail(articleId);
	}
}