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
	descriptionEnabled = false;

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
			const propName = block.getProp();
			if (propName) {
				this.renderProp(context, propName);
			}
		}

		if (this.labelEnabled) {
			const label = block.getLabel();
			if (label) {
				this.renderLabelWithStatusCode(context, label, status.some);
			}
		}

		if (this.descriptionEnabled) {
			const description = block.getDescription();
			if (description) {
				this.renderDescription(context, description);
			}
		}

		if (this.effectEnabled) {
			const effect = block.getEffect();
			if (effect) {
				this.renderEffect(context, effect, block.getTimeOffset());
			}
		}

		context.restore();
	}

	renderBase(context, block) {
		let needToRedraw = false;

		context.save();

		context.globalAlpha = block.getAlpha();

		const offset = block.getOffset();
		const texture = block.getTexture();
		
		context.translate(offset.x, offset.y);

		if (texture.top) {
			needToRedraw ||= this.renderTexturedPath(context, this.topPath, texture.top);
		}
		if (texture.left) {
			needToRedraw ||= this.renderTexturedPath(context, this.leftPath, texture.left);
		}
		if (texture.right) {
			needToRedraw ||= this.renderTexturedPath(context, this.rightPath, texture.right);
		}

		if (this.propEnabled) {
			const propName = block.getProp();
			if (propName) {
				needToRedraw ||= this.renderProp(context, propName);
			}
		}

		context.restore();

		return needToRedraw;
	}

	renderOverlay(context, block) {
		context.save();

		const offset = block.getOffset();
		const status = block.getStatus();
		
		context.translate(offset.x, offset.y);

		if (status.top) {
			this.renderTopHighlight(context, status.top);
		}
		if (status.left) {
			this.renderLeftHighlight(context, status.left);
		}
		if (status.right) {
			this.renderRightHighlight(context, status.right);
		}

		if (this.effectEnabled) {
			const effect = block.getEffect();
			if (effect) {
				this.renderEffect(context, effect, block.getTimeOffset());
			}
		}

		if (this.labelEnabled) {
			const label = block.getLabel();
			if (label) {
				this.renderLabelWithStatusCode(context, label, status.some);
			}
		}
		
		if (this.descriptionEnabled) {
			const description = block.getDescription();
			if (description) {
				this.renderDescription(context, description);
			}
		}

		context.restore();
	}

	renderTopHighlight(context, statusCode) {
		if (statusCode == "hover") {
			this.renderColoredPath(context, this.topSelectionPath, HanulseBlockRenderer.hoverStrokeStyle, HanulseBlockRenderer.hoverFillStyle);
		} else if (statusCode == "active") {
			this.renderColoredPath(context, this.topSelectionPath, HanulseBlockRenderer.activeStrokeStyle, HanulseBlockRenderer.activeFillStyle);
		} else if (statusCode == "focus") {
			this.renderColoredPath(context, this.topSelectionPath, HanulseBlockRenderer.focusStrokeStyle, HanulseBlockRenderer.focusFillStyle);
		}
	}

	renderLeftHighlight(context, statusCode) {
		if (statusCode == "hover") {
			this.renderColoredPath(context, this.leftSelectionPath, HanulseBlockRenderer.hoverStrokeStyle, HanulseBlockRenderer.hoverFillStyle);
		} else if (statusCode == "active") {
			this.renderColoredPath(context, this.leftSelectionPath, HanulseBlockRenderer.activeStrokeStyle, HanulseBlockRenderer.activeFillStyle);
		} else if (statusCode == "focus") {
			this.renderColoredPath(context, this.leftSelectionPath, HanulseBlockRenderer.focusStrokeStyle, HanulseBlockRenderer.focusFillStyle);
		}
	}

	renderRightHighlight(context, statusCode) {
		if (statusCode == "hover") {
			this.renderColoredPath(context, this.rightSelectionPath, HanulseBlockRenderer.hoverStrokeStyle, HanulseBlockRenderer.hoverFillStyle);
		} else if (statusCode == "active") {
			this.renderColoredPath(context, this.rightSelectionPath, HanulseBlockRenderer.activeStrokeStyle, HanulseBlockRenderer.activeFillStyle);
		} else if (statusCode == "focus") {
			this.renderColoredPath(context, this.rightSelectionPath, HanulseBlockRenderer.focusStrokeStyle, HanulseBlockRenderer.focusFillStyle);
		}
	}

	renderTexturedPath(context, path, textureName) {
		let needToRedraw = false;

		context.beginPath();
		context.moveTo(path[0][0], path[0][1]);
		for (let i = 1; i < path.length; i++) {
			context.lineTo(path[i][0], path[i][1]);
		}

		context.strokeStyle = HanulseBlockRenderer.defaultStrokeStyle;
		context.stroke();

		if (!this.onlyWireframe) {
			if (this.textureEnabled) {
				var texture = HanulseAssets.getTexture(textureName);
				if (texture) {
					if (texture.ready) {
						context.save();
						context.clip();
						context.drawImage(texture.image, texture.left, texture.top, texture.width, texture.height);
						context.restore();
					} else {
						needToRedraw = true;
					}
				}
			} else {
				context.fillStyle = HanulseBlockRenderer.defaultFillStyle;
				context.fill();
			}
		}
		context.closePath();

		return needToRedraw;
	}

	renderColoredPath(context, path, strokeStyle, fillStyle) {
		context.save();
		// context.clip();
		context.beginPath();
		context.moveTo(path[0][0], path[0][1]);
		for (let i = 1; i < path.length; i++) {
			context.lineTo(path[i][0], path[i][1]);
		}
		context.strokeStyle = strokeStyle;
		context.lineWidth = 1;
		context.lineJoin = "round";
		context.lineCap = "round";
		context.stroke();
		context.fillStyle = fillStyle;
		context.fill();
		context.closePath();
		context.restore();
	}

	renderProp(context, propName) {
		var prop = HanulseAssets.getProp(propName);
		if (prop) {
			if (prop.ready) {
				context.drawImage(prop.image, prop.left, prop.top, prop.width, prop.height);
			} else {
				return true;
			}
		}

		return false;
	}

	renderDescription(context, description) {
		HanulseUtils.drawDescription(context, description, 0, 0);
	}

	renderLabelWithStatusCode(context, label, statusCode) {
		let text;
		let position;
		if (typeof label == "string") {
			text = label;
			position = "medium";
		} else {
			text = label.text;
			position = label.position || "medium";
		}

		let y;
		if (position == "top") {
			y = -115;
		} else if (position == "medium") {
			y = -85;
		} else if (position == "bottom") {
			y = -55;
		} else {
			y = -85;
		}

		if (statusCode == "active") {
			HanulseUtils.drawActiveLabel(context, text, 0, y);
		} else if (statusCode == "hover") {
			HanulseUtils.drawHoverLabel(context, text, 0, y);
		} else if (statusCode == "focus") {
			HanulseUtils.drawFocusLabel(context, text, 0, y);
		} else {
			HanulseUtils.drawLabel(context, text, 0, y);
		}
	}

	renderEffect(context, effect, timeOffset) {
		if (!this._effectRendererFactory) {
			return;
		}

		const effectRenderer = this._effectRendererFactory.get(effect);
		if (effectRenderer) {
			effectRenderer.render(context, timeOffset);
		}
	}
}