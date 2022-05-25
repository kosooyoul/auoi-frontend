class HanulseBlockRenderer {
	static defaultStrokeStyle = "rgb(83, 74, 17)";
	static defaultFillStyle = "rgb(255, 255, 255)";

	static hoverStrokeStyle = "rgba(255, 255, 255, 0.6)";
	static hoverFillStyle = "rgba(255, 255, 0, 0.2)";
	static activeStrokeStyle = "rgba(255, 255, 255, 0.6)";
	static activeFillStyle = "rgba(255, 255, 255, 0.4)";
	static focusStrokeStyle = "rgba(0, 255, 255, 0.6)";
	static focusFillStyle = "rgba(0, 255, 255, 0.4)";

	static defaultTopPath = [[0, -20], [40, 0], [0, 20], [-40, 0], [0, -20]];
	static defaultLeftPath = [[0, 20], [-40, 0], [-40, 35], [0, 55], [0, 20]];
	static defaultRightPath = [[0, 20], [40, 0], [40, 35], [0, 55], [0, 20]];
	static defaultTopSelectionPath = [[0, -19], [38, 0], [0, 19], [-38, 0], [0, -19]];
	static defaultLeftSelectionPath = [[-1, 20], [-39, 1], [-39, 34], [-1, 54], [-1, 20]];
	static defaultRightSelectionPath = [[1, 20], [39, 1], [39, 34], [1, 54], [1, 20]];

	static getTopPath = (w, h, _d) => [[0, -h >> 1], [w >> 1, 0], [0, h >> 1], [-w >> 1, 0], [0, -h >> 1]];
	static getLeftPath = (w, h, d) => [[0, h >> 1], [-w >> 1, 0], [-w >> 1, d], [0, d + (h >> 1)], [0, h >> 1]];
	static getRightPath = (w, h, d) => [[0, h >> 1], [w >> 1, 0], [w >> 1, d], [0, d + (h >> 1)], [0, h >> 1]];
	static getTopSelectionPath = (w, h, d) => [[0, -(h >> 1) + 1], [(w >> 1) - 2, 0], [0, (h >> 1) - 1], [-(w >> 1) + 2, 0], [0, -(h >> 1) + 1]];
	static getLeftSelectionPath = (w, h, d) => [[-1, h >> 1], [-(w >> 1) + 1, 1], [-(w >> 1) + 1, d - 1], [-1, d + (h >> 1) - 1], [-1, h >> 1]];
	static getRightSelectionPath = (w, h, d) => [[1, h >> 1], [(w >> 1) - 1, 1], [(w >> 1) - 1, d - 1], [1, d + (h >> 1) - 1], [1, h >> 1]];

	topPath = null;
	leftPath = null;
	rightPath = null;
	topSelectionPath = null;
	leftSelectionPath = null;
	rightSelectionPath = null;

	_effectRendererFactory = null;

	textureEnabled = true;
	onlyWireframe = false;
	propEnabled = true;
	effectEnabled = true;
	labelEnabled = true;

	constructor(options) {
		if (options.size) {
			this.topPath = HanulseBlockRenderer.getTopPath(options.size.w, options.size.h, options.size.d);
			this.leftPath = HanulseBlockRenderer.getLeftPath(options.size.w, options.size.h, options.size.d);
			this.rightPath = HanulseBlockRenderer.getRightPath(options.size.w, options.size.h, options.size.d);
			this.topSelectionPath = HanulseBlockRenderer.getTopSelectionPath(options.size.w, options.size.h, options.size.d);
			this.leftSelectionPath = HanulseBlockRenderer.getLeftSelectionPath(options.size.w, options.size.h, options.size.d);
			this.rightSelectionPath = HanulseBlockRenderer.getRightSelectionPath(options.size.w, options.size.h, options.size.d);
		} else {
			this.topPath = HanulseBlockRenderer.defaultToppath;
			this.leftPath = HanulseBlockRenderer.defaultLeftpath;
			this.rightPath = HanulseBlockRenderer.defaultRightpath;
			this.topSelectionPath = HanulseBlockRenderer.defaultTopselectionpath;
			this.leftSelectionPath = HanulseBlockRenderer.defaultLeftselectionpath;
			this.rightSelectionPath = HanulseBlockRenderer.defaultRightselectionpath;
		}

		this._effectRendererFactory = options.effectRendererFactory;
	}

	render(context, block) {
		context.save();

		context.globalAlpha = block.getAlpha();

		const offset = block.getOffset();
		const texture = block.getTexture();
		const status = block.getStatus();
		
		context.translate(offset.x, offset.y);

		if (texture.top) {
			this.renderTopWithStatusCode(context, texture.top, status.top);
		}
		if (texture.left) {
			this.renderLeftWithStatusCode(context, texture.left, status.left);
		}
		if (texture.right) {
			this.renderRightWithStatusCode(context, texture.right, status.right);
		}

		if (this.propEnabled) {
			const prop = block.getProp();
			if (prop) {
				this.renderProp(context, prop);
			}
		}

		if (this.labelEnabled) {
			const label = block.getLabel();
			if (label) {
				this.renderLabelWithStatus(context, label, status);
			}
		}

		if (this.effectEnabled) {
			const effect = block.getEffect();
			if (effect) {
				this.renderEffect(context, effect);
			}
		}

		context.restore();
	}

	renderTopWithStatusCode(context, textureName, statusCode) {
		this.renderTexturedPath(context, this.topPath, textureName);

		if (statusCode == "hover") {
			this.renderColoredPath(context, this.topSelectionPath, HanulseBlockRenderer.hoverStrokeStyle, HanulseBlockRenderer.hoverFillStyle);
		} else if (statusCode == "active") {
			this.renderColoredPath(context, this.topSelectionPath, HanulseBlockRenderer.activeStrokeStyle, HanulseBlockRenderer.activeFillStyle);
		} else if (statusCode == "focus") {
			this.renderColoredPath(context, this.topSelectionPath, HanulseBlockRenderer.focusStrokeStyle, HanulseBlockRenderer.focusFillStyle);
		}
	}

	renderLeftWithStatusCode(context, textureName, statusCode) {
		this.renderTexturedPath(context, this.leftPath, textureName);

		if (statusCode == "hover") {
			this.renderColoredPath(context, this.leftSelectionPath, HanulseBlockRenderer.hoverStrokeStyle, HanulseBlockRenderer.hoverFillStyle);
		} else if (statusCode == "active") {
			this.renderColoredPath(context, this.leftSelectionPath, HanulseBlockRenderer.activeStrokeStyle, HanulseBlockRenderer.activeFillStyle);
		} else if (statusCode == "focus") {
			this.renderColoredPath(context, this.leftSelectionPath, HanulseBlockRenderer.focusStrokeStyle, HanulseBlockRenderer.focusFillStyle);
		}
	}

	renderRightWithStatusCode(context, textureName, statusCode) {
		this.renderTexturedPath(context, this.rightPath, textureName);

		if (statusCode == "hover") {
			this.renderColoredPath(context, this.rightSelectionPath, HanulseBlockRenderer.hoverStrokeStyle, HanulseBlockRenderer.hoverFillStyle);
		} else if (statusCode == "active") {
			this.renderColoredPath(context, this.rightSelectionPath, HanulseBlockRenderer.activeStrokeStyle, HanulseBlockRenderer.activeFillStyle);
		} else if (statusCode == "focus") {
			this.renderColoredPath(context, this.rightSelectionPath, HanulseBlockRenderer.focusStrokeStyle, HanulseBlockRenderer.focusFillStyle);
		}
	}

	renderTexturedPath(context, path, textureName) {
		context.beginPath();
		context.moveTo(path[0][0], path[0][1]);
		for (let i = 1; i < path.length; i++) {
			context.lineTo(path[i][0], path[i][1]);
		}
		context.strokeStyle = HanulseBlockRenderer.defaultStrokeStyle;
		context.stroke();
		if (!this.onlyWireframe) {
			if (this.textureEnabled) {
				context.save();
				context.clip();
				if (context.textures[textureName]) {
					var texture = context.textures[textureName];
					context.drawImage(texture.image, texture.left, texture.top, texture.width, texture.height);
				}
				context.restore();
			} else {
				context.fillStyle = HanulseBlockRenderer.defaultFillStyle;
				context.fill();
			}
		}
		context.closePath();
	}

	renderColoredPath(context, path, strokeStyle, fillStyle) {
		context.beginPath();
		context.moveTo(path[0][0], path[0][1]);
		for (let i = 1; i < path.length; i++) {
			context.lineTo(path[i][0], path[i][1]);
		}
		context.strokeStyle = strokeStyle;
		context.stroke();
		context.fillStyle = fillStyle;
		context.fill();
		context.closePath();
	}

	renderProp(context, prop) {
		if (context.props[prop]) {
			var p = context.props[prop];
			context.drawImage(p.image, p.left, p.top, p.width, p.height);
		}
	}

	renderLabelWithStatus(context, label, status) {
		if (status == "active") {
			HanulseUtils.drawActiveLabel(context, label, 0, -85);
		} else if (status == "hover") {
			HanulseUtils.drawHoverLabel(context, label, 0, -85);
		} else if (status == "focus") {
			HanulseUtils.drawFocusLabel(context, label, 0, -85);
		} else {
			HanulseUtils.drawLabel(context, label, 0, -85);
		}
	}

	renderEffect(context, effect) {
		if (!this._effectRendererFactory) {
			return;
		}

		const effectRenderer = this._effectRendererFactory.get(effect);
		if (effectRenderer) {
			effectRenderer.render(context);
		}
	}
}