class HanulseBoardView {
	$parent = null;

	boardWidth = null;
	boardHeight = null;

	nextItemId = 0;
	nextZIndex = 0;

	/*
		{
			type: "color" | "image"
			value: ColorString | ImageUrlString
		}
	*/
	background;
	/*
		{
			id: number,
			type: "image" | "text",
			value: ImageUrlString | TextString,
			x: number,
			y: number,
			w: number,
			h: number,
			radian: number,
			zIndex: number,
		}[];
	*/
	items = [];

	// Touch variables
	transformMode = null;
	downedItem = null;
	$downedItem = null;
	lastPointerX = null;
	lastPointerY = null;

	constructor($parent) {
		this.$parent = $parent;
		this.boardWidth = $parent.width();
		this.boardHeight = $parent.height();
		
		this.background = { type: "color", value: "white" };
		this.$parent.css({ backgroundColor: "white" });

		$parent.on('mousedown', (event) => this._onItemMoveStart(event));
		$(document).on('mousemove', (event) => this._onItemMove(event));
		$(document).on('mouseup', (event) => this._onItemMoveEnd(event));
		$parent.on('touchstart', (event) => this._onItemMoveStart(event));
		$(document).on('touchmove', (event) => this._onItemMove(event));
		$(document).on('touchend', (event) => this._onItemMoveEnd(event));
	}

	setBackground(itemDescription) {
		if (itemDescription.type == "color") {
			this.background = itemDescription;
			this.$parent.css({
				backgroundColor: itemDescription.value,
				backgroundImage: "",
			});
		} else if (itemDescription.type == "image") {
			this.background = itemDescription;
			this.$parent.css({
				backgroundColor: "black",
				backgroundImage: "url(\"" + itemDescription.value + "\")",
				backgroundPosition: "center",
				backgroundSize: "cover",
				backgroundRepeat: "no-repeat",
			});
		} else if (itemDescription.type == "pattern") {
			this.background = itemDescription;
			this.$parent.css({
				backgroundColor: "black",
				backgroundImage: "url(\"" + itemDescription.value + "\")",
				backgroundPosition: "center",
				backgroundSize: "auto",
				backgroundRepeat: "repeat",
			});
		}
	}

	createItem(itemDescription) {
		var item = this._newItem(itemDescription);
		var $item = this._newItemElement(item);

		this.items.push(item);
		this.$parent.append($item);
		
		// Unselect
		$(".item").removeClass('selected');
		// Select Item
		$item.addClass('selected');
		$item.css({ zIndex: item.zIndex });
	}

	deleteItemById(id) {
		var index = this.items.findIndex((item) => item.id == id);
		if (index > 0) {
			this.items.splice(index, 1);
		}

		var $item = this.$parent.find("[data-id=" + id + "]");
		$item.remove();
	}

	cloneItemById(id) {
		var item = this.items.find((item) => item.id == id);
		if (item == null) {
			return;
		}

		var clonedItem = this._newItem({
			... item,
			x: item.x + 10,
			y: item.y + 10,
		});
		var $clonedItem = this._newItemElement(clonedItem);

		this.items.push(clonedItem);
		this.$parent.append($clonedItem);

		// Unselect
		$(".item").removeClass('selected');
		// Select Item
		$clonedItem.addClass('selected');
		$clonedItem.css({ zIndex: clonedItem.zIndex });
	}

