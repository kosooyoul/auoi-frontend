class HanulseSelectionView {
	static #SELECTION_TEMPLATE_PATH = "./template/selection.html";
	static #ITEM_TEMPLATE_PATH = "./template/selection-item.html";

	#rootElement;
	#itemElement;

	#message;
	#options;
	#onSelectedListener;

	constructor(options) {
		this.#message = options.message;
		this.#options = options.options;
		this.#onSelectedListener = options.onSelectedListener;
	}

	async build() {
		this.#rootElement = await HtmlHelper.createFromUrl(HanulseSelectionView.#SELECTION_TEMPLATE_PATH);
		this.#itemElement = await HtmlHelper.createFromUrl(HanulseSelectionView.#ITEM_TEMPLATE_PATH);

		this.#validate();

		return this;
	}

	getElement() {
		return this.#rootElement.get();
	}

	#validate() {
		const messageElement = this.#rootElement.find("._message");
		const optionsElement = this.#rootElement.find("._options");

		messageElement.text(this.#message);
		optionsElement.clear();
		this.#options.forEach(option => {
			const optionElement = this.#itemElement.clone();
			optionElement.find("._title").text(option.title);
			optionElement.listenEvent("click", () => {
				if (this.#onSelectedListener) {
					this.#onSelectedListener(option);
				}
			});
			optionsElement.append(optionElement.get());
		});
	}
}