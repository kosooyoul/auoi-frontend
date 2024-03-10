class HanulseGuestbookView extends HanulseView {

	#guestbookListView;
	#loadingView;

	constructor() {
		super();
	}

	async load() {
		this.setElement($("<div>").get(0));

		await this.#loadGuestbookListView();
		await this.#loadLoadingView();
	}

	async #loadGuestbookListView() {
		this.#guestbookListView = new HanulseGuestbookListView();

		await this.#guestbookListView.load();
		this.#guestbookListView.hide();

		// this.#guestbookListView.setOnClickGuestbookItemCallback((guestbookId) => this.#onClickGuestbookItemCallback(guestbookId));

		this.addChildView(this.#guestbookListView);
	}

	async #loadLoadingView() {
		this.#loadingView = await new HanulseLoadingView().build();
		this.addChildView(this.#loadingView);
	}

	setTitle(title) {
		this.#guestbookListView.setTitle(title);
	}

	setFilter(filter) {
		this.#guestbookListView.show();
		this.#guestbookListView.setFilter(filter);
		this.#guestbookListView.requestGuestbookList();
	}
}