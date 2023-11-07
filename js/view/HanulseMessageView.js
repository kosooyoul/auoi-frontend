class HanulseMessageView {
	static #TEMPLATE_PATH = "./template/message.html";

	#rootElement;

	#message;

	constructor(options) {
		this.#message = options.message;
	}

	getElement() {
		return this.#rootElement.get();
	}

	async build() {
		this.#rootElement = await HtmlHelper.createFromUrl(HanulseMessageView.#TEMPLATE_PATH);

		this.#validate();

		return this;
	}

	#validate() {
		this.#rootElement.find("._message").htmlFromText(this.#message);
	}
}