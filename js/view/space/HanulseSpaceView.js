var TileSize = 48;
// var CharaClip = {
// 	up: [{x: 0, y: 0, w: 48, h: 64}, {x: 48, y: 0, w: 48, h: 64}, {x: 96, y: 0, w: 48, h: 64}, {x: 48, y: 0, w: 48, h: 64}],
// 	right: [{x: 0, y: 64, w: 48, h: 64}, {x: 48, y: 64, w: 48, h: 64}, {x: 96, y: 64, w: 48, h: 64}, {x: 48, y: 64, w: 48, h: 64}],
// 	down: [{x: 0, y: 128, w: 48, h: 64}, {x: 48, y: 128, w: 48, h: 64}, {x: 96, y: 128, w: 48, h: 64}, {x: 48, y: 128, w: 48, h: 64}],
// 	left: [{x: 0, y: 192, w: 48, h: 64}, {x: 48, y: 192, w: 48, h: 64}, {x: 96, y: 192, w: 48, h: 64}, {x: 48, y: 192, w: 48, h: 64}],
// };
var CharaClip = {
	up: [
		{x: 0, y: 0, w: 64, h: 64},
		{x: 64, y: 0, w: 64, h: 64},
		{x: 128, y: 0, w: 64, h: 64},
		{x: 192, y: 0, w: 64, h: 64},
		{x: 256, y: 0, w: 64, h: 64},
		{x: 320, y: 0, w: 64, h: 64},
		{x: 384, y: 0, w: 64, h: 64},
		{x: 448, y: 0, w: 64, h: 64},
		{x: 512, y: 0, w: 64, h: 64},
	],
	left: [
		{x: 0, y: 64, w: 64, h: 64},
		{x: 64, y: 64, w: 64, h: 64},
		{x: 128, y: 64, w: 64, h: 64},
		{x: 192, y: 64, w: 64, h: 64},
		{x: 256, y: 64, w: 64, h: 64},
		{x: 320, y: 64, w: 64, h: 64},
		{x: 384, y: 64, w: 64, h: 64},
		{x: 448, y: 64, w: 64, h: 64},
		{x: 512, y: 64, w: 64, h: 64},
	],
	down: [
		{x: 0, y: 128, w: 64, h: 64},
		{x: 64, y: 128, w: 64, h: 64},
		{x: 128, y: 128, w: 64, h: 64},
		{x: 192, y: 128, w: 64, h: 64},
		{x: 256, y: 128, w: 64, h: 64},
		{x: 320, y: 128, w: 64, h: 64},
		{x: 384, y: 128, w: 64, h: 64},
		{x: 448, y: 128, w: 64, h: 64},
		{x: 512, y: 128, w: 64, h: 64},
	],
	right: [
		{x: 0, y: 192, w: 64, h: 64},
		{x: 64, y: 192, w: 64, h: 64},
		{x: 128, y: 192, w: 64, h: 64},
		{x: 192, y: 192, w: 64, h: 64},
		{x: 256, y: 192, w: 64, h: 64},
		{x: 320, y: 192, w: 64, h: 64},
		{x: 384, y: 192, w: 64, h: 64},
		{x: 448, y: 192, w: 64, h: 64},
		{x: 512, y: 192, w: 64, h: 64},
	],
}

var CharaImages = {
	// "saint": {
	// 	src: './images/space/chara/saint.png',
	// 	image: null,
	// },
	"sarah": {
		src: './images/space/chara/sarah.png',
		image: null,
	}
}

class HanulseSpaceView {
	$parent = null;
	$canvas = null;

	canvas = null;
	context = null;

	width = null;
	height = null;
	aspectRatio = null;
	needToRefreshItems = false;

	centerX = null;
	centerY = null;
	tilesCountX = null;
	tilesCountY = null;

	mapPositionX = 0;
	mapPositionY = 0;
	mapOffsetX = 0;
	mapOffsetY = 0;

	charaDirection = 'down';
	charaStep = 0;
	charaStepCount = 9;
	charaPositionX = 0;
	charaPositionY = 0;

	keyStatus = {
		left: false,
		right: false,
		top: false,
		bottom: false,
		action: false,
		move: false,
	};


