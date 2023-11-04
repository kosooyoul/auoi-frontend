class HanulsePrismEffectRenderer {
	static #curvedRatio;

	static {
		this.#curvedRatio = new Array(100).fill(0).reduce((result, _v, i) => {
			result[i] = Math.sin(i / 100 * Math.PI);
			return result;
		}, []);
	}

	render(context, timeOffset) {
		const tick = Date.now() + timeOffset;
		const ratio = ((tick) % 1000) / 1000;
		const curvedRatio = HanulsePrismEffectRenderer.#curvedRatio[Math.floor(ratio * 100)];
		const sqrtCurvedRatio = (1 - (curvedRatio - 1) * (curvedRatio - 1));

		const alpha = sqrtCurvedRatio * 0.8;
		const colorDegree = sqrtCurvedRatio * 255;
		const subColorDegree = (curvedRatio * curvedRatio) * 255;
		const colorSetIndex = Math.floor(timeOffset) % 6;

		context.save();

		context.globalAlpha = alpha;

		context.beginPath();
		context.moveTo(0, -19);
		context.lineTo(39, 0);
		context.lineTo(0, 19);
		context.lineTo(-39, 0);
		context.lineTo(0, -19);
		if (colorSetIndex == 0) {
			context.fillStyle = "rgba(" + colorDegree + ", 255, 255, 0.6)";
		} else if (colorSetIndex == 1) {
			context.fillStyle = "rgba(255, 255, " + colorDegree + ", 0.6)";
		} else if (colorSetIndex == 2) {
			context.fillStyle = "rgba(255, " + colorDegree + ", 255, 0.6)";
		} else if (colorSetIndex == 3) {
			context.fillStyle = "rgba(" + subColorDegree + ", 255, " + colorDegree + ", 0.4)";
		} else if (colorSetIndex == 4) {
			context.fillStyle = "rgba(" + subColorDegree + ", " + colorDegree + ", 255, 0.4)";
		} else if (colorSetIndex == 5) {
			context.fillStyle = "rgba(255, " + colorDegree + ", " + subColorDegree + ", 0.4)";
		}
		context.fill();
		context.closePath();

		context.restore();
	}
}