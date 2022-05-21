class HanulseAction {
	static COLOR_BY_MENU_ITEM_TAG = {
		"possible": "rgb(0, 255, 200)",
		"working": "rgb(255, 200, 0)",
		"impossible": "rgb(255, 0, 0)",
		"test": "rgb(200, 100, 255)",
		"deprecated": "rgb(255, 0, 200)"
	}

	static act(action) {
		if (!action) {
			return;
		}

		if (action.type == "message") {
			this.message(action);
		} else if (action.type == "menu") {
			this.menu(action);
		} else if (action.type == "link") {
			this.link(action);
		}
	}

	static message(action) {
		var dialogBox = this.getDialogBox();

		this.getTextBox(action.message).appendTo(dialogBox);

		this.showOverlay(dialogBox);
	}

	static menu(action) {
		var dialogBox = this.getDialogBox();

		for (var menu of action.menu) {
			if (menu.type == "separator") {
				this.getMenuSeparator().appendTo(dialogBox);
			} else {
				this.getMenuItem(menu).appendTo(dialogBox);
			}
		}

		this.showOverlay(dialogBox);
	}

	static link(action) {
		location.assign(action.link);
	}

	static hideOverlay() {
		var overlay = $(".hanulse-overlay");
		overlay.fadeOut(function() {
			overlay.remove();
		});
	}

	static showOverlay(element) {
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
			"background-color": "rgba(0, 0, 0, 0.5)"
		});
		overlay.append(element);
		overlay.hide();

		overlay.one("click", function(event) {
			if (overlay.is(event.target)) {
				_this.hideOverlay();
			}
		});

		$(document).one("keyup", function(event) {
			if (event.which == 27) {
				_this.hideOverlay();
			}
		});

		overlay.appendTo(document.body).fadeIn();
	}

	static getDialogBox() {
		return $("<div>").css({
			"position": "relative",
			"background-color": "rgba(0, 0, 60, 0.6)",
			"border": "1px solid rgba(255, 255, 255, 0.8)",
			"border-radius": "6px",
			"box-shadow": "0px 0px 5px 0px rgba(255, 255, 255, 0.4)",
			"margin": "0px",
			"padding": "10px 10px",
			"pointer-events": "none"
		});
	}

	static getTextBox(text) {
		return $("<p>").css({
			"position": "relative",
			"color": "white",
			"margin": "10px",
			"padding": "0px",
			"font-size": "13px",
			"line-height": "24px",
			"word-break": "keep-all",
			"text-overflow": "ellipsis",
			"overflow": "hidden",
			"pointer-events": "none",
			"user-select": "none"
		}).html(text.replace(/\n/g, "<br>"));
	}

	static getMenuSeparator() {
		var _this = this;

		var menuItem = $("<hr>").css({
			"border-bottom": "1px solid rgba(255, 255, 255, 0.8)",
			"border-top": "none",
			"border-left": "none",
			"border-right": "none"
		});
		
		return menuItem;
	}

	static getMenuItem(menu) {
		var _this = this;

		var menuItem = $("<a>").css({
			"display": "block",
			"position": "relative",
			"border-radius": "4px",
			"color": "white",
			"margin": "2px 4px",
			"padding": "2px 8px",
			"font-size": "13px",
			"line-height": "24px",
			"word-break": "keep-all",
			"text-overflow": "ellipsis",
			"overflow": "hidden",
			"text-decoration": "none",
			"pointer-events": "all",
			"cursor": "pointer",
			"user-select": "none"
		}).attr({"href": menu.link || "javascript:void(0)"});

		menuItem.one("click", function(event) {
			_this.hideOverlay();
		});

		$("<span>").text(menu.title).appendTo(menuItem);
		$("<span>").css({
			"float": "right",
			"margin-left": "20px",
			"color": this.COLOR_BY_MENU_ITEM_TAG[menu.tag] || "rgb(100, 100, 100)"
		}).text(menu.tag).appendTo(menuItem);

		return menuItem;
	}
}