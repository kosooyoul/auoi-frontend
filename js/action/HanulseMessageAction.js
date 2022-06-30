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
		const message = HtmlHelper.createHtml(this.templateMessage);
		message.find("._message").htmlFromText(data.message);

		this.showOverlay(message.get(), onFinished);
	}

	hideOverlay() {
		var overlay = HtmlHelper.find(".hanulse-overlay");
		var onFinished = overlay.getData("onFinished");
		if (onFinished) {
			onFinished();
		}
		overlay.removeClass("hanulse-overlay");
		overlay.css({"pointer-events": "none"});
		overlay.cssAsync({"opacity": 0});
		setTimeout(() => overlay.remove(), 1000);
	}

	showOverlay(element, onFinished) {
		var _this = this;

		var overlay = HtmlHelper.createHtml("<div class=\"hanulse-overlay _dismiss\">");
		overlay.css({
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
		})
		overlay.setData("onFinished", onFinished);
		overlay.append(element);
		overlay.css({
			"transition": "opacity 0.5s linear",
			"opacity": 0
		});

		overlay.listenEvent("click", function(event) {
			if (event.target.webkitMatchesSelector("._dismiss")) {
				_this.hideOverlay();
			}
		});

		var body = new HtmlElementBuilder(document.body);
		body.listenEvent("keyup", function(event) {
			if (event.which == 27) {
				_this.hideOverlay();
			}
		});

		overlay.appendTo(document.body);
		overlay.cssAsync({"opacity": 1});
	}
}