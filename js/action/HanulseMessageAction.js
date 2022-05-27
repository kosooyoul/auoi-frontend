class HanulseMessageAction {
	act(data, onFinished) {
		var dialogBox = this.getDialogBox();

		this.getTextBox(data.message).appendTo(dialogBox);

		this.showOverlay(dialogBox, onFinished);
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

	getDialogBox() {
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

	getTextBox(text) {
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
}