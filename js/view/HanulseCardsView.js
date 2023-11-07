class HanulseCardsView {
	static #LIST_TEMPLATE_PATH = "./template/card-list.html";
	static #CARD_TEMPLATE_PATH = "./template/card-list-item.html";

	#rootElement;
	#cardElement;

	#title;
	#cards;

	constructor(options) {
		this.#title = options.title || "제목 없음";
		this.#cards = options.cards || [];
	}

	getElement() {
		return this.#rootElement.get();
	}

	async build() {
		this.#rootElement = await HtmlHelper.createFromUrl(HanulseCardsView.#LIST_TEMPLATE_PATH);
		this.#cardElement = await HtmlHelper.createFromUrl(HanulseCardsView.#CARD_TEMPLATE_PATH);

		this.#validate();

		return this;
	}

	async #validate() {
		const titleElement = this.#rootElement.find("._title");
		const cardsElement = this.#rootElement.find("._cards");

		titleElement.text(this.#title);
		cardsElement.clear();
		this.#cards.forEach(card => {
			const cardElement = this.#cardElement.clone();
			cardElement.find("._title").text(card.title);
			cardElement.find("._content").text(card.content);
			if (card.link) {
				cardElement.find("._link-wrap").show();
				cardElement.find("._link").text(card.link);
			}
			cardsElement.append(cardElement.get());
		});
	}
}