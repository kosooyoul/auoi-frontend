class HanulseGuestbookView extends HanulseView {

	_guestbookListView;
	_loadingView;

	constructor() {
		super();

		this._initializeGuestbookView();
	}

	_initializeGuestbookView() {
		this.setElement($("<div>").get(0));

		this._initializeGuestbookListView();
		this._initializeLoadingView();
	}

	_initializeGuestbookListView() {
		const guestbookListView = new HanulseGuestbookListView();
		guestbookListView.hide();

		this.addChildView(this._guestbookListView = guestbookListView);
	}

	_initializeLoadingView() {
		this.addChildView(this._loadingView = new HanulseLoadingView());
	}

	setOnSaveCallback(onSaveCallback) {
		this._guestbookListView.setOnSaveCallback(onSaveCallback);
	}

	setTitle(title) {
		this._guestbookListView.setTitle(title);
	}

	load(filter) {
		this._guestbookListView.show();
		this._guestbookListView.setFilter(filter);
		this._guestbookListView.load();
	}
}