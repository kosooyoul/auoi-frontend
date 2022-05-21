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
	
		context.blocks = {};
		context.blocks["grass"] =  {"image": this.getImage("./images/grass.png"), "left": -40, "top": -20, "width": 80, "height": 40};
		context.blocks["pink"] =  {"image": this.getImage("./images/pink.png"), "left": -40, "top": -20, "width": 80, "height": 40};
		context.blocks["blue"] =  {"image": this.getImage("./images/blue.png"), "left": -40, "top": -20, "width": 80, "height": 40};
		context.blocks["hologram"] = {"image": this.getImage("./images/hologram.png"), "left": -40, "top": -20, "width": 80, "height": 40};
	}
}