	/*
		"name": String
		"chips": {
			"base": [Nullable<{ "name": String, "src": String, "image": ImageElement }]
			"prop": [Nullable<{ "name": String, "src": String, "image": ImageElement }]
		}
		"map": {
			"base": [[Number]]
			"prop": [[Number]]
			"over": [[Number]]
		}
	*/
	map = null;
	joypad = null;

	constructor($parent) {
		this.$parent = $parent;

		this.width = $parent.width();
		this.height = $parent.height();
		this.aspectRatio = this.width / this.height;

		this.$canvas = $("<canvas>").css({ position: "relative", width: this.width + "px", height: this.height + "px" });
		this.$parent.append(this.$canvas);

		this.canvas = this.$canvas.get(0);
		this.context = this.canvas.getContext('2d');
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		this.centerX = this.width >> 1;
		this.centerY = this.height >> 1;

		this.tilesCountX = Math.ceil(this.width / TileSize) + 3;
		this.tilesCountY = Math.ceil(this.height / TileSize) + 3;

		this.tilesOffsetX = (this.width - this.tilesCountX * TileSize) / 2;
		this.tilesOffsetY = (this.height - this.tilesCountY * TileSize) / 2;

		console.log(this.tilesCountX, this.tilesCountY);
		//

		for (var charaImageKey in CharaImages) {
			var charaImage = CharaImages[charaImageKey];
			charaImage.image = document.createElement('img');
			charaImage.image.src = charaImage.src;
		}

		$(window).on('keydown', (event) => {
			if (event.which == 39) {
				this.keyStatus['right'] = true;
			} else if (event.which == 37) {
				this.keyStatus['left'] = true;
			} else if (event.which == 38) {
				this.keyStatus['up'] = true;
			} else if (event.which == 40) {
				this.keyStatus['down'] = true;
			} else if (event.which == 32) {
				this.keyStatus['action'] = true;
			}
		});
		
		$(window).on('keyup', (event) => {
			if (event.which == 39) {
				this.keyStatus['right'] = false;
				this.keyStatus['move'] = false;
			} else if (event.which == 37) {
				this.keyStatus['left'] = false;
				this.keyStatus['move'] = false;
			} else if (event.which == 38) {
				this.keyStatus['up'] = false;
				this.keyStatus['move'] = false;
			} else if (event.which == 40) {
				this.keyStatus['down'] = false;
				this.keyStatus['move'] = false;
			} else if (event.which == 32) {
				this.keyStatus['action'] = false;
			}
		});
		
        this.canvas.addEventListener("mousedown", (evt) => this._onPointersDown(evt));
        this.canvas.addEventListener("mousemove", (evt) => this._onPointersMove(evt));
        this.canvas.addEventListener("mouseup", (evt) => this._onPointersUp(evt));
        this.canvas.addEventListener("mouseout", (evt) => this._onPointersUp(evt));
        this.canvas.addEventListener("mouseleave", (evt) => this._onPointersUp(evt));
        this.canvas.addEventListener("touchstart", (evt) => this._onPointersDown(evt));
        this.canvas.addEventListener("touchmove", (evt) => this._onPointersMove(evt));
        this.canvas.addEventListener("touchend", (evt) => this._onPointersUp(evt));
        document.body.addEventListener("keydown", (evt) => this._onKeyDown(evt));
        document.body.addEventListener("keyup", (evt) => this._onKeyUp(evt));

		setInterval(() => {
			var parentWidth = $parent.width();
			var parentHeight = $parent.height();
			if (parentWidth == this.width && parentHeight == this.height) {
				if (this.needToRefreshItems) {
					console.log("Resized!!!!!!!!!", this.width, this.height);
					// Update canvas size
					this.width = parentWidth;
					this.height = parentHeight;
					this.aspectRatio = this.width / this.height;

					this.canvas.width = this.width;
					this.canvas.height = this.height;
					// this.$canvas.css({ width: this.width + 'px', height: this.height + 'px' });
					this.$canvas.stop().animate({
						width: this.width + "px",
						height: this.height + "px",
					}, { duration: 100 });

					this.centerX = this.width >> 1;
					this.centerY = this.height >> 1;

					this.tilesCountX = Math.ceil(this.width / TileSize) + 3;
					this.tilesCountY = Math.ceil(this.height / TileSize) + 3;

					this.tilesOffsetX = (this.width - this.tilesCountX * TileSize) / 2;
					this.tilesOffsetY = (this.height - this.tilesCountY * TileSize) / 2;

					this.joypad.setCanvasSize(this.width, this.height, 1);

					console.log(this.tilesCountX, this.tilesCountY);
					//
					
					this.needToRefreshItems = false;
				}
				return;
			}

			this.width = parentWidth;
			this.height = parentHeight;
			this.needToRefreshItems = true;

			console.log("Resized", this.width, this.height);
		}, 100);

		this.joypad = new SingleAction4DirectionsJoypad();
		this.joypad.setCanvasSize(this.width, this.height, 1);
	}

