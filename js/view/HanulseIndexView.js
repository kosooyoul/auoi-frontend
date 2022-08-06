class HanulseIndexView extends HanulseView {
	static _defaultAreaName = "4d-world";

	_canvasElement;

	_canvasView;
	_loadingView;

	_areaName;

	constructor(element) {
		super(element);

		this._initializeIndexView();
	}

	_initializeIndexView() {
		this._canvasElement = document.querySelector("canvas");

		this._initializeCanvasView();
		this._initializeLoadingView();

		this._initializeEvents();

		this._updateCounter();
		this._updateWisesaying();

		this._loadArea();
	}

	_initializeCanvasView() {
		this._canvasView = new HanulseCanvasView(this._canvasElement, {
			"autoplay": true,
			"enabledFPSCounter": true,
		});
	}

	_initializeLoadingView() {
		this.addChildView(this._loadingView = new HanulseLoadingView());
	}

	_initializeEvents() {
		window.addEventListener("load", () => this.onChangeArea());
		window.addEventListener("hashchange", () => this.onChangeArea());

		this._canvasElement.addEventListener("mousedown", (evt) => this._canvasView.onPointerDown(evt));
		this._canvasElement.addEventListener("mousemove", (evt) => this._canvasView.onPointerMove(evt));
		this._canvasElement.addEventListener("mouseup", (evt) => this._canvasView.onPointerUp(evt));
		this._canvasElement.addEventListener("mouseout", (evt) => this._canvasView.onPointerUp(evt));
		this._canvasElement.addEventListener("mouseleave", (evt) => this._canvasView.onPointerUp(evt));
		this._canvasElement.addEventListener("touchstart", (evt) => this._canvasView.onPointerDown(evt));
		this._canvasElement.addEventListener("touchmove", (evt) => this._canvasView.onPointerMove(evt));
		this._canvasElement.addEventListener("touchend", (evt) => this._canvasView.onPointerUp(evt));
	}

	onChangeArea() {
		this._loadArea();
		this._loadingView.show();
	}

	onLoadArea(data) {
		$(".placeinfo").text(data.title || "어딘가");

		this._canvasView.updateMapData(data);
		this._canvasView.fadeIn(400);
		this._loadingView.hide();
	}

	_loadArea() {
		const areaName = this._getAreaNameFromLocationHash() || HanulseIndexView._defaultAreaName;
		if (this._areaName == areaName) {
			return;
		}

		this._canvasView.fadeOut(200, () => {
			HanulseCommonApis.getArea(areaName, (data) => {
				this.onLoadArea(data);
				this._areaName = areaName;
			});
		});
	}

	_getAreaNameFromLocationHash() {
		return location.hash.slice(1);
	}

	_getAreaNameFromQueryString() {
		const queryString = location.search.split(/[?&]/g).map(function(p) {return p.split("=");}).reduce(function(r, p) {r[p[0]] = p[1]; return r;}, {});
		return queryString["name"];
	}

	_updateCounter() {
		HanulseCommonApis.getVisitCounts((data) => {
			if (data == null) return;
	
			var token = data.token;
			localStorage.setItem("token", token);
	
			var targetCounts = data.counts;
			var counts = {"today": 0, "yesterday": 0, "total": 0};
			var updateCount = function() {
				$(".counter-count-today").text(parseInt(counts.today));
				$(".counter-count-yesterday").text(parseInt(counts.yesterday));
				$(".counter-count-total").text(parseInt(counts.total));
			};
	
			$(counts).animate({"today": targetCounts.today, "yesterday": targetCounts.yesterday, "total": targetCounts.total}, {
				"duration": 1000,
				"progress": updateCount,
				"done": updateCount
			});
	
			var ratioToday = targetCounts.today / (targetCounts.today + targetCounts.yesterday);
			var ratioYesterday = 1 - ratioToday;
	
			$(".counter-bar-today").animate({"width": ratioToday * 60});
			$(".counter-bar-yesterday").animate({"width": ratioYesterday * 60});
			$(".counter-bar-long-today").animate({"width": ratioToday * 160});
			$(".counter-bar-long-yesterday").animate({"width": ratioYesterday * 160});
		});
	}
	
	_updateWisesaying() {
		HanulseCommonApis.getWisesaying((wisesaying) => {
			if (wisesaying == null) return;
			$(".wisesaying").text(wisesaying.sentense);
		});
	}
}