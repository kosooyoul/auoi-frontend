class HanulseBoardComponent {
	thisElement = null;
	contentElement = null;

	width = null;
	height = null;
	aspectRatio = null;

	thisElementWidth = null;
	thisElementHeight = null;
	thisAspectRatio = null;
	
	contentWidth = null;
	contentHeight = null;
	contentSizeRatio = 1;

	needToRefreshItems = false;

	nextItemId = 0;
	nextZIndex = 0;

	/** 외부 콜백 */
	onItemEditCallback = null;

	/** 편집 모드 */
	pointerMode = 'place';

	/** 배경 */
	background = null; // { type: 'color' | 'image', value: ColorString | ImageUrlString }
	
	/** 배치된 아이템 목록 */
	items = []; // HanulseBoardItem[]
	/*
		HanulseBoardItem {
			id: number
			type: BoardItemString 'image' | 'text'
			value: ImageUrlString | TextString
			x: number
			y: number
			w: number // 너비
			h: number // 높이
			radian: number
			zIndex: number
			functions: { // 기능 목록
				resize4d: boolean
				resize8d: boolean
				resize2w: boolean
				resize2h: boolean
				'simple-transform': boolean
				rotate: boolean
				delete: boolean
				clone: boolean
				edit: boolean
			};
			textStyle: { // 텍스트 스타일
				color: ColorString
				backgroundColor: ColorString
				fontSize: number
				fontFamily: FontNameString
				isFontBold: boolean
				isFontItalic: boolean
			};
		}
	*/

	/** 변형 작업을 위한 상태 값 */
	transformStatus = {
		isStarted: false, // boolean

		mode: null, // TransformModeString

		lastX: null, // number
		lastY: null, // number
		
		item: null, // HanulseBoardItem
		itemElement: null, // HTMLElement
	}

	/** 그리기 작업을 위한 상태 값 */
	drawingStatus = {
		isStarted: false, // boolean

		lastX: null, // number
		lastY: null, // number
		lastTimeMs: null, // number
		
		path: null, // {x: number, y: number, w: number}[]

		canvasElement: null, // HTMLCanvasElement
		context: null, // CanvasRenderingContext2D
	}

	/** 그리기에 사용할 스타일 */
	drawingStyle = {
		strokeColor: '#000000c8', // ColorString
		strokeWidth: 4, // number
	};

	constructor({element, width, height}) {
		// 부모 요소 저장
		this.thisElement = element;
		this.thisElementWidth = this.thisElement.offsetWidth;
		this.thisElementHeight = this.thisElement.offsetHeight;
		this.thisAspectRatio = this.thisElementWidth / this.thisElementHeight;

		// 기준 크기 및 종횡비 저장
		this.width = width || this.thisElementWidth;
		this.height = height || this.thisElementHeight;
		this.aspectRatio = this.width / this.height;

		// 컨텐츠 크기와 비율을 기준 사이즈를 부모 요소에 맞추어 계산
		this.contentWidth = this.thisElementWidth;
		this.contentHeight = this.thisElementHeight;
		if (this.aspectRatio < this.thisAspectRatio) this.contentWidth = this.contentHeight * this.aspectRatio;
		if (this.aspectRatio > this.thisAspectRatio) this.contentHeight = this.contentWidth / this.aspectRatio;
		this.contentSizeRatio = this.contentWidth / this.width;

		// 하위 기본 요소 초기화
		this.initializeElements();

		// 기본 이벤트 초기화
		this.initializeEvents();
		
		// 보드 크기 재설정 디텍터 초기화
		this.initializeBoardResizeDetector();
		
		// 편집 상태 초기화
		this.initializeEditStatus();
	}

	initializeElements() {
		// 컨텐츠 요소 생성
		this.contentElement = document.createElement('div');
		this.contentElement.classList.add('content');
		this.contentElement.style.width = this.contentWidth + 'px';
		this.contentElement.style.height = this.contentHeight + 'px';
		this.thisElement.appendChild(this.contentElement);
	}

	initializeEvents() {
		const onPointerStart = (event) => {
			if (this.pointerMode == 'place') this._onItemTransformStart(event);
			else if (this.pointerMode == 'drawing') this._onDrawingStart(event);
		};
		const onPointerMove = (event) => {
			if (this.pointerMode == 'place') this._onItemTransform(event);
			else if (this.pointerMode == 'drawing') this._onDrawing(event);
		};
		const onPointerEnd = (event) => {
			if (this.pointerMode == 'place') this._onItemTransformEnd(event);
			else if (this.pointerMode == 'drawing') this._onDrawingEnd(event);
		};

		this.thisElement.addEventListener("mousedown", onPointerStart);
		this.thisElement.addEventListener("mousemove", onPointerMove);
		this.thisElement.addEventListener("mouseup", onPointerEnd);
		this.thisElement.addEventListener("touchstart", onPointerStart);
		this.thisElement.addEventListener("touchmove", onPointerMove);
		this.thisElement.addEventListener("touchend", onPointerEnd);
	}

	initializeBoardResizeDetector() {
		// 100ms 마다 반복
		setInterval(() => {
			// 크기가 변경되었는지 검사
			if (this.thisElement.offsetWidth == this.thisElementWidth && this.thisElement.offsetHeight == this.thisElementHeight) {
				// 크기 변경이 끝났지만, 내부 컨텐츠 갱신이 필요한 경우
				if (this.needToRefreshItems) {
					this._refreshContent();
					this.needToRefreshItems = false;
				}
				return;
			}

			// 변경된 크기로 부모 요소 크기 저장
			this.thisElementWidth = this.thisElement.offsetWidth;
			this.thisElementHeight = this.thisElement.offsetHeight;
			this.thisAspectRatio = this.thisElementWidth / this.thisElementHeight;

			// 컨텐츠 크기와 비율을 기준 사이즈를 부모 요소에 맞추어 계산
			this.contentWidth = this.thisElementWidth;
			this.contentHeight = this.thisElementHeight;
			if (this.aspectRatio < this.thisAspectRatio) this.contentWidth = this.contentHeight * this.aspectRatio;
			if (this.aspectRatio > this.thisAspectRatio) this.contentHeight = this.contentWidth / this.aspectRatio;
			this.contentSizeRatio = this.contentWidth / this.width;

			// 내부 컨텐츠 갱신이 필요하다고 설정
			this.needToRefreshItems = true;

			console.log("Resized", this.thisElementWidth, this.thisElementHeight);
		}, 100);
	}

	_refreshContent() {
		// 컨텐츠 요소 크기 재설정
		this.contentElement.style.width = this.contentWidth + 'px';
		this.contentElement.style.height = this.contentHeight + 'px';

		// 모든 배치된 아이템 순회
		for (const item of this.items) {
			// 아이템 요소 탐색
			const itemElement = this.contentElement.querySelector(`[data-id="${item.id}"]`);
			if (itemElement == null) continue;

			// 배율에 따라 아이템 요소 크기 및 위치 재설정
			itemElement.style.width = item.width * this.contentSizeRatio + 'px';
			itemElement.style.height = item.height * this.contentSizeRatio + 'px';
			itemElement.style.left = item.x * this.contentSizeRatio + 'px';
			itemElement.style.top = item.y * this.contentSizeRatio + 'px';
		}
	}

	initializeEditStatus() {
		// 편집 모드 설정
		this.setPointerMode('place');

		// 기본 배경 설정
		this.setBackground({ type: 'color', value: 'white' });
	}

	setOnItemEdit(callback) {
		this.onItemEditCallback = callback;
	}

	setPointerMode(modeName) {
		if (modeName == 'place') {
			// 배치 모드
			this.pointerMode = 'place';
		} else if (modeName == 'drawing') {
			// 그리기 모드
			this.pointerMode = 'drawing';
		} else {
			// 기본값; 배치 모드
			this.pointerMode = 'place';
		}

		// 컨텐츠 요소에 모드 기록 - 편집 모드별 CSS 적용을 위함
		this.contentElement.setAttribute('data-mode', this.pointerMode);
	}

	setBackground(itemDescription) {
		this.background = itemDescription;

		if (itemDescription.type == 'color') {
			// 배경이 단색인 경우
			this.contentElement.style.backgroundColor = itemDescription.value;
			this.contentElement.style.backgroundImage = '';
		} else if (itemDescription.type == 'image') {
			// 배경이 이미지인 경우
			this.contentElement.style.backgroundColor = 'black';
			this.contentElement.style.backgroundImage = `url("${itemDescription.value}")`;
			this.contentElement.style.backgroundPosition = 'center';
			this.contentElement.style.backgroundSize = 'cover';
			this.contentElement.style.backgroundRepeat = 'no-repeat';
		}
	}

	createItem(itemDescription, focus = true) {
		const item = this._newItem(itemDescription);
		const itemElement = this._newItemElement(item);

		// 배치된 아이템 목록에 추가
		this.items.push(item);

		// 아이템의 요소 또한 컨텐츠 요소에 추가
		this.contentElement.appendChild(itemElement);

		// 조건에 따라 포커스
		if (focus) {
			this.unselectAllItem();
			this.selectItemById(item.id);
		}
	}

	deleteItemById(itemId) {
		// 배치된 아이템 목록에서 제거
		const index = this.items.findIndex((item) => item.id == itemId);
		if (index > 0) {
			this.items.splice(index, 1);
		}

		// 아이템 요소 또한 제거
		const itemElement = this.contentElement.querySelector('[data-id="' + itemId + '"]');
		if (itemElement) {
			itemElement.remove();
		}
	}

	cloneItemById(itemId, focus = true) {
		const item = this.items.find((item) => item.id == itemId);
		if (item == null) {
			return;
		}

		// 아이템 복제 및 새 요소 생성
		const clonedItem = this._newItem({
			...item,
			x: item.x + 10,
			y: item.y + 10,
		});
		const clonedItemElement = this._newItemElement(clonedItem);

		// 복제된 아이템을 배치된 아이템 목록에 추가
		this.items.push(clonedItem);

		// 복제된 아이템의 요소 또한 컨텐츠 요소에 추가
		this.contentElement.append(clonedItemElement);

		// 조건에 따라 포커스
		if (focus) {
			this.unselectAllItem();
			this.selectItemById(clonedItem.id);
		}
	}

	unselectAllItem() {
		const itemElements = this.contentElement.querySelectorAll('.item');
		itemElements.forEach(element => element.classList.remove('selected'));
	}

	selectItemById(itemId) {
		const item = this.items.find((item) => item.id == itemId);
		if (item == null) {
			return;
		}

		const itemElement = this.contentElement.querySelector(`[data-id="${itemId}"]`);
		if (itemElement) {
			itemElement.classList.add('selected');
			itemElement.style.zIndex = item.zIndex = this.nextZIndex++;
		}
	}

	setDrawerStyles(styles) {
		// 그리기 스타일 설정
		this.drawingStyle = styles;
	}

	toImageBlob(callback) {
		this._loadImages((imagesByUrl) => {
			const canvas = document.createElement('canvas');
			const width = canvas.width = this.width;
			const height = canvas.height = this.height;
			const context = canvas.getContext('2d');

			// 배경 랜더링
			if (this.background.type == 'color') {
				context.fillStyle = this.background.value;
				context.fillRect(0, 0, width, height);
			} else if (this.background.type == 'image') {
				const backgroundImage = imagesByUrl['background'];
				let backgroundOffsetX;
				let backgroundOffsetY;
				let backgroundWidth;
				let backgroundHeight;
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
			}

			// 배치된 아이템 정렬하여 순서대로 랜더링
			this.items.sort((a, b) => a.zIndex > b.zIndex ? 1 : -1);
			this.items.forEach(item => {
				if (item.type == 'image') {
					// 이미지인 경우
					const itemImage = imagesByUrl[item.id];
					context.save();
					context.translate(item.x + item.width * 0.5, item.y + item.height * 0.5);
					context.rotate(item.radian);
					context.drawImage(itemImage, -item.width * 0.5, -item.height * 0.5, item.width, item.height);
					context.restore();
				} else if (item.type == 'text') {
					// 텍스트인 경우
					context.save();
					context.translate(item.x + item.width * 0.5, item.y + item.height * 0.5);
					context.rotate(item.radian);
					// 텍스트 배경 랜더링
					if (item.textStyle) {
						context.fillStyle = item.textStyle.backgroundColor;
						context.fillRect(-item.width * 0.5, -item.height * 0.5, item.width, item.height);
					}
					// 텍스트 랜더링
					if (item.textStyle) {
						context.font = `${item.textStyle.isFontItalic ? 'italic' : ''} ${item.textStyle.isFontBold ? 'bold' : ''} ${item.textStyle.fontSize}px ${item.textStyle.fontFamily}`
						context.fillStyle = item.textStyle.color;
					} else {
						context.fillStyle = 'black';
					}
					context.textBaseline = 'top';
					context.textAlign = 'left';
					context.fillText(item.value, -item.width * 0.5, -item.height * 0.5);
					context.restore();
				}
			});

			// Preview image
			// var dataUrl = canvas.toDataURL("image/png");
			// var newTab = window.open('about:blank', '_blank');
			// newTab.document.write("<img src='" + dataUrl + "' alt='from canvas'/>");

			canvas.toBlob((blob) => {
				callback && callback(blob);
			}, 'image/png');
		});
	}

	_loadImages(callback) {
		const imagesByUrl = {};

		const imageList = [];
		if (this.background.type == 'image') {
			imageList.push({ id: 'background', url: this.background.value });
		}

		this.items.forEach(item => {
			if (item.type == 'image') {
				imageList.push({ id: item.id, url: item.value });
			}
		})

		const loadNextImage = (imageItem) => {
			if (imageItem == null) {
				return callback && callback(imagesByUrl);
			}

			const image = new Image();
			image.onload = () => {
				imagesByUrl[imageItem.id] = image;
				loadNextImage(imageList.shift());
			};
			image.src = imageItem.url;
		};

		loadNextImage(imageList.shift());
	}

	_newItem(itemDescription) {
		return {
			id: this.nextItemId++,
			type: itemDescription.type,
			value: itemDescription.value,
			x: itemDescription.x ?? (this.width - itemDescription.width) * 0.5,
			y: itemDescription.y ?? (this.height - itemDescription.height) * 0.5,
			width: itemDescription.width,
			height: itemDescription.height,
			radian: itemDescription.radian ?? 0,
			zIndex: this.nextZIndex++,
			functions: itemDescription.functions ?? {
				resize4d: true,
				resize8d: false,
				resize2w: false,
				resize2h: false,
				'simple-transform': false,
				rotate: true,
				delete: true,
				clone: true,
				edit: false,
			},
			textStyle: itemDescription.textStyle
		};
	}

	_newItemElement(item) {
		const element = document.createElement('div');
		element.classList.add('item');
		element.setAttribute('data-id', item.id);
		element.style.width = item.width * this.contentSizeRatio + 'px';
		element.style.height = item.height * this.contentSizeRatio + 'px';
		element.style.left = item.x * this.contentSizeRatio + 'px';
		element.style.top = item.y * this.contentSizeRatio + 'px';
		element.style.zIndex = item.zIndex;
		element.style.transform = `rotate(${item.radian}rad)`;

		const contentElement = document.createElement('div');
		contentElement.classList.add('content');
		element.appendChild(contentElement);

		if (item.type == "image") {
			const imageElement = document.createElement('img');
			imageElement.setAttribute('data-type', 'image');
			imageElement.setAttribute('src', item.value);

			contentElement.appendChild(imageElement);
		} else {
			const textElement = document.createElement('span');
			textElement.setAttribute('data-type', 'text');
			textElement.textContent = item.value;

			if (item.textStyle) {
				textElement.style.color = item.textStyle.color;
				textElement.style.backgroundColor = item.textStyle.backgroundColor;
				textElement.style.fontSize = item.textStyle.fontSize;
				textElement.style.fontFamily = item.textStyle.fontFamily;
				textElement.style.fontWeight = item.textStyle.isFontBold ? "bold" : "normal";
				textElement.style.fontStyle = item.textStyle.isFontItalic ? "italic" : "normal";
				textElement.style.whiteSpace = "nowrap";
			}

			contentElement.appendChild(textElement);
		}

		const frameElement = document.createElement('div');
		frameElement.classList.add('frame');
		frameElement.setAttribute('data-id', item.id);
		frameElement.setAttribute('data-transform-mode', 'move');

		element.appendChild(frameElement);

		// 4방향 크기 조절 기능이 있는 경우
		if (item.functions['resize4d']) {
			frameElement.appendChild(this._createTransformFunctionElement('resize-nw', item));
			frameElement.appendChild(this._createTransformFunctionElement('resize-ne', item));
			frameElement.appendChild(this._createTransformFunctionElement('resize-sw', item));
			frameElement.appendChild(this._createTransformFunctionElement('resize-se', item));
		}

		// 8방향 크기 조절 기능이 있는 경우
		if (item.functions['resize8d']) {
			frameElement.appendChild(this._createTransformFunctionElement('resize-nw', item));
			frameElement.appendChild(this._createTransformFunctionElement('resize-ne', item));
			frameElement.appendChild(this._createTransformFunctionElement('resize-sw', item));
			frameElement.appendChild(this._createTransformFunctionElement('resize-se', item));
			frameElement.appendChild(this._createTransformFunctionElement('resize-n', item));
			frameElement.appendChild(this._createTransformFunctionElement('resize-s', item));
			frameElement.appendChild(this._createTransformFunctionElement('resize-w', item));
			frameElement.appendChild(this._createTransformFunctionElement('resize-e', item));
		}

		// 횡 2방향 크기 조절 기능이 있는 경우
		if (item.functions['resize2w']) {
			frameElement.appendChild(this._createTransformFunctionElement('resize-w', item));
			frameElement.appendChild(this._createTransformFunctionElement('resize-e', item));
		}

		// 종 2방향 크기 조절 기능이 있는 경우
		if (item.functions['resize2h']) {
			frameElement.appendChild(this._createTransformFunctionElement('resize-n', item));
			frameElement.appendChild(this._createTransformFunctionElement('resize-s', item));
		}

		// 단순 변형 기능이 있는 경우
		if (item.functions['simple-transform']) {
			frameElement.appendChild(this._createTransformFunctionElement('simple-transform', item));
		}

		// 회전 기능이 있는 경우
		if (item.functions['rotate']) {
			frameElement.appendChild(this._createTransformFunctionElement('rotate', item));
		}

		// 삭제 기능이 있는 경우
		if (item.functions['delete']) {
			frameElement.appendChild(this._createSpecialFunctionElement('delete', item, () => this.deleteItemById(item.id)));
		}

		// 복제 기능이 있는 경우
		if (item.functions['clone']) {
			frameElement.appendChild(this._createSpecialFunctionElement('delete', item, () => this.cloneItemById(item.id)));
		}

		// 편집 기능이 있는 경우
		if (item.functions['edit']) {
			frameElement.appendChild(this._createSpecialFunctionElement('edit', item, () => this.onItemEditCallback && this.onItemEditCallback(item)));
		}

		return element;
	}

	_createTransformFunctionElement(functionName, item) {
		const element = document.createElement('div');
		element.classList.add(functionName);
		element.setAttribute('data-id', item.id);
		element.setAttribute('data-transform-mode', functionName);
		return element;
	}

	_createSpecialFunctionElement(functionName, item, callback) {
		const element = document.createElement('div');
		element.classList.add(functionName);
		element.setAttribute('data-id', item.id);
		element.addEventListener('click', () => callback && callback());
		return element;
	}

	_pointToRadian(x, y) {
		return Math.atan2(y, x);
	}

	_onItemTransformStart(event) {
		const targetElement = event.target;
		const itemId = targetElement.getAttribute('data-id');
		const transformMode = targetElement.getAttribute('data-transform-mode');

		if (transformMode == null) {
			this.transformStatus.mode = null;
			return;
		}

		// 변형 모드가 없을 때만, 기본 동작 무시
		if (event.type == 'touchstart') {
			event.preventDefault(); //for Mobile
		}

		const item = this.items.find(item => item.id == itemId);
		const itemElement = this.contentElement.querySelector(`[data-id="${itemId}"]`);
		if (item == null || itemElement == null) {
			this.unselectAllItem();
			this.transformStatus.item = null;
			this.transformStatus.itemElement = null;
			this.transformStatus.mode = null;
			return;
		}

		if (this.transformStatus.item != item) {
			this.unselectAllItem();
			this.selectItemById(item.id);
		}


		this.transformStatus.item = item;
		this.transformStatus.itemElement = itemElement;
		this.transformStatus.mode = transformMode;

		const pointer = event.targetTouches ? event.targetTouches[0] : event;
		this.transformStatus.lastX = pointer.pageX;
		this.transformStatus.lastY = pointer.pageY;

		console.log('Start Transform', item.id, transformMode);
	}

	_onItemTransform(event) {
		if (this.transformStatus.item == null) return;
		if (this.transformStatus.itemElement == null) return;
		if (this.transformStatus.mode == null) return;

		const pointer = event.targetTouches ? event.targetTouches[0] : event;
		const pointerX = pointer.pageX;
		const pointerY = pointer.pageY;

		if (this.transformStatus.mode == 'move') {
			// 아이템 이동
			this.transformStatus.item.x += (pointerX - this.transformStatus.lastX) / this.contentSizeRatio;
			this.transformStatus.item.y += (pointerY - this.transformStatus.lastY) / this.contentSizeRatio;
			this.transformStatus.itemElement.style.left = this.transformStatus.item.x * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.top = this.transformStatus.item.y * this.contentSizeRatio + 'px';
		} else if (this.transformStatus.mode == 'rotate') {
			// 아이템 회전
			const itemCenterX = (this.transformStatus.item.x + this.transformStatus.item.width * 0.5) * this.contentSizeRatio + this.contentElement.offsetLeft;
			const itemCenterY = (this.transformStatus.item.y + this.transformStatus.item.height * 0.5) * this.contentSizeRatio + this.contentElement.offsetTop;
			const lastRadian = this._pointToRadian(this.transformStatus.lastX - itemCenterX, this.transformStatus.lastY - itemCenterY);
			const radian = this._pointToRadian(pointerX - itemCenterX, pointerY - itemCenterY);
			this.transformStatus.item.radian += radian - lastRadian;
			this.transformStatus.itemElement.style.transform = `rotate(${this.transformStatus.item.radian}rad)`;
		} else if (this.transformStatus.mode == 'simple-transform') {
			// 단순 변형
			// TODO
		} else if (this.transformStatus.mode == 'resize-nw') {
			// 아이템 북서 방향 크기 조절
			const x = (pointerX - this.transformStatus.lastX) / this.contentSizeRatio;
			const y = (pointerY - this.transformStatus.lastY) / this.contentSizeRatio;
			const cos = Math.cos(this.transformStatus.item.radian);
			const sin = Math.sin(this.transformStatus.item.radian);
			const rcos = cos;
			const rsin = -sin;
			const rotatedX = x * rcos - y * rsin;
			const rotatedY = x * rsin + y * rcos;

			this.transformStatus.item.x += rotatedX;
			this.transformStatus.item.y += rotatedY;
			this.transformStatus.item.width -= rotatedX;
			this.transformStatus.item.height -= rotatedY;

			this.transformStatus.item.x -= (rotatedX - x) / 2;
			this.transformStatus.item.y -= (rotatedY - y) / 2;

			this.transformStatus.itemElement.style.width = this.transformStatus.item.width * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.height = this.transformStatus.item.height * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.left = this.transformStatus.item.x * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.top = this.transformStatus.item.y * this.contentSizeRatio + 'px';
		} else if (this.transformStatus.mode == 'resize-ne') {
			// 아이템 북동 방향 크기 조절
			const x = (pointerX - this.transformStatus.lastX) / this.contentSizeRatio;
			const y = (pointerY - this.transformStatus.lastY) / this.contentSizeRatio;
			const cos = Math.cos(this.transformStatus.item.radian);
			const sin = Math.sin(this.transformStatus.item.radian);
			const rcos = cos;
			const rsin = -sin;
			const rotatedX = x * rcos - y * rsin;
			const rotatedY = x * rsin + y * rcos;

			this.transformStatus.item.y += rotatedY;
			this.transformStatus.item.width += rotatedX;
			this.transformStatus.item.height -= rotatedY;

			this.transformStatus.item.x -= (rotatedX - x) / 2;
			this.transformStatus.item.y -= (rotatedY - y) / 2;

			this.transformStatus.itemElement.style.width = this.transformStatus.item.width * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.height = this.transformStatus.item.height * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.left = this.transformStatus.item.x * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.top = this.transformStatus.item.y * this.contentSizeRatio + 'px';
		} else if (this.transformStatus.mode == 'resize-sw') {
			// 아이템 남서 방향 크기 조절
			const x = (pointerX - this.transformStatus.lastX) / this.contentSizeRatio;
			const y = (pointerY - this.transformStatus.lastY) / this.contentSizeRatio;
			const cos = Math.cos(this.transformStatus.item.radian);
			const sin = Math.sin(this.transformStatus.item.radian);
			const rcos = cos;
			const rsin = -sin;
			const rotatedX = x * rcos - y * rsin;
			const rotatedY = x * rsin + y * rcos;

			this.transformStatus.item.x += rotatedX;
			this.transformStatus.item.width -= rotatedX;
			this.transformStatus.item.height += rotatedY;

			this.transformStatus.item.x -= (rotatedX - x) / 2;
			this.transformStatus.item.y -= (rotatedY - y) / 2;

			this.transformStatus.itemElement.style.width = this.transformStatus.item.width * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.height = this.transformStatus.item.height * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.left = this.transformStatus.item.x * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.top = this.transformStatus.item.y * this.contentSizeRatio + 'px';
		} else if (this.transformStatus.mode == 'resize-se') {
			// 아이템 남동 방향 크기 조절
			const x = (pointerX - this.transformStatus.lastX) / this.contentSizeRatio;
			const y = (pointerY - this.transformStatus.lastY) / this.contentSizeRatio;
			const cos = Math.cos(this.transformStatus.item.radian);
			const sin = Math.sin(this.transformStatus.item.radian);
			const rcos = cos;
			const rsin = -sin;
			const rotatedX = x * rcos - y * rsin;
			const rotatedY = x * rsin + y * rcos;

			this.transformStatus.item.width += rotatedX;
			this.transformStatus.item.height += rotatedY;

			this.transformStatus.item.x -= (rotatedX - x) / 2;
			this.transformStatus.item.y -= (rotatedY - y) / 2;

			this.transformStatus.itemElement.style.width = this.transformStatus.item.width * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.height = this.transformStatus.item.height * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.left = this.transformStatus.item.x * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.top = this.transformStatus.item.y * this.contentSizeRatio + 'px';
		} else if (this.transformStatus.mode == 'resize-n') {
			// 아이템 북 방향 크기 조절
			const x = (pointerX - this.transformStatus.lastX) / this.contentSizeRatio;
			const y = (pointerY - this.transformStatus.lastY) / this.contentSizeRatio;
			const cos = Math.cos(this.transformStatus.item.radian);
			const sin = Math.sin(this.transformStatus.item.radian);
			const rcos = cos;
			const rsin = -sin;
			const rotatedX = 0;
			const rotatedY = x * rsin + y * rcos;
			const fixedX = rotatedX * cos - rotatedY * sin;
			const fixedY = rotatedX * sin + rotatedY * cos;

			this.transformStatus.item.y += rotatedY;
			this.transformStatus.item.height -= rotatedY;

			this.transformStatus.item.x -= (rotatedX - fixedX) / 2;
			this.transformStatus.item.y -= (rotatedY - fixedY) / 2;

			this.transformStatus.itemElement.style.width = this.transformStatus.item.width * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.height = this.transformStatus.item.height * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.left = this.transformStatus.item.x * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.top = this.transformStatus.item.y * this.contentSizeRatio + 'px';
		} else if (this.transformStatus.mode == 'resize-s') {
			// 아이템 남 방향 크기 조절
			const x = (pointerX - this.transformStatus.lastX) / this.contentSizeRatio;
			const y = (pointerY - this.transformStatus.lastY) / this.contentSizeRatio;
			const cos = Math.cos(this.transformStatus.item.radian);
			const sin = Math.sin(this.transformStatus.item.radian);
			const rcos = cos;
			const rsin = -sin;
			const rotatedX = 0;
			const rotatedY = x * rsin + y * rcos;
			const fixedX = rotatedX * cos - rotatedY * sin;
			const fixedY = rotatedX * sin + rotatedY * cos;

			this.transformStatus.item.height += rotatedY;

			this.transformStatus.item.x -= (rotatedX - fixedX) / 2;
			this.transformStatus.item.y -= (rotatedY - fixedY) / 2;

			this.transformStatus.itemElement.style.width = this.transformStatus.item.width * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.height = this.transformStatus.item.height * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.left = this.transformStatus.item.x * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.top = this.transformStatus.item.y * this.contentSizeRatio + 'px';
		} else if (this.transformStatus.mode == 'resize-w') {
			// 아이템 서 방향 크기 조절
			const x = (pointerX - this.transformStatus.lastX) / this.contentSizeRatio;
			const y = (pointerY - this.transformStatus.lastY) / this.contentSizeRatio;
			const cos = Math.cos(this.transformStatus.item.radian);
			const sin = Math.sin(this.transformStatus.item.radian);
			const rcos = cos;
			const rsin = -sin;
			const rotatedX = x * rcos - y * rsin;
			const rotatedY = 0;
			const fixedX = rotatedX * cos - rotatedY * sin;
			const fixedY = rotatedX * sin + rotatedY * cos;

			this.transformStatus.item.x += rotatedX;
			this.transformStatus.item.width -= rotatedX;

			this.transformStatus.item.x -= (rotatedX - fixedX) / 2;
			this.transformStatus.item.y -= (rotatedY - fixedY) / 2;

			this.transformStatus.itemElement.style.width = this.transformStatus.item.width * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.height = this.transformStatus.item.height * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.left = this.transformStatus.item.x * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.top = this.transformStatus.item.y * this.contentSizeRatio + 'px';
		} else if (this.transformStatus.mode == 'resize-e') {
			// 아이템 동 방향 크기 조절
			const x = (pointerX - this.transformStatus.lastX) / this.contentSizeRatio;
			const y = (pointerY - this.transformStatus.lastY) / this.contentSizeRatio;
			const cos = Math.cos(this.transformStatus.item.radian);
			const sin = Math.sin(this.transformStatus.item.radian);
			const rcos = cos;
			const rsin = -sin;
			const rotatedX = x * rcos - y * rsin;
			const rotatedY = 0;
			const fixedX = rotatedX * cos - rotatedY * sin;
			const fixedY = rotatedX * sin + rotatedY * cos;

			this.transformStatus.item.width += rotatedX;

			this.transformStatus.item.x -= (rotatedX - fixedX) / 2;
			this.transformStatus.item.y -= (rotatedY - fixedY) / 2;

			this.transformStatus.itemElement.style.width = this.transformStatus.item.width * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.height = this.transformStatus.item.height * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.left = this.transformStatus.item.x * this.contentSizeRatio + 'px';
			this.transformStatus.itemElement.style.top = this.transformStatus.item.y * this.contentSizeRatio + 'px';
		}

		this.transformStatus.lastX = pointer.pageX;
		this.transformStatus.lastY = pointer.pageY;
	}

	_onItemTransformEnd() {
		this.transformStatus.mode = null;
		this.transformStatus.item = null;
		this.transformStatus.itemElement = null;
		this.transformStatus.lastX = null;
		this.transformStatus.lastY = null;
	}

	_onDrawingStart(event) {
		if (event.type == 'touchstart') {
			event.preventDefault(); //for Mobile
		}

		if (this.drawingStatus.isStarted) return;

		const pointer = event.targetTouches ? event.targetTouches[0] : event;
		const x = pointer.pageX - this.contentElement.offsetLeft;
		const y = pointer.pageY - this.contentElement.offsetTop;

		this.drawingStatus.canvasElement = document.createElement('canvas');
		this.drawingStatus.canvasElement.width = this.contentWidth;
		this.drawingStatus.canvasElement.height = this.contentHeight;
		this.drawingStatus.canvasElement.style.position = 'absolute';
		this.drawingStatus.canvasElement.style.left = '0px';
		this.drawingStatus.canvasElement.style.right = '0px';
		this.drawingStatus.canvasElement.style.top = '0px';
		this.drawingStatus.canvasElement.style.bottom = '0px';
		this.drawingStatus.canvasElement.style.zIndex = this.nextZIndex++;

		this.drawingStatus.context = this.drawingStatus.canvasElement.getContext('2d');
		this.contentElement.appendChild(this.drawingStatus.canvasElement);

		this.drawingStatus.context.lineJoin = 'round';
		this.drawingStatus.context.lineCap = 'round';
		this.drawingStatus.context.strokeStyle = this.drawingStyle.strokeColor;
		this.drawingStatus.context.lineWidth = this.drawingStyle.strokeWidth;
		this.strokeRatio = 2;

		this.drawingStatus.isStarted = true;
		this.drawingStatus.path = [{ x: x, y: y, w: this.drawingStyle.lineWidth}];
		this.drawingStatus.lastX = x;
		this.drawingStatus.lastY = y;
		this.drawingStatus.lastTimeMs = 0;
	}

	_onDrawing(event) {
		if (this.drawingStatus.isStarted == false) return;

		const pointer = event.targetTouches ? event.targetTouches[0] : event;
		const x = pointer.pageX - this.contentElement.offsetLeft;
		const y = pointer.pageY - this.contentElement.offsetTop;

		const dx = x - this.drawingStatus.lastX;
		const dy = y - this.drawingStatus.lastY;
		const lineWidthRatio = (Date.now() - this.drawingStatus.lastTimeMs) / (Math.abs(dx) + Math.abs(dy));
		const lineWidth = this.drawingStyle.strokeWidth * Math.max(0.5, Math.min(2, lineWidthRatio));

		const lastLineWidth = this.drawingStatus.context.lineWidth;
		const dw = lineWidth - lastLineWidth;

		const count = Math.max(1, Math.floor((Math.abs(dx) + Math.abs(dy)) / 2));
		const cdx = dx / count;
		const cdy = dy / count;
		const cdw = dw > 0 ? 0.02 : -0.02;
		for (let i = 0; i < count; i++) {
			this.drawingStatus.context.lineWidth = Math.max(lineWidth * 0.5, Math.min(lineWidth * 2, this.drawingStatus.context.lineWidth + cdw));

			this.drawingStatus.context.beginPath();
			this.drawingStatus.context.moveTo(this.drawingStatus.lastX, this.drawingStatus.lastY);
			this.drawingStatus.context.lineTo(this.drawingStatus.lastX + cdx, this.drawingStatus.lastY + cdy);
			this.drawingStatus.context.stroke();
			this.drawingStatus.context.closePath();

			this.drawingStatus.lastX = this.drawingStatus.lastX + cdx;
			this.drawingStatus.lastY = this.drawingStatus.lastY + cdy;

			this.drawingStatus.path.push({ x: this.drawingStatus.lastX, y: this.drawingStatus.lastY, w: this.drawingStatus.context.lineWidth });
		}

		this.drawingStatus.lastX = x;
		this.drawingStatus.lastY = y;
		this.drawingStatus.path.push({ x: this.drawingStatus.lastX, y: this.drawingStatus.lastY, w: this.drawingStatus.context.lineWidth });
		this.drawingStatus.lastTimeMs = Date.now();
	}

	_onDrawingEnd(event) {
		if (this.drawingStatus.isStarted == false) return;

		this.drawingStatus.canvasElement.remove();
		
		const image = this._makeDrawingImage(this.drawingStatus.path, this.drawingStyle);
		const imageBoundary = image.boundary;
		
		this.createItem({
			type: 'image',
			value: image.src,
			x: imageBoundary.offsetX / this.contentSizeRatio,
			y: imageBoundary.offsetY / this.contentSizeRatio,
			width: imageBoundary.width / this.contentSizeRatio,
			height: imageBoundary.height / this.contentSizeRatio,
			radian: 0,
		}, false);

		this.drawingStatus.isStarted = false;
		this.drawingStatus.path = null;
		this.drawingStatus.canvasElement = null;
		this.drawingStatus.context = null;
		this.drawingStatus.lastX = null;
		this.drawingStatus.lastY = null;
	}

	_makeDrawingImage(drawingPath, drawingStyle) {
		const quality = 2;
		const offset = drawingStyle.strokeWidth;
		const pathBoundary = this._getPathBoundary(drawingPath, offset);
		const normalizedPath = this._normalizePath(drawingPath, pathBoundary);

		this.drawingStatus.canvasElement.width = pathBoundary.width * quality;
		this.drawingStatus.canvasElement.height = pathBoundary.height * quality;
		this.drawingStatus.context.clearRect(0, 0, pathBoundary.width * quality, pathBoundary.height * quality);

		this.drawingStatus.context.lineJoin = 'meter';
		this.drawingStatus.context.lineCap = 'round';
		this.drawingStatus.context.strokeStyle = drawingStyle.strokeColor;
		this.drawingStatus.context.lineWidth = drawingStyle.strokeWidth;

		this.drawingStatus.context.scale(quality, quality);
		// this.drawingStatus.context.lineWidth = 1;

		for (let i = 0; i < normalizedPath.length - 1; i++) {
			this.drawingStatus.context.lineWidth = normalizedPath[i + 1].w;
			this.drawingStatus.context.beginPath();
			this.drawingStatus.context.moveTo(normalizedPath[i].x, normalizedPath[i].y);
			this.drawingStatus.context.lineTo(normalizedPath[i + 1].x, normalizedPath[i + 1].y);
			this.drawingStatus.context.stroke();
		}
		this.drawingStatus.context.closePath();

		return {
			src: this.drawingStatus.canvasElement.toDataURL('image/png'),
			boundary: pathBoundary,
		};
	}

	_getPathBoundary(path, margin) {
		let minX = Number.MAX_VALUE;
		let maxX = -Number.MAX_VALUE;
		let minY = Number.MAX_VALUE;
		let maxY = -Number.MAX_VALUE;
		for (let i = 0; i < path.length; i++) {
			minX = Math.min(minX, path[i].x);
			minY = Math.min(minY, path[i].y);
			maxX = Math.max(maxX, path[i].x);
			maxY = Math.max(maxY, path[i].y);
		}
		return {
			offsetX: minX - margin,
			offsetY: minY - margin,
			width: maxX - minX + margin * 2,
			height: maxY - minY + margin * 2,
		}
	}

	_normalizePath(path, boundary) {
		return path.map(p => ({ x: p.x - boundary.offsetX, y: p.y - boundary.offsetY, w: p.w }));
	}
}