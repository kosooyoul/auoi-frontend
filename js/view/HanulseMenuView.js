class HanulseMenuView {
	static #LIST_TEMPLATE_PATH = "./template/menu-list.html";
	static #ITEM_TEMPLATE_PATH = "./template/menu-list-item.html";
	static #SEPARATOR_TEMPLATE_PATH = "./template/menu-list-separator.html";

	static #DEFAULT_TAG_COLOR = "rgb(100, 100, 100)";
	static #TAG_COLORS = {
		"possible": "rgb(0, 255, 200)",
		"working": "rgb(255, 200, 0)",
		"impossible": "rgb(255, 0, 0)",
		"test": "rgb(200, 100, 255)",
		"deprecated": "rgb(255, 0, 200)",
		"relics": "rgb(172, 172, 172)"
	};

	#rootElement;
	#itemElement;
	#separatorElement;

	#items;

	constructor(options) {
		this.#items = options.items || [];
	}

	async build() {
		this.#rootElement = await HtmlHelper.createFromUrl(HanulseMenuView.#LIST_TEMPLATE_PATH);
		this.#itemElement = await HtmlHelper.createFromUrl(HanulseMenuView.#ITEM_TEMPLATE_PATH);
		this.#separatorElement = await HtmlHelper.createFromUrl(HanulseMenuView.#SEPARATOR_TEMPLATE_PATH);

		this.#validate();
		
		return this;
	}

	getElement() {
		return this.#rootElement.get(0);
	}

	#validate() {
		const listElement = this.#rootElement.find("._list");

		this.#items.forEach(item => {
			if (item.visible !== false) {
				if (item.type == "separator") {
					listElement.append(this.#createSeparator().get());
				} else {
					listElement.append(this.#createItem(item).get());
				}
			}
		});
	}

	#createItem(item) {
		const itemElement = this.#itemElement.clone();
		itemElement.attributes({ "href": item.link });
		itemElement.find("._title").text(item.title);
		itemElement.find("._tag").text(item.tag).css({ "color": this.#getTagColor(item.tag) });
		return itemElement;
	}

	#createSeparator() {
		return this.#separatorElement.clone();
	}

	#getTagColor(tag) {
		return HanulseMenuView.#TAG_COLORS[tag] || HanulseMenuView.#DEFAULT_TAG_COLOR;
	}
}