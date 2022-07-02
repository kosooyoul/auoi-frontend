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
	if (canvasView == null) {
		canvasView = new HanulseCanvasView(canvas, {
			"autoplay": true,
			"enabledFPSCounter": true
		});
	}

	canvasView.fadeOut(200, () => {
		canvasView.updateMapData(data);
		canvasView.fadeIn(200);
	});
}

function updateCounter() {
	const token = localStorage.getItem("token");
	$.post({
		"url": "https://apis.auoi.net/v1/visit",
		"dataType": "json",
		"data": {
			"token": token,
			"timeOffsetHours": getTimeDifferenceHours()
		},
		"success": function(response) {
			const data = response && response.data;
			if (data) {
				var token = data.token;
				localStorage.setItem("token", token);

				var targetCount = data.counts;
				var count = {"today": 0, "yesterday": 0, "total": 0};
				var updateCount = function() {
					$(".counter-count-today").text(parseInt(count.today));
					$(".counter-count-yesterday").text(parseInt(count.yesterday));
					$(".counter-count-total").text(parseInt(count.total));
				};

				$(count).animate({"today": targetCount.today, "yesterday": targetCount.yesterday, "total": targetCount.total}, {
					"duration": 1000,
					"progress": updateCount,
					"done": updateCount
				});

				var ratioToday = targetCount.today / (targetCount.today + targetCount.yesterday);
				var ratioYesterday = 1 - ratioToday;

				$(".counter-bar-today").animate({"width": ratioToday * 60});
				$(".counter-bar-yesterday").animate({"width": ratioYesterday * 60});
				$(".counter-bar-long-today").animate({"width": ratioToday * 160});
				$(".counter-bar-long-yesterday").animate({"width": ratioYesterday * 160});
			}
		}
	});
}

function updateWisesaying() {
	$.get({
		"url": "https://apis.auoi.net/v1/wisesaying",
		"dataType": "json",
		"success": function(response) {
			const wisesaying = response && response.data;

			if (wisesaying) {
				$(".wisesaying").text(wisesaying.sentense);
			}
		}
	});
}

function getTimeDifferenceHours() {
	return -new Date().getTimezoneOffset() / 60;
}