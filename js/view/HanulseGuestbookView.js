class HanulseGuestbookView extends HanulseView {
	static _templatePath = "./template/guestbook.html";

	_titleElementWrap;

	_loadingView;

	constructor() {
		super();

		this._initializeGuestbookView();
	}

	_initializeGuestbookView() {
		this.setElement(HtmlHelper.createHtml(HtmlTemplate.get(HanulseTableView._templatePath)).get());

		this._titleElementWrap = $(this.findChildElement("._title"));

		this._initializeLoadingView();
	}

	_initializeLoadingView() {
		this.addChildView(this._loadingView = new HanulseLoadingView());
	}

	setTitle(title) {
		this._titleElementWrap.text(title);
	}
}