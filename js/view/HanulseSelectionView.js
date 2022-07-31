class HanulseSelectionView extends HanulseView {
	static _templatePath = "./template/selection.html";

	_messageElementWrap;
	_optionsElementWrap;

	_onSelectOptionCallback;

	constructor() {
		super();

		this._initializeSelectionView();
	}

	_initializeSelectionView() {
		this.setElement(HtmlHelper.createHtml(HtmlTemplate.get(HanulseSelectionView._templatePath)).get());

		this._messageElementWrap = $(this.findChildElement("._message"));
		this._optionsElementWrap = $(this.findChildElement("._options"));
	}

	setOnSelectOptionCallback(onSelectOptionCallback) {
		this._onSelectOptionCallback = onSelectOptionCallback;
	}

	setMessage(message) {
		this._messageElementWrap.text(message);
	}

	setOptions(options) {
		this._optionsElementWrap.empty();

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
			if (this._onSelectOptionCallback) {
				this._onSelectOptionCallback(option);
			}
		});

		this._optionsElementWrap.append(optionItem);
	}
}