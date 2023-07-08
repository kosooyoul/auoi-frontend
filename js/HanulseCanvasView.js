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

	boundary = null;

	renderer = null;
	actionRunner = null;
	slider = null;
	fpsCounterView = null;
	identityView = null;

	blocks = [];
	rotation = 0;

	_playing = false;
	
	// enabled = true;

	quality = 1.5;
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

	constructor(options) {
		console.log("initialize");

		this.root = options.root;
		this.canvas = options.canvas;

		this.context = this.canvas.getContext("2d");
		this.context.imageSmoothingEnabled = false;
	
		this.renderer = new HanulseRenderer();
		this.renderer.initialize(this.context);
		this.renderer.setBlocks(this.blocks);

		this.actionRunner = new HanulseActions();

		this.slider = new HanulseSlider();
		this.slider.setOnSlide((x, y) => {
			this.canvas.style.left = (x + (this.root.clientWidth - this.canvas.width / this.computedQuality) / 2) + 'px';
			this.canvas.style.top = (y + (this.root.clientHeight - this.canvas.height / this.computedQuality) / 2) + 'px';
		});

		if (options.enabledFPSCounter) {
			this.fpsCounterView = new HanulseFPSCounterView($(".fps").get(0));
		}

		// TODO: 2022-07-07: modulize view
		HanulseAuthorizationManager.bindLoginButton(".identity");
		$(".identity").on("click", () => {
			const loginView = new HanulseLoginView();
			this.targetQualityRatio = 0.1;
			// this.enabled = false;
			loginView.setOnHideCallback(() => {
				this.targetQualityRatio = 1;
				// this.enabled = true;
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
			description: item.description,
			action: item.action,
			actions: item.actions,
			alpha: item.alpha
		}));
		this.blocks = HanulseBlock.sortBlocks(blocks);
		this.actionRunner.run(mapData.actions || []);

		this.renderer.clearAssets();
		this.renderer.setBlocks(this.blocks);

		this.boundary = HanulseBlock.getBlocksBoundary(this.blocks);

		// Update canvas size
		const width = Math.max(this.boundary.right, this.boundary.left) * 2 + 120;
		const height = this.boundary.bottom - this.boundary.top + 240;
		this.width = width * this.computedQuality;
		this.height = height * this.computedQuality;
		this.canvas.width = width * this.computedQuality;
		this.canvas.height = height * this.computedQuality;
		this.canvas.style.width = width + 'px';
		this.canvas.style.height = height + 'px';
		this.renderer.setCanvasSize(this.canvas.width, this.canvas.height);

		this.slider.setBoundary(this.boundary);
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
		if (this.boundary == null) {
			return;
		}

		this.slider.resizeBoundary({
			left: -(Math.max(this.root.clientWidth, this.canvas.clientWidth) / 2),
			top: -(Math.max(this.root.clientHeight, this.canvas.clientHeight) / 2),
			right: (Math.max(this.root.clientWidth, this.canvas.clientWidth) / 2),
			bottom: (Math.max(this.root.clientHeight, this.canvas.clientHeight) / 2)
		});

		this.offset.x += (this.targetOffset.x - this.offset.x) * 0.4;
		this.offset.y += (this.targetOffset.y - this.offset.y) * 0.4;

		if (this.targetQualityRatio > this.qualityRatio) {
			this.qualityRatio = Math.min(this.qualityRatio * 1.2, this.targetQualityRatio);
		} else if (this.targetQualityRatio < this.qualityRatio) {
			this.qualityRatio = Math.max(this.qualityRatio / 1.2, this.targetQualityRatio);
		}

		// Update quality
		const computedQuality = this.quality * this.qualityRatio;
		if (this.computedQuality != computedQuality) {
			this.computedQuality = computedQuality;
			this.renderer.setQuality(this.computedQuality);
		}

		// Update canvas size
		const width = Math.max(this.boundary.right, this.boundary.left) * 2 + 120;
		const height = this.boundary.bottom - this.boundary.top + 240;
		if (this.width != width * this.computedQuality || this.height != height * this.computedQuality) {
			this.width = width * this.computedQuality;
			this.height = height * this.computedQuality;
			this.canvas.width = width * this.computedQuality;
			this.canvas.height = height * this.computedQuality;
			this.canvas.style.width = width + 'px';
			this.canvas.style.height = height + 'px';
			this.renderer.setCanvasSize(this.canvas.width, this.canvas.height);
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

		this.boundary = HanulseBlock.getBlocksBoundary(this.blocks);
		this.slider.setBoundary(this.boundary);
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
		var actions = selectedObject.block.getActions(selectedObject.side);
		if (actions) {
			this.targetQualityRatio = 0.1;
			// this.enabled = false;
			this.actionRunner.run(actions, () => {
				this.targetQualityRatio = 1;
				// this.enabled = true;
			});
		}
	}

	onPointerDown(evt) {
		// if (!this.enabled) return;

		var pointer = this.slider.onPointerDown(evt);

		// 포인터 중심 위치
		var cursorX = pointer.x  - this.root.clientWidth / 2 - this.slider.offsetX;
		var cursorY = pointer.y - this.root.clientHeight / 2 - this.slider.offsetY;

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
		// if (!this.enabled) return;

		var pointer = this.slider.onPointerMove(evt);

		// 포인터 중심 위치
		var cursorX = pointer.x  - this.root.clientWidth / 2 - this.slider.offsetX;
		var cursorY = pointer.y - this.root.clientHeight / 2 - this.slider.offsetY;

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
		// if (!this.enabled) return;

		var pointer = this.slider.onPointerUp(evt);
		if (!pointer) {
			return;
		}

		// 포인터 중심 위치
		var cursorX = pointer.x  - this.root.clientWidth / 2 - this.slider.offsetX;
		var cursorY = pointer.y - this.root.clientHeight / 2 - this.slider.offsetY;

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