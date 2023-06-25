class HanulseSlider {

	_boundary = null;

	offsetX = 0;
	offsetY = 0;
	
	moving = false;
	startPointerX = null;
	startPointerY = null;
	lastPointerX = null;
	lastPointerY = null;

	_onSlide = null;

	intervalRecording = null;
	intervalSliding = null;

	constructor() {

	}

	setBoundary(boundary) {
		this._boundary = boundary;
	}

	resizeBoundary(boundary) {
		this._boundary = boundary;
		this.setPosition(this.offsetX, this.offsetY);
	}

	setOnSlide(onSlide) {
		this._onSlide = onSlide;
	}

	destroy() {
		// 슬라이딩 이전 타이머 제거
		if (this.intervalSliding) {
			clearInterval(this.intervalSliding);
		}
	}

	setPosition(x, y) {
		this.offsetX = x;
		this.offsetY = y;
		this._onSlide(this.offsetX, this.offsetY);
	}

	moveTo(x, y) {
		// 슬라이딩 이전 타이머 제거
		if (this.intervalSliding) {
			clearInterval(this.intervalSliding);
		}

		// 슬라이딩 새 타이머 시작
		var self = this;
		this.intervalSliding = setInterval(function() {
			// 이동 중이면 슬라이딩 이전 타이머 제거
			if (self.moving) {
				return self.stopSliding();
			}

			// 위치 이동량 계산
			var dx = (x - self.offsetX) * 0.2;
			var dy = (y - self.offsetY) * 0.2;

			// 위치 이동
			self.offsetX += dx;
			self.offsetY += dy;
			if (self._onSlide) {
				self._onSlide(self.offsetX, self.offsetY);
			}

			// 이동량이 0에 가까워지면 슬라이딩 중지 
			if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
				self.stopSliding();
			}
		}, 1000 / 50);
	}

	onPointerDown(evt) {
		if (evt.type == "touchstart") {
			evt.preventDefault(); //for Mobile
		}

		// 포인터 위치
		var pointer = evt.targetTouches? evt.targetTouches[0] : evt;
		var pointerX = pointer.pageX;
		var pointerY = pointer.pageY;

		// 포인터 위치 초기화
		this.startPointerX = this.lastPointerX = pointerX;
		this.startPointerY = this.lastPointerY = pointerY;

		// 이동 시작
		this.moving = true;

		// 슬라이딩 멈추고, 이동 위치 기록
		this.stopSliding();
		this.startRecording();

		return {
			"x": pointerX,
			"y": pointerY,
			"distanceX": 0,
			"distanceY": 0,
			"moving": true
		};
	}

	onPointerMove(evt) {
		// 포인터 위치
		var pointer = evt.targetTouches? evt.targetTouches[0] : evt;
		var pointerX = pointer.pageX;
		var pointerY = pointer.pageY;

		// 이동 중이 아니면 리턴
		if (!this.moving) {
			return {
				"x": pointerX,
				"y": pointerY,
				"distanceX": pointerX - this.startPointerX,
				"distanceY": pointerY - this.startPointerY,
				"moving": false
			};
		}

		// 최대 이동 범위 제한
		var tempX = this.offsetX + (pointerX - this.lastPointerX);
		var tempY = this.offsetY + (pointerY - this.lastPointerY);
		if (tempX < -this._boundary.right) {
			tempX = -this._boundary.right;
		} else if (tempX > -this._boundary.left) {
			tempX = -this._boundary.left;
		}
		if (tempY < -this._boundary.bottom) {
			tempY = -this._boundary.bottom;
		} else if (tempY > -this._boundary.top) {
			tempY = -this._boundary.top;
		}

		// 위치 이동
		this.offsetX = tempX;
		this.offsetY = tempY;
		if (this._onSlide) {
			this._onSlide(this.offsetX, this.offsetY);
		}

		// 포인터 위치 갱신
		this.lastPointerX = pointerX;
		this.lastPointerY = pointerY;

		return {
			"x": pointerX,
			"y": pointerY,
			"distanceX": pointerX - this.startPointerX,
			"distanceY": pointerY - this.startPointerY,
			"moving": true
		};
	}
	
	onPointerUp(evt) {
		// 포인터 위치
		var pointerX = this.lastPointerX;
		var pointerY = this.lastPointerY;

		// 이동 중이 아니면 리턴
		if (!this.moving) {
			return null;
		}

		// 이동 중지
		this.moving = false;
		
		// 위치 기록 중지, 슬라이딩 시작
		this.stopRecording();
		this.startSliding();

		return {
			"x": pointerX,
			"y": pointerY,
			"distanceX": pointerX - this.startPointerX,
			"distanceY": pointerY - this.startPointerY,
			"moving": false
		};
	}

	startRecording() {
		// 위치 기록 초기화
		this.records = [];
		this.records.push({x: this.offsetX, y: this.offsetY});

		// 위치 기록 이전 타이머 제거
		if (this.intervalRecording) {
			clearInterval(this.intervalRecording);
		}

		// 위치 기록 새 타이머 시작
		var self = this;
		this.intervalRecording = setInterval(function() {
			// 위치 이동 중이 아니면 기록 종료
			if (!self.moving) {
				return self.stopRecording();
			}

			self.records.push({x: self.offsetX, y: self.offsetY});
		}, 1000 / 50)
	};

	stopRecording() {
		// 마지막 위치 기록
		this.records.push({x: this.offsetX, y: this.offsetY});

		// 위치 기록 이전 타이머 제거
		clearInterval(this.intervalRecording);
		this.intervalRecording = null;
	};

	startSliding() {
		// 마지막 기록된 위치 샘플 검사
		var lastRecords = this.records.slice(-3);
		if (lastRecords.length < 3) return;

		// 추가 위치 이동량 계산
		var first = lastRecords[0], prev = lastRecords[1], curr = lastRecords[2];
		var pdx = first.x - curr.x, pdy = first.y - curr.y;
		var cdx = curr.x - prev.x, cdy = curr.y - prev.y;
		var dx = cdx + (cdx - pdx) * 0.1; // expected next dx is added prev dx x 0.1
		var dy = cdy + (cdy - pdy) * 0.1; // expected next dy is added prev dy x 0.1

		// 슬라이딩 이전 타이머 제거
		if (this.intervalSliding) {
			clearInterval(this.intervalSliding);
		}

		// 슬라이딩 새 타이머 시작
		var self = this;
		this.intervalSliding = setInterval(function() {
			// 이동 중이면 슬라이딩 이전 타이머 제거
			if (self.moving) {
				return self.stopSliding();
			}

			// 최대 이동 범위 도달시 방향 전환
			var tempX = self.offsetX + dx;
			var tempY = self.offsetY + dy;
			if (tempX < -self._boundary.right) {
				tempX = -self._boundary.right;
				dx = -dx * 0.5;
			} else if (tempX > -self._boundary.left) {
				tempX = -self._boundary.left;
				dx = -dx * 0.5;
			}
			if (tempY < -self._boundary.bottom) {
				tempY = -self._boundary.bottom;
				dy = -dy * 0.5;
			} else if (tempY > -self._boundary.top) {
				tempY = -self._boundary.top;
				dy = -dy * 0.5;
			}

			// 위치 이동
			self.offsetX = tempX;
			self.offsetY = tempY;
			if (self._onSlide) {
				self._onSlide(self.offsetX, self.offsetY);
			}

			// 마찰력 적용, 이동량이 0에 가까워지면 슬라이딩 중지 
			dx *= 0.9;
			dy *= 0.9;
			if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
				self.stopSliding();
			}
		}, 1000 / 50);
	};

	stopSliding() {
		// 슬라이딩 이전 타이머 제거
		clearInterval(this.intervalSliding);
		this.intervalSliding = null;
	};
}