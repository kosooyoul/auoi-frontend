class HanulseTableView extends HanulseView {
	static _templatePath = "./template/table.html";

	_titleElementWrap;
	_tableElementWrap;

	_colsOptions = [];

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

	setColsOptions(colsOptions) {
		this._colsOptions = colsOptions;
	}

	setTable(table) {
		this._tableElementWrap.empty();

		const tableWrap = $("<table>").css({
			"padding": "10px",
			"user-select": "text",
			"word-break": "break-all"
		});
		const tableBody = $("<tbody>");
		tableWrap.append(tableBody);
		table.forEach(row => {
			const rowWrap = $("<tr>").css({"background-color": "rgba(0, 0, 0, 0.4)"});
			tableBody.append(rowWrap);
			row.forEach((col, i) => {
				const colWrap = $("<td>").css({"padding": "6px"});
				colWrap.text(col);
				rowWrap.append(colWrap);

				const options = this._colsOptions[i];
				if (options == null) return;
				if (options["line-wrap"] === false) {
					colWrap.css({"white-space": "nowrap"});
				} else {
					colWrap.css({"white-space": "pre-line"});
				}
			});
		});

		this._tableElementWrap.append(tableWrap);
	}
}