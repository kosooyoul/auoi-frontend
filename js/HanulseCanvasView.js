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
	actions = null;
	slider = null;
	fpsCounterView = null;
	identityView = null;

	blocks = [];
	rotation = 0;

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
		this.renderer.setBlocks(this.blocks);

		this.actions = new HanulseActions();

		this.slider = new HanulseSlider();
		this.slider.setOnSlide((x, y) => {
			this.targetOffset.x = x;
			this.targetOffset.y = y;
		});

		if (options.enabledFPSCounter) {
			this.fpsCounterView = new HanulseFPSCounterView($(".fps").get(0));
		}

		// TODO: 2022-07-07: modulize view
		HanulseAuthorizationManager.bindLoginButton(".identity");
		$(".identity").on("click", () => {
			const loginView = new HanulseLoginView();
			this.targetQualityRatio = 0.2;
			loginView.setOnHideCallback(() => {
				this.targetQualityRatio = 1;
			});
			loginView.show();
		});

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
			// Note: 2022-06-29: ????????? ????????? ??????, ????????? ????????? ??????
			// this.quality = 2;
			this.quality = 1;
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
		$(this.canvas).stop().fadeOut(duration, () => onFaded && onFaded());
	}
	
	fadeIn(duration, onFaded) {
		$(this.canvas).stop().fadeIn(duration, () => onFaded && onFaded());
	}

	addBlock(options) {
		console.log(options)
		this.blocks.push(new HanulseBlock({
			... options,
			size: this.blockSize
		}));
		HanulseBlock.sortBlocks(this.blocks);

		var boundary = HanulseBlock.getBlocksBoundary(this.blocks);
		this.slider.setBoundary(boundary);
	}

	rotateLeft() {
		this.rotation = (this.rotation + 3) % 4;
		this.blocks.forEach(block => block.setRotation(this.rotation));
		HanulseBlock.sortBlocks(this.blocks);
	}

	rotateRight() {
		this.rotation = (this.rotation + 1) % 4;
		this.blocks.forEach(block => block.setRotation(this.rotation));
		HanulseBlock.sortBlocks(this.blocks);
	}

	onBlockSelected(selectedObject) {
		var actionData = selectedObject.block.getAction(selectedObject.side);
		if (actionData) {
			this.targetQualityRatio = 0.2;
			this.actions.act(actionData.type, actionData, () => {
				this.targetQualityRatio = 1;
			});
		}
	}

	onPointerDown(evt) {
		var pointer = this.slider.onPointerDown(evt);

		var cursorX = pointer.x - this.canvas.width / 2 / this.computedQuality;
		var cursorY = pointer.y - this.canvas.height / 2 / this.computedQuality;

		// ????????? ?????? ????????? ??????
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

		// ????????? ?????? ??????
		var cursorX = pointer.x - this.canvas.width / 2 / this.computedQuality;
		var cursorY = pointer.y - this.canvas.height / 2 / this.computedQuality;

		// ?????? ????????? ????????? ????????? ????????? ??????
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

		// ?????? ?????? ?????? ????????????, ?????? ??????
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

		// ????????? ?????? ??????
		var cursorX = pointer.x - this.canvas.width / 2 / this.computedQuality;
		var cursorY = pointer.y - this.canvas.height / 2 / this.computedQuality;

		// ?????? ?????? ?????? ????????????, ?????? ???????????? ???
		if (Math.abs(pointer.distanceX) > 20 || Math.abs(pointer.distanceY) > 20) {
			if (this.activeObject) {
				this.activeObject.block.setStatus("hover", this.activeObject.side);
			}
			return;
		}

		// ????????? ????????? ????????? ????????? ???????????? ??????
		var pickedObject = this.pick(cursorX, cursorY);
		if (this.isSameObject(this.activeObject, pickedObject)) {
			var offset = pickedObject.block.getOffset();
			this.slider.moveTo(-offset.x, -offset.y);

			this.activeObject.block.setStatus("focus", this.activeObject.side);
			
			this.onBlockSelected(this.activeObject);
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