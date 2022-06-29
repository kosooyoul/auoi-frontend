class HtmlHelper {
	static createTag(tag) {
		const element = document.createElement(tag);
		return new HtmlElementBuilder(element);
	}

	static createHtml(html) {
		const element = document.createElement("div");
		element.innerHTML = html;
		return new HtmlElementBuilder(element.children[0]);
	}

	static createFromUrl(url) {
		const element = document.createElement("div");
		const html = $.ajax({
			"url": url,
			"async": false
		});
		return new HtmlElementBuilder(element).outerHtml(html);
	}

	static find(selector, parentElement) {
		const element = (parentElement || window.document).querySelector(selector);
		return new HtmlElementBuilder(element);
	}
	
	static findAll(selector, parentElement) {
		const elements = (parentElement || window.document).querySelector(selector);
		return new HtmlElementBuilder(elements);
	}
}