class HanulseBlock {
	_position = {
		x: 0,
		y: 0,
		z: 0
	};

	_offset = {
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
			return (a._position.y - b._position.y) || (a._position.x - b._position.x);
		});
	}
}