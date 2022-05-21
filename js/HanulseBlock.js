class HanulseBlock {

	position = {
		x: 0,
		y: 0,
		z: 0
	};

	block = null;
	prop = null;
	effect = null;
	label = null;
	action = null;

	status = null;

	constructor(position, block, prop, effect, label, action) {
		if (position) {
			this.position.x = position.x;
			this.position.y = position.y;
			this.position.z = position.z;
		}

		this.block = block;
		this.prop = prop;
		this.effect = effect;
		this.label = label;
		this.action = action;
	}

	pick(x, y) {
		if (!this.block) {
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
			return true;
		}

		return false;
	}

	render(context) {
		context.save();

		context.translate(40 * this.position.x - 40 * this.position.y, 20 * this.position.y + 20 * this.position.x - this.position.z * 35);

		if (this.block) {
			context.beginPath();
			context.moveTo(0, -20);
			context.lineTo(40, 0);
			context.lineTo(0, 20);
			context.lineTo(-40, 0);
			context.lineTo(0, -20);
			context.fillStyle = "darkgray";
			context.fill();
			context.strokeStyle = "rgba(20, 18, 8, 0.4)";
			context.stroke();
			context.closePath();

			context.save();
			context.clip();
			if (context.blocks[this.block]) {
				var block = context.blocks[this.block];
				context.drawImage(block.image, block.left, block.top, block.width, block.height);
			}
			context.restore();

			if (this.status == "active") {
				context.beginPath();
				context.moveTo(0, -19);
				context.lineTo(39, 0);
				context.lineTo(0, 19);
				context.lineTo(-39, 0);
				context.lineTo(0, -19);
				context.fillStyle = "rgba(0, 255, 255, 0.4)";
				context.fill();
				context.strokeStyle = "rgba(0, 255, 255, 0.6)"
				context.stroke();
				context.closePath();
			} else if (this.status == "hover") {
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
			} else if (this.status == "focus") {
				context.beginPath();
				context.moveTo(0, -19);
				context.lineTo(39, 0);
				context.lineTo(0, 19);
				context.lineTo(-39, 0);
				context.lineTo(0, -19);
				context.fillStyle = "rgba(0, 255, 255, 0.4)";
				context.fill();
				context.strokeStyle = "rgba(0, 255, 255, 0.6)"
				context.stroke();
				context.closePath();
			}

			// Left
			context.beginPath();
			context.moveTo(0, 20);
			context.lineTo(-40, 0);
			context.lineTo(-40, 35);
			context.lineTo(0, 55);
			context.lineTo(0, 20);
			context.fillStyle = "rosybrown";
			context.fill();
			context.strokeStyle = "rgba(20, 18, 8, 0.4)";
			context.stroke();
			context.closePath();

			// Right
			context.beginPath();
			context.moveTo(0, 20);
			context.lineTo(40, 0);
			context.lineTo(40, 35);
			context.lineTo(0, 55);
			context.lineTo(0, 20);
			context.fillStyle = "saddlebrown";
			context.fill();
			context.strokeStyle = "rgba(20, 18, 8, 0.4)";
			context.stroke();
			context.closePath();
		}

		if (context.props[this.prop]) {
			var prop = context.props[this.prop];
			context.drawImage(prop.image, prop.left, prop.top, prop.width, prop.height);
		}

		if (this.label) {
			if (this.status == "active") {
				HanulseUtils.drawActiveLabel(context, this.label, 0, -85);
			} else if (this.status == "hover") {
				HanulseUtils.drawHoverLabel(context, this.label, 0, -85);
			} else if (this.status == "focus") {
				HanulseUtils.drawFocusLabel(context, this.label, 0, -85);
			} else {
				HanulseUtils.drawLabel(context, this.label, 0, -85);
			}
		}

		if (this.effect == "warp") {
			HanulseWarpEffect.render(context);
		} else if (this.effect == "bigwarp") {
			HanulseWarpEffect.render(context);
		} else if (this.effect == "link") {
			HanulseLinkEffect.render(context);
		} else if (this.effect == "flash") {
			HanulseFlashEffect.render(context);
		}

		context.restore();
	}

	setStatus(status) {
		this.status = status;
	}

	resetStatus() {
		this.status = null;
	}

	act() {
		if (!this.action) {
			return;
		}

		HanulseAction.act(this.action);
	}
}