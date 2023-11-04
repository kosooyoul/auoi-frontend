class HanulseLoadingView extends HanulseView {

	#rootElementWrap;

	constructor() {
		super();
	}

	async load(callback) {
		this.#rootElementWrap = $("<div class=\"_loading knead\" style=\"display: none; position: absolute; left: 50%; top: 50%; margin-left: -13px; margin-top: 16px; width: 24px; height: 8px; background-color: white; border: 1px solid white; border-radius: 10px; box-shadow: 0px 0px 8px rgb(0 255 231);\"></div>");
		callback && callback();
	}

	getElement() {
		return this.#rootElementWrap.get(0);
	}

	show() {
		this.#rootElementWrap.fadeIn();
	}
	
	hide() {
		this.#rootElementWrap.stop().fadeOut();
	}
}