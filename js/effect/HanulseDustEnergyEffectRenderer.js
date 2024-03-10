class HanulseDustEnergyEffectRenderer {
	render(context, _timeOffset) {
		context.save();

		context.translate(0, -20);

		this.#drawEnergyBall(context, 0, 1.0, 1.0, 0);
		this.#drawEnergyBall(context, 100, 1.2, 2, 0.2);
		this.#drawEnergyBall(context, 500, 1.5, 1.2, 0.4);
		this.#drawEnergyBall(context, 600, 0.7, 1.6, 0.5);
		this.#drawEnergyBall(context, 700, 0.5, 1.9, 0.3);
		this.#drawEnergyBall(context, 300, 1.3, 1.2, 0.1);
		this.#drawEnergyBall(context, 400, 1.4, 2.0, 1.7);
		this.#drawEnergyBall(context, 450, 0.9, 1.8, 1.8);
		this.#drawEnergyBall(context, 650, 1.0, 1.2, 2.6);
		this.#drawEnergyBall(context, 800, 0.2, 0.2, 2.4);
		this.#drawEnergyBall(context, 900, 3.2, 0.8, 1.3);
		this.#drawEnergyBall(context, 450, 0.4, 1.8, 1.2);
		this.#drawEnergyBall(context, 650, 0.7, 1.2, 2.9);
		this.#drawEnergyBall(context, 800, 2.2, 0.2, 2.8);
		this.#drawEnergyBall(context, 600, 0.9, 0.6, 1.5);
		this.#drawEnergyBall(context, 700, 0.7, 0.9, 1.3);
		this.#drawEnergyBall(context, 300, 1.4, 1.7, 2.1);
		this.#drawEnergyBall(context, 400, 1.6, 2.2, 2.7);
		this.#drawEnergyBall(context, 450, 0.9, 0.8, 0.8);
		this.#drawEnergyBall(context, 650, 1.2, 0.6, 1.6);
		this.#drawEnergyBall(context, 800, 0.4, 1.2, 3.0);
		this.#drawEnergyBall(context, 900, 2.2, 1.8, 3.1);

		context.restore();
	}

	#drawMainBall(context, timeOffset, timeScale, scale) {
		const tick = Date.now() + timeOffset;
		const ratio = ((tick * timeScale) % 2000) / 2000;

		const curvedRatio = Math.sin(ratio * Math.PI);

		const alpha = (1 - (curvedRatio * 2 - 1) * (curvedRatio * 2 - 1)) * 0.4 + 0.2;

		context.globalAlpha = alpha;

		context.save();

		context.scale(scale + curvedRatio, scale + curvedRatio);

		context.save();
		context.beginPath();
		context.arc(0, 0, 2, 0, Math.PI * 2);
		context.fillStyle = "rgba(255, 255, 255, 1)";
		context.fill();
		context.closePath();
		context.restore();

		context.restore();
	}

	#drawEnergyBall(context, timeOffset, timeScale, scale, rotate) {
		const tick = Date.now() + timeOffset;
		const ratio = ((tick * timeScale) % 2000) / 2000;

		const curvedRatio = Math.sin(ratio * Math.PI);

		const alpha = (1 - (curvedRatio * 2 - 1) * (curvedRatio * 2 - 1)) * 1;

		context.globalAlpha = alpha;

		context.save();

		context.scale(curvedRatio, curvedRatio);
		context.scale(scale, scale);

		context.save();
		context.beginPath();
		context.rotate(ratio * Math.PI * 2 + rotate);
		context.translate(20, 0);
		context.arc(10, 0, 2, 0, Math.PI * 2);
		context.fillStyle = "rgba(255, 255, 255, 1)";
		// context.moveTo(0, 30);
		// context.lineTo(5, 30);
		context.strokeStyle = "rgba(255, 255, 255, 1)";
		context.fill();
		// context.stroke();
		context.closePath();
		context.restore();

		context.restore();
	}
}