class HanulseBlock {
	position = {
		x: 0,
		y: 0,
		z: 0
	};

	offset = {
		x: 0,
		y: 0
	}

	texture = {
		top: null,
		left: null,
		right: null
	};

	prop = null;
	effect = null;
	label = null;

	action = {
		top: null,
		left: null,
		right: null,
		all: null
	};

	status = {
		top: null,
		left: null,
		right: null
	};

	constructor(options) {
		if (options == null) {
			return;
		}

		if (options.position) {
			this.position.x = options.position.x;
			this.position.y = options.position.y;
			this.position.z = options.position.z;
			
			this.offset.x = (40 * this.position.x - 40 * this.position.y)
			this.offset.y = (20 * this.position.y + 20 * this.position.x - this.position.z * 35);
		}

		if (options.texture) {
			this.texture.top = options.texture.top;
			this.texture.left = options.texture.left;
			this.texture.right = options.texture.right;
		}

		this.prop = options.prop;
		this.effect = options.effect;
		this.label = options.label;

		if (options.action) {
			if (options.action.all) {
				this.action.all = options.action.all;
			} else {
				this.action.top = options.action.top;
				this.action.left = options.action.left;
				this.action.right = options.action.right;
			}
		}
	}

	pick(x, y) {
		var rx = x - this.offset.x;
		var ry = y - this.offset.y;

		if (this.texture.top) {
			if (this._pickTop(rx, ry)) {
				return "top";
			}
		}
		if (this.texture.left) {
			if (this._pickLeft(rx, ry)) {
				return "left";
			}
		}
		if (this.texture.right) {
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
		if (!this.texture.left) {
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
		if (!this.texture.right) {
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
		return this.offset;
	}

	setStatus(status, side) {
		if (side == "top") {
			this.status.top = status;
		} else if (side == "left") {
			this.status.left = status;
		} else if (side == "right") {
			this.status.right = status;
		} else {
			this.status.top = status;
			this.status.left = status;
			this.status.right = status;
		}
	}

	resetStatus(side) {
		if (side == "top") {
			this.status.top = null;
		} else if (side == "left") {
			this.status.left = null;
		} else if (side == "right") {
			this.status.right = null;
		} else {
			this.status.top = null;
			this.status.left = null;
			this.status.right = null;
		}
	}

	getAction(side) {
		if (side == "top") {
			return this.action.top || this.action.all;
		} else if (side == "left") {
			return this.action.left || this.action.all;
		} else if (side == "right") {
			return this.action.right || this.action.all;
		} else if (side == "all") {
			return this.action.all;
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
			boundary.left = Math.min(boundary.left, block.offset.x);
			boundary.right = Math.max(boundary.right, block.offset.x);
			boundary.top = Math.min(boundary.top, block.offset.y);
			boundary.bottom = Math.max(boundary.bottom, block.offset.y);
		});

		return boundary;
	}
}