	saveImage(callback) {
		this._loadImages((imagesByUrl) => {
			var canvas = document.createElement("canvas");
			var width = canvas.width = this.boardWidth;
			var height = canvas.height = this.boardHeight;

			var context = canvas.getContext("2d");
			if (this.background.type == "color") {
				context.fillStyle = this.background.value;
				context.fillRect(0, 0, width, height);
			} else if (this.background.type == "image") {
				var backgroundImage = imagesByUrl[this.background.value];
				var backgroundOffsetX;
				var backgroundOffsetY;
				var backgroundWidth;
				var backgroundHeight;
				if (width / height < backgroundImage.width / backgroundImage.height) {
					backgroundWidth = width * (backgroundImage.width / backgroundImage.height);
					backgroundHeight = height;
					backgroundOffsetX = (width - backgroundWidth) * 0.5;
					backgroundOffsetY = 0;
				} else {
					backgroundWidth = width;
					backgroundHeight = height / (backgroundImage.width / backgroundImage.height);
					backgroundOffsetX = 0;
					backgroundOffsetY = (height - backgroundHeight) * 0.5;
				}
				context.drawImage(backgroundImage, backgroundOffsetX, backgroundOffsetY, backgroundWidth, backgroundHeight);
			} else if (this.background.type == "pattern") {
				// TODO
			}

			this.items.forEach(item => {
				if (item.type == "image") {
					var itemImage = imagesByUrl[item.value];
					context.save();
					context.translate(item.x + item.width * 0.5, item.y + item.height * 0.5);
					context.rotate(item.radian);
					context.drawImage(itemImage, -item.width * 0.5, -item.height * 0.5, item.width, item.height);
					context.restore();
				} else if (item.type == "text") {
					// TODO
				}
			});

			// Preview image
			var dataUrl = canvas.toDataURL("image/png");
			var newTab = window.open('about:blank', '_blank');
			newTab.document.write("<img src='" + dataUrl + "' alt='from canvas'/>");
		});
	}
	
	_loadImages(callback) {
		var imagesByUrl = {};

		var imageUrlList = [];
		if (this.background.type == "image") {
			imageUrlList.push(this.background.value);
		} else if (this.background.type == "pattern") {
			imageUrlList.push(this.background.value);
		}

		this.items.forEach(item => {
			if (item.type == "image") {
				imageUrlList.push(item.value);
			}
		})

		var loadNextImage = (url) => {
			if (url == null) {
				return callback(imagesByUrl);
			}

			var image = new Image();
			image.onload = () => {
				imagesByUrl[url] = image;
				loadNextImage(imageUrlList.shift());
			};
			image.src = url;
		};

		loadNextImage(imageUrlList.shift());
	}

	_newItem(itemDescription) {
		if (itemDescription.type == "image") {
			return {
				id: this.nextItemId++,
				type: "image",
				value: itemDescription.value,
				x: itemDescription.x ?? (this.boardWidth - itemDescription.width) * 0.5,
				y: itemDescription.y ?? (this.boardHeight - itemDescription.height) * 0.5,
				width: itemDescription.width,
				height: itemDescription.height,
				radian: itemDescription.radian ?? 0,
				zIndex: this.nextZIndex++,
			};
		} else if(itemDescription.type == "text") {
			return {
				id: this.nextItemId++,
				type: "text",
				value: itemDescription.value,
				x: itemDescription.x ?? (this.boardWidth - itemDescription.width) * 0.5,
				y: itemDescription.y ?? (this.boardHeight - itemDescription.height) * 0.5,
				width: itemDescription.width,
				height: itemDescription.height,
				radian: itemDescription.radian ?? 0,
				zIndex: this.nextZIndex++,
				style: itemDescription.style, // TODO
			};
		}
	}

