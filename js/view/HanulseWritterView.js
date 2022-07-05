class HanulseWritterView extends HanulseOverlayView {
	static _templatePath = "./template/writer.html";

	_elementWrap;

	constructor() {
		super();

		this._initializeWritterView();
	}

	_initializeWritterView() {
		this._elementWrap = $($.parseHTML(HtmlTemplate.get(HanulseWritterView._templatePath)));
		this._titleInputElementWrap = this._elementWrap.find("._title-input");
		this._contentInputElementWrap = this._elementWrap.find("._content-input");

		this.addOverlayElement(this._elementWrap.get(0));
	}

	setTitle(title) {
		this._elementWrap.find("._title").text(title);
	}
}