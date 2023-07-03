class HtmlTemplate {
	static _templates = {};

	static _loadTemplate(url, async, callback) {
		const result = $.ajax({"url": url, "async": async, "success": callback});
		this._templates[url] = result && result.responseText;
		return this._templates[url];
	}
	
	static get(url) {
		return this._templates[url] || this._loadTemplate(url, false);
	}

	static fetch(url, callback) {
		if (this._templates[url]) {
			return callback(this._templates[url]);
		}
		return this._loadTemplate(url, true, (data) => callback(data));
	}
}