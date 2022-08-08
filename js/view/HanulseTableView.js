class HanulseTableView extends HanulseView {
	static _templatePath = "./template/table.html";

	_titleElementWrap;

	constructor() {
		super();

		this._initializeTableView();
	}

	_initializeTableView() {
		this.setElement(HtmlHelper.createHtml(HtmlTemplate.get(HanulseTableView._templatePath)).get());

		this._titleElementWrap = $(this.findChildElement("._title"));
	}

	setTitle(title) {
		this._titleElementWrap.text(title || "제목 없음");
	}

	setTable(table) {
		console.log(table);
	}
}