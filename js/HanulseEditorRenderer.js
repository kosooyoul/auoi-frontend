class HanulseEditorRenderer {
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

	offset = {
		x: 0,
		y: 0
	};

	quality = 1;

	effectRendererFactory = null;
	blockRenderer = null;

	constructor() {
		this.blocks = [];
		this.blockSize = HanulseEditorRenderer.defaultBlockSize;

		this.effectRendererFactory = new HanulseEffectRendererFactory();
		this.blockRenderer = new HanulseBlockRenderer({
			size: this.blockSize,
			effectRendererFactory: this.effectRendererFactory
		});
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
	}

	setOffset(x, y) {
		this.offset.x = x;
		this.offset.y = y;
	}

	setQuality(quality) {
		this.quality = quality;
	}

	compute() {

	}

	render(context) {
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
		context.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h);
	}

	_beginRelativePosition(context) {
		context.save();
		context.translate(this.canvasSize.w >> 1, this.canvasSize.h >> 1);
		context.scale(this.quality, this.quality);
	}

	_endRelativePosition(context) {
		context.restore();
	}

	_beginScrolledPosition(context) {
		context.save();
		context.translate(this.offset.x, this.offset.y);
	}

	_endScrolledPosition(context) {
		context.restore();
	}

	renderBackgroundOnCanvas(_context) {

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
		var count = this.blocks.length;
		for (var i = 0; i < count; i++) {
			this.blockRenderer.render(context, this.blocks[i]);
		}
	}
}