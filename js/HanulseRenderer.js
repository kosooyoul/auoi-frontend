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

	blocks = null;
	blockSize = null;

	canvasSize = {
		w: 0,
		h: 0
	};

	quality = 1;

	effectRendererFactory = null;
	blockRenderer = null;

	baseCacheCanvas = null;
	baseCacheContext = null;
	baseCacheUpdated = null;

	constructor() {
		this.blocks = [];
		this.blockSize = HanulseRenderer.defaultBlockSize;

		this.effectRendererFactory = new HanulseEffectRendererFactory();
		this.blockRenderer = new HanulseBlockRenderer({
			size: this.blockSize,
			effectRendererFactory: this.effectRendererFactory
		});
		
		// Cache canvas
		this.baseCacheCanvas = document.createElement("canvas");
		this.baseCacheContext = this.baseCacheCanvas.getContext("2d");
		this.baseCacheCanvas.width = 1;
		this.baseCacheCanvas.height = 1;
	}

	initialize(context) {
		HanulseAssets.initialize(context);
	}

	clearAssets() {
		HanulseAssets.resetImages();
	}

	setBlocks(blocks) {
		this.blocks = blocks;
	}

	setCanvasSize(w, h) {
		this.canvasSize.w = w;
		this.canvasSize.h = h;
		
		// Cache canvas
		this.baseCacheCanvas.width = w;
		this.baseCacheCanvas.height = h;
		this.baseCacheUpdated = null;
	}

	setQuality(quality) {
		this.quality = quality;
	}

	compute() {

	}

	render(context) {
		this._clearCanvas(context);

		this.renderMap(context);
	}

	_clearCanvas(context) {
		context.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h);
	}

	renderOverlayOnCanvas(context) {
		// const size = 2 * this.quality;
		// context.fillStyle = "rgb(127, 127, 127)";
		// context.fillRect(0, 0, size, size);
		// context.fillRect(this.canvasSize.w - size, 0, size, size);
		// context.fillRect(0, this.canvasSize.h - size, size, size);
		// context.fillRect(this.canvasSize.w - size, this.canvasSize.h - size, size, size);
	}

	renderBackgroundOnRelativePosition(context) {
		// context.fillStyle = "rgb(127, 127, 127)";
		// context.fillRect(-300, -200, 2, 2);
		// context.fillRect(298, 198, 2, 2);
		// context.fillRect(298, -200, 2, 2);
		// context.fillRect(-300, 198, 2, 2);
	}

	renderOverlayOnRelativePosition(_context) {
		
	}


	renderBackgroundOnScrolledPosition(context) {
		// context.fillStyle = "rgb(127, 127, 127)";
		// context.fillRect(-300, -200, 2, 2);
		// context.fillRect(298, 198, 2, 2);
		// context.fillRect(298, -200, 2, 2);
		// context.fillRect(-300, 198, 2, 2);
	}

	renderOverlayOnScrolledPosition(_context) {

	}

	renderMap(context) {
		// Draw cache
		if (Date.now() - this.baseCacheUpdated > 100) {
			this.baseCacheContext.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h);

			this.baseCacheContext.save();
			this.baseCacheContext.translate(this.canvasSize.w >> 1, this.canvasSize.h >> 1);
			this.baseCacheContext.scale(this.quality, this.quality);

			var count = this.blocks.length;
			for (var i = 0; i < count; i++) {
				this.blockRenderer.renderBase(this.baseCacheContext, this.blocks[i]);
			}

			this.baseCacheContext.restore();

			this.baseCacheUpdated = Date.now();
		}

		context.drawImage(this.baseCacheCanvas, 0, 0, this.canvasSize.w, this.canvasSize.h);
		
		context.save();
		context.translate(this.canvasSize.w >> 1, this.canvasSize.h >> 1);
		context.scale(this.quality, this.quality);
		
		var count = this.blocks.length;
		for (var i = 0; i < count; i++) {
			this.blockRenderer.renderOverlay(context, this.blocks[i]);
		}

		context.restore();
	}
}