class HtmlTemplate {
	static _templates = {};

	static _loadTemplate(url) {
		const result = $.ajax({"url": url, "async": false});

		this._templates[url] = result && result.responseText;
		return this._templates[url];
	}
	
	static get(url) {
		return this._templates[url] || this._loadTemplate(url);
	}
}