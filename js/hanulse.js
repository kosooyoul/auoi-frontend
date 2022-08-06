window.env = location.host? 'server': 'local';

var canvasView = null;

$(document).ready(function() {
	var canvas = $("canvas").get(0);
	canvas.addEventListener("mousedown", function(evt) {canvasView && canvasView.onPointerDown(evt);});
	canvas.addEventListener("mousemove", function(evt) {canvasView && canvasView.onPointerMove(evt);});
	canvas.addEventListener("mouseup", function(evt) {canvasView && canvasView.onPointerUp(evt);});
	canvas.addEventListener("mouseout", function(evt) {canvasView && canvasView.onPointerUp(evt);});
	canvas.addEventListener("mouseleave", function(evt) {canvasView && canvasView.onPointerUp(evt);});
	canvas.addEventListener("touchstart", function(evt) {canvasView && canvasView.onPointerDown(evt);});
	canvas.addEventListener("touchmove", function(evt) {canvasView && canvasView.onPointerMove(evt);});
	canvas.addEventListener("touchend", function(evt) {canvasView && canvasView.onPointerUp(evt);});

	if (window.env == "server") {
		updateCounter();
		updateWisesaying();
	}
});

function initializeHanulse(canvas, data) {
	$(document).ready(function() {
		setTitle(data.title || "어딘가");

		createHanulse(canvas, data);
	});
}

function setTitle(title) {
	$(".placeinfo").text(title);
}

function createHanulse(canvas, data) {
	if (canvasView) {
		canvasView.updateMapData(data);
		canvasView.fadeIn(400);
		$("._loading-area").stop().fadeOut();
		return;
	}

	canvasView = new HanulseCanvasView(canvas, {
		"autoplay": true,
		"enabledFPSCounter": true
	});
	canvasView.fadeOut(0, () => {
		canvasView.updateMapData(data);
		canvasView.fadeIn(400);
		$("._loading-area").stop().fadeOut();
	});
}

function updateCounter() {
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

function updateWisesaying() {
	HanulseCommonApis.getWisesaying((wisesaying) => {
		if (wisesaying == null) return;
		$(".wisesaying").text(wisesaying.sentense);
	});
}