class HanulseView {

	_element;

	constructor(element) {
		this.setElement(element);
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

	findChildElements(selector) {
		return $(this._element).find(selector);
	}

	addChildView(view) {
		$(this.getElement()).append(view.getElement());
	}

	show() {
		$(this.getElement()).show();
		this.onShow();
	}

	hide() {
		$(this.getElement()).hide();
		this.onHide();
	}

	onShow() {

	}

	onHide() {

	}
}