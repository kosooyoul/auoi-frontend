class HanulseGuestbookListView extends HanulseView {
	static _templateGuestbookListPath = "./template/guestbook/guestbook-list.html";
	static _templateGuestbookListItemPath = "./template/guestbook/guestbook-list-item.html";
	static _templateGuestbookListPaginationItemPath = "./template/guestbook/guestbook-list-pagination-item.html";

	_guestbookListElementWrap;
	_guestbookListPaginationElementWrap;
	_pageElementWrap;
	_loadingElementWrap;

	_filter = {
		ownerId: null,
	};

	_pageIndex = 0;
	_countPerPage = 5;

	_onClickGuestbookItemCallback;

	constructor() {
		super();
	}

	load(callback) {
		HtmlTemplate.fetch(HanulseGuestbookListView._templateGuestbookListPath, (data) => {
			this.setElement(HtmlHelper.createHtml(data).get());
			
			this._titleElementWrap = $(this.findChildElement("._title"));
			this._guestbookListElementWrap = $(this.findChildElement("._list"));
			this._guestbookListPaginationElementWrap = $(this.findChildElement("._pagination"));
			this._pageElementWrap = $(this.findChildElement("._page"));
			this._loadingElementWrap = $(this.findChildElement("._loading"));
			
			this._authorInputElementWrap = $(this.findChildElement("._author-input"));
			this._contentInputElementWrap = $(this.findChildElement("._content-input"));
			this._createdAtInputElementWrap = $(this.findChildElement("._created-at-input"));
			this._saveButtonElementWrap = $(this.findChildElement("._save-button"));
			
			this._saveButtonElementWrap.on("click", () => {
				this._showLoading();
				HanulseGuestbookApis.createGuestbook(this._getFields(), (guestbook) => {
					if (guestbook) {
						this._clearFields();
						this._requestGuestbookList();
					} else {
						const messageView = new HanulseMessageView();
						messageView.load(() => {
							messageView.setMessage("방명록을 저장할 수 없습니다.");
							
							const overlayView = new HanulseOverlayView();
							overlayView.setContentView(messageView);
							overlayView.show();
						});
					}
					
					this._hideLoading();
				});
			});

			callback && callback();
		});
	}

	setTitle(title) {
		this._titleElementWrap.text(title || "제목 없음");
	}

	setFilter(filter) {
		console.log(filter)
		this._filter.ownerId = filter.owner;
	}

	updateItem(articeId, guestbook) {
		const guestbookListItem = $(this.findChildElement("[data-id=" + articeId + "]"));

		guestbookListItem.find("._author").text(guestbook.authorName);
		guestbookListItem.find("._content").text(guestbook.content);
		guestbookListItem.find("._created-at").text(this._formatDateTime(guestbook.createdAt));
	}

	requestGuestbookList() {
		this._requestGuestbookList();
	}
	
	_addGuestbookItem(guestbookItem) {
		const guestbookListItem = $($.parseHTML(HtmlTemplate.get(HanulseGuestbookListView._templateGuestbookListItemPath)));

		guestbookListItem.attr("data-id", guestbookItem.id);
		guestbookListItem.find("._no").text(guestbookItem.no);
		guestbookListItem.find("._author").text(guestbookItem.authorName);
		guestbookListItem.find("._content").text(guestbookItem.content);
		guestbookListItem.find("._created-at").text(this._formatDateTime(guestbookItem.createdAt));

		this._guestbookListElementWrap.append(guestbookListItem);
	}

	_addPaginationItem(pageIndex, selected) {
		const paginationItem = $($.parseHTML(HtmlTemplate.get(HanulseGuestbookListView._templateGuestbookListPaginationItemPath)));
		
		paginationItem.text(pageIndex + 1);
		if (selected) {
			paginationItem.css({"background-color": "rgba(127, 127, 127, 0.5)"}); 
		} else {
			paginationItem.one("click", () => {
				this._pageIndex = pageIndex;
				this._requestGuestbookList();
			});
		}
		
		this._guestbookListPaginationElementWrap.append(paginationItem);
	}

	_requestGuestbookList() {
		const options = {
			"pageIndex": this._pageIndex,
			"countPerPage": this._countPerPage,
		}

		this._invisibleGuestbookList();
		this._showLoading();
		HanulseGuestbookApis.requestGuestbookList(this._filter, options, (guestbookList) => {
			if (guestbookList == null) {
				return;
			}

			this._hideLoading();
			this._clearGuestbookList();
			this._updateGuestbookList(guestbookList);
		});
	}

	_updateGuestbookList(guestbookList) {
		const firstGuestbookNo = guestbookList.countOfTotal - (guestbookList.countPerPage * guestbookList.pageIndex);
		const guestbookItems = guestbookList.guestbooks.map((guestbook, index) => {
			return {
				id: guestbook.id,
				no: firstGuestbookNo - index,
				authorId: guestbook.authorId,
				authorName: guestbook.authorName,
				content: guestbook.content,
				readable: guestbook.readable,
				createdAt: guestbook.createdAt,
			};
		});
		guestbookItems.forEach(guestbookItem => this._addGuestbookItem(guestbookItem));

		const pageIndex = parseInt(guestbookList.pageIndex);
		const countOfPage = Math.ceil(guestbookList.countOfTotal / guestbookList.countPerPage);
		const firstPageIndex = Math.max(pageIndex - 3, 0);
		const lastPageIndex = Math.min(pageIndex + 3, countOfPage - 1);

		for (let i = firstPageIndex; i <= lastPageIndex; i++) {
			this._addPaginationItem(i, i == pageIndex);
		}

		this._pageElementWrap.text(pageIndex + 1);
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

	_invisibleGuestbookList() {
		this._guestbookListElementWrap.children().css({"visibility": "invisible"});
		this._guestbookListPaginationElementWrap.children().css({"visibility": "invisible"});
	}

	_hideGuestbookList() {
		this._guestbookListElementWrap.hide();
		this._guestbookListPaginationElementWrap.hide();
	}

	_showGuestbookList() {
		this._guestbookListElementWrap.show();
		this._guestbookListPaginationElementWrap.show();
	}

	_clearGuestbookList() {
		this._guestbookListElementWrap.empty();
		this._guestbookListPaginationElementWrap.empty();
	}

	_showLoading() {
		this._loadingElementWrap.fadeIn();
	}
	
	_hideLoading() {
		this._loadingElementWrap.stop().fadeOut();
	}

	_getFields() {
		const author = this._authorInputElementWrap.val().trim();
		const content = this._contentInputElementWrap.val().trim();
		// const createdAtString = this._createdAtInputElementWrap.val().trim();
		// const createdAt = new Date(createdAtString);

		if (author.length == 0) return this._authorInputElementWrap.focus();
		if (content.length == 0) return this._contentInputElementWrap.focus();

		const guestbookFields = {};
		guestbookFields.ownerId = this._filter.ownerId;
		guestbookFields.authorName = author;
		guestbookFields.content = content;
		// if (isNaN(createdAt) == false) guestbookFields.createdAt = createdAt;

		return guestbookFields;
	}

	_clearFields() {
		this._authorInputElementWrap.val(null);
		this._contentInputElementWrap.val(null);
		this._createdAtInputElementWrap.val(null);
	}
}