class HtmlTemplate {
	static #templates = {};

	static async fetch(url) {
		if (this.#templates[url]) {
			return this.#templates[url];
		}

		const html = await HanulseAjax.html(url);

		this.#templates[url] = html;

		return html;
	}
}