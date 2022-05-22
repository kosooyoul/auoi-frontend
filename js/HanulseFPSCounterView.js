class HanulseFPSCounterView {
	static defaultMaximumCalledCount = 20;

	_element = null;
	_enabled = false;

	_lastCheckedTime = Date.now();
	_calledCount = 0;
	_fps = null;

	constructor(element) {
		if (element) {
			this._element = element;
			this._enabled = true;
		}
	}

	count() {
		if (!this._enabled) {
			return;
		}

		if (this._calledCount >= HanulseFPSCounterView.defaultMaximumCalledCount) {
			const now = Date.now();
			
			this._fps = (1000 * this._calledCount) / (now - this._lastCheckedTime);

			this._calledCount = 0;
			this._lastCheckedTime = now;

			this._updateElement();
		}

		this._calledCount++;
	}

	_updateElement() {
		this._element.textContent = this._fps.toFixed(2) + " FPS";
	}
}