	load(map) {
		this.map = map;

		this.map.chips.base.forEach(chip => {
			if (chip == null) return;
			chip.image = document.createElement('img');
			chip.image.src = chip.src;
		});

		this.map.chips.prop.forEach(chip => {
			if (chip == null) return;
			chip.image = document.createElement('img');
			chip.image.src = chip.src;
		});

		this.map.chips.over.forEach(chip => {
			if (chip == null) return;
			chip.image = document.createElement('img');
			chip.image.src = chip.src;
		});

		this._loop();
	}

	_loop() {
		var requestedTime = Date.now();
		requestAnimationFrame(() => {
			var elapsedTime = Date.now() - requestedTime;
			var fpsRatio = elapsedTime / (1000 / 60);
			this._calculate(elapsedTime, fpsRatio);
			this._draw();
			this._loop();
		});
	}

	_calculate(elapsedTime, fpsRatio) {
		this.joypad.compute();

		this._processKeyEvent();

		if (this.mapOffsetX > 0) {
			this.mapOffsetX -= 3 * fpsRatio;
			if (this.mapOffsetX < 0) this.mapOffsetX = 0;
		}
		if (this.mapOffsetX < 0) {
			this.mapOffsetX += 3 * fpsRatio;
			if (this.mapOffsetX > 0) this.mapOffsetX = 0;
		}
		if (this.mapOffsetY > 0) {
			this.mapOffsetY -= 3 * fpsRatio;
			if (this.mapOffsetY < 0) this.mapOffsetY = 0;
		}
		if (this.mapOffsetY < 0) {
			this.mapOffsetY += 3 * fpsRatio;
			if (this.mapOffsetY > 0) this.mapOffsetY = 0;
		}
		if (this.mapOffsetX == 0 && this.mapOffsetY == 0) {
			if (this.keyStatus['move'] == false) {
				this.charaStep = 0;
				this.isCharaMoving = false;
			}
		}
		
		if (this.isCharaMoving) {
			this.charaStep += 0.18 * fpsRatio;
		}
	}

