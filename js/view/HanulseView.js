class HanulseView {

	_element;

	constructor() {

	}

	setElement(element) {
		this._element = element;
	}

	getElement() {
		return this._element;
	}

	findChildElement(selector) {
		return $(this._element).find(selector).get(0);
	}

	addChildView(view) {
		$(this.getElement()).append(view.getElement());
	}

	show() {
		$(this.getElement()).show();
	}

	hide() {
		$(this.getElement()).hide();
	}
}