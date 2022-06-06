class HanulseMessageAction {
	templateMessage = null;

	constructor() {
		this.initialize();
	}

	initialize() {
		this.templateMessage = HanulseMessageAction.loadTemplate("./template/message.html");
	}

	static loadTemplate(url) {
		const result = $.ajax({
			"url": url,
			"async": false
		});
		return result && result.responseText;
	}
	
	act(data, onFinished) {
		const message = $($.parseHTML(this.templateMessage));
		message.find("._message").html(data.message.replace(/\n/g, "<br>"));

		this.showOverlay(message, onFinished);
	}

	hideOverlay() {
		var overlay = $(".hanulse-overlay");
		var onFinished = overlay.data("onFinished");
		if (onFinished) {
			onFinished();
		}
		overlay.css({"pointer-events": "none"}).fadeOut(function() {
			overlay.remove();
		});
	}

	showOverlay(element, onFinished) {
		var _this = this;

		var overlay = $("<div class=\"hanulse-overlay _dismiss\">").css({
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
			if ($(event.target).is("._dismiss")) {
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