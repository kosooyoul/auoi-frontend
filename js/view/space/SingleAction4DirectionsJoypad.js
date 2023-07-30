class SingleAction4DirectionsJoypad {
    _width = 0;
    _height = 0;
    _scale = 1;
    _scaledHalfWidth = 0;
    _scaledHalfHeight = 0;

    _downedCursor;
    _movingCursor;
    _actionedCursor;

    _keyStatus = {};

    constructor(targetElement) {
        targetElement.addEventListener("mousedown", (evt) => this._onPointersDown(evt));
        targetElement.addEventListener("mousemove", (evt) => this._onPointersMove(evt));
        targetElement.addEventListener("mouseup", (evt) => this._onPointersUp(evt));
        targetElement.addEventListener("mouseout", (evt) => this._onPointersUp(evt));
        targetElement.addEventListener("mouseleave", (evt) => this._onPointersUp(evt));
        targetElement.addEventListener("touchstart", (evt) => this._onPointersDown(evt));
        targetElement.addEventListener("touchmove", (evt) => this._onPointersMove(evt));
        targetElement.addEventListener("touchend", (evt) => this._onPointersUp(evt));
        document.body.addEventListener("keydown", (evt) => this._onKeyDown(evt));
        document.body.addEventListener("keyup", (evt) => this._onKeyUp(evt));
    }

    getStatus() {
        return this._keyStatus;
    }

    setCanvasSize(width, height, scale) {
        this._width = width;
        this._height = height;
        this._scale = scale || 1;
        this._scaledHalfWidth = width / 2 / this._scale;
        this._scaledHalfHeight = height / 2 / this._scale;
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

        pointers.forEach(pointer => {
            var cursorX = pointer.x - this._scaledHalfWidth;
            var cursorY = pointer.y - this._scaledHalfHeight;

            if (cursorX < 0) {
                // Left side -> joystick
                if (this._downedCursor == null) {
                    this._downedCursor = { x: cursorX, y: cursorY, id: pointer.id };
                    this._movingCursor = { x: cursorX, y: cursorY, id: pointer.id };
                }
            } else {
                // Right side -> action
                if (this._actionedCursor == null) {
                    this._actionedCursor = { x: cursorX, y: cursorY, id: pointer.id };
                    this._keyStatus["action"] = Date.now();
                }
            }
        });
    }

    _onPointersMove(evt) {
		var pointers = this._getPointers(evt);

        if (this._downedCursor == null) {
            return;
        }

        pointers.forEach(pointer => {
            if (pointer.id != this._downedCursor.id) {
                return;
            }

            var cursorX = pointer.x - this._scaledHalfWidth;
            var cursorY = pointer.y - this._scaledHalfHeight;
            this._movingCursor = { x: cursorX, y: cursorY };

            if (Math.abs(this._downedCursor.x - this._movingCursor.x) > Math.abs(this._downedCursor.y - this._movingCursor.y)) {
                if (this._downedCursor.x < this._movingCursor.x) {
                    if (this._keyStatus["right"] == null) {
                        this._keyStatus["right"] = Date.now();
                        delete this._keyStatus["left"];
                        delete this._keyStatus["up"];
                        delete this._keyStatus["down"];
                    }
                } else if (this._downedCursor.x > this._movingCursor.x) {
                    if (this._keyStatus["left"] == null) {
                        this._keyStatus["left"] = Date.now();
                        delete this._keyStatus["right"];
                        delete this._keyStatus["up"];
                        delete this._keyStatus["down"];
                    }
                }
            } else {
                if (this._downedCursor.y < this._movingCursor.y) {
                    if (this._keyStatus["down"] == null) {
                        this._keyStatus["down"] = Date.now();
                        delete this._keyStatus["left"];
                        delete this._keyStatus["right"];
                        delete this._keyStatus["up"];
                    }
                } else if (this._downedCursor.y > this._movingCursor.y) {
                    if (this._keyStatus["up"] == null) {
                        this._keyStatus["up"] = Date.now();
                        delete this._keyStatus["left"];
                        delete this._keyStatus["right"];
                        delete this._keyStatus["down"];
                    }
                }
            }
        });
    }

    _onPointersUp(evt) {
		var pointers = this._getPointers(evt);

        if (this._downedCursor) {
            const downedPointer = pointers.find(pointer => pointer.id == this._downedCursor.id)
            if (downedPointer == null || downedPointer.id == null) {
                delete this._keyStatus["left"];
                delete this._keyStatus["right"];
                delete this._keyStatus["up"];
                delete this._keyStatus["down"];
                this._downedCursor = null;
                this._movingCursor = null;
                this._moving = false;
            }
        }

        if (this._actionedCursor) {
            const actionedPointer = pointers.find(pointer => pointer.id == this._actionedCursor.id)
            if (actionedPointer == null || actionedPointer.id == null) {
                delete this._keyStatus["action"];
                this._actionedCursor = null;
            }
        }
    }

    _onKeyDown(evt) {
        const keyCode = evt.which;
        const keyName = this._keyCodeToName(keyCode);
        if (this._keyStatus[keyName] != null) {
            return
        }

        if (keyName) {
            this._keyStatus[keyName] = Date.now();
        }
    }

    _onKeyUp(evt) {
        const keyCode = evt.which;
        const keyName = this._keyCodeToName(keyCode);
        delete this._keyStatus[keyName];
    }

    compute() {

    }

    render(context) {
        context.save();

        context.translate(this._scaledHalfWidth, this._scaledHalfHeight);
        if (this._downedCursor) {
            this._renderJoystickLeft(context, !!this._keyStatus["left"]);
            this._renderJoystickRight(context, !!this._keyStatus["right"]);
            this._renderJoystickUp(context, !!this._keyStatus["up"]);
            this._renderJoystickDown(context, !!this._keyStatus["down"]);
        }

        if (this._movingCursor) {
            this._renderJoystickCursor(context);
        }

        context.restore();
    }

    _keyCodeToName(keyCode) {
        switch (keyCode) {
            case 37: return "left";
            case 38: return "up";
            case 39: return "right";
            case 40: return "down";
            case 32: return "action";
            case 13: return "action";
        }
        return "";
    }

    _renderJoystickLeft(context, highlight) {
        context.beginPath();
        context.fillStyle = highlight ? "rgba(0, 255, 255, 0.4)" : "rgba(127, 127, 127, 0.2)";
        context.strokeStyle = "rgba(220, 220, 220, 0.4)";
        context.moveTo(this._downedCursor.x - 28.28, this._downedCursor.y + 28.28);
        context.arc(this._downedCursor.x, this._downedCursor.y, 30, Math.PI * 0.75, Math.PI * 1.25);
        context.lineTo(this._downedCursor.x - 28.28, this._downedCursor.y - 28.28);
        context.arc(this._downedCursor.x, this._downedCursor.y, 40, Math.PI * 1.25, Math.PI * 0.75, true);
        context.fill();
        context.stroke();
    }


    _renderJoystickRight(context, highlight) {
        context.beginPath();
        context.fillStyle = highlight ? "rgba(0, 255, 255, 0.4)" : "rgba(127, 127, 127, 0.2)";
        context.strokeStyle = "rgba(220, 220, 220, 0.4)";
        context.moveTo(this._downedCursor.x + 28.28, this._downedCursor.y - 28.28);
        context.arc(this._downedCursor.x, this._downedCursor.y, 30, Math.PI * 1.75, Math.PI * 2.25);
        context.lineTo(this._downedCursor.x + 28.28, this._downedCursor.y + 28.28);
        context.arc(this._downedCursor.x, this._downedCursor.y, 40, Math.PI * 2.25, Math.PI * 1.75, true);
        context.fill();
        context.stroke();
    }

    _renderJoystickUp(context, highlight) {
        context.beginPath();
        context.fillStyle = highlight ? "rgba(0, 255, 255, 0.4)" : "rgba(127, 127, 127, 0.2)";
        context.strokeStyle = "rgba(220, 220, 220, 0.4)";
        context.moveTo(this._downedCursor.x - 28.28, this._downedCursor.y - 28.28);
        context.arc(this._downedCursor.x, this._downedCursor.y, 30, Math.PI * 1.25, Math.PI * 1.75);
        context.lineTo(this._downedCursor.x + 28.28, this._downedCursor.y - 28.28);
        context.arc(this._downedCursor.x, this._downedCursor.y, 40, Math.PI * 1.75, Math.PI * 1.25, true);
        context.fill();
        context.stroke();
    }

    _renderJoystickDown(context, highlight) {
        context.beginPath();
        context.fillStyle = highlight ? "rgba(0, 255, 255, 0.4)" : "rgba(127, 127, 127, 0.2)";
        context.strokeStyle = "rgba(220, 220, 220, 0.4)";
        context.moveTo(this._downedCursor.x + 28.28, this._downedCursor.y + 28.28);
        context.arc(this._downedCursor.x, this._downedCursor.y, 30, Math.PI * 0.25, Math.PI * 0.75);
        context.lineTo(this._downedCursor.x - 28.28, this._downedCursor.y + 28.28);
        context.arc(this._downedCursor.x, this._downedCursor.y, 40, Math.PI * 0.75, Math.PI * 0.25, true);
        context.fill();
        context.stroke();
    }

    _renderJoystickCursor(context) {
        context.beginPath();
        context.fillStyle = "rgba(127, 127, 127, 0.2)";
        context.strokeStyle = "rgba(220, 220, 220, 0.4)";
        context.arc(this._movingCursor.x, this._movingCursor.y, 20, 0, Math.PI * 2);
        context.fill();
        context.stroke();
    }
}