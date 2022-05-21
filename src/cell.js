class Cell {
	position = {
		x: 0,
		y: 0,
		z: 0
	};
	rotatedPosition = {
		x: 0,
		y: 0,
		z: 0
	};
	offset = {
		x: 0,
		y: 0
	};
	rotation = 0;

	constructor() {

	}

	// TODO: Refactoring
	setPosition(position) {
		this.position.x = position.x;
		this.position.y = position.y;
		this.position.z = position.z;

		this.setRotation(this.rotation);

		// this.offset.x = (40 * this.rotatedPosition.x - 40 * this.rotatedPosition.y)
		// this.offset.y = (20 * this.rotatedPosition.y + 20 * this.rotatedPosition.x - this.rotatedPosition.z * 35);

		return this;
	}

	// TODO: Refactoring
	setRotation(rotation) {
		rotation = (rotation + 4) % 4;
		if (rotation == 0) {
			this.rotatedPosition.x = this.position.x;
			this.rotatedPosition.y = this.position.y;
			this.rotatedPosition.z = this.position.z;
		} else if (rotation == 1) {
			this.rotatedPosition.x = -this.position.y;
			this.rotatedPosition.y = this.position.x;
			this.rotatedPosition.z = this.position.z;
		} else if (rotation == 2) {
			this.rotatedPosition.x = -this.position.x;
			this.rotatedPosition.y = -this.position.y;
			this.rotatedPosition.z = this.position.z;
		} else if (rotation == 3) {
			this.rotatedPosition.x = this.position.y;
			this.rotatedPosition.y = -this.position.x;
			this.rotatedPosition.z = this.position.z;
		} else {
			this.rotatedPosition.x = this.position.x;
			this.rotatedPosition.y = this.position.y;
			this.rotatedPosition.z = this.position.z;
		}

		this.offset.x = (40 * this.rotatedPosition.x - 40 * this.rotatedPosition.y)
		this.offset.y = (20 * this.rotatedPosition.y + 20 * this.rotatedPosition.x - this.rotatedPosition.z * 35);

		this.rotation = rotation;
	}

	setHighlight(onOff) {
		this.highlight = onOff;
	}

	setFocused(onOff) {
		this.focused = onOff;
	}

	setProp(prop) {
		this.prop = prop;
		return this;
	}

	setLabel(label) {
		this.label = label;
		return this;
	}

	isFrontOf(targetCell) {
		return (this.rotatedPosition.z - targetCell.rotatedPosition.z) || (this.rotatedPosition.y - targetCell.rotatedPosition.y) || (this.rotatedPosition.x - targetCell.rotatedPosition.x);
	}

	pick(x, y) {
		var rx = x - this.offset.x; // (40 * this.rotatedPosition.x - 40 * this.rotatedPosition.y);
		var ry = y - this.offset.y; // (20 * this.rotatedPosition.y + 20 * this.rotatedPosition.x - this.rotatedPosition.z * 35);

		// var p1 = {x: 0, y: -20};
		// var p2 = {x: -40, y: 0};
		// var p3 = {x: 0, y: 20};
		// var p4 = {x: 40, y: 0};

		// var r1 = -0.5; // (p2.y - p1.y) / (p2.x - p1.x);
		// var r3 = -0.5; // (p4.y - p3.y) / (p4.x - p3.x);

		// var r2 = 0.5; // (p3.y - p2.y) / (p3.x - p2.x);
		// var r4 = 0.5; // (p1.y - p4.y) / (p1.x - p4.x);

		if (-0.5 * rx + -20 <= ry && -0.5 * rx + 20 >= ry
		 && 0.5 * rx - 20 <= ry && 0.5 * rx - -20 >= ry) {
			return true;
		}

		return false;
	}

	pickLeft(x, y) {
		var rx = x - this.offset.x; // (40 * this.rotatedPosition.x - 40 * this.rotatedPosition.y);
		var ry = y - this.offset.y; // (20 * this.rotatedPosition.y + 20 * this.rotatedPosition.x - this.rotatedPosition.z * 35);

		var p1 = {x: 0, y: 20};
		var p2 = {x: -40, y: 0};
		var p3 = {x: -40, y: 35};
		var p4 = {x: 0, y: 55};

		var r1 = (p2.y - p1.y) / (p2.x - p1.x);
		var r3 = (p4.y - p3.y) / (p4.x - p3.x);

		if (rx >= -40 && rx <= 0
		 && r1 * rx + p1.y <= ry && r3 * rx + p4.y >= ry
		) {
			return true;
		}

		return false;
	}

	pickRight(x, y) {
		var rx = x - this.offset.x; // (40 * this.rotatedPosition.x - 40 * this.rotatedPosition.y);
		var ry = y - this.offset.y; // (20 * this.rotatedPosition.y + 20 * this.rotatedPosition.x - this.rotatedPosition.z * 35);

		var p1 = {x: 40, y: 0};
		var p2 = {x: 0, y: 20};
		var p3 = {x: 0, y: 55};
		var p4 = {x: 40, y: 35};

		var r1 = (p2.y - p1.y) / (p2.x - p1.x);
		var r3 = (p4.y - p3.y) / (p4.x - p3.x);

		if (rx >= 0 && rx <= 40
		 && r1 * rx + p2.y <= ry && r3 * rx + p3.y >= ry
		) {
			return true;
		}

		return false;
	}

	draw(context) {
		context.translate(this.offset.x, this.offset.y);
		if (this.focused) {
			context.scale(1.1, 1.1);
			context.globalAlpha = 0.5;
		}

		context.beginPath();
		context.moveTo(0, -20);
		context.lineTo(40, 0);
		context.lineTo(0, 20);
		context.lineTo(-40, 0);
		context.lineTo(0, -20);
		context.fillStyle = "rgba(80, 120, 0, 1)";
		context.fill();
		context.strokeStyle = "rgba(20, 18, 8, 0.4)";
		context.stroke();
		context.closePath();

		if (this.focused) {
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
		} else if (this.highlight) {
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

		if (this.focused) {
			context.beginPath();
			context.moveTo(0, 20);
			context.lineTo(-40, 0);
			context.lineTo(-40, 35);
			context.lineTo(0, 55);
			context.lineTo(0, 20);
			context.fillStyle = "rgba(0, 255, 255, 0.4)";
			context.fill();
			context.strokeStyle = "rgba(0, 255, 255, 0.6)"
			context.stroke();
			context.closePath();
		} else if (this.highlight) {
			context.beginPath();
			context.moveTo(0, 20);
			context.lineTo(-40, 0);
			context.lineTo(-40, 35);
			context.lineTo(0, 55);
			context.lineTo(0, 20);
			context.fillStyle = "rgba(255, 255, 0, 0.2)";
			context.fill();
			context.strokeStyle = "rgba(255, 255, 255, 0.6)"
			context.stroke();
			context.closePath();
		} else if (this.status == "focus") {
			context.beginPath();
			context.moveTo(0, 20);
			context.lineTo(-40, 0);
			context.lineTo(-40, 35);
			context.lineTo(0, 55);
			context.lineTo(0, 20);
			context.fillStyle = "rgba(0, 255, 255, 0.4)";
			context.fill();
			context.strokeStyle = "rgba(0, 255, 255, 0.6)"
			context.stroke();
			context.closePath();
		}

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

		if (this.focused) {
			context.beginPath();
			context.moveTo(0, 20);
			context.lineTo(40, 0);
			context.lineTo(40, 35);
			context.lineTo(0, 55);
			context.lineTo(0, 20);
			context.fillStyle = "rgba(0, 255, 255, 0.4)";
			context.fill();
			context.strokeStyle = "rgba(0, 255, 255, 0.6)"
			context.stroke();
			context.closePath();
		} else if (this.highlight) {
			context.beginPath();
			context.moveTo(0, 20);
			context.lineTo(40, 0);
			context.lineTo(40, 35);
			context.lineTo(0, 55);
			context.lineTo(0, 20);
			context.fillStyle = "rgba(255, 255, 0, 0.2)";
			context.fill();
			context.strokeStyle = "rgba(255, 255, 255, 0.6)"
			context.stroke();
			context.closePath();
		} else if (this.status == "focus") {
			context.beginPath();
			context.moveTo(0, 20);
			context.lineTo(40, 0);
			context.lineTo(40, 35);
			context.lineTo(0, 55);
			context.lineTo(0, 20);
			context.fillStyle = "rgba(0, 255, 255, 0.4)";
			context.fill();
			context.strokeStyle = "rgba(0, 255, 255, 0.6)"
			context.stroke();
			context.closePath();
		}
		
	}
}