	_processKeyEvent() {
		var joypadStatus = this.joypad.getStatus();
		if (this.keyStatus['right'] || joypadStatus['right']) {
			if (this.mapOffsetX != 0) return;
			if (this.mapOffsetY != 0) return;
			this.charaDirection = 'right';
			if (
				this.charaPositionX + 1 < 0 ||
				this.charaPositionY < 0 ||
				this.charaPositionX + 1 > this.map.width - 1 ||
				this.charaPositionY > this.map.height - 1
			) {
				this.isCharaMoving = false;
				return;
			}
			if (this.map.map.prop[this.charaPositionY][this.charaPositionX + 1] != 0) {
				this.isCharaMoving = false;
				return;
			}
			this.mapPositionX -= 48;
			this.mapOffsetX = 48;
			this.charaPositionX++;
			this.isCharaMoving = true;
			this.keyStatus['move'] = true;
		} else if (this.keyStatus['left'] || joypadStatus['left']) {
			if (this.mapOffsetX != 0) return;
			if (this.mapOffsetY != 0) return;
			this.charaDirection = 'left';
			if (
				this.charaPositionX - 1 < 0 ||
				this.charaPositionY < 0 ||
				this.charaPositionX - 1 > this.map.width - 1 ||
				this.charaPositionY > this.map.height - 1
			) {
				this.isCharaMoving = false;
				return;
			}
			if (this.map.map.prop[this.charaPositionY][this.charaPositionX - 1] != 0) {
				this.isCharaMoving = false;
				return;
			}
			this.mapPositionX += 48;
			this.mapOffsetX = -48;
			this.charaPositionX--;
			this.isCharaMoving = true;
			this.keyStatus['move'] = true;
		} else if (this.keyStatus['up'] || joypadStatus['up']) {
			if (this.mapOffsetX != 0) return;
			if (this.mapOffsetY != 0) return;
			this.charaDirection = 'up';
			if (
				this.charaPositionX < 0 ||
				this.charaPositionY - 1 < 0 ||
				this.charaPositionX > this.map.width - 1 ||
				this.charaPositionY - 1 > this.map.height - 1
			) {
				this.isCharaMoving = false;
				return;
			}
			if (this.map.map.prop[this.charaPositionY - 1][this.charaPositionX] != 0) {
				this.isCharaMoving = false;
				return;
			}
			this.mapPositionY += 48;
			this.mapOffsetY = -48;
			this.charaPositionY--;
			this.isCharaMoving = true;
			this.keyStatus['move'] = true;
		} else if (this.keyStatus['down'] || joypadStatus['down']) {
			if (this.mapOffsetX != 0) return;
			if (this.mapOffsetY != 0) return;
			this.charaDirection = 'down';
			if (
				this.charaPositionX < 0 ||
				this.charaPositionY + 1 < 0 ||
				this.charaPositionX > this.map.width - 1 ||
				this.charaPositionY + 1 > this.map.height - 1
			) {
				this.isCharaMoving = false;
				return;
			}
			if (this.map.map.prop[this.charaPositionY + 1][this.charaPositionX] != 0) {
				this.isCharaMoving = false;
				return;
			}
			this.mapPositionY -= 48;
			this.mapOffsetY = 48;
			this.charaPositionY++;
			this.isCharaMoving = true;
			this.keyStatus['move'] = true;
		} else {
			this.isCharaMoving = false;
			this.keyStatus['move'] = false;
		}
	}

