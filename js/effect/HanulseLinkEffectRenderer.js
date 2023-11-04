class HanulseLinkEffectRenderer {
	#centerGradient = null;
	#ringGradient = null;

	render(context, _timeOffset) {
		if (!this.#centerGradient) {
			this.#centerGradient = context.createLinearGradient(0, 0, 0, -120);
			this.#centerGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
			this.#centerGradient.addColorStop(1, "rgba(255, 255, 255, 1)");
		}

		if (!this.#ringGradient) {
			this.#ringGradient = context.createLinearGradient(0, -20, 0, 40);
			this.#ringGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
			this.#ringGradient.addColorStop(1, "rgba(255, 255, 255, 1)");
		}

		context.save();
		this.#renderRing(context, 1200, 0, 1.1, 8);
		context.restore();

		context.save();
		this.#renderRing(context, 1000, 200, 1.2, 4);
		context.restore();

		context.save();
		this.#renderRing(context, 800, 300, 1.15, 5);
		context.restore();

		context.save();
		this.#renderRing(context, 600, 600, 1.2, 2);
		context.restore();

		context.save();
		this.#renderRing(context, 500, 100, 0.9, 10);
		context.restore();
	}
	
	#renderRing(context, r, o, s, h) {
		const tick = Date.now();
		const ratio = ((tick - o) % r) / r; // 100
		// const curvedRatio = Math.sin(ratio * Math.PI);
		const curvedRatio = Math.sin(ratio / 2 * Math.PI);
		const target = -30;
		const translateY = target * curvedRatio;// * Math.pow(ratio, 1.5);

		context.translate(0, translateY);

		const height = h;
		const widthScale = s; //2;
		const scaledWidth = 40 * widthScale;
		const scaledHeight = 20 * widthScale;
		const alpha = (1 - (curvedRatio * 2 - 1) * (curvedRatio * 2 - 1)) * 0.4;

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
		context.fillStyle = this.#ringGradient;
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
		context.fillStyle = this.#ringGradient;
		context.fill();
		// context.strokeStyle = strokeColor
		// context.stroke();
		context.closePath();
	}
}