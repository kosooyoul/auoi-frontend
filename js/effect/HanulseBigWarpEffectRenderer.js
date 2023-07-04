class HanulseBigWarpEffectRenderer {
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

	render(context, timeOffset) {
		if (this.initialized == false) {
			this.init(context);
		}

		var tick = Date.now() + timeOffset;
		var ratio = (tick % 1000) / 1000;
		var curvedRatio = this.curvedRatio[Math.floor(ratio * 100)];
		var sqrtCurvedRatio = (1 - (curvedRatio - 1) * (curvedRatio - 1));

		var alpha = sqrtCurvedRatio * 0.8;
		var colorDegree = sqrtCurvedRatio * 255;
		var subColorDegree = (curvedRatio * curvedRatio) * 255;
		var colorIndex = Math.floor(tick / 2000) % 6;
		var subColorIndex = Math.floor(tick / 3000) % 6;

		
		var color = this.getColor(colorIndex, colorDegree, subColorDegree);
		var subColor = this.getColor(subColorIndex, colorDegree, subColorDegree);

		context.save();

		context.globalAlpha = alpha;

		context.save();
		this.renderCenter(context, color, 740, 0);
		context.restore();

		context.save();
		this.renderCenter(context, subColor, 1000, 400);
		context.restore();

		context.save();
		this.renderRing(context, 800, 0, 1.6, 24);
		context.restore();

		context.save();
		this.renderRing(context, 800, 400, 1.2, 10);
		context.restore();

		context.save();
		this.renderRing(context, 1100, 600, 1.2, 10);
		context.restore();

		context.save();
		this.renderRing(context, 980, 700, 1.4, 40);
		context.restore();

		context.save();
		this.renderBar(context, 650, 400, -12, 10, 5);
		context.restore();

		context.save();
		this.renderBar(context, 1200, 1400, -24, 3, 20);
		context.restore();

		context.save();
		this.renderBar(context, 800, 500, -44, 5, 30);
		context.restore();

		context.save();
		this.renderBar(context, 700, 1200, -56, 10, 15);
		context.restore();

		context.save();
		this.renderBar(context, 900, 5400, 14, 0, 10);
		context.restore();

		context.save();
		this.renderBar(context, 1000, 800, 34, 5, 20);
		context.restore();

		context.save();
		this.renderBar(context, 550, 300, 48, 10, 5);
		context.restore();

		context.save();
		this.renderBar(context, 750, 500, 52, 10, 10);
		context.restore();

		context.restore();
	}

	renderCenter(context, color, duration, timeOffset) {
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
		context.fillStyle = color;
		context.fill();
		context.closePath();
	}

	renderRing(context, duration, timeOffset, widthScale, offsetY) {
		var tick = Date.now() - timeOffset;
		var ratio = (tick % duration) / duration;
		var halfCurvedRatio = this.curvedRatio[Math.floor(ratio * 50)];
		var curvedRatio = this.curvedRatio[Math.floor(ratio * 100)];
		var sqrtCurvedRatio = (1 - (curvedRatio - 1) * (curvedRatio - 1));

		var colorDegree = halfCurvedRatio * 255;
		var subColorDegree = (curvedRatio * curvedRatio) * 255;
		var colorIndex = Math.floor(tick / 2000) % 6;
		var color = this.getColor(colorIndex, colorDegree, subColorDegree);

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
		context.fillStyle = color;
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
		context.fillStyle = color;
		context.fill();
		context.closePath();
	}

	renderBar(context, duration, timeOffset, offsetX, offsetY, height) {
		var tick = Date.now() - timeOffset;
		var ratio = (tick % duration) / duration;
		var halfCurvedRatio = this.curvedRatio[Math.floor(ratio * 50)];
		var curvedRatio = this.curvedRatio[Math.floor(ratio * 100)];
		var sqrtCurvedRatio = (1 - (curvedRatio - 1) * (curvedRatio - 1));

		var colorDegree = halfCurvedRatio * 255;
		var subColorDegree = (curvedRatio * curvedRatio) * 255;
		var colorIndex = Math.floor(tick / 2000) % 6;
		var color = this.getColor(colorIndex, colorDegree, subColorDegree);

		var target = -140;
		var translateY = target * halfCurvedRatio;

		context.translate(0, translateY + 20);

		var alpha = sqrtCurvedRatio * 0.4;

		context.globalAlpha = alpha;

		context.beginPath();
		context.moveTo(offsetX, height - offsetY);
		context.lineTo(offsetX, -offsetY);
		context.lineTo(offsetX + 4, -offsetY);
		context.lineTo(offsetX + 4, height - offsetY);
		context.fillStyle = this.ringGradient;
		context.fill();
		context.closePath();
	}

	getColor(index, colorDegree, subColorDegree) {
		if (index == 0) {
			return "rgba(" + colorDegree + ", 255, 255, 0.8)";
		} else if (index == 1) {
			return "rgba(255, 255, " + colorDegree + ", 0.8)";
		} else if (index == 2) {
			return "rgba(255, " + colorDegree + ", 255, 0.8)";
		} else if (index == 3) {
			return "rgba(" + subColorDegree + ", 255, " + colorDegree + ", 0.6)";
		} else if (index == 4) {
			return "rgba(" + subColorDegree + ", " + colorDegree + ", 255, 0.6)";
		} else if (index == 5) {
			return "rgba(255, " + colorDegree + ", " + subColorDegree + ", 0.6)";
		}
	}
}