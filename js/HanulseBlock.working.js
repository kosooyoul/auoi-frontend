class HanulseBlock {

	position = {
		x: 0,
		y: 0,
		z: 0
	};

	texture = {
		top: null,
		left: null,
		right: null,
		stroke: "rgba(20, 18, 8, 0.4)"
	};

	prop = null;
	effect = null;

	picked = false;

	constructor(context, position, texture, prop, effect) {
		if (position) {
			this.position.x = position.x;
			this.position.y = position.y;
			this.position.z = position.z;
		}

		if (texture) {
			this.texture.top = texture.top;
			this.texture.left = texture.left;
			this.texture.right = texture.right;
		}

		this.prop = prop;
		this.effect = effect;
	}

	pick(x, y) {
		if (!this.texture.top) {
			this.picked = false;
			return false;
		}

		var ox = x - (40 * this.position.x - 40 * this.position.y);
		var oy = y - (20 * this.position.y + 20 * this.position.x - this.position.z * 35);

		var p1 = {x: 0, y: -20};
		var p2 = {x: -40, y: 0};
		var p3 = {x: 0, y: 20};
		var p4 = {x: 40, y: 0};

		var r1 = (p2.y - p1.y) / (p2.x - p1.x);
		var r3 = (p4.y - p3.y) / (p4.x - p3.x);

		var r2 = (p3.y - p2.y) / (p3.x - p2.x);
		var r4 = (p1.y - p4.y) / (p1.x - p4.x);

		if (r1 * ox + p1.y <= oy && r3 * ox + p3.y >= oy
		 && r2 * ox - p3.y <= oy && r4 * ox - p1.y >= oy) {
			this.picked = true;
			return true;
		}

		this.picked = false;
		return false;
	}

	unpick() {
		this.picked = false;
	}

	render(context) {
		context.save();

		context.translate(40 * this.position.x - 40 * this.position.y, 20 * this.position.y + 20 * this.position.x - this.position.z * 35);

		if (this.texture.top) {
			context.beginPath();
			context.moveTo(0, -20);
			context.lineTo(40, 0);
			context.lineTo(0, 20);
			context.lineTo(-40, 0);
			context.lineTo(0, -20);
			context.fillStyle = "darkgray";
			context.fill();
			context.strokeStyle = this.texture.stroke
			context.stroke();
			context.closePath();

			context.save();
			context.clip();
			if (this.texture.top == 1) {
				context.drawImage(context.textures["grass"], -40, -20, 80, 40);
			} else if (this.texture.top == 2) {
				context.drawImage(context.textures["hologram"], -40, -20, 80, 40);
			}
			context.restore();

			if (this.picked) {
				context.beginPath();
				context.moveTo(0, -19);
				context.lineTo(39, 0);
				context.lineTo(0, 19);
				context.lineTo(-39, 0);
				context.lineTo(0, -19);
				context.fillStyle = "rgba(255, 255, 0, 0.2)";
				context.fill();
				context.strokeStyle = "rgba(255, 255, 255, 0.6)"
				context.stroke();
				context.closePath();
			}
		}

		if (this.texture.left) {
			context.beginPath();
			context.moveTo(0, 20);
			context.lineTo(-40, 0);
			context.lineTo(-40, 35);
			context.lineTo(0, 55);
			context.lineTo(0, 20);
			context.fillStyle = this.texture.left;
			context.fill();
			context.strokeStyle = this.texture.stroke;
			context.stroke();
			context.closePath();
		}

		if (this.texture.right) {
			context.beginPath();
			context.moveTo(0, 20);
			context.lineTo(40, 0);
			context.lineTo(40, 35);
			context.lineTo(0, 55);
			context.lineTo(0, 20);
			context.fillStyle = this.texture.right;
			context.fill();
			context.strokeStyle = this.texture.stroke;
			context.stroke();
			context.closePath();
		}

		if (this.prop) {
			// context.beginPath();
			// context.arc(0, 0, 10, 0, Math.PI * 2);
			// context.strokeStyle = "black";
			// context.stroke();
			// context.closePath();
			if (this.prop == 1) {
				context.drawImage(context.images["tree"], -50, -109, 99, 109);
			} else if (this.prop == 2) {
				context.drawImage(context.images["bush"], -13, -13, 25, 13);
			} else if (this.prop == 3) {
				context.drawImage(context.images["flower"], -13, -20, 25, 20);
			} else if (this.prop == 4) {
				context.drawImage(context.images["warp"], -46, -32, 92, 52);

				context.fillStyle = "rgba(0, 0, 0, 0.8)";
				context.fillRect(-50, -100, 100, 100);

				context.fillStyle = "white";
				context.font = '48px serif';
				context.textBaseline = 'hanging';
				context.fillText("워프", 0, -100);
			}

		}

		if (this.effect) {
			context.save();
			this.renderEffect2(context, null, 800, 0);
			context.restore();

			context.save();
			this.renderEffect(context, null, 1000, 0, 1, 10);
			context.restore();

			context.save();
			this.renderEffect(context, null, 1000, 200, 1.1, 10);
			context.restore();

			context.save();
			this.renderEffect(context, null, 1000, 600, 1.05, 10);
			context.restore();

			context.save();
			this.renderEffect(context, null, 800, 0, 1.4, 30);
			context.restore();
		}

		context.restore();
	}

	renderEffect(context, effect, r, o, s, h) {
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
		context.fillStyle = context.gradients["effect-warp-ring"];
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
		context.fillStyle = context.gradients["effect-warp-ring"];
		context.fill();
		// context.strokeStyle = strokeColor
		// context.stroke();
		context.closePath();
	}

	renderEffect2(context, effect, r, o) {
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
		context.fillStyle = context.gradients["effect-warp-center"]; // "rgba(255, 255, 255, " + alpha + ")"
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
		context.fillStyle = context.gradients["effect-warp-center"]; // "rgba(255, 255, 255, " + alpha + ")"
		context.fill();
		// context.strokeStyle = strokeColor
		// context.stroke();
		context.closePath();
	}
}