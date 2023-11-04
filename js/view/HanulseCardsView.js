class HanulseCardsView extends HanulseView {
	static _templatePath = "./template/cards.html";

	#titleElementWrap;
	#cardsElementWrap;

	#colsOptions = [];

	constructor() {
		super();
	}

	async load() {
		const html = await HtmlTemplate.fetch(HanulseCardsView._templatePath);
		this.setElement(HtmlHelper.createHtml(html).get());

		this.#titleElementWrap = $(this.findChildElement("._title"));
		this.#cardsElementWrap = $(this.findChildElement("._cards"));
	}

	setTitle(title) {
		this.#titleElementWrap.text(title || "제목 없음");
	}

	setColsOptions(colsOptions) {
		this.#colsOptions = colsOptions;
	}

	setCards(cards) {
		this.#cardsElementWrap.empty();

		const cardsWrap = $("<div>").css({
			"padding": "10px",
			"user-select": "text",
			"word-break": "break-all"
		});
		cards.forEach(card => {
			const cardWrap = $("<div>").css({
				"margin": "4px",
				"padding": "4px",
				"border-radius": "8px",
				"background-color": "rgba(0, 0, 0, 0.4)"
			});
			cardsWrap.append(cardWrap);

			const titleWrap = $("<div>").css({
				"padding": "8px",
				"font-size": "14px",
			});
			titleWrap.text(card.title);
			cardWrap.append(titleWrap);

			const contentWrap = $("<div>").css({
				"padding": "8px",
				"font-size": "14px",
				"word-break": "break-word",
				"color": "rgb(180, 180, 180)",
			});
			contentWrap.text(card.content);
			cardWrap.append(contentWrap);

			if (card.link) {
				const linkWrap = $("<div>").css({
					"padding": "8px",
					"font-size": "14px",
					"text-overflow": "ellisis",
				});
				const linkAnchor = $("<a class=\"link\" target=\"_blank\">")
				linkAnchor.attr("href", card.link);
				linkAnchor.text(card.link);
				linkWrap.append(linkAnchor);
				cardWrap.append(linkWrap);
			}
		});

		this.#cardsElementWrap.append(cardsWrap);
	}
}