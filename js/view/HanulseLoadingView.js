class HanulseLoadingView {
	static #TEMPLATE = "<div class=\"_loading knead\" style=\"display: none; position: absolute; left: 50%; top: 50%; margin-left: -13px; margin-top: 16px; width: 24px; height: 8px; background-color: white; border: 1px solid white; border-radius: 10px; box-shadow: 0px 0px 8px rgb(0 255 231);\"></div>";

	#rootElement;

	async build() {
		this.#rootElement = HtmlHelper.createHtml(HanulseLoadingView.#TEMPLATE);

		return this;
	}

	getElement() {
		return this.#rootElement.get();
	}

	show() {
		this.#rootElement.fadeIn();
	}
	
	hide() {
		this.#rootElement.fadeOut();
	}
}