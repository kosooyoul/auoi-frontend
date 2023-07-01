class HanulseUtils {
	static roundedRectangle(context, x, y, width, height, round) {
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

	static drawDescription(context, text, x, y) {
		context.save();
		
		context.shadowColor = "black";
		context.shadowBlur = 4;

		context.beginPath();
		context.moveTo(17, 5);
		context.lineTo(30, 15);
		context.lineTo(45, 15);
		context.strokeStyle = "white";
		context.stroke();
		context.closePath();

		context.font = "10px sans-serif";
		context.textBaseline = 'middle';
		context.textAlign = 'left';
		context.fillStyle = "white";
		context.fillText(text, x + 50, y + 10);

		context.restore();
	}

	static drawLabel(context, text, x, y) {
		context.save();

		context.font = "14px Arial, Helvetica, sans-serif";
		context.textBaseline = "middle";
		context.textAlign = 'center';
		var size = context.measureText(text);

		context.beginPath();
		this.roundedRectangle(context, x - (size.width + 20) / 2, y, size.width + 20, 25, 6);
		context.strokeStyle = "white";
		context.lineWidth = 1;
		context.lineJoin = "round";
		context.lineCap = "round";
		context.fillStyle = "rgba(0, 0, 0, 0.6)";
		context.fill();
		context.stroke();
		context.closePath();

		context.fillStyle = "white";
		context.fillText(text, x, y + 14);

		context.restore();
	}

	static drawActiveLabel(context, text, x, y) {
		context.save();

		context.font = "14px Arial, Helvetica, sans-serif";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		var size = context.measureText(text);

		context.beginPath();
		this.roundedRectangle(context, x - (size.width + 20) / 2, y, size.width + 20, 25, 6);
		context.strokeStyle = "rgb(0, 200, 255)";
		context.lineWidth = 1;
		context.lineJoin = "round";
		context.lineCap = "round";
		context.fillStyle = "rgba(0, 0, 0, 0.6)";
		context.fill();
		context.stroke();
		context.closePath();

		context.fillStyle = "white";
		context.fillText(text, x, y + 14);

		context.restore();
	}

	static drawFocusLabel(context, text, x, y) {
		context.save();

		context.font = "14px Arial, Helvetica, sans-serif";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		var size = context.measureText(text);

		context.beginPath();
		this.roundedRectangle(context, x - (size.width + 20) / 2, y, size.width + 20, 25, 6);
		context.strokeStyle = "rgb(0, 200, 255)";
		context.lineWidth = 1;
		context.lineJoin = "round";
		context.lineCap = "round";
		context.fillStyle = "rgba(0, 0, 0, 0.6)";
		context.fill();
		context.stroke();
		context.closePath();

		context.fillStyle = "white";
		context.fillText(text, x, y + 14);

		context.restore();
	}

	static drawHoverLabel(context, text, x, y) {
		context.save();

		context.font = "14px Arial, Helvetica, sans-serif";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		var size = context.measureText(text);

		context.beginPath();
		this.roundedRectangle(context, x - (size.width + 20) / 2, y, size.width + 20, 25, 6);
		context.strokeStyle = "rgb(255, 200, 0)";
		context.lineWidth = 1;
		context.lineJoin = "round";
		context.lineCap = "round";
		context.fillStyle = "rgba(0, 0, 0, 0.6)";
		context.fill();
		context.stroke();
		context.closePath();

		context.fillStyle = "white";
		context.fillText(text, x, y + 14);

		context.restore();
	}

	static drawWarningLabel(context, text, x, y) {
		context.save();

		context.font = "14px Arial, Helvetica, sans-serif";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		var size = context.measureText(text);

		context.beginPath();
		this.roundedRectangle(context, x - (size.width + 20) / 2, y, size.width + 20, 25, 6);
		context.strokeStyle = "rgb(255, 200, 200)";
		context.lineWidth = 1;
		context.lineJoin = "round";
		context.lineCap = "round";
		context.fillStyle = "rgba(150, 0, 0, 0.6)";
		context.fill();
		context.stroke();
		context.closePath();

		context.fillStyle = "white";
		context.fillText(text, x, y + 14);

		context.restore();
	}

	static parseOptions(optionsText) {
		var optionTexts = (optionsText || "").split(";");
		return optionTexts.reduce(function(options, optionText) {
			var keyValue = optionText.split(":");
			var key = keyValue[0].trim();
			if (key) {
				var value = keyValue[1] && keyValue[1].trim();
				options[key] = value;
			}
			return options;
		}, {});
	}
}