	_newItemElement(item) {
		var $e = $("<div class=\"item\">");
		$e.attr("data-id", item.id);

		if (item.type == "image") {
			var $image = $("<img data-type=\"image\">").attr("src", item.value);
			$e.append($("<div class=\"content\">").append($image));
		} else {
			var $text = $("<span data-type=\"text\">").text(item.value);
			$e.append($("<div class=\"content\">").append($text));
		}

		var $frame = $("<div class=\"frame\" data-transform-mode=\"move\">");
		var $frameEdgeNW = $("<div class=\"edge-nw\" data-transform-mode=\"resize-nw\">");
		var $frameEdgeNE = $("<div class=\"edge-ne\" data-transform-mode=\"resize-ne\">");
		var $frameEdgeSW = $("<div class=\"edge-sw\" data-transform-mode=\"resize-sw\">");
		var $frameEdgeSE = $("<div class=\"edge-se\" data-transform-mode=\"resize-se\">");
		var $frameEdgeN = $("<div class=\"edge-n\" data-transform-mode=\"resize-n\">");
		var $frameEdgeS = $("<div class=\"edge-s\" data-transform-mode=\"resize-s\">");
		var $frameEdgeW = $("<div class=\"edge-w\" data-transform-mode=\"resize-w\">");
		var $frameEdgeE = $("<div class=\"edge-e\" data-transform-mode=\"resize-e\">");
		var $frameRotate = $("<div class=\"function rotate\" data-transform-mode=\"rotate\">");
		var $frameDelete = $("<div class=\"function delete\">").click(() => this.deleteItemById(item.id));
		var $frameClone = $("<div class=\"function clone\">").click(() => this.cloneItemById(item.id));

		$frame.append($frameEdgeNW);
		$frame.append($frameEdgeNE);
		$frame.append($frameEdgeSW);
		$frame.append($frameEdgeSE);
		$frame.append($frameEdgeN);
		$frame.append($frameEdgeS);
		$frame.append($frameEdgeW);
		$frame.append($frameEdgeE);
		$frame.append($frameRotate);
		$frame.append($frameDelete);
		$frame.append($frameClone);

		$e.width(item.width);
		$e.height(item.height);
		$e.css({ left: item.x, top: item.y, zIndex: item.zIndex });

		$e.css({ transform: "rotate(" + item.radian + "rad)" });
		$e.find('.function').css({ transform: "rotate(" + -item.radian + "rad)" });

		$e.append($frame);

		return $e;
	}

	_pointToRadian(x, y) {
		return Math.atan2(y, x);
	}

	_onItemMoveStart(event) {
		var $target = $(event.target);

		var $item = $target.parents('[data-id]');
		var itemId = $item.attr("data-id");
		var item = this.items.find(item => item.id == itemId);
		if (item == null) {
			// Unselect
			$(".item").removeClass('selected');
			this.transformMode = null;
			this.downedItem = null;
			this.$downedItem = null;
			return;
		}

		if (this.downedItem != item) {
			// Unselect
			$(".item").removeClass('selected');
			// Select Item
			item.zIndex = this.nextZIndex++;
			$item.addClass('selected');
			$item.css({ zIndex: item.zIndex });
		}

		var mode = $target.attr("data-transform-mode");
		if (mode == null) {
			return;
		}

		this.transformMode = mode;
		this.downedItem = item;
		this.$downedItem = $item;

		var pointer = event.targetTouches? event.targetTouches[0] : event;
		this.lastPointerX = pointer.pageX;
		this.lastPointerY = pointer.pageY;

		if (event.type == "touchstart") {
			event.preventDefault(); //for Mobile
		}

		console.log('Start Transform', item.id, mode);
	}

