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
	static MOVE_PIXEL_PER_TICK = 4;

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

	mapOffsetX = 0;
	mapOffsetY = 0;

	charaDirection = 'down';
	charaStep = 0;
	charaStepCount = 9;
	charaPositionX = 0;
	charaPositionY = 0;

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
	isJoyPadBlocked = false;
	actionactionRunner = null;

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

		for (var charaImageKey in CharaImages) {
			var charaImage = CharaImages[charaImageKey];
			charaImage.image = document.createElement('img');
			charaImage.image.src = charaImage.src;
		}

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

		this.joypad = new SingleAction4DirectionsJoypad($parent.get(0));
		this.joypad.setCanvasSize(this.width, this.height, 1);
		this.actionRunner = new HanulseActions();
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

		this.map.events.forEach(event=> {
			if (event == null) return;
			event.image = document.createElement('img');
			event.image.src = event.src;
		});

		this.map.map.event = [];
		for (var i = 0; i < this.map.height; i++) {
			this.map.map.event.push(new Array(this.map.width).fill(null));
		}

		this.map.events.forEach((event, i) => {
			this.map.map.event[event.y][event.x] = { id: event.id = i, type: 'event' };
		});

		console.log(JSON.stringify(this.map.map.event))

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

		var moving = this._processJoyPad();

		var movePixel = fpsRatio * HanulseSpaceView.MOVE_PIXEL_PER_TICK;
		if (this.mapOffsetX > 0) this.mapOffsetX = Math.max(this.mapOffsetX - movePixel, 0);
		if (this.mapOffsetX < 0) this.mapOffsetX = Math.min(this.mapOffsetX + movePixel, 0);
		if (this.mapOffsetY > 0) this.mapOffsetY = Math.max(this.mapOffsetY - movePixel, 0);
		if (this.mapOffsetY < 0) this.mapOffsetY = Math.min(this.mapOffsetY + movePixel, 0);
			
		if (moving) {
			this.charaStep += 0.2 * fpsRatio;
		} else if (this.charaStep != 0) {
			this.charaStep += 0.2 * fpsRatio;
			if (this.charaStep >= this.charaStepCount) {
				this.charaStep = 0;
			}
		}
	}

	_processJoyPad() {
		if (this.isJoyPadBlocked) {
			return;
		}

		var joypadStatus = this.joypad.getStatus();
		
		if (this.mapOffsetX != 0) return true;
		if (this.mapOffsetY != 0) return true;

		var nextCharaPositionX = this.charaPositionX;
		var nextCharaPositionY = this.charaPositionY;

		if (joypadStatus['right']) {
			this.charaDirection = 'right';
			nextCharaPositionX++;
		} else if (joypadStatus['left']) {
			this.charaDirection = 'left';
			nextCharaPositionX--;
		} else if (joypadStatus['up']) {
			this.charaDirection = 'up';
			nextCharaPositionY--;
		} else if (joypadStatus['down']) {
			this.charaDirection = 'down';
			nextCharaPositionY++;
		} else if (joypadStatus['action'] == null) {
			return false;
		}

		if (joypadStatus['action']) {
			var event = null;
			if (this.charaDirection == 'left') {
				event = this._getMapEvent(this.charaPositionX - 1, this.charaPositionY);
				if (event != null) {
					event.originalDirection = event.direction;
					event.direction = 'right';
				}
			} else if (this.charaDirection == 'right') {
				event = this._getMapEvent(this.charaPositionX + 1, this.charaPositionY);
				if (event != null) {
					event.originalDirection = event.direction;
					event.direction = 'left';
				}
			} else if (this.charaDirection == 'up') {
				event = this._getMapEvent(this.charaPositionX, this.charaPositionY - 1);
				if (event != null) {
					event.originalDirection = event.direction;
					event.direction = 'down';
				}
			} else if (this.charaDirection == 'down') {
				event = this._getMapEvent(this.charaPositionX, this.charaPositionY + 1);
				if (event != null) {
					event.originalDirection = event.direction;
					event.direction = 'up';
				}
			}
			if (event && event.actions) {
				this.isJoyPadBlocked = true;
				this.actionRunner.run(event.actions, () => {
					this.isJoyPadBlocked = false;
					event.direction = event.originalDirection;
				});
			}
		}

		if (this._isOutOfMapBoundary(nextCharaPositionX, nextCharaPositionY)) {
			return false;
		}

		if (this._isBlockedMapPosition(nextCharaPositionX, nextCharaPositionY)) {
			return false;
		}

		if (joypadStatus['right']) {
			this.mapOffsetX = 48;
		} else if (joypadStatus['left']) {
			this.mapOffsetX = -48;
		} else if (joypadStatus['up']) {
			this.mapOffsetY = -48;
		} else if (joypadStatus['down']) {
			this.mapOffsetY = 48;
		}

		this.charaPositionX = nextCharaPositionX;
		this.charaPositionY = nextCharaPositionY;

		return true;
	}
	
	_isOutOfMapBoundary(x, y) {
		return x < 0 || y < 0 || x >= this.map.width || y >= this.map.height;
	}

	_isBlockedMapPosition(x, y) {
		if (this.map.map.prop[y][x] != 0) return true;
		if (this.map.map.event[y][x] != null) return true;
		return false;
	}

	_getMapEvent(x, y) {
		return this.map.events[this.map.map.event[y][x] && this.map.map.event[y][x].id];
	}

	_isEmptyMapBasePosition(x, y) {
		return this.map.chips.base[this.map.map.base[y][x]] == null;
	}

	_isEmptyMapPropPosition(x, y) {
		return this.map.chips.prop[this.map.map.prop[y][x]] == null;
	}

	_isEmptyMapOverPosition(x, y) {
		return this.map.chips.over[this.map.map.over[y][x]] == null;
	}

	_draw() {
		this.context.fillStyle = 'black';
		this.context.fillRect(0, 0, this.width, this.height);

		var tileStartX = Math.max(this.charaPositionX - Math.round(this.tilesCountX / 2), 0);
		var tileStartY = Math.max(this.charaPositionY - Math.round(this.tilesCountY / 2), 0);
		var tileEndX = Math.min(this.tilesCountX + tileStartX, this.map.width - 1);
		var tileEndY = Math.min(this.tilesCountY + tileStartY, this.map.height - 1);
		var tileOffsetX = this.centerX + this.mapOffsetX;
		var tileOffsetY = this.centerY + this.mapOffsetY;
		
		for (var y = tileStartY; y <= tileEndY; y++) {
			for (var x = tileStartX; x <= tileEndX; x++) {
				if (this._isEmptyMapBasePosition(x, y)) continue;

				this.context.drawImage(
					this.map.chips.base[this.map.map.base[y][x]].image,
					(x - this.charaPositionX) * TileSize + tileOffsetX,
					(y - this.charaPositionY) * TileSize + tileOffsetY,
					TileSize,
					TileSize
				);
			}
		}

		for (var y = tileStartY; y <= tileEndY; y++) {
			for (var x = tileStartX; x <= tileEndX; x++) {
				if (this._isEmptyMapPropPosition(x, y)) continue;

				this.context.drawImage(
					this.map.chips.prop[this.map.map.prop[y][x]].image,
					(x - this.charaPositionX) * TileSize + tileOffsetX,
					(y - this.charaPositionY) * TileSize + tileOffsetY,
					TileSize,
					TileSize
				);
			}
		}

		for (var y = tileStartY; y < this.charaPositionY; y++) {
			for (var x = tileStartX; x <= tileEndX; x++) {
				var event = this._getMapEvent(x, y);
				if (event == null) continue;

				var charaClip = CharaClip[event.direction][0];
				this.context.drawImage(
					event.image,
					charaClip.x,
					charaClip.y,
					charaClip.w,
					charaClip.h,
					(x - this.charaPositionX) * TileSize + tileOffsetX + (TileSize - charaClip.w) / 2,
					(y - this.charaPositionY) * TileSize + tileOffsetY + (TileSize - charaClip.h),
					charaClip.w,
					charaClip.h,
				);

				this.context.font = '12px san-serif';
				var measuredSize = this.context.measureText(event.name);
				var textWidth = measuredSize.width + 10;
				
				this.context.beginPath();
				this._pathRoundedRectangle(
					this.context,
					(x - this.charaPositionX) * TileSize + tileOffsetX - (textWidth + 4 - TileSize) / 2,
					(y - this.charaPositionY) * TileSize + tileOffsetY - 32,
					textWidth + 4,
					24,
					6
				);
				this.context.strokeStyle = "white";
				this.context.lineWidth = 0.5;
				this.context.lineJoin = "round";
				this.context.lineCap = "round";
				this.context.fillStyle = "rgba(0, 0, 0, 0.6)";
				this.context.fill();
				this.context.stroke();
				this.context.closePath();

				this.context.fillStyle = 'white';
				this.context.strokeStyle = 'black';
				this.context.textAlign = 'center';
				this.context.fillText(
					event.name,
					(x - this.charaPositionX) * TileSize + tileOffsetX + (TileSize) / 2,
					(y - this.charaPositionY) * TileSize + tileOffsetY - 16,
					textWidth,
					24,
				);
			}
		}

		// <Player>
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
		// </Player>

		for (var y = this.charaPositionY; y <= tileEndY; y++) {
			for (var x = tileStartX; x <= tileEndX; x++) {
				var event = this._getMapEvent(x, y);
				if (event == null) continue;

				var charaClip = CharaClip[event.direction][0];
				this.context.drawImage(
					event.image,
					charaClip.x,
					charaClip.y,
					charaClip.w,
					charaClip.h,
					(x - this.charaPositionX) * TileSize + tileOffsetX + (TileSize - charaClip.w) / 2,
					(y - this.charaPositionY) * TileSize + tileOffsetY + (TileSize - charaClip.h),
					charaClip.w,
					charaClip.h,
				);

				this.context.font = '12px san-serif';
				var measuredSize = this.context.measureText(event.name);
				var textWidth = measuredSize.width + 10;
				
				this.context.beginPath();
				this._pathRoundedRectangle(
					this.context,
					(x - this.charaPositionX) * TileSize + tileOffsetX - (textWidth + 4 - TileSize) / 2,
					(y - this.charaPositionY) * TileSize + tileOffsetY - 32,
					textWidth + 4,
					24,
					6
				);
				this.context.strokeStyle = "white";
				this.context.lineWidth = 0.5;
				this.context.lineJoin = "round";
				this.context.lineCap = "round";
				this.context.fillStyle = "rgba(0, 0, 0, 0.6)";
				this.context.fill();
				this.context.stroke();
				this.context.closePath();

				this.context.fillStyle = 'white';
				this.context.strokeStyle = 'black';
				this.context.textAlign = 'center';
				this.context.fillText(
					event.name,
					(x - this.charaPositionX) * TileSize + tileOffsetX + (TileSize) / 2,
					(y - this.charaPositionY) * TileSize + tileOffsetY - 16,
					textWidth,
					24,
				);
			}
		}

		// this.context.globalAlpha = 0.5;
		for (var y = tileStartY; y <= tileEndY; y++) {
			for (var x = tileStartX; x <= tileEndX; x++) {
				if (this._isEmptyMapOverPosition(x, y)) continue;

				this.context.drawImage(
					this.map.chips.over[this.map.map.over[y][x]].image,
					(x - this.charaPositionX) * TileSize + tileOffsetX,
					(y - this.charaPositionY) * TileSize + tileOffsetY,
					TileSize,
					TileSize
				);
			}
		}
		// this.context.globalAlpha = 1;

		this.joypad.render(this.context);
	}
	
	_pathRoundedRectangle(context, x, y, width, height, round) {
		var x2 = x + width;
		var y2 = y + height;
		context.moveTo(x + round, y);
		context.lineTo(x2 - round, y);
		context.quadraticCurveTo(x2, y, x2, y + round);
		context.lineTo(x2, y2 - round);
		context.quadraticCurveTo(x2, y2, x2 - round, y2);
		context.lineTo(x + round, y2);
		context.quadraticCurveTo(x, y2, x, y2 - round);
		context.lineTo(x, y + round);
		context.quadraticCurveTo(x, y, x + round, y);
	}
}