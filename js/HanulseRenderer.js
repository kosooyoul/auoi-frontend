class HanulseRenderer {
	static defaultBlockSize = {
		w: 80,
		h: 40,
		d: 35
	};

	static relicsblockSize = {
		w: 69,
		h: 35,
		d: 32
	};

	blockSize = HanulseRenderer.defaultBlockSize;

	canvas = null;
	context = null;
	options = null;

	playing = false;

	quality = 1;

	blocks = null;

	activeObject = null;
	hoverObject = null;

	slider = null;
	offsetX = 0;
	offsetY = 0;
	targetOffsetX = 0;
	targetOffsetY = 0;

	blockRenderer = null;
	fpsCounterView = null;

	constructor(canvas, map, options) {
		console.log("initialize");

		this.canvas = canvas;

		this.context = canvas.getContext("2d");
		this.context.imageSmoothingEnabled = false;
	
		HanulseAssets.initialize(this.context);

		this.blockRenderer = new HanulseBlockRenderer({
			size: this.blockSize,
			effectRendererFactory: new HanulseEffectRendererFactory()
		});
		this.fpsCounterView = new HanulseFPSCounterView($(".fps").get(0));
		

		this.initialize(map);

		// Autoplay
		if (options.autoplay) {
			this.play();
		}
	}

	updateMap(map) {
		this.slider.destroy();
		this.initialize(map);
		this.slider.moveTo(0, 0);
	}

	destroy() {

	}

	initialize(map) {
		// Initialize map
		this.blocks = map.map(item => new HanulseBlock({
			position: item.position,
			size: this.blockSize,
			texture: item.texture,
			prop: item.prop,
			effect: item.effect,
			label: item.label,
			action: item.action
		}));
		HanulseBlock.sortBlocks(this.blocks);

		var bounds = HanulseBlock.getBlocksBoundary(this.blocks);
		
		this.slider = new HanulseSlider(bounds, (x, y) => {
			this.targetOffsetX = x;
			this.targetOffsetY = y;
		});
	}

	play() {
		console.log("play");

		if (this.playing) return;
		this.playing = true;
		this._requestRender(this.context);
	}

	stop() {
		console.log("stop");

		if (!this.playing) return;
		this.playing = false;
	}

	release() {
		console.log("release");

		this.playing = false;

		// Release All Objects
	}

	_requestRender(context) {
		this.fpsCounterView.count();

		var self = this;
		window.requestAnimationFrame(() => {
			self._compute();

			self._render(context);

			if (self.playing) {
				self._requestRender(context);
			}
		});
	}

	_compute() {
		if (this.canvas.clientWidth * this.canvas.clientHeight > 480000) { // 800 * 600
			this.quality = 1;
		} else {
			this.quality = 2;
		}

		this.canvas.width = this.canvas.clientWidth * this.quality;
		this.canvas.height = this.canvas.clientHeight * this.quality;

		this.offsetX += (this.targetOffsetX - this.offsetX) * 0.4;
		this.offsetY += (this.targetOffsetY - this.offsetY) * 0.4;
	}

	_render(context) {
		this._clearCanvas(context);

		this.renderBackgroundOnCanvas(context);

		this._beginRelativePosition(context);
		{
			this.renderBackgroundOnRelativePosition(context);

			this._beginScrolledPosition(context);
			{
				this.renderBackgroundOnScrolledPosition(context);

				this.renderMap(context);

				this.renderOverlayOnScrolledPosition(context);
			}
			this._endScrolledPosition(context);

			this.renderOverlayOnRelativePosition(context);
		}
		this._endRelativePosition(context);

		this.renderOverlayOnCanvas(context);
	}

	_clearCanvas(context) {
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	_beginRelativePosition(context) {
		context.save();
		context.translate(this.canvas.width * 0.5, this.canvas.height * 0.5);
		context.scale(this.quality, this.quality);
	}

	_endRelativePosition(context) {
		context.restore();
	}

	_beginScrolledPosition(context) {
		context.save();
		context.translate(this.offsetX, this.offsetY);
	}

	_endScrolledPosition(context) {
		context.restore();
	}

	renderBackgroundOnCanvas(_context) {

	}

	renderOverlayOnCanvas(context) {
		const size = 2 * this.quality;
		context.fillStyle = "rgb(127, 127, 127)";
		context.fillRect(0, 0, size, size);
		context.fillRect(this.canvas.width - size, 0, size, size);
		context.fillRect(0, this.canvas.height - size, size, size);
		context.fillRect(this.canvas.width - size, this.canvas.height - size, size, size);
	}

	renderBackgroundOnRelativePosition(context) {
		context.fillStyle = "rgb(127, 127, 127)";
		context.fillRect(-300, -200, 2, 2);
		context.fillRect(298, 198, 2, 2);
		context.fillRect(298, -200, 2, 2);
		context.fillRect(-300, 198, 2, 2);
	}

	renderOverlayOnRelativePosition(_context) {
		
	}


	renderBackgroundOnScrolledPosition(context) {
		context.fillStyle = "rgb(127, 127, 127)";
		context.fillRect(-300, -200, 2, 2);
		context.fillRect(298, 198, 2, 2);
		context.fillRect(298, -200, 2, 2);
		context.fillRect(-300, 198, 2, 2);
	}

	renderOverlayOnScrolledPosition(_context) {

	}

	renderMap(context) {
		var count = this.blocks.length;
		for (var i = 0; i < count; i++) {
			this.blockRenderer.render(context, this.blocks[i]);
		}
	}

	onPointerDown(evt) {
		var pointer = this.slider.onPointerDown(evt);

		var cursorX = pointer.x - this.canvas.width / 2 / this.quality;
		var cursorY = pointer.y - this.canvas.height / 2 / this.quality;

		// 활성화 개체 상태를 변경
		if (this.activeObject) {
			this.activeObject.block.resetStatus(this.activeObject.side);
		}
		this.activeObject = this.pick(cursorX, cursorY);
		if (this.activeObject) {
			this.activeObject.block.setStatus("active", this.activeObject.side);
		}
	}

	onPointerMove(evt) {
		var pointer = this.slider.onPointerMove(evt);

		// 포인터 중심 위치
		var cursorX = pointer.x - this.canvas.width / 2 / this.quality;
		var cursorY = pointer.y - this.canvas.height / 2 / this.quality;

		// 다운 상태가 아니면 롤오버 상태를 교체
		if (!pointer.moving) {
			if (this.isSameObject(this.hoverObject, this.activeObject) == false) {
				if (this.hoverObject) {
					this.hoverObject.block.resetStatus(this.hoverObject.side);
				}
			}
			var hoverObject = this.pick(cursorX, cursorY);
			if (this.isSameObject(hoverObject, this.activeObject) == false) {
				if (hoverObject) {
					this.hoverObject = hoverObject;
					this.hoverObject.block.setStatus("hover", this.hoverObject.side);
				}
			}
			return;
		}

		// 클릭 유효 범위 넘어서면, 상태 변경
		if (Math.abs(pointer.distanceX) > 20 || Math.abs(pointer.distanceY) > 20) {
			if (this.activeObject) {
				this.activeObject.block.setStatus("hover", this.activeObject.side);
			}
		}
	}
	
	onPointerUp(evt) {
		var pointer = this.slider.onPointerUp(evt);
		if (!pointer) {
			return;
		}

		// 포인터 중심 위치
		var cursorX = pointer.x - this.canvas.width / 2 / this.quality;
		var cursorY = pointer.y - this.canvas.height / 2 / this.quality;

		// 클릭 유효 범위 넘어서면, 상태 변경하고 끝
		if (Math.abs(pointer.distanceX) > 20 || Math.abs(pointer.distanceY) > 20) {
			if (this.activeObject) {
				this.activeObject.block.setStatus("hover", this.activeObject.side);
			}
			return;
		}

		// 선택한 개체가 활성화 개체와 동일하면 클릭
		var pickedObject = this.pick(cursorX, cursorY);
		if (this.isSameObject(this.activeObject, pickedObject)) {
			var offset = pickedObject.block.getOffset();
			this.slider.moveTo(-offset.x, -offset.y);

			this.activeObject.block.setStatus("focus", this.activeObject.side);
			var action = this.activeObject.block.getAction(this.activeObject.side);
			if (action) {
				HanulseAction.act(action);
			}
		}
	}

	pick(x, y) {
		for (var i = this.blocks.length - 1; i >= 0; i--) {
			var block = this.blocks[i];
			var pickedSide = block.pick(x - this.offsetX, y - this.offsetY);
			if (pickedSide) {
				return {block: block, side: pickedSide};
			}
		}
		return null;
	}

	isSameObject(a, b) {
		if (a == null) return false;
		if (b == null) return false;
		if (a.block != b.block) return false;
		if (a.side != b.side) return false;
		return true;
	}
}