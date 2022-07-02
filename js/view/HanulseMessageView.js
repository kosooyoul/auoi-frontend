class HanulseMessageView extends HanulseOverlayView {
	static _templatePath = "./template/message.html";

	_elementWrap;
	_messageElementWrap;

	constructor() {
		super();

		this._initializeMessageView();
	}

	_initializeMessageView() {
		this._elementWrap = HtmlHelper.createHtml(HtmlTemplate.get(HanulseMessageView._templatePath));
		this._messageElementWrap = this._elementWrap.find("._message");

		this.addOverlayElement(this._elementWrap.get());
	}

	setMessage(message) {
		this._messageElementWrap.htmlFromText(message);
	}
}