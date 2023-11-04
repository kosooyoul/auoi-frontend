class HanulseMessageView extends HanulseView {
	static _templatePath = "./template/message.html";

	_elementWrap;

	constructor() {
		super();
	}

	async load() {
		const html = await HtmlTemplate.fetch(HanulseMessageView._templatePath);
		this._elementWrap = HtmlHelper.createHtml(html);
	}

	getElement() {
		return this._elementWrap.get(0);
	}

	setMessage(message) {
		this._elementWrap.find("._message").htmlFromText(message);
	}
}