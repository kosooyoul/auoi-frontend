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

	constructor(options) {
		if (options == null) {
			return;
		}

		if (options.position && options.size) {
			this._position.x = options.position.x;
			this._position.y = options.position.y;
			this._position.z = options.position.z;
			
			this._offset.x = ((options.size.w >> 1) * this._position.x - (options.size.w >> 1) * this._position.y)
			this._offset.y = ((options.size.h >> 1) * this._position.y + (options.size.h >> 1) * this._position.x - this._position.z * options.size.d);
		}

		if (options.texture) {
			this._texture.top = options.texture.top;
			this._texture.left = options.texture.left;
			this._texture.right = options.texture.right;
		}

		this._prop = options.prop;
		this._effect = options.effect;
		this._label = options.label;

		if (options.action) {
			if (options.action.all) {
				this._action.all = options.action.all;
			} else {
				this._action.top = options.action.top;
				this._action.left = options.action.left;
				this._action.right = options.action.right;
			}
		}

		if (options.alpha) {
			this._alpha = options.alpha;
		}

		if (options.timeOffset) {
			this._timeOffset = options.timeOffset;
		} else {
			this._timeOffset = Math.random() * 60000;
		}
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

	pick(x, y) {
		var rx = x - this._offset.x;
		var ry = y - this._offset.y;

		if (this._texture.top) {
			if (this._pickTop(rx, ry)) {
				return "top";
			}
		}
		if (this._texture.left) {
			if (this._pickLeft(rx, ry)) {
				return "left";
			}
		}
		if (this._texture.right) {
			if (this._pickRight(rx, ry)) {
				return "right";
			}
		}

		return null;
	}

	_pickTop(rx, ry) {
		if (-0.5 * rx + -20 <= ry && -0.5 * rx + 20 >= ry
		 && 0.5 * rx - 20 <= ry && 0.5 * rx - -20 >= ry) {
			return true;
		}

		return false;
	}

	_pickLeft(rx, ry) {
		if (!this._texture.left) {
			return false;
		}

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

	_pickRight(rx, ry) {
		if (!this._texture.right) {
			return false;
		}

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

	getOffset() {
		return this._offset;
	}

	getOffset() {
		return this._offset;
	}

	getTexture() {
		return this._texture;
	}

	getStatus() {
		return this._status;
	}

	getProp() {
		return this._prop;
	}

	getLabel() {
		return this._label;
	}

	getEffect() {
		return this._effect;
	}

	getAlpha() {
		return this._alpha;
	}

	getTimeOffset() {
		return this._timeOffset;
	}

	setProp(prop) {
		this._prop = prop;
	}

	setLabel(label) {
		this._label = label;
	}

	setEffect(effect) {
		this._effect = effect;
	}

	setStatus(status, side) {
		if (side == "top") {
			this._status.top = status;
		} else if (side == "left") {
			this._status.left = status;
		} else if (side == "right") {
			this._status.right = status;
		} else {
			this._status.top = status;
			this._status.left = status;
			this._status.right = status;
		}
	}

	resetStatus(side) {
		if (side == "top") {
			this._status.top = null;
		} else if (side == "left") {
			this._status.left = null;
		} else if (side == "right") {
			this._status.right = null;
		} else {
			this._status.top = null;
			this._status.left = null;
			this._status.right = null;
		}
	}

	getAction(side) {
		if (side == "top") {
			return this._action.top || this._action.all;
		} else if (side == "left") {
			return this._action.left || this._action.all;
		} else if (side == "right") {
			return this._action.right || this._action.all;
		} else if (side == "all") {
			return this._action.all;
		}
		return null;
	}

	isFrontOf(targetCell) {
		return (this.rotatedPosition.z - targetCell.rotatedPosition.z) || (this.rotatedPosition.y - targetCell.rotatedPosition.y) || (this.rotatedPosition.x - targetCell.rotatedPosition.x);
	}

	static getBlocksBoundary(blocks) {
		var boundary = {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0
		};

		blocks.forEach(block => {
			boundary.left = Math.min(boundary.left, block._offset.x);
			boundary.right = Math.max(boundary.right, block._offset.x);
			boundary.top = Math.min(boundary.top, block._offset.y);
			boundary.bottom = Math.max(boundary.bottom, block._offset.y);
		});

		return boundary;
	}

	static sortBlocks(blocks) {
		return blocks.sort((a, b) => {
			return (a._position.x - b._position.x) || (a._position.y - b._position.y);
		});
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