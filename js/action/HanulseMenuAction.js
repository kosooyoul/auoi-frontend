class HanulseMenuAction {
	static colorByMenuTags = {
		"possible": "rgb(0, 255, 200)",
		"working": "rgb(255, 200, 0)",
		"impossible": "rgb(255, 0, 0)",
		"test": "rgb(200, 100, 255)",
		"deprecated": "rgb(255, 0, 200)",
		"relics": "rgb(172, 172, 172)"
	}

	templateMenuList = null;
	templateMenuListItem = null
	templateMenuListPaginationItem = null

	constructor() {
		this.initialize();
	}

	initialize() {
		this.templateMenuList = HanulseMenuAction.loadTemplate("./template/menu-list.html");
		this.templateMenuListItem = HanulseMenuAction.loadTemplate("./template/menu-list-item.html");
		this.templateMenuListSeparator = HanulseMenuAction.loadTemplate("./template/menu-list-separator.html");
	}

	static loadTemplate(url) {
		const result = $.ajax({
			"url": url,
			"async": false
		});
		return result && result.responseText;
	}

	act(data, onFinished) {
		const menuList = $($.parseHTML(this.templateMenuList));
		menuList.find("._title").text(data.title || "제목 없음");

		const menuListItems = menuList.find("._list")
		data.menu.forEach(menu => {
			if (menu.type == "separator") {
				const menuListSeparator = $($.parseHTML(this.templateMenuListSeparator));

				menuListItems.append(menuListSeparator);
			} else {
				const menuListItem = $($.parseHTML(this.templateMenuListItem));
				
				menuListItem.attr({
					"href": menu.link || "javascript:void(0)"}
				).one("click", () => this.hideOverlay());
				menuListItem.find("._no").text(menu.no);
				menuListItem.find("._title").text(menu.title);
				menuListItem.find("._tag").css({
					"color": HanulseMenuAction.colorByMenuTags[menu.tag] || "rgb(100, 100, 100)"
				}).text(menu.tag);

				menuListItems.append(menuListItem);
			}
		});

		this.showOverlay($(menuList), onFinished);
	}

	hideOverlay() {
		var overlay = $(".hanulse-overlay");
		var onFinished = overlay.data("onFinished");
		if (onFinished) {
			onFinished();
		}
		overlay.fadeOut(function() {
			overlay.remove();
		});
	}

	showOverlay(element, onFinished) {
		var _this = this;

		var overlay = $("<div class=\"hanulse-overlay\">").css({
			"display": "flex",
			"flex-direction": "column",
			"justify-content": "center",
			"align-items": "center",
			"position": "absolute",
			"left": "0px",
			"top": "0px",
			"width": "100%",
			"height": "100%",
			"background-color": "rgba(0, 0, 0, 0.5)",
			"z-index": "100001"
		});
		overlay.data("onFinished", onFinished);
		overlay.append(element);
		overlay.hide();

		overlay.on("click", function(event) {
			if (overlay.is(event.target)) {
				_this.hideOverlay();
			}
		});

		$(document).on("keyup", function(event) {
			if (event.which == 27) {
				_this.hideOverlay();
			}
		});

		overlay.appendTo(document.body).fadeIn();
	}
}