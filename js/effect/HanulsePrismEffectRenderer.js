class HanulsePrismEffectRenderer {
	curvedRatio = new Array(100).fill(0).reduce((result, _v, i) => (result[i] = Math.sin(i / 100 * Math.PI), result), {});

	render(context, timeOffset) {
		var tick = Date.now() + timeOffset;
		var ratio = ((tick) % 1000) / 1000;
		var curvedRatio = this.curvedRatio[Math.floor(ratio * 100)];
		var sqrtCurvedRatio = (1 - (curvedRatio - 1) * (curvedRatio - 1));

		var alpha = sqrtCurvedRatio * 0.8;
		var colorDegree = sqrtCurvedRatio * 255;
		var subColorDegree = (curvedRatio * curvedRatio) * 255;
		var colorSetIndex = Math.floor(timeOffset) % 6;

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
	}
}