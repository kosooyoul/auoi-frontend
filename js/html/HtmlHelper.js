class HtmlHelper {
	createTag(tag) {
		const element = document.createElement(tag);
		return new HtmlElementBuilder(element);
	}

	createHtml(html) {
		const element = document.createElement("div");
		return new HtmlElementBuilder(element).outerHtml(html);
	}

	createFromUrl(url) {
		const element = document.createElement("div");
		const html = $.ajax({
			"url": url,
			"async": false
		});
		return new HtmlElementBuilder(element).outerHtml(html);
	}

	find(selector, parentElement) {
		const element = (parentElement || window.document).querySelector(selector);
		return new HtmlElementBuilder(element);
	}
	
	findAll(selector, parentElement) {
		const elements = (parentElement || window.document).querySelector(selector);
		return new HtmlElementBuilder(elements);
	}
}