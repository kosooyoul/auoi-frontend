class HanulseMessageView extends HanulseView {
	static _templatePath = "./template/message.html";

	_elementWrap;

	constructor() {
		super();
	}

	load(callback) {
		HtmlTemplate.fetch(HanulseMessageView._templatePath, (data) => {
			this._elementWrap = HtmlHelper.createHtml(data);

			callback && callback();
		})
	}

	getElement() {
		return this._elementWrap.get(0);
	}

	setMessage(message) {
		this._elementWrap.find("._message").htmlFromText(message);
	}
}