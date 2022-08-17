class HanulseCalendarView extends HanulseView {
	static _templatePath = "./template/calendar.html";

	_titleElementWrap;
	_calendarElementWrap;

	_colsOptions = [];

	constructor() {
		super();

		this._initializeCalendarView();
	}

	_initializeCalendarView() {
		this.setElement(HtmlHelper.createHtml(HtmlTemplate.get(HanulseCalendarView._templatePath)).get());

		this._titleElementWrap = $(this.findChildElement("._title"));
		this._calendarElementWrap = $(this.findChildElement("._calendar"));
		this._yearElementWrap = $(this.findChildElement("._year"));
		this._monthElementWrap = $(this.findChildElement("._month"));
	}

	setTitle(title) {
		this._titleElementWrap.text(title || "제목 없음");
	}

	setCalendar(year, month) {
		this._calendarElementWrap.empty();

		const hasLeapDay = month == 2 && (year % 4 == 0) && (year % 100 != 0) && (year % 400 == 0);
		const dates = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] + (hasLeapDay? 1: 0);
		 // Temporary
		const dow = new Date(year, month - 1, 1).getDate();

		this._yearElementWrap.text(year);
		this._monthElementWrap.text(month);

		const calendarWrap = $("<table>").css({
			"width": "100%",
			"padding": "10px",
			"text-align": "center",
			"user-select": "text",
			"word-break": "break-all"
		});
		const calendarBody = $("<tbody>");
		calendarWrap.append(calendarBody);

		let d = -dow;
		while (d < dates) {
			const rowWrap = $("<tr>").css({"background-color": "rgba(0, 0, 0, 0.4)"});
			calendarBody.append(rowWrap);

			for (let i = 0; i < 7; i++) {
				d++;

				const colWrap = $("<td>").css({
					"padding": "10px",
					"border-radius": "8px",
				});

				if (d > 0 && d <= dates) {
					colWrap.text(d);
				}
				rowWrap.append(colWrap);
			}
		}

		this._calendarElementWrap.append(calendarWrap);
	}
}