class HanulseFlashEffectRenderer {
	render(context, timeOffset) {
		var tick = Date.now() + timeOffset;
		var ratio = ((tick) % 1000) / 1000;
		var curvedRatio = Math.sin(ratio / 2 * Math.PI);

		var alpha = (1 - (curvedRatio * 2 - 1) * (curvedRatio * 2 - 1)) * 0.4;

		context.save();

		context.globalAlpha = alpha;

		context.beginPath();
		context.moveTo(0, -19);
		context.lineTo(39, 0);
		context.lineTo(0, 19);
		context.lineTo(-39, 0);
		context.lineTo(0, -19);
		context.fillStyle = "rgba(255, 255, 255, 0.6)";
		context.fill();
		context.closePath();

		context.restore();
	}
}