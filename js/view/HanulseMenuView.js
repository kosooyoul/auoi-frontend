class HanulseMenuView extends HanulseOverlayView {
	static _templateMenuListPath = "./template/menu-list.html";
	static _templateMenuListItemPath = "./template/menu-list-item.html";
	static _templateMenuListSeparatorPath = "./template/menu-list-separator.html";

	static _tagColors = {
		"possible": "rgb(0, 255, 200)",
		"working": "rgb(255, 200, 0)",
		"impossible": "rgb(255, 0, 0)",
		"test": "rgb(200, 100, 255)",
		"deprecated": "rgb(255, 0, 200)",
		"relics": "rgb(172, 172, 172)"
	};

	_menuElementWrap;
	_menuListElementWrap;

	constructor() {
		super();

		this._initializeMenuView();
	}

	_initializeMenuView() {
		this._menuElementWrap = $($.parseHTML(HtmlTemplate.get(HanulseMenuView._templateMenuListPath)));
		this._menuListElementWrap = this._menuElementWrap.find("._list");

		this.addOverlayElement(this._menuElementWrap.get(0));
	}

	addMenuItem(menuItem) {
		if (menuItem.type == "separator") {
			const menuListSeparator = $($.parseHTML(HtmlTemplate.get(HanulseMenuView._templateMenuListSeparatorPath)));
			this._menuListElementWrap.append(menuListSeparator);
			return;
		}

		const menuListItem = $($.parseHTML(HtmlTemplate.get(HanulseMenuView._templateMenuListItemPath)));
		menuListItem.attr({"href": menuItem.link || "javascript:void(0)"});
		menuListItem.one("click", () => this.hide());
		
		menuListItem.find("._title").text(menuItem.title);
		menuListItem.find("._tag").text(menuItem.tag).css({
			"color": HanulseMenuView._tagColors[menuItem.tag] || "rgb(100, 100, 100)"
		});

		this._menuListElementWrap.append(menuListItem);
	}
}