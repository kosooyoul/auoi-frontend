class HanulseGalleryView extends HanulseView {
	static _templatePath = "./template/gallery.html";

	_titleElementWrap;
	_galleryElementWrap;

	_colsOptions = [];

	constructor() {
		super();

		this._initializeGalleryView();
	}

	async _initializeGalleryView() {
		this.setElement(HtmlHelper.createHtml(await HtmlTemplate.fetch(HanulseGalleryView._templatePath)).get());

		this._titleElementWrap = $(this.findChildElement("._title"));
		this._galleryElementWrap = $(this.findChildElement("._gallery"));
	}

	setTitle(title) {
		this._titleElementWrap.text(title || "제목 없음");
	}
}