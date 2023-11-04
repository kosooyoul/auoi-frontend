class HanulseSelectionView extends HanulseView {
	static _templatePath = "./template/selection.html";

	#messageElementWrap;
	#optionsElementWrap;

	#onSelectOptionCallback;

	constructor() {
		super();
	}

	async load() {
		const html = await HtmlTemplate.fetch(HanulseSelectionView._templatePath);
		this.setElement(HtmlHelper.createHtml(html).get());

		this.#messageElementWrap = $(this.findChildElement("._message"));
		this.#optionsElementWrap = $(this.findChildElement("._options"));
	}

	setOnSelectOptionCallback(onSelectOptionCallback) {
		this.#onSelectOptionCallback = onSelectOptionCallback;
	}

	setMessage(message) {
		this.#messageElementWrap.text(message);
	}

	setOptions(options) {
		this.#optionsElementWrap.empty();

		options.forEach(option => this._addOptionItem(option));
	}

	_addOptionItem(option) {
		const optionItem = $("<a class=\"_option-button\">");
		optionItem.attr("href", "javascript:void(0)");
		optionItem.css({
			"display": "block",
			"position": "relative",
			"border-radius": "4px",
			"color": "white",
			"margin": "2px 4px",
			"padding": "2px 8px",
			"font-size": "13px",
			"line-height": "24px",
			"word-break": "keep-all",
			"text-overflow": "ellipsis",
			"overflow": "hidden",
			"cursor": "pointer",
			"user-select": "none",
		});
		optionItem.text("> " + option.title);

		optionItem.on("click", () => {
			if (this.#onSelectOptionCallback) {
				this.#onSelectOptionCallback(option);
			}
		});

		this.#optionsElementWrap.append(optionItem);
	}
}