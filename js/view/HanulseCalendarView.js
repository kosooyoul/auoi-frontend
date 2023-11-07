class HanulseCalendarView {
	static #LIST_TEMPLATE_PATH = "./template/calendar.html";
	static #ITEM_TEMPLATE_PATH = "./template/calendar-item.html";

	#rootElement;
	#itemElement;

	#title;
	#year;
	#month;

	constructor(options) {
		this.#title = options.title || "제목 없음";
		this.#year = options.year || new Date().getFullYear();
		this.#month = options.month || (new Date().getMonth() + 1);
	}

	getElement() {
		return this.#rootElement.get();
	}

	async build() {
		this.#rootElement = await HtmlHelper.createFromUrl(HanulseCalendarView.#LIST_TEMPLATE_PATH);
		this.#itemElement = await HtmlHelper.createFromUrl(HanulseCalendarView.#ITEM_TEMPLATE_PATH);

		this.#validate();

		return this;
	}

	#validate() {
		this.#rootElement.find("._title").text(this.#title);
		this.#rootElement.find("._year").text(this.#year);
		this.#rootElement.find("._month").text(this.#month);

		const lastDate = this.#getLastDate();
		const dayOfWeek = this.#getDayOfWeek();
		const start = -dayOfWeek + 1;
		const end = lastDate + 1 + (7 - (dayOfWeek + lastDate) % 7);

		const calendarElement = this.#rootElement.find("._calendar");
		calendarElement.clear();
		for (let d = start; d < end; d++) {
			const dateElement = this.#itemElement.clone();
			if (d >= 1 && d <= lastDate) {
				dateElement.text(d);
			}
			calendarElement.append(dateElement.get());
		}
	}

	#hasLeapDay() {
		return this.#month == 2 && (this.#year % 4 == 0) && (this.#year % 100 != 0) && (this.#year % 400 == 0);
	}

	#getLastDate() {
		return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][this.#month - 1] + (this.#hasLeapDay()? 1: 0);
	}

	#getDayOfWeek() {
		return new Date(this.#year, this.#month - 1, 1).getDay();
	}
}