class HanulseRenderer {
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

	blockRenderer = new HanulseBlockRenderer();

	constructor(canvas, map, options) {
		console.log("initialize");

		this.canvas = canvas;

		this.context = canvas.getContext("2d");
		this.context.imageSmoothingEnabled = false;
	
		HanulseAssets.initialize(this.context);

		this.initializeMap(map);
		this.initializeSlider();

		// Autoplay
		if (options.autoplay) {
			this.play();
		}
	}

	destroy() {


	}

	initializeMap(map) {
		// Initialize map
		this.blocks = map.map(item => new HanulseBlock({
			position: item.position,
			texture: item.texture,
			prop: item.prop,
			effect: item.effect,
			label: item.label,
			action: item.action
		}));
		this.blocks.sort((a, b) => {
			return (a.position.y - b.position.y) || (a.position.x - b.position.x);
		});
	}

	initializeSlider() {
		// Initialize bounds and slider
		var bounds = {"left": 0, "right": 0, "top": 0, "bottom": 0};
		this.blocks.forEach(block => {
			var blockOffsetX = (40 * block.position.x - 40 * block.position.y);
			var blockOffsetY = (20 * block.position.y + 20 * block.position.x - block.position.z * 35);

			bounds.left = Math.min(bounds.left, blockOffsetX);
			bounds.right = Math.max(bounds.right, blockOffsetX);
			bounds.top = Math.min(bounds.top, blockOffsetY);
			bounds.bottom = Math.max(bounds.bottom, blockOffsetY);
		});
		
		this.slider = new HanulseSlider(bounds, (x, y) => {
			this.targetOffsetX = x;
			this.targetOffsetY = y;
		});
	}

	play() {
		console.log("play");

		if (this.playing) return;
		this.playing = true;
		this.requestRender(this.context);
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

	requestRender(context) {
		// console.log("requestRender");

		var self = this;
		window.requestAnimationFrame(() => {
			// console.log("requestAnimationFrame");

			self.compute(context);

			self.render(context);

			if (self.playing) {
				self.requestRender(context);
			}
		});
	}

	compute(context) {
		// console.log("compute");

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

	render(context) {
		// console.log("render");

		// Background
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// context.fillStyle = "red";// this.options.background;
		// context.fillRect(0, 0, 50, 50);
		// context.fillRect(this.canvas.width - 50, this.canvas.height - 50, 50, 50);

		// Main
		context.save();
		context.translate(this.canvas.width * 0.5, this.canvas.height * 0.5);
		context.scale(this.quality, this.quality);

		context.save();
		context.translate(this.offsetX, this.offsetY);
		var count = this.blocks.length;
		for (var i = 0; i < count; i++) {
			this.blockRenderer.render(context, this.blocks[i]);
		}
		context.restore();

		// HanulseUtils.drawWarningLabel(context, "테스트 버전", 0, 200);
		context.restore();
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
			var blockOffsetX = (40 * pickedObject.block.position.x - 40 * pickedObject.block.position.y);
			var blockOffsetY = (20 * pickedObject.block.position.y + 20 * pickedObject.block.position.x - pickedObject.block.position.z * 35);
			this.slider.moveTo(-blockOffsetX, -blockOffsetY);

			this.activeObject.block.setStatus("focus", this.activeObject.side);
			this.activeObject.block.act(this.activeObject.side);
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