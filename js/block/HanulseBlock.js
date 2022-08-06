class HanulseBlock {
	_size = {
		w: 0,
		h: 0,
		d: 0
	};

	_position = {
		x: 0,
		y: 0,
		z: 0
	};

	_offset = {
		x: 0,
		y: 0
	};

	_rotatedPosition = {
		x: 0,
		y: 0,
		z: 0
	};

	_rotatedOffset = {
		x: 0,
		y: 0
	};

	_texture = {
		top: null,
		left: null,
		right: null
	};

	_prop = null;
	_effect = null;
	_label = null;

	_action = {
		top: null,
		left: null,
		right: null,
		all: null
	};

	_status = {
		top: null,
		left: null,
		right: null
	};

	_alpha = 1.0;
	_dark = 0.0;
	_timeOffset = 0;
	_rotation = 0; // 0: "none" | 1: "quarter" | 2: "half" | 3: "rev-quarter"

	constructor(options) {
		if (options == null) {
			return;
		}

		if (options.size) {
			this._size.w = options.size.w;
			this._size.h = options.size.h;
			this._size.d = options.size.d;
		}

		if (options.position) {
			this.setPosition(options.position);
			this.setRotation(options.rotation || 0);
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

	pick(x, y) {
		var offset = this.getOffset();
		var rx = x - offset.x;
		var ry = y - offset.y;

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

	getPosition() {
		return this._position;
	}

	getOffset() {
		return this._rotatedOffset;
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

	setDark(dark) {
		this._dark = dark;
	}

	setPosition(position) {
		this._position.x = position.x;
		this._position.y = position.y;
		this._position.z = position.z;
			
		this._offset.x = ((this._size.w >> 1) * this._position.x - (this._size.w >> 1) * this._position.y);
		this._offset.y = ((this._size.h >> 1) * this._position.y + (this._size.h >> 1) * this._position.x - this._position.z * this._size.d);

		this.setRotation(this._rotation);
	}

	setRotation(rotation) {
		const r = (rotation + 4) % 4;

		if (r == 0) {
			this._rotatedPosition.x = this._position.x;
			this._rotatedPosition.y = this._position.y;
			this._rotatedPosition.z = this._position.z;
		} else if (r == 1) {
			this._rotatedPosition.x = -this._position.y;
			this._rotatedPosition.y = this._position.x;
			this._rotatedPosition.z = this._position.z;
		} else if (r == 2) {
			this._rotatedPosition.x = -this._position.x;
			this._rotatedPosition.y = -this._position.y;
			this._rotatedPosition.z = this._position.z;
		} else if (r == 3) {
			this._rotatedPosition.x = this._position.y;
			this._rotatedPosition.y = -this._position.x;
			this._rotatedPosition.z = this._position.z;
		} else {
			this._rotatedPosition.x = this._position.x;
			this._rotatedPosition.y = this._position.y;
			this._rotatedPosition.z = this._position.z;
		}

		this._rotatedOffset.x = ((this._size.w >> 1) * this._rotatedPosition.x - (this._size.w >> 1) * this._rotatedPosition.y);
		this._rotatedOffset.y = ((this._size.h >> 1) * this._rotatedPosition.y + (this._size.h >> 1) * this._rotatedPosition.x - this._rotatedPosition.z * this._size.d);

		this._rotation = rotation;
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
		this._status.some = status;
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
		this._status.some = this._status.top || this._status.left || this._status.right;
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

	isFrontOf(targetBlock) {
		return (this._rotatedPosition.z - targetBlock._rotatedPosition.z) || (this._rotatedPosition.y - targetBlock._rotatedPosition.y) || (this._rotatedPosition.x - targetBlock._rotatedPosition.x);
	}

	static getBlocksBoundary(blocks) {
		var boundary = {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0
		};

		blocks.forEach(block => {
			boundary.left = Math.min(boundary.left, block._rotatedOffset.x);
			boundary.right = Math.max(boundary.right, block._rotatedOffset.x);
			boundary.top = Math.min(boundary.top, block._rotatedOffset.y);
			boundary.bottom = Math.max(boundary.bottom, block._rotatedOffset.y);
		});

		return boundary;
	}

	static sortBlocks(blocks) {
		return blocks.sort((a, b) => {
			return (a._rotatedPosition.x - b._rotatedPosition.x) || (a._rotatedPosition.y - b._rotatedPosition.y);
		});
	}
}