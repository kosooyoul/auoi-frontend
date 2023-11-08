class HanulseGuestbookView extends HanulseView {

	_guestbookListView;
	#loadingView;

	constructor() {
		super();
	}

	async load() {
		this.setElement($("<div>").get(0));

		this.#loadingView = new HanulseLoadingView().build();
		this.addChildView(this.#loadingView);

		const guestbookListView = new HanulseGuestbookListView();
		await guestbookListView.load();
		guestbookListView.hide();

		this.addChildView(this._guestbookListView = guestbookListView);
	}

	setTitle(title) {
		this._guestbookListView.setTitle(title);
	}

	setFilter(filter) {
		this._guestbookListView.show();
		this._guestbookListView.setFilter(filter);
		this._guestbookListView.requestGuestbookList();
	}
}