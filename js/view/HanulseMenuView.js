class HanulseMenuView extends HanulseView {
	static _templateMenuListPath = "./template/menu-list.html";
	static _templateMenuListItemPath = "./template/menu-list-item.html";
	static _templateMenuListSeparatorPath = "./template/menu-list-separator.html";

	static _defaultTagColor = "rgb(100, 100, 100)";
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
	}

	load(callback) {
		HtmlTemplate.fetch(HanulseMenuView._templateMenuListPath, (data) => {
			this._menuElementWrap = $($.parseHTML(data));
			this._menuListElementWrap = this._menuElementWrap.find("._list");
			callback && callback();
		});
	}

	getElement() {
		return this._menuElementWrap.get(0);
	}

	addMenuItem(menuItem) {
		if (menuItem.type == "separator") {
			this._menuListElementWrap.append(this._createMenuSeparator());
		} else {
			this._menuListElementWrap.append(this._createMenuItem(menuItem));
		}
	}

	_createMenuSeparator() {
		return $($.parseHTML(HtmlTemplate.get(HanulseMenuView._templateMenuListSeparatorPath)));
	}

	_createMenuItem(menuItem) {
		const menuListItem = $($.parseHTML(HtmlTemplate.get(HanulseMenuView._templateMenuListItemPath)));
		menuListItem.attr({"href": menuItem.link});
		menuListItem.find("._title").text(menuItem.title);
		menuListItem.find("._tag").text(menuItem.tag).css({"color": this._getTagColor(menuItem.tag)});
		return menuListItem;
	}

	_getTagColor(tag) {
		return HanulseMenuView._tagColors[tag] || HanulseMenuView._defaultTagColor;
	}
}