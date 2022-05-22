class HanulseAssets {
	static images = {};

	static getImage(path) {
		if (this.images[path]) {
			return this.images[path];
		}

		var image = new Image();
		image.src = path;
		this.images[path] = image;
		return image;
	}

	static initialize(context) {
		context.props = {};
		context.props["tree"] = {"image": this.getImage("./images/tree.png"), "left": -50, "top": -109, "width": 99, "height": 109};
		context.props["bush"] =  {"image": this.getImage("./images/bush.png"), "left": -13, "top": -13, "width": 25, "height": 13};
		context.props["flower"] = {"image": this.getImage("./images/flower.png"), "left": -13, "top": -20, "width": 25, "height": 20};
		context.props["warp"] = {"image": this.getImage("./images/warp.png"), "left": -46, "top": -32, "width": 92, "height": 52};
		context.props["staff"] = {"image": this.getImage("./images/staff.png"), "left": -6, "top": -48, "width": 38, "height": 77};
		context.props["waste"] = {"image": this.getImage("./images/waste.png"), "left": -6, "top": -12, "width": 12, "height": 12};
		context.props["trash"] = {"image": this.getImage("./images/trash.png"), "left": -9, "top": -21, "width": 18, "height": 21};
	
		context.textures = {};
		context.textures["grass-top"] =  {"image": this.getImage("./images/grass-top.png"), "left": -40, "top": -20, "width": 80, "height": 40};

		context.textures["soil-left"] =  {"image": this.getImage("./images/soil-left.png"), "left": -40, "top": 0, "width": 40, "height": 55};
		context.textures["soil-right"] =  {"image": this.getImage("./images/soil-right.png"), "left": 0, "top": 0, "width": 40, "height": 55};
		
		context.textures["snow-top"] = {"image": this.getImage("./images/snow-top.png"), "left": -40, "top": -20, "width": 80, "height": 40};
		context.textures["snow-left"] =  {"image": this.getImage("./images/snow-left.png"), "left": -40, "top": 0, "width": 40, "height": 55};
		context.textures["snow-right"] =  {"image": this.getImage("./images/snow-right.png"), "left": 0, "top": 0, "width": 40, "height": 55};
		
		context.textures["pink-top"] =  {"image": this.getImage("./images/pink-top.png"), "left": -40, "top": -20, "width": 80, "height": 40};
		context.textures["pink-left"] =  {"image": this.getImage("./images/pink-left.png"), "left": -40, "top": 0, "width": 40, "height": 55};
		context.textures["pink-right"] =  {"image": this.getImage("./images/pink-right.png"), "left": 0, "top": 0, "width": 40, "height": 55};

		context.textures["blue-top"] =  {"image": this.getImage("./images/blue-top.png"), "left": -40, "top": -20, "width": 80, "height": 40};
		context.textures["blue-left"] =  {"image": this.getImage("./images/blue-left.png"), "left": -40, "top": 0, "width": 40, "height": 55};
		context.textures["blue-right"] =  {"image": this.getImage("./images/blue-right.png"), "left": 0, "top": 0, "width": 40, "height": 55};

		context.textures["iron-top"] =  {"image": this.getImage("./images/iron-top.png"), "left": -40, "top": -20, "width": 80, "height": 40};
		context.textures["iron-left"] =  {"image": this.getImage("./images/iron-left.png"), "left": -40, "top": 0, "width": 40, "height": 55};
		context.textures["iron-right"] =  {"image": this.getImage("./images/iron-right.png"), "left": 0, "top": 0, "width": 40, "height": 55};

		context.textures["hologram-top"] = {"image": this.getImage("./images/hologram-top.png"), "left": -40, "top": -20, "width": 80, "height": 40};
		context.textures["glass-top"] = {"image": this.getImage("./images/glass-top.png"), "left": -40, "top": -20, "width": 80, "height": 40};
		context.textures["parquet-top"] = {"image": this.getImage("./images/parquet-top.png"), "left": -40, "top": -20, "width": 80, "height": 40};

	}
}