	_onItemMove(event) {
		if (this.downedItem == null) {
			return;
		}

		var pointer = event.targetTouches? event.targetTouches[0] : event;
		var pointerX = pointer.pageX;
		var pointerY = pointer.pageY;

		if (this.transformMode == 'move') {
			this.downedItem.x += pointerX - this.lastPointerX;
			this.downedItem.y += pointerY - this.lastPointerY;
			this.$downedItem.css({ left: this.downedItem.x, top: this.downedItem.y });
		} else if (this.transformMode == 'rotate') {
			var offset = this.$parent.offset();
			var boardCenterX = this.downedItem.x + this.downedItem.width * 0.5 + offset.left;
			var boardCenterY = this.downedItem.y + this.downedItem.height * 0.5 + offset.top;
			var lastRadian = this._pointToRadian(this.lastPointerX - boardCenterX, this.lastPointerY - boardCenterY);
			var radian = this._pointToRadian(pointerX - boardCenterX, pointerY - boardCenterY);
			this.downedItem.radian += radian - lastRadian;
			this.$downedItem.css({ transform: "rotate(" + this.downedItem.radian + "rad)" });
			this.$downedItem.find('.function').css({ transform: "rotate(" + -this.downedItem.radian + "rad)" })
		} else if (this.transformMode == "resize-nw") {
			var x = pointerX - this.lastPointerX;
			var y = pointerY - this.lastPointerY;
			var cos = Math.cos(this.downedItem.radian);
			var sin = Math.sin(this.downedItem.radian);
			var rcos = cos;
			var rsin = -sin;
			var rotatedX = x * rcos - y * rsin;
			var rotatedY = x * rsin + y * rcos;

			this.downedItem.x += rotatedX;
			this.downedItem.y += rotatedY;
			this.downedItem.width -= rotatedX;
			this.downedItem.height -= rotatedY;
			
			this.downedItem.x -= (rotatedX - x) / 2;
			this.downedItem.y -= (rotatedY - y) / 2;
			
			this.$downedItem.width(this.downedItem.width);
			this.$downedItem.height(this.downedItem.height);
			this.$downedItem.css({ left: this.downedItem.x, top: this.downedItem.y });
		} else if (this.transformMode == "resize-ne") {
			var x = pointerX - this.lastPointerX;
			var y = pointerY - this.lastPointerY;
			var cos = Math.cos(this.downedItem.radian);
			var sin = Math.sin(this.downedItem.radian);
			var rcos = cos;
			var rsin = -sin;
			var rotatedX = x * rcos - y * rsin;
			var rotatedY = x * rsin + y * rcos;

			this.downedItem.y += rotatedY;
			this.downedItem.width += rotatedX;
			this.downedItem.height -= rotatedY;
			
			this.downedItem.x -= (rotatedX - x) / 2;
			this.downedItem.y -= (rotatedY - y) / 2;

			this.$downedItem.width(this.downedItem.width);
			this.$downedItem.height(this.downedItem.height);
			this.$downedItem.css({ left: this.downedItem.x, top: this.downedItem.y });
		} else if (this.transformMode == "resize-sw") {
			var x = pointerX - this.lastPointerX;
			var y = pointerY - this.lastPointerY;
			var cos = Math.cos(this.downedItem.radian);
			var sin = Math.sin(this.downedItem.radian);
			var rcos = cos;
			var rsin = -sin;
			var rotatedX = x * rcos - y * rsin;
			var rotatedY = x * rsin + y * rcos;

			this.downedItem.x += rotatedX;
			this.downedItem.width -= rotatedX;
			this.downedItem.height += rotatedY;
			
			this.downedItem.x -= (rotatedX - x) / 2;
			this.downedItem.y -= (rotatedY - y) / 2;

			this.$downedItem.width(this.downedItem.width);
			this.$downedItem.height(this.downedItem.height);
			this.$downedItem.css({ left: this.downedItem.x, top: this.downedItem.y });
		} else if (this.transformMode == "resize-se") {
			var x = pointerX - this.lastPointerX;
			var y = pointerY - this.lastPointerY;
			var cos = Math.cos(this.downedItem.radian);
			var sin = Math.sin(this.downedItem.radian);
			var rcos = cos;
			var rsin = -sin;
			var rotatedX = x * rcos - y * rsin;
			var rotatedY = x * rsin + y * rcos;

			this.downedItem.width += rotatedX;
			this.downedItem.height += rotatedY;

			this.downedItem.x -= (rotatedX - x) / 2;
			this.downedItem.y -= (rotatedY - y) / 2;

			this.$downedItem.width(this.downedItem.width);
			this.$downedItem.height(this.downedItem.height);
			this.$downedItem.css({ left: this.downedItem.x, top: this.downedItem.y });
		} else if (this.transformMode == "resize-n") {
			var x = pointerX - this.lastPointerX;
			var y = pointerY - this.lastPointerY;
			var cos = Math.cos(this.downedItem.radian);
			var sin = Math.sin(this.downedItem.radian);
			var rcos = cos;
			var rsin = -sin;
			var rotatedX = 0;
			var rotatedY = x * rsin + y * rcos;
			var fixedX = rotatedX * cos - rotatedY * sin;
			var fixedY = rotatedX * sin + rotatedY * cos;

			this.downedItem.y += rotatedY;
			this.downedItem.height -= rotatedY;
			
			this.downedItem.x -= (rotatedX - fixedX) / 2;
			this.downedItem.y -= (rotatedY - fixedY) / 2;
			
			this.$downedItem.width(this.downedItem.width);
			this.$downedItem.height(this.downedItem.height);
			this.$downedItem.css({ left: this.downedItem.x, top: this.downedItem.y });
		} else if (this.transformMode == "resize-s") {
			var x = pointerX - this.lastPointerX;
			var y = pointerY - this.lastPointerY;
			var cos = Math.cos(this.downedItem.radian);
			var sin = Math.sin(this.downedItem.radian);
			var rcos = cos;
			var rsin = -sin;
			var rotatedX = 0;
			var rotatedY = x * rsin + y * rcos;
			var fixedX = rotatedX * cos - rotatedY * sin;
			var fixedY = rotatedX * sin + rotatedY * cos;

			this.downedItem.height += rotatedY;

			this.downedItem.x -= (rotatedX - fixedX) / 2;
			this.downedItem.y -= (rotatedY - fixedY) / 2;

			this.$downedItem.width(this.downedItem.width);
			this.$downedItem.height(this.downedItem.height);
			this.$downedItem.css({ left: this.downedItem.x, top: this.downedItem.y });
		} else if (this.transformMode == "resize-w") {
			var x = pointerX - this.lastPointerX;
			var y = pointerY - this.lastPointerY;
			var cos = Math.cos(this.downedItem.radian);
			var sin = Math.sin(this.downedItem.radian);
			var rcos = cos;
			var rsin = -sin;
			var rotatedX = x * rcos - y * rsin;
			var rotatedY = 0;
			var fixedX = rotatedX * cos - rotatedY * sin;
			var fixedY = rotatedX * sin + rotatedY * cos;

			this.downedItem.x += rotatedX;
			this.downedItem.width -= rotatedX;
			
			this.downedItem.x -= (rotatedX - fixedX) / 2;
			this.downedItem.y -= (rotatedY - fixedY) / 2;
			
			this.$downedItem.width(this.downedItem.width);
			this.$downedItem.height(this.downedItem.height);
			this.$downedItem.css({ left: this.downedItem.x, top: this.downedItem.y });
		} else if (this.transformMode == "resize-e") {
			var x = pointerX - this.lastPointerX;
			var y = pointerY - this.lastPointerY;
			var cos = Math.cos(this.downedItem.radian);
			var sin = Math.sin(this.downedItem.radian);
			var rcos = cos;
			var rsin = -sin;
			var rotatedX = x * rcos - y * rsin;
			var rotatedY = 0;
			var fixedX = rotatedX * cos - rotatedY * sin;
			var fixedY = rotatedX * sin + rotatedY * cos;

			this.downedItem.width += rotatedX;

			this.downedItem.x -= (rotatedX - fixedX) / 2;
			this.downedItem.y -= (rotatedY - fixedY) / 2;

			this.$downedItem.width(this.downedItem.width);
			this.$downedItem.height(this.downedItem.height);
			this.$downedItem.css({ left: this.downedItem.x, top: this.downedItem.y });
		}

		this.lastPointerX = pointer.pageX;
		this.lastPointerY = pointer.pageY;
	}

	_onItemMoveEnd() {
		this.transformMode = null;
		this.downedItem = null;
		this.$downedItem = null;
		this.lastPointerX = null;
		this.lastPointerY = null;
	}
}