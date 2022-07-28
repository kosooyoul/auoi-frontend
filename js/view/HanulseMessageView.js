class HanulseMessageView extends HanulseView {
	static _templatePath = "./template/message.html";

	_elementWrap;

	constructor() {
		super();

		this._initializeMessageView();
	}

	_initializeMessageView() {
		this._elementWrap = HtmlHelper.createHtml(HtmlTemplate.get(HanulseMessageView._templatePath));
	}

	getElement() {
		return this._elementWrap.get(0);
	}

	setMessage(message) {
		this._elementWrap.find("._message").htmlFromText(message);
	}
}