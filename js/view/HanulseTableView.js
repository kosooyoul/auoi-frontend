class HanulseTableView extends HanulseView {
	static _templatePath = "./template/table.html";

	_titleElementWrap;
	_tableElementWrap;

	constructor() {
		super();

		this._initializeTableView();
	}

	_initializeTableView() {
		this.setElement(HtmlHelper.createHtml(HtmlTemplate.get(HanulseTableView._templatePath)).get());

		this._titleElementWrap = $(this.findChildElement("._title"));
		this._tableElementWrap = $(this.findChildElement("._table"));
	}

	setTitle(title) {
		this._titleElementWrap.text(title || "제목 없음");
	}

	setTable(table) {
		this._tableElementWrap.empty();

		const tableWrap = $("<table>").css({"padding": "10px"});
		const tableBody = $("<tbody>");
		tableWrap.append(tableBody);
		table.forEach(row => {
			const rowWrap = $("<tr>").css({"background-color": "rgba(0, 0, 0, 0.4)"});
			tableBody.append(rowWrap);
			row.forEach(col => {
				const colWrap = $("<td>").css({"padding": "6px"});
				colWrap.text(col);
				rowWrap.append(colWrap);
			});
		});

		this._tableElementWrap.append(tableWrap);
	}
}