class HanulseMessageView extends HanulseOverlayView {
	static _templatePath = "./template/message.html";

	_elementWrap;

	constructor() {
		super();

		this._initializeMessageView();
	}

	_initializeMessageView() {
		this._elementWrap = HtmlHelper.createHtml(HtmlTemplate.get(HanulseMessageView._templatePath));

		this.addOverlayElement(this._elementWrap.get());
	}

	setMessage(message) {
		this._elementWrap.find("._message").htmlFromText(message);
	}
}