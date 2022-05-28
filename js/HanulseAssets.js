class HanulseAssets {
	static images = {};
	static props = {};
	static textures = {};

	static getImage(path) {
		if (this.images[path]) {
			return this.images[path];
		}

		var image = new Image();
		image.onload = function(e) {
			e.path.forEach(img => {
				console.log("Image loaded: '" + img.src + "'");
			});
		};
		image.src = path;
		this.images[path] = image;
		return image;
	}

	static getTexture(name) {
		const texture = this.textures[name];
		if (texture == null) {
			return null;
		}
		texture.image = this.getImage(texture.path);
		return texture
	}

	static getProp(name) {
		const prop = this.props[name];
		if (prop == null) {
			return null;
		}
		prop.image = this.getImage(prop.path);
		return prop
	}

	static initialize() {
		this.props["tree"] = {"path": "./images/tree.png", "left": -50, "top": -109, "width": 99, "height": 109};
		this.props["bush"] =  {"path": "./images/bush.png", "left": -13, "top": -13, "width": 25, "height": 13};
		this.props["flower"] = {"path": "./images/flower.png", "left": -13, "top": -20, "width": 25, "height": 20};
		this.props["warp"] = {"path": "./images/warp.png", "left": -46, "top": -32, "width": 92, "height": 52};
		this.props["staff"] = {"path": "./images/staff.png", "left": -6, "top": -48, "width": 38, "height": 77};
		this.props["waste"] = {"path": "./images/waste.png", "left": -6, "top": -12, "width": 12, "height": 12};
		this.props["trash"] = {"path": "./images/trash.png", "left": -9, "top": -21, "width": 18, "height": 21};

		this.props["flower-palm"] = {"path": "./images/flower-palm.png", "left": -12 * 1.16, "top": -26 * 1.16, "width": 24 * 1.16, "height": 28 * 1.16};
		this.props["picture"] = {"path": "./images/picture.png", "left": -13 * 1.16, "top": -7.5 * 1.16, "width": 26 * 1.16, "height": 15 * 1.16};
		this.props["pictures"] = {"path": "./images/pictures.png", "left": -17 * 1.16, "top": -9 * 1.16, "width": 34 * 1.16, "height": 18 * 1.16};
		this.props["scrap-right"] = {"path": "./images/scrap-right.png", "left": -21.5 * 1.16, "top": -16 * 1.16, "width": 43 * 1.16, "height": 27 * 1.16};
		this.props["book-right-1"] = {"path": "./images/book-right-1.png", "left": -19 * 1.16, "top": -16 * 1.16, "width": 38 * 1.16, "height": 27 * 1.16};
		this.props["book-right-2"] = {"path": "./images/book-right-2.png", "left": -19 * 1.16, "top": -22 * 1.16, "width": 38 * 1.16, "height": 33 * 1.16};
		this.props["book-left-1"] = {"path": "./images/book-left-1.png", "left": -19 * 1.16, "top": -16 * 1.16, "width": 38 * 1.16, "height": 27 * 1.16};
		this.props["book-left-2"] = {"path": "./images/book-left-2.png", "left": -19 * 1.16, "top": -22 * 1.16, "width": 38 * 1.16, "height": 33 * 1.16};

		this.props["table"] = {"path": "./images/table.png", "left": -35 * 1.16, "top": -36 * 1.16, "width": 70 * 1.16, "height": 52 * 1.16};
		this.props["bookontable"] = {"path": "./images/bookontable.png", "left": -35 * 1.16, "top": -36 * 1.16, "width": 70 * 1.16, "height": 52 * 1.16};
		this.props["scrapontable"] = {"path": "./images/scrapontable.png", "left": -35 * 1.16, "top": -36 * 1.16, "width": 70 * 1.16, "height": 52 * 1.16};
		this.props["pcontable-left"] = {"path": "./images/pcontable-left.png", "left": -35 * 1.16, "top": -52 * 1.16, "width": 70 * 1.16, "height": 68 * 1.16};
		this.props["pcontable-right"] = {"path": "./images/pcontable-right.png", "left": -35 * 1.16, "top": -52 * 1.16, "width": 70 * 1.16, "height": 68 * 1.16};
		this.props["chair-small"] = {"path": "./images/chair-small.png", "left": -16.5 * 1.16, "top": -22 * 1.16, "width": 33 * 1.16, "height": 31 * 1.16};
		this.props["bookshelf-left-2"] = {"path": "./images/bookshelf-left-2.png", "left": -35 * 1.16, "top": -76.5 * 1.16, "width": 70 * 1.16, "height": 95 * 1.16};
		this.props["blocks-cube"] = {"path": "./images/blocks-cube.png", "left": -13.5, "top": -22, "width": 27, "height": 29};
		this.props["blocks-xyz"] = {"path": "./images/blocks-xyz.png", "left": -19.5, "top": -32, "width": 39, "height": 36};

		this.props["flower-berry-1"] = {"path": "./images/flower-berry-1.png", "left": -16, "top": -42, "width": 33, "height": 47};
		this.props["flower-palm-2"] = {"path": "./images/flower-palm-2.png", "left": -16, "top": -45, "width": 33, "height": 55};
		this.props["parquet-floor-left"] = {"path": "./images/parquet-floor-left.png", "left": -40, "top": -55, "width": 80, "height": 75};
		this.props["grass-slide-right"] = {"path": "./images/grass-slide-right.png", "left": -40, "top": -55, "width": 80, "height": 75};
		this.props["grass-slide-left"] = {"path": "./images/grass-slide-left.png", "left": -40, "top": -55, "width": 80, "height": 75};
		this.props["grass-slide-right-back"] = {"path": "./images/grass-slide-right-back.png", "left": -40, "top": -37, "width": 80, "height": 57};
		this.props["grass-slide-left-back"] = {"path": "./images/grass-slide-left-back.png", "left": -40, "top": -37, "width": 80, "height": 57};
		this.props["pink-slide-right"] = {"path": "./images/pink-slide-right.png", "left": -40, "top": -55, "width": 80, "height": 75};
		this.props["pink-slide-left"] = {"path": "./images/pink-slide-left.png", "left": -40, "top": -55, "width": 80, "height": 75};
		
		this.textures["grass-top"] =  {"path": "./images/grass-top.png", "left": -40, "top": -20, "width": 80, "height": 40};
		this.textures["gravel-top"] =  {"path": "./images/gravel-top.png", "left": -40, "top": -20, "width": 80, "height": 40};
		this.textures["water-top"] =  {"path": "./images/water-top.png", "left": -40, "top": -20, "width": 80, "height": 40};

		this.textures["soil-top"] =  {"path": "./images/soil-top.png", "left": -40, "top": -20, "width": 80, "height": 40};
		this.textures["soil-left"] =  {"path": "./images/soil-left.png", "left": -40, "top": 0, "width": 40, "height": 55};
		this.textures["soil-right"] =  {"path": "./images/soil-right.png", "left": 0, "top": 0, "width": 40, "height": 55};
		
		this.textures["snow-top"] = {"path": "./images/snow-top.png", "left": -40, "top": -20, "width": 80, "height": 40};
		this.textures["snow-left"] =  {"path": "./images/snow-left.png", "left": -40, "top": 0, "width": 40, "height": 55};
		this.textures["snow-right"] =  {"path": "./images/snow-right.png", "left": 0, "top": 0, "width": 40, "height": 55};
		
		this.textures["pink-top"] =  {"path": "./images/pink-top.png", "left": -40, "top": -20, "width": 80, "height": 40};
		this.textures["pink-left"] =  {"path": "./images/pink-left.png", "left": -40, "top": 0, "width": 40, "height": 55};
		this.textures["pink-right"] =  {"path": "./images/pink-right.png", "left": 0, "top": 0, "width": 40, "height": 55};

		this.textures["blue-top"] =  {"path": "./images/blue-top.png", "left": -40, "top": -20, "width": 80, "height": 40};
		this.textures["blue-left"] =  {"path": "./images/blue-left.png", "left": -40, "top": 0, "width": 40, "height": 55};
		this.textures["blue-right"] =  {"path": "./images/blue-right.png", "left": 0, "top": 0, "width": 40, "height": 55};

		this.textures["green-left"] =  {"path": "./images/green-left.png", "left": -40, "top": 0, "width": 40, "height": 55};
		this.textures["green-right"] =  {"path": "./images/green-right.png", "left": 0, "top": 0, "width": 40, "height": 55};

		this.textures["iron-top"] =  {"path": "./images/iron-top.png", "left": -40, "top": -20, "width": 80, "height": 40};
		this.textures["iron-left"] =  {"path": "./images/iron-left.png", "left": -40, "top": 0, "width": 40, "height": 55};
		this.textures["iron-right"] =  {"path": "./images/iron-right.png", "left": 0, "top": 0, "width": 40, "height": 55};

		this.textures["glass-top"] = {"path": "./images/glass-top.png", "left": -40, "top": -20, "width": 80, "height": 40};
		this.textures["glass-left"] = {"path": "./images/glass-left.png", "left": -40, "top": 0, "width": 40, "height": 55};
		this.textures["glass-right"] = {"path": "./images/glass-right.png", "left": 0, "top": 0, "width": 40, "height": 55};

		this.textures["hologram-top"] = {"path": "./images/hologram-top.png", "left": -40, "top": -20, "width": 80, "height": 40};
		this.textures["parquet-top"] = {"path": "./images/parquet-top.png", "left": -40, "top": -20, "width": 80, "height": 40};

	}
}