	_draw() {
		this.context.fillStyle = 'black';
		this.context.fillRect(0, 0, this.width, this.height);
		var tileStartX = -Math.round(this.tilesCountX / 2);
		var tileStartY = -Math.round(this.tilesCountY / 2);
		var tileEndX = this.tilesCountX + tileStartX;
		var tileEndY = this.tilesCountY + tileStartY;
		

		for (var y = tileStartY; y < tileEndY; y++) {
			for (var x = tileStartX; x < tileEndX; x++) {
				var mapPositionXIndex = x - Math.round((this.mapPositionX) / TileSize);
				var mapPositionYIndex = y - Math.round((this.mapPositionY) / TileSize);

				if (
					mapPositionXIndex >= 0 &&
					mapPositionYIndex >= 0 &&
					mapPositionXIndex <= this.map.width - 1 &&
					mapPositionYIndex <= this.map.height - 1
				) {
					if (this.map.map.base[mapPositionYIndex][mapPositionXIndex] == 0) continue;
					if (this.map.chips.base[this.map.map.base[mapPositionYIndex][mapPositionXIndex]] == null) continue;

					this.context.drawImage(
						this.map.chips.base[this.map.map.base[mapPositionYIndex][mapPositionXIndex]].image,
						x * TileSize + this.centerX + this.mapOffsetX,
						y * TileSize + this.centerY + this.mapOffsetY,
						TileSize,
						TileSize
					);
				}
			}
		}

		/*
		for (var y = tileStartY; y < tileEndY; y++) {
			for (var x = tileStartX; x < tileEndX; x++) {
				var mapPositionXIndex = x - Math.round((this.mapPositionX) / TileSize);
				var mapPositionYIndex = y - Math.round((this.mapPositionY) / TileSize);

				this.context.fillStyle = 'blue';
				this.context.textAlign = 'center';
				this.context.fillText(
					(mapPositionXIndex) + ', ' + (mapPositionYIndex),
					x * TileSize + this.centerX + this.mapOffsetX + TileSize / 2,
					y * TileSize + this.centerY + this.mapOffsetY + TileSize / 2,
				);
			}
		}
		*/

		for (var y = tileStartY; y < tileEndY; y++) {
			for (var x = tileStartX; x < tileEndX; x++) {
				var mapPositionXIndex = x - Math.round((this.mapPositionX) / TileSize);
				var mapPositionYIndex = y - Math.round((this.mapPositionY) / TileSize);

				if (
					mapPositionXIndex >= 0 &&
					mapPositionYIndex >= 0 &&
					mapPositionXIndex <= this.map.width - 1 &&
					mapPositionYIndex <= this.map.height - 1
				) {
					if (this.map.map.prop[mapPositionYIndex][mapPositionXIndex] == 0) continue;
					if (this.map.chips.prop[this.map.map.prop[mapPositionYIndex][mapPositionXIndex]] == null) continue;

					this.context.drawImage(
						this.map.chips.prop[this.map.map.prop[mapPositionYIndex][mapPositionXIndex]].image,
						x * TileSize + this.centerX + this.mapOffsetX,
						y * TileSize + this.centerY + this.mapOffsetY,
						TileSize,
						TileSize
					);
				}
			}
		}

		var step = Math.ceil(this.charaStep) % this.charaStepCount;
		var charaClip = CharaClip[this.charaDirection][step];

		this.context.drawImage(
			CharaImages['sarah'].image,
			charaClip.x,
			charaClip.y,
			charaClip.w,
			charaClip.h,
			this.centerX + (TileSize - charaClip.w) / 2,
			this.centerY + TileSize - charaClip.h,
			charaClip.w,
			charaClip.h,
		);

		this.context.fillStyle = 'white';
		this.context.strokeStyle = 'black';
		this.context.textAlign = 'center';
		this.context.strokeText(
			'( ' + this.charaPositionX + ', ' + this.charaPositionY + ' )',
			this.centerX + TileSize / 2,
			this.centerY + TileSize + 16,
			TileSize,
			20,
		);
		this.context.fillText(
			'( ' + this.charaPositionX + ', ' + this.charaPositionY + ' )',
			this.centerX + TileSize / 2,
			this.centerY + TileSize + 16,
			TileSize,
			20,
		);

		// this.context.globalAlpha = 0.5;
		for (var y = tileStartY; y < tileEndY; y++) {
			for (var x = tileStartX; x < tileEndX; x++) {
				var mapPositionXIndex = x - Math.round((this.mapPositionX) / TileSize);
				var mapPositionYIndex = y - Math.round((this.mapPositionY) / TileSize);

				if (
					mapPositionXIndex >= 0 &&
					mapPositionYIndex >= 0 &&
					mapPositionXIndex <= this.map.width - 1 &&
					mapPositionYIndex <= this.map.height - 1
				) {
					if (this.map.map.over[mapPositionYIndex][mapPositionXIndex] == 0) continue;
					if (this.map.chips.over[this.map.map.over[mapPositionYIndex][mapPositionXIndex]] == null) continue;

					this.context.drawImage(
						this.map.chips.over[this.map.map.over[mapPositionYIndex][mapPositionXIndex]].image,
						x * TileSize + this.centerX + this.mapOffsetX,
						y * TileSize + this.centerY + this.mapOffsetY,
						TileSize,
						TileSize
					);
				}
			}
		}
		// this.context.globalAlpha = 1;

		this.joypad.render(this.context);
	}

	_getPointers(evt) {
		var touches = evt.targetTouches ? evt.targetTouches : [evt];
		const pointers = [];
		for (var i = 0; i < touches.length; i++) {
			pointers.push({
				x: touches[i].pageX,
				y: touches[i].pageY,
				id: touches[i].identifier
			});
		}
		return pointers;
	}
	
	_onPointersDown(evt) {
		if (evt.type == "touchstart") {
			evt.preventDefault(); // for Mobile
		}

		var pointers = this._getPointers(evt);

		if (this.joypad) {
			this.joypad.onPointersDown(pointers);
		}
	}

	_onPointersMove(evt) {
		var pointers = this._getPointers(evt);

		if (this.joypad) {
			this.joypad.onPointersMove(pointers);
		}
	}

	_onPointersUp(evt) {
		var pointers = this._getPointers(evt);

		if (this.joypad) {
			this.joypad.onPointersUp(pointers);
		}
	}

	_onKeyDown(evt) {
		if (this.joypad) {
			this.joypad.onKeyDown(evt.which);
		}
	}

	_onKeyUp(evt) {
		if (this.joypad) {
			this.joypad.onKeyUp(evt.which);
		}
	}
}