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
	static defaultLeftPath = [[0, 20], [-40, 0], [-40, 35], [0, 55], [0, 20],];
	static defaultRightPath = [[0, 20], [40, 0], [40, 35], [0, 55], [0, 20]];
	static defaultTopSelectionPath = [[0, -19], [38, 0], [0, 19], [-38, 0], [0, -19]];
	static defaultLeftSelectionPath = [[-1, 20], [-39, 1], [-39, 34], [-1, 54], [-1, 20]];
	static defaultRightSelectionPath = [[1, 20], [39, 1], [39, 34], [1, 54], [1, 20]];

	textureEnabled = true;
	onlyWireframe = false;
	propEnabled = true;
	effectEnabled = true;
	labelEnabled = true;

	render(context, block) {
		context.save();
		context.translate(block.offset.x, block.offset.y);

		if (block.texture.top) {
			this.renderTopWithStatusCode(context, block.texture.top, block.status.top);
		}
		
		if (block.texture.left) {
			this.renderLeftWithStatusCode(context, block.texture.left, block.status.left);
		}
		
		if (block.texture.right) {
			this.renderRightWithStatusCode(context, block.texture.right, block.status.right);
		}

		if (this.propEnabled && block.prop) {
			this.renderProp(context, block.prop);
		}

		if (this.labelEnabled && block.label) {
			this.renderLabelWithStatus(context, block.label, block.status);
		}

		if (this.effectEnabled && block.effect) {
			this.renderEffect(context, block.effect);
		}

		context.restore();
	}

	renderTopWithStatusCode(context, textureName, statusCode) {
		this.renderTexturedPath(context, HanulseBlockRenderer.defaultTopPath, textureName);

		if (statusCode == "hover") {
			this.renderColoredPath(context, HanulseBlockRenderer.defaultTopSelectionPath, HanulseBlockRenderer.hoverStrokeStyle, HanulseBlockRenderer.hoverFillStyle);
		} else if (statusCode == "active") {
			this.renderColoredPath(context, HanulseBlockRenderer.defaultTopSelectionPath, HanulseBlockRenderer.activeStrokeStyle, HanulseBlockRenderer.activeFillStyle);
		} else if (statusCode == "focus") {
			this.renderColoredPath(context, HanulseBlockRenderer.defaultTopSelectionPath, HanulseBlockRenderer.focusStrokeStyle, HanulseBlockRenderer.focusFillStyle);
		}
	}

	renderLeftWithStatusCode(context, textureName, statusCode) {
		this.renderTexturedPath(context, HanulseBlockRenderer.defaultLeftPath, textureName);

		if (statusCode == "hover") {
			this.renderColoredPath(context, HanulseBlockRenderer.defaultLeftSelectionPath, HanulseBlockRenderer.hoverStrokeStyle, HanulseBlockRenderer.hoverFillStyle);
		} else if (statusCode == "active") {
			this.renderColoredPath(context, HanulseBlockRenderer.defaultLeftSelectionPath, HanulseBlockRenderer.activeStrokeStyle, HanulseBlockRenderer.activeFillStyle);
		} else if (statusCode == "focus") {
			this.renderColoredPath(context, HanulseBlockRenderer.defaultLeftSelectionPath, HanulseBlockRenderer.focusStrokeStyle, HanulseBlockRenderer.focusFillStyle);
		}
	}

	renderRightWithStatusCode(context, textureName, statusCode) {
		this.renderTexturedPath(context, HanulseBlockRenderer.defaultRightPath, textureName);

		if (statusCode == "hover") {
			this.renderColoredPath(context, HanulseBlockRenderer.defaultRightSelectionPath, HanulseBlockRenderer.hoverStrokeStyle, HanulseBlockRenderer.hoverFillStyle);
		} else if (statusCode == "active") {
			this.renderColoredPath(context, HanulseBlockRenderer.defaultRightSelectionPath, HanulseBlockRenderer.activeStrokeStyle, HanulseBlockRenderer.activeFillStyle);
		} else if (statusCode == "focus") {
			this.renderColoredPath(context, HanulseBlockRenderer.defaultRightSelectionPath, HanulseBlockRenderer.focusStrokeStyle, HanulseBlockRenderer.focusFillStyle);
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
		if (effect == "warp") {
			HanulseWarpEffect.render(context);
		} else if (effect == "bigwarp") {
			HanulseWarpEffect.render(context);
		} else if (effect == "link") {
			HanulseLinkEffect.render(context);
		} else if (effect == "flash") {
			HanulseFlashEffect.render(context);
		}
	}
}