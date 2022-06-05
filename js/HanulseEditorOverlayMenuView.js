class HanulseEditorOverlayMenuView {
	templateEditorOverlayMenu = null;

	constructor() {
		this.initialize();
	}

	initialize() {
		this.templateEditorOverlayMenu = HanulseEditorOverlayMenuView.loadTemplate("./template/editor-overlay-menu.html");
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
		editorOverlayMenuView.find("._position").text([position.x, position.y, position.z].join(", "));

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


		this.showOverlay($(editorOverlayMenuView));
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