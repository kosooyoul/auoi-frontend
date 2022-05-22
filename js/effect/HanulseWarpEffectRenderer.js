class HanulseWarpEffectRenderer {
	centerGradient = null;
	ringGradient = null;

	render(context) {
		if (!this.centerGradient) {
			this.centerGradient = context.createLinearGradient(0, 0, 0, -120);
			this.centerGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
			this.centerGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
		}

		if (!this.ringGradient) {
			this.ringGradient = context.createLinearGradient(0, -20, 0, 40);
			this.ringGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
			this.ringGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
		}

		context.save();
		this.renderCenter(context, 800, 0);
		context.restore();

		context.save();
		this.renderRing(context, 1000, 0, 1, 10);
		context.restore();

		context.save();
		this.renderRing(context, 1000, 200, 1.1, 10);
		context.restore();

		context.save();
		this.renderRing(context, 1000, 600, 1.05, 10);
		context.restore();

		context.save();
		this.renderRing(context, 800, 0, 1.4, 30);
		context.restore();
	}

	renderCenter(context, r, o) {
		var tick = Date.now();
		var ratio = ((tick - o) % r) / r; // 100
		// var curvedRatio = Math.sin(ratio * Math.PI);
		var curvedRatio = Math.sin(ratio / 2 * Math.PI);
		var target = -140;
		var translateY = target * curvedRatio;// * Math.pow(ratio, 1.5);

		var height = 120;
		var widthScale = 1; //2;
		var scaledWidth = 40 * widthScale;
		var scaledHeight = 20 * widthScale;
		var alpha = (1 - (curvedRatio * 2 - 1) * (curvedRatio * 2 - 1)) * 0.4 + 0.1;

		context.globalAlpha = alpha;
		// grd.setColorStop(0, "rgba(255, 255, 255, " + alpha + ")");

		context.beginPath();
		context.moveTo(0, scaledHeight - height);
		context.lineTo(-scaledWidth, -height);
		context.lineTo(-scaledWidth, 0);
		context.lineTo(0, scaledHeight);
		context.lineTo(scaledWidth, 0);
		context.lineTo(scaledWidth, -height);
		context.lineTo(0, scaledHeight - height);
		context.fillStyle = this.centerGradient;
		context.fill();
		context.closePath();

		context.beginPath();
		context.moveTo(0, -scaledHeight - height);
		context.lineTo(-scaledWidth, -height);
		context.lineTo(-scaledWidth, 0);
		context.lineTo(0, -scaledHeight);
		context.lineTo(scaledWidth, 0);
		context.lineTo(scaledWidth, -height);
		context.lineTo(0, -scaledHeight - height);
		context.fillStyle = this.centerGradient;
		context.fill();
		// context.strokeStyle = strokeColor
		// context.stroke();
		context.closePath();
	}
	
	renderRing(context, r, o, s, h) {
		var tick = Date.now();
		var ratio = ((tick - o) % r) / r; // 100
		// var curvedRatio = Math.sin(ratio * Math.PI);
		var curvedRatio = Math.sin(ratio / 2 * Math.PI);
		var target = -140;
		var translateY = target * curvedRatio;// * Math.pow(ratio, 1.5);

		context.translate(0, translateY + 20);

		var height = h;
		var widthScale = s; //2;
		var scaledWidth = 40 * widthScale;
		var scaledHeight = 20 * widthScale;
		var alpha = (1 - (curvedRatio * 2 - 1) * (curvedRatio * 2 - 1)) * 0.4;

		context.globalAlpha = alpha;
		// grd.setColorStop(0, "rgba(255, 255, 255, " + alpha + ")");

		context.beginPath();
		context.moveTo(0, scaledHeight - height);
		context.lineTo(-scaledWidth, -height);
		context.lineTo(-scaledWidth, 0);
		context.lineTo(0, scaledHeight);
		context.lineTo(scaledWidth, 0);
		context.lineTo(scaledWidth, -height);
		context.lineTo(0, scaledHeight - height);
		context.fillStyle = this.ringGradient;
		context.fill();
		context.closePath();

		context.beginPath();
		context.moveTo(0, -scaledHeight - height);
		context.lineTo(-scaledWidth, -height);
		context.lineTo(-scaledWidth, 0);
		context.lineTo(0, -scaledHeight);
		context.lineTo(scaledWidth, 0);
		context.lineTo(scaledWidth, -height);
		context.lineTo(0, -scaledHeight - height);
		context.fillStyle = this.ringGradient;
		context.fill();
		// context.strokeStyle = strokeColor
		// context.stroke();
		context.closePath();
	}
}