class HtmlElementBuilder {
	_elements;

	constructor(elements) {
		this._elements = elements instanceof Array? elements: [elements];
	}

	get() {
		return this._elements[0];
	}

	all() {
		return this._elements;
	}

	outerHtml(html) {
		this._elements.forEach(element => element.outerHtml = html);
		return this;
	}

	innerHtml(html) {
		this._elements.forEach(element => element.oinnerHtml = html);
		return this;
	}

	css(styleObject) {
		for (const key of styleObject) {
			this._elements.forEach(element => element.style[key] = styleObject[key]);
		}
		return this;
	}

	text(text) {
		this._elements.forEach(element => element.textContent = text);
		return this;
	}

	listenEvent(eventName, eventHandler) {
		this._elements.forEach(element => element.addEventListener(eventName, eventHandler));
		return this;
	}

	listenEvents(eventNames, eventHandler) {
		for (const eventName of eventNames) {
			this._elements.forEach(element => element.addEventListener(eventName, eventHandler));
		}
		return this;
	}
}