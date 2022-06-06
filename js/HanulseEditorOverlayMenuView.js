class HanulseEditorOverlayMenuView {
	static TEXTURES_TOP = {
		"none-top": "./images/none.png",
		"grass-top": "./images/grass-top.png",
		"soil-top": "./images/soil-top.png",
		"pink-top": "./images/pink-top.png",
		"blue-top": "./images/blue-top.png",
		"iron-top": "./images/iron-top.png",
		"gravel-top": "./images/gravel-top.png",
		"water-top": "./images/water-top.png",
		"snow-top": "./images/snow-top.png",
		"glass-top": "./images/glass-top.png",
		"hologram-top": "./images/hologram-top.png",
		"parquet-top": "./images/parquet-top.png"
	};
	static TEXTURES_LEFT = {
		"none-left": "./images/none.png",
		"soil-left": "./images/soil-left.png",
		"pink-left": "./images/pink-left.png",
		"blue-left": "./images/blue-left.png",
		"iron-left": "./images/iron-left.png",
		"snow-left": "./images/snow-left.png",
		"green-left": "./images/green-left.png",
		"glass-left": "./images/glass-left.png"
	};
	static TEXTURES_RIGHT = {
		"none-right": "./images/none.png",
		"soil-right": "./images/soil-right.png",
		"pink-right": "./images/pink-right.png",
		"blue-right": "./images/blue-right.png",
		"iron-right": "./images/iron-right.png",
		"snow-right": "./images/snow-right.png",
		"green-right": "./images/green-right.png",
		"glass-right": "./images/glass-right.png"
	};
	static PROPS = {
		"": null,
		"tree": "./images/tree.png",
		"bush": "./images/bush.png",
		"flower": "./images/flower.png",
		"warp": "./images/warp.png",
		"staff": "./images/staff.png",
		"waste": "./images/waste.png",
		"trash": "./images/trash.png",
		"flower-palm": "./images/flower-palm.png",
		"picture": "./images/picture.png",
		"pictures": "./images/pictures.png",
		"scrap-right": "./images/scrap-right.png",
		"book-right-1": "./images/book-right-1.png",
		"book-right-2": "./images/book-right-2.png",
		"book-left-1": "./images/book-left-1.png",
		"book-left-2": "./images/book-left-2.png",
		"table": "./images/table.png",
		"bookontable": "./images/bookontable.png",
		"scrapontable": "./images/scrapontable.png",
		"pcontable-left": "./images/pcontable-left.png",
		"pcontable-right": "./images/pcontable-right.png",
		"chair-small": "./images/chair-small.png",
		"bookshelf-left-2": "./images/bookshelf-left-2.png",
		"blocks-cube": "./images/blocks-cube.png",
		"blocks-xyz": "./images/blocks-xyz.png",
		"flower-berry-1": "./images/flower-berry-1.png",
		"flower-palm-2": "./images/flower-palm-2.png",
		"parquet-floor-left": "./images/parquet-floor-left.png",
		"grass-slide-right": "./images/grass-slide-right.png",
		"grass-slide-left": "./images/grass-slide-left.png",
		"grass-slide-right-back": "./images/grass-slide-right-back.png",
		"grass-slide-left-back": "./images/grass-slide-left-back.png",
		"pink-slide-right": "./images/pink-slide-right.png",
		"pink-slide-left": "./images/pink-slide-left.png"
	};
	static EFFECTS = {
		"": "None",
		"flash": "Flash",
		"prism": "Prism flash",
		"link": "Link",
		"warp": "Warp",
		"bigwarp": "Big warp",
	};

	templateEditorOverlayMenu = null;
	templateEditorOverlayTextureList = null;
	templateEditorOverlayTextureListItem = null;
	templateEditorOverlayPropList = null;
	templateEditorOverlayPropListItem = null;
	templateEditorOverlayEffectList = null;
	templateEditorOverlayEffectListItem = null;

	constructor() {
		this.initialize();
	}

	initialize() {
		this.templateEditorOverlayMenu = HanulseEditorOverlayMenuView.loadTemplate("./template/editor-overlay-menu.html");
		this.templateEditorOverlayTextureList = HanulseEditorOverlayMenuView.loadTemplate("./template/editor-overlay-texture-list.html");
		this.templateEditorOverlayTextureListItem = HanulseEditorOverlayMenuView.loadTemplate("./template/editor-overlay-texture-list-item.html");
		this.templateEditorOverlayPropList = HanulseEditorOverlayMenuView.loadTemplate("./template/editor-overlay-prop-list.html");
		this.templateEditorOverlayPropListItem = HanulseEditorOverlayMenuView.loadTemplate("./template/editor-overlay-prop-list-item.html");
		this.templateEditorOverlayEffectList = HanulseEditorOverlayMenuView.loadTemplate("./template/editor-overlay-effect-list.html");
		this.templateEditorOverlayEffectListItem = HanulseEditorOverlayMenuView.loadTemplate("./template/editor-overlay-effect-list-item.html");
	}

	static loadTemplate(url) {
		const result = $.ajax({
			"url": url,
			"async": false
		});
		return result && result.responseText;
	}

	show(block) {
		const editorOverlayMenuView = $($.parseHTML(this.templateEditorOverlayMenu));

		const position = {...block.getPosition()};
		editorOverlayMenuView.find("._position").text("x " + position.x + " y " + position.y + " z " + position.z);

		/*
		editorOverlayMenuView.find("._north").on("click", () => {
			console.log("north");
			const position = block.getPosition();
			position.x--;
			block.setPosition(position);
		});
		editorOverlayMenuView.find("._east").on("click", () => {
			console.log("east");
			const position = block.getPosition();
			position.y--;
			block.setPosition(position);
		});
		editorOverlayMenuView.find("._west").on("click", () => {
			console.log("west");
			const position = block.getPosition();
			position.y++;
			block.setPosition(position);
		});
		editorOverlayMenuView.find("._south").on("click", () => {
			console.log("south");
			const position = block.getPosition();
			position.x++;
			block.setPosition(position);
		});
		editorOverlayMenuView.find("._up").on("click", () => {
			console.log("up");
			const position = block.getPosition();
			position.z++;
			block.setPosition(position);
		});
		editorOverlayMenuView.find("._down").on("click", () => {
			console.log("down");
			const position = block.getPosition();
			position.z--;
			block.setPosition(position);
		});
		editorOverlayMenuView.find("._center").on("click", () => {
			console.log("center");
			block.setPosition(position);
		});
		*/

		editorOverlayMenuView.find("._texture-top>._texture").css({
			"background-image": "url('" + HanulseEditorOverlayMenuView.TEXTURES_TOP[block._texture.top] + "')"
		});
		editorOverlayMenuView.find("._texture-top>._texture").on("click", () => {
			this.hideOverlayList();

			const editorOverlayTextureList = $($.parseHTML(this.templateEditorOverlayTextureList));
			editorOverlayMenuView.find("._texture-top").append(editorOverlayTextureList);
			editorOverlayTextureList.hide().fadeIn();
			
			Object.keys(HanulseEditorOverlayMenuView.TEXTURES_TOP).forEach(key => {
				const texture = HanulseEditorOverlayMenuView.TEXTURES_TOP[key];

				const editorOverlayTextureListItem = $($.parseHTML(this.templateEditorOverlayTextureListItem));
				editorOverlayTextureListItem.css({
					"background-image": "url('" + texture + "')"
				})
				editorOverlayTextureList.append(editorOverlayTextureListItem);
				editorOverlayTextureListItem.on("click", () => {
					block._texture.top = key;
					editorOverlayMenuView.find("._texture-top>._texture").css({
						"background-image": "url('" + HanulseEditorOverlayMenuView.TEXTURES_TOP[key] + "')"
					});
					editorOverlayTextureList.css({"pointer-events": "none"}).fadeOut();
				});
			});
		});
		editorOverlayMenuView.find("._texture-top>._button").on("click", () => {
			this.hideOverlayList();

			const editorOverlayTextureList = $($.parseHTML(this.templateEditorOverlayTextureList));
			editorOverlayMenuView.find("._texture-top").append(editorOverlayTextureList);
			editorOverlayTextureList.hide().fadeIn();
			
			Object.keys(HanulseEditorOverlayMenuView.TEXTURES_TOP).forEach(key => {
				const texture = HanulseEditorOverlayMenuView.TEXTURES_TOP[key];

				const editorOverlayTextureListItem = $($.parseHTML(this.templateEditorOverlayTextureListItem));
				editorOverlayTextureListItem.css({
					"background-image": "url('" + texture + "')"
				})
				editorOverlayTextureList.append(editorOverlayTextureListItem);
				editorOverlayTextureListItem.on("click", () => {
					block._texture.top = key;
					editorOverlayMenuView.find("._texture-top>._texture").css({
						"background-image": "url('" + HanulseEditorOverlayMenuView.TEXTURES_TOP[key] + "')"
					});
					editorOverlayTextureList.css({"pointer-events": "none"}).fadeOut();
				});
			});
		});

		editorOverlayMenuView.find("._texture-left>._texture").css({
			"background-image": "url('" + HanulseEditorOverlayMenuView.TEXTURES_LEFT[block._texture.left] + "')"
		});
		editorOverlayMenuView.find("._texture-left>._texture").on("click", () => {
			this.hideOverlayList();

			const editorOverlayTextureList = $($.parseHTML(this.templateEditorOverlayTextureList));
			editorOverlayMenuView.find("._texture-left").append(editorOverlayTextureList);
			editorOverlayTextureList.hide().fadeIn();
			
			Object.keys(HanulseEditorOverlayMenuView.TEXTURES_LEFT).forEach(key => {
				const texture = HanulseEditorOverlayMenuView.TEXTURES_LEFT[key];

				const editorOverlayTextureListItem = $($.parseHTML(this.templateEditorOverlayTextureListItem));
				editorOverlayTextureListItem.css({
					"background-image": "url('" + texture + "')"
				})
				editorOverlayTextureList.append(editorOverlayTextureListItem);
				editorOverlayTextureListItem.on("click", () => {
					block._texture.left = key;
					editorOverlayMenuView.find("._texture-left>._texture").css({
						"background-image": "url('" + HanulseEditorOverlayMenuView.TEXTURES_LEFT[key] + "')"
					});
					editorOverlayTextureList.css({"pointer-events": "none"}).fadeOut();
				});
			});
		});
		editorOverlayMenuView.find("._texture-left>._button").on("click", () => {
			this.hideOverlayList();

			const editorOverlayTextureList = $($.parseHTML(this.templateEditorOverlayTextureList));
			editorOverlayMenuView.find("._texture-left").append(editorOverlayTextureList);
			editorOverlayTextureList.hide().fadeIn();
			
			Object.keys(HanulseEditorOverlayMenuView.TEXTURES_LEFT).forEach(key => {
				const texture = HanulseEditorOverlayMenuView.TEXTURES_LEFT[key];

				const editorOverlayTextureListItem = $($.parseHTML(this.templateEditorOverlayTextureListItem));
				editorOverlayTextureListItem.css({
					"background-image": "url('" + texture + "')"
				}).data({"key": key});
				editorOverlayTextureList.append(editorOverlayTextureListItem);
				editorOverlayTextureListItem.on("click", () => {
					block._texture.left = key;
					editorOverlayMenuView.find("._texture-left>._texture").css({
						"background-image": "url('" + HanulseEditorOverlayMenuView.TEXTURES_LEFT[key] + "')"
					});
					editorOverlayTextureList.css({"pointer-events": "none"}).fadeOut();
				});
			});
		});

		editorOverlayMenuView.find("._texture-right>._texture").css({
			"background-image": "url('" + HanulseEditorOverlayMenuView.TEXTURES_RIGHT[block._texture.right] + "')"
		});
		editorOverlayMenuView.find("._texture-right>._texture").on("click", () => {
			this.hideOverlayList();

			const editorOverlayTextureList = $($.parseHTML(this.templateEditorOverlayTextureList));
			editorOverlayMenuView.find("._texture-right").append(editorOverlayTextureList);
			editorOverlayTextureList.hide().fadeIn();
			
			Object.keys(HanulseEditorOverlayMenuView.TEXTURES_RIGHT).forEach(key => {
				const texture = HanulseEditorOverlayMenuView.TEXTURES_RIGHT[key];

				const editorOverlayTextureListItem = $($.parseHTML(this.templateEditorOverlayTextureListItem));
				editorOverlayTextureListItem.css({
					"background-image": "url('" + texture + "')"
				}).data({"key": key});
				editorOverlayTextureList.append(editorOverlayTextureListItem);
				editorOverlayTextureListItem.on("click", () => {
					block._texture.right = key;
					editorOverlayMenuView.find("._texture-right>._texture").css({
						"background-image": "url('" + HanulseEditorOverlayMenuView.TEXTURES_RIGHT[key] + "')"
					});
					editorOverlayTextureList.css({"pointer-events": "none"}).fadeOut();
				});
			});
		});
		editorOverlayMenuView.find("._texture-right>._button").on("click", () => {
			this.hideOverlayList();

			const editorOverlayTextureList = $($.parseHTML(this.templateEditorOverlayTextureList));
			editorOverlayMenuView.find("._texture-right").append(editorOverlayTextureList);
			editorOverlayTextureList.hide().fadeIn();
			
			Object.keys(HanulseEditorOverlayMenuView.TEXTURES_RIGHT).forEach(key => {
				const texture = HanulseEditorOverlayMenuView.TEXTURES_RIGHT[key];

				const editorOverlayTextureListItem = $($.parseHTML(this.templateEditorOverlayTextureListItem));
				editorOverlayTextureListItem.css({
					"background-image": "url('" + texture + "')"
				}).data({"key": key});
				editorOverlayTextureList.append(editorOverlayTextureListItem);
				editorOverlayTextureListItem.on("click", () => {
					block._texture.right = key;
					editorOverlayMenuView.find("._texture-right>._texture").css({
						"background-image": "url('" + HanulseEditorOverlayMenuView.TEXTURES_RIGHT[key] + "')"
					});
					editorOverlayTextureList.css({"pointer-events": "none"}).fadeOut();
				});
			});
		});

		editorOverlayMenuView.find("._prop>._button").on("click", () => {
			this.hideOverlayList();

			const editorOverlayPropList = $($.parseHTML(this.templateEditorOverlayPropList));
			editorOverlayMenuView.find("._prop").append(editorOverlayPropList);
			editorOverlayPropList.hide().fadeIn();
			
			Object.keys(HanulseEditorOverlayMenuView.PROPS).forEach(key => {
				const prop = HanulseEditorOverlayMenuView.PROPS[key];

				const editorOverlayPropListItem = $($.parseHTML(this.templateEditorOverlayPropListItem));
				editorOverlayPropListItem.css({
					"background-image": "url('" + prop + "')"
				}).data({"key": key});
				editorOverlayPropList.append(editorOverlayPropListItem);
				editorOverlayPropListItem.on("click", () => {
					block._prop = key;
					editorOverlayPropList.css({"pointer-events": "none"}).fadeOut();
				});
			});
		});

		editorOverlayMenuView.find("._effect>._button").on("click", () => {
			this.hideOverlayList();

			const editorOverlayEffectList = $($.parseHTML(this.templateEditorOverlayEffectList));
			editorOverlayMenuView.find("._effect").append(editorOverlayEffectList);
			editorOverlayEffectList.hide().fadeIn();
			
			Object.keys(HanulseEditorOverlayMenuView.EFFECTS).forEach(key => {
				const effect = HanulseEditorOverlayMenuView.EFFECTS[key];

				const editorOverlayEffectListItem = $($.parseHTML(this.templateEditorOverlayEffectListItem));
				editorOverlayEffectListItem.find("._text").text(effect);
				editorOverlayEffectList.append(editorOverlayEffectListItem);
				editorOverlayEffectListItem.on("click", () => {
					block._effect = key;
					editorOverlayEffectList.css({"pointer-events": "none"}).fadeOut();
				});
			});
		});

		this.showOverlay($(editorOverlayMenuView));
	}

	hideOverlayList() {
		$("._texture-list").css({"pointer-events": "none"}).fadeOut();
		$("._prop-list").css({"pointer-events": "none"}).fadeOut();
		$("._effect-list").css({"pointer-events": "none"}).fadeOut();
	}

	hide() {
		this.hideOverlay();
	}

	hideOverlay() {
		var overlay = $(".hanulse-overlay");
		overlay.fadeOut(function() {
			overlay.remove();
		});
	}

	showOverlay(element) {
		var _this = this;

		var overlay = $("<div class=\"hanulse-overlay\">").css({
			"display": "flex",
			"flex-direction": "column",
			"justify-content": "center",
			"align-items": "center",
			"position": "absolute",
			"left": "0px",
			"top": "0px",
			"width": "100%",
			"height": "100%",
			// "background-color": "rgba(0, 0, 0, 0.5)",
			"pointer-events": "none",
			"z-index": "100001"
		});
		overlay.append(element);
		overlay.hide();

		overlay.on("click", function(event) {
			if (overlay.is(event.target)) {
				_this.hideOverlay();
			}
		});

		$(document).on("keyup", function(event) {
			if (event.which == 27) {
				_this.hideOverlay();
			}
		});

		overlay.appendTo(document.body).fadeIn();
	}
}