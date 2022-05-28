class HanulseCanvasView {
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

	blockSize = HanulseCanvasView.defaultBlockSize;

	canvas = null;
	context = null;

	renderer = null;
	actionFactory = null;
	slider = null;
	fpsCounterView = null;

	blocks = [];

	_playing = false;
	
	quality = 1;
	qualityRatio = 1;
	computedQuality = 1;
	targetQualityRatio = 1;

	activeObject = null;
	hoverObject = null;

	offset = {
		x: 0,
		y: 0
	};

	targetOffset = {
		x: 0,
		y: 0
	};

	constructor(canvas, options) {
		console.log("initialize");

		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.context.imageSmoothingEnabled = false;
	
		this.renderer = new HanulseRenderer();
		this.renderer.initialize(this.context);

		this.actionFactory = new HanulseActionFactory();

		this.slider = new HanulseSlider();
		this.slider.setOnSlide((x, y) => {
			this.targetOffset.x = x;
			this.targetOffset.y = y;
		});

		if (options.enabledFPSCounter) {
			this.fpsCounterView = new HanulseFPSCounterView($(".fps").get(0));
		}
		
		// Autoplay
		if (options.autoplay) {
			this.play();
		}
	}

	destroy() {

	}

	updateMapData(mapData) {
		var startOffset = mapData.so || {x: 0, y: 0};
		var map = mapData.map || [];
		var blocks = map.map(item => new HanulseBlock({
			position: item.position,
			size: this.blockSize,
			texture: item.texture,
			prop: item.prop,
			effect: item.effect,
			label: item.label,
			action: item.action,
			alpha: item.alpha
		}));
		this.blocks = HanulseBlock.sortBlocks(blocks);

		this.renderer.clearAssets();
		this.renderer.setBlocks(this.blocks);

		var boundary = HanulseBlock.getBlocksBoundary(this.blocks);
		this.slider.setBoundary(boundary);
		this.slider.moveTo(startOffset.x, startOffset.y);
	}

	play() {
		console.log("play");

		if (this._playing) return;
		this._playing = true;
		this._requestRender(this.context);
	}

	stop() {
		console.log("stop");

		if (!this._playing) return;
		this._playing = false;
	}

	release() {
		console.log("release");

		this._playing = false;

		// Release All Objects
	}

	_requestRender(context) {
		if (this.fpsCounterView) {
			this.fpsCounterView.count();
		}

		var self = this;
		window.requestAnimationFrame(() => {
			self._compute();

			self.renderer.compute();
			self.renderer.render(context);

			if (self._playing) {
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
		this.computedQuality = this.quality * this.qualityRatio;
		this.renderer.setQuality(this.computedQuality);

		this.canvas.width = this.canvas.clientWidth * this.computedQuality;
		this.canvas.height = this.canvas.clientHeight * this.computedQuality;
		this.renderer.setCanvasSize(this.canvas.width, this.canvas.height);

		this.offset.x += (this.targetOffset.x - this.offset.x) * 0.4;
		this.offset.y += (this.targetOffset.y - this.offset.y) * 0.4;
		this.renderer.setOffset(this.offset.x, this.offset.y);

		if (this.targetQualityRatio > this.qualityRatio) {
			this.qualityRatio = Math.min(this.qualityRatio * 1.2, this.targetQualityRatio);
		} else if (this.targetQualityRatio < this.qualityRatio) {
			this.qualityRatio = Math.max(this.qualityRatio / 1.2, this.targetQualityRatio);
		}
	}

	fadeOut(duration, onFaded) {
		// TODO: implement fade out
		setTimeout(function() {
			onFaded && onFaded();
		}, duration)
	}
	
	fadeIn(duration, onFaded) {
		// TODO: implement fade in
		setTimeout(function() {
			onFaded && onFaded();
		}, duration)
	}

	onPointerDown(evt) {
		var pointer = this.slider.onPointerDown(evt);

		var cursorX = pointer.x - this.canvas.width / 2 / this.computedQuality;
		var cursorY = pointer.y - this.canvas.height / 2 / this.computedQuality;

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
		var cursorX = pointer.x - this.canvas.width / 2 / this.computedQuality;
		var cursorY = pointer.y - this.canvas.height / 2 / this.computedQuality;

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
		var cursorX = pointer.x - this.canvas.width / 2 / this.computedQuality;
		var cursorY = pointer.y - this.canvas.height / 2 / this.computedQuality;

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
			var actionData = this.activeObject.block.getAction(this.activeObject.side);
			if (actionData) {
				var action = this.actionFactory.get(actionData.type);
				if (action) {
					this.targetQualityRatio = 0.2;
					action.act(actionData, () => {
						this.targetQualityRatio = 1;
					});
				}
			}
		}
	}

	pick(x, y) {
		for (var i = this.blocks.length - 1; i >= 0; i--) {
			var block = this.blocks[i];
			var pickedSide = block.pick(x - this.offset.x, y - this.offset.y);
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