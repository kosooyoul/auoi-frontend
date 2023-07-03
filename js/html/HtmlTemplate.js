class HtmlTemplate {
	static _templates = {};
	
	static get(url) {
		if (this._templates[url]) {
			return this._templates[url];
		}
		const result = $.ajax({"url": url, "async": false});
		this._templates[url] = result && result.responseText;
		return this._templates[url];
	}

	static fetch(url, callback) {
		if (this._templates[url]) {
			return callback(this._templates[url]);
		}
		$.ajax({"url": url, "async": true, "success": (data) => {
			this._templates[url] = data;
			callback(data);
		}});
	}
}