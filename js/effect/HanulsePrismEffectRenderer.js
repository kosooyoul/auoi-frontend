class HanulsePrismEffectRenderer {
	render(context, timeOffset) {
		var tick = Date.now() + timeOffset;
		var ratio = ((tick) % 1000) / 1000;
		var curvedRatio = Math.sin(ratio / 2 * Math.PI);

		var alpha = (1 - (curvedRatio * 2 - 1) * (curvedRatio * 2 - 1)) * 0.8;
		var r = (1 - (curvedRatio * 2 - 1) * (curvedRatio * 2 - 1)) * 255;
		var rr = (curvedRatio * curvedRatio) * 255;
		var c = Math.floor(timeOffset) % 6;

		context.globalAlpha = alpha;

		context.beginPath();
		context.moveTo(0, -19);
		context.lineTo(39, 0);
		context.lineTo(0, 19);
		context.lineTo(-39, 0);
		context.lineTo(0, -19);
		if (c == 0) {
			context.fillStyle = "rgba(" + r + ", 255, 255, 0.6)";
		} else if (c == 1) {
			context.fillStyle = "rgba(255, 255, " + r + ", 0.6)";
		} else if (c == 2) {
			context.fillStyle = "rgba(255, " + r + ", 255, 0.6)";
		} else if (c == 3) {
			context.fillStyle = "rgba(" + rr + ", 255, " + r + ", 0.4)";
		} else if (c == 4) {
			context.fillStyle = "rgba(" + rr + ", " + r + ", 255, 0.4)";
		} else if (c == 5) {
			context.fillStyle = "rgba(255, " + r + ", " + rr + ", 0.4)";
		}
		context.fill();
		context.closePath();
	}
}