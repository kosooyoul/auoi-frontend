class HanulseGuestbookView extends HanulseView {

	_guestbookListView;
	_loadingView;

	constructor() {
		super();
	}

	load(callback) {
		this.setElement($("<div>").get(0));

		const loadingView = new HanulseLoadingView();
		loadingView.load(() => {
			this.addChildView(this._loadingView = loadingView);

			const guestbookListView = new HanulseGuestbookListView();
			guestbookListView.load(() => {
				guestbookListView.hide();

				this.addChildView(this._guestbookListView = guestbookListView);

				callback && callback();
			});
		});

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