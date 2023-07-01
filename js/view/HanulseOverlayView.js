class HanulseOverlayView {
	static KEYCODE_ESCAPE = 27;
	static _globalDismissListeners = (() => {
		var body = new HtmlElementBuilder(document.body);
		body.listenEvent("keydown", (event) => {
			if (event.which == this.KEYCODE_ESCAPE) {
				const listener = this._globalDismissListeners.pop();
				if (listener) {
					listener(event);
				}
			}
		});
		window.addEventListener("hashchange", (event) => {
			this._globalDismissListeners.forEach(listener => listener(event));
			this._globalDismissListeners.splice(0);
		});
		return [];
	})();

	static _registerDismissEventListener(listener) {
		this._globalDismissListeners.push(listener);
	}

	_rootElementWrap;
	_onHideCallback;
	_hidden = true;

	constructor() {
		this._initializeOverlayView();
	}

	_initializeOverlayView() {
		this._rootElementWrap = HtmlHelper.createHtml("<div class=\"hanulse-overlay _dismiss\">");
		this._rootElementWrap.css({
			"display": "flex",
			"flex-direction": "column",
			"justify-content": "center",
			"align-items": "center",
			"position": "absolute",
			"left": "0px",
			"top": "0px",
			"width": "100%",
			"height": "100%",
			"background-color": "rgba(0, 0, 0, 0.6)",
			"z-index": "100001"
		})

		this._rootElementWrap.listenEvent("click", (event) => {
			if (event.target.webkitMatchesSelector("._dismiss")) {
				this.hide();
			}
		});
	}

	setOnHideCallback(onHideCallback) {
		this._onHideCallback = onHideCallback;
	}

	addOverlayElement(element) {
		this._rootElementWrap.append(element);
	}

	setContentView(view) {
		this._rootElementWrap.append(view.getElement());
	}

	show() {
		this._hidden = false;

		this._rootElementWrap.appendTo(document.body);

		this._rootElementWrap.css({"opacity": 0, "transition": "opacity 0.5s linear"});
		this._rootElementWrap.cssAsync({"opacity": 1});

		HanulseOverlayView._registerDismissEventListener(() => this.hide());
	}

	hide() {
		this._rootElementWrap.css({"pointer-events": "none"});
		this._rootElementWrap.cssAsync({"opacity": 0});

		setTimeout(() => this._rootElementWrap.remove(), 500);
		
		if (this._hidden == false) {
			this._onHideCallback && this._onHideCallback();
		}

		this._hidden = true;
	}

	dismiss() {
		this.hide();
	}
}