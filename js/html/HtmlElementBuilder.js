class HtmlElementBuilder {
	static _dataIndex = 0;
	static _dataMap = {};

	_elements;

	constructor(elements) {
		if (!elements) {
			this._elements = [];
		} else {
			this._elements = elements instanceof Array? elements: [elements];
		}
	}

	get() {
		return this._elements[0];
	}

	all() {
		return this._elements;
	}

	clone() {
		return new HtmlElementBuilder(this._elements.map(element => element.cloneNode(true)));
	}

	static _registerData(value) {
		const index = HtmlElementBuilder._dataIndex++;
		HtmlElementBuilder._dataMap[index] = {"value": value, "ref": 0};
		return index;
	}

	static _getData(index) {
		const data = HtmlElementBuilder._dataMap[index];
		return data && data["value"];
	}

	static _refData(index) {
		const data = HtmlElementBuilder._dataMap[index];
		if (data) {
			data["ref"]++;
		}
	}

	static _unrefData(index) {
		const data = HtmlElementBuilder._dataMap[index];
		if (data) {
			if (--data["ref"] == 0) {
				delete HtmlElementBuilder._dataMap[index];
			}
		}
	}

	setData(key, value) {
		const index = HtmlElementBuilder._registerData(value);
		this._elements.forEach(element => {
			if (element.dataset[key] != null) {
				HtmlElementBuilder._unrefData(element.dataset[key]);
			}
			element.dataset[key] = index;
			HtmlElementBuilder._refData(index);
		})
	}

	getData(key) {
		for (const i in this._elements) {
			const index = this._elements[i].dataset[key];
			const value = HtmlElementBuilder._getData(index);
			if (value) return value;
		}
		return null;
	}

	remove() {
		this._elements.forEach(element => {
			for (const key in element.dataset) {
				const index = element.dataset[key];
				HtmlElementBuilder._unrefData(index);
			}
			element.remove();
		});
		this._elements.splice(0);
	}

	html(html) {
		this._elements.forEach(element => element.innerHTML = html);
		return this;
	}

	htmlFromText(text) {
		return this.html(text.replace(/\n/g, "<br>"));
	}
	
	removeClass(name) {
		this._elements.forEach(element => element.classList.remove(name));
		return this;
	}

	attributes(attributesObject) {
		for (const key in attributesObject) {
			this._elements.forEach(element => element.setAttribute(key, attributesObject[key]));
		}
		return this;
	}

	attributesAsync(attributesObject) {
		setTimeout(() => this.attributes(attributesObject), 10);
		return this;
	}

	css(styleObject) {
		for (const key in styleObject) {
			this._elements.forEach(element => element.style[key] = styleObject[key]);
		}
		return this;
	}

	cssAsync(styleObject) {
		setTimeout(() => this.css(styleObject), 10);
		return this;
	}

	text(text) {
		this._elements.forEach(element => element.textContent = text);
		return this;
	}

	append(childElement) {
		this._elements.forEach(element => element.appendChild(childElement));
		return this;
	}

	appendTo(parentElement) {
		this._elements.forEach(element => parentElement.appendChild(element));
		return this;
	}

	clear() {
		this._elements.forEach(element => element.innerHTML = "");
		return this;
	}

	find(selector) {
		for (const element of this._elements) {
			const e = element.querySelector(selector);
			if (e) {
				return new HtmlElementBuilder(e);
			}
		}
		return new HtmlElementBuilder();
	}

	show() {
		this._elements.forEach(element => element.style["display"] = "");
		return this;
	}

	hide() {
		this._elements.forEach(element => element.style["display"] = "none");
		return this;
	}

	fadeIn() {
		this._elements.forEach(element => element.style["display"] = "");
		return this;
	}

	fadeOut() {
		this._elements.forEach(element => element.style["display"] = "none");
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