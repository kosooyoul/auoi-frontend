class HanulseWarpEffectRenderer {
	curvedRatio = new Array(100).fill(0).reduce((result, _v, i) => (result[i] = Math.sin(i / 100 * Math.PI), result), {});

	initialized = false;
	centerGradient = null;
	ringGradient = null;

	init(context) {
		this.centerGradient = context.createLinearGradient(0, 0, 0, -120);
		this.centerGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
		this.centerGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

		this.ringGradient = context.createLinearGradient(0, -20, 0, 40);
		this.ringGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
		this.ringGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

		this.initialized = true;
	}

	render(context, _timeOffset) {
		if (this.initialized == false) {
			this.init(context);
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

	renderCenter(context, duration, timeOffset) {
		var ratio = ((Date.now() - timeOffset) % duration) / duration;
		var curvedRatio = this.curvedRatio[Math.floor(ratio * 100)];
		var sqrtCurvedRatio = (1 - (curvedRatio - 1) * (curvedRatio - 1));

		var offsetY = 120;
		var width = 40;
		var height = 20;
		var alpha = sqrtCurvedRatio * 0.4 + 0.1;

		context.globalAlpha = alpha;

		context.beginPath();
		context.moveTo(0, height - offsetY);
		context.lineTo(-width, -offsetY);
		context.lineTo(-width, 0);
		context.lineTo(0, height);
		context.lineTo(width, 0);
		context.lineTo(width, -offsetY);
		context.lineTo(0, height - offsetY);
		context.fillStyle = this.centerGradient;
		context.fill();
		context.closePath();

		context.beginPath();
		context.moveTo(0, -height - offsetY);
		context.lineTo(-width, -offsetY);
		context.lineTo(-width, 0);
		context.lineTo(0, -height);
		context.lineTo(width, 0);
		context.lineTo(width, -offsetY);
		context.lineTo(0, -height - offsetY);
		context.fillStyle = this.centerGradient;
		context.fill();
		context.closePath();
	}
	
	renderRing(context, duration, timeOffset, widthScale, offsetY) {
		var ratio = ((Date.now() - timeOffset) % duration) / duration;
		var halfCurvedRatio = this.curvedRatio[Math.floor(ratio * 50)];
		var curvedRatio = this.curvedRatio[Math.floor(ratio * 100)];
		var sqrtCurvedRatio = (1 - (curvedRatio - 1) * (curvedRatio - 1));

		var target = -140;
		var translateY = target * halfCurvedRatio;

		context.translate(0, translateY + 20);

		var scaledWidth = 40 * widthScale;
		var scaledHeight = 20 * widthScale;
		var alpha = sqrtCurvedRatio * 0.4;

		context.globalAlpha = alpha;

		context.beginPath();
		context.moveTo(0, scaledHeight - offsetY);
		context.lineTo(-scaledWidth, -offsetY);
		context.lineTo(-scaledWidth, 0);
		context.lineTo(0, scaledHeight);
		context.lineTo(scaledWidth, 0);
		context.lineTo(scaledWidth, -offsetY);
		context.lineTo(0, scaledHeight - offsetY);
		context.fillStyle = this.ringGradient;
		context.fill();
		context.closePath();

		context.beginPath();
		context.moveTo(0, -scaledHeight - offsetY);
		context.lineTo(-scaledWidth, -offsetY);
		context.lineTo(-scaledWidth, 0);
		context.lineTo(0, -scaledHeight);
		context.lineTo(scaledWidth, 0);
		context.lineTo(scaledWidth, -offsetY);
		context.lineTo(0, -scaledHeight - offsetY);
		context.fillStyle = this.ringGradient;
		context.fill();
		context.closePath();
	}
}