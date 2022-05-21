window.env = location.host? 'server': 'local';

var renderer = null;

$(document).ready(function() {
	var canvas = $("canvas").get(0);
	canvas.addEventListener("mousedown", function(evt) {renderer && renderer.onPointerDown(evt);});
	canvas.addEventListener("mousemove", function(evt) {renderer && renderer.onPointerMove(evt);});
	canvas.addEventListener("mouseup", function(evt) {renderer && renderer.onPointerUp(evt);});
	canvas.addEventListener("mouseout", function(evt) {renderer && renderer.onPointerUp(evt);});
	canvas.addEventListener("mouseleave", function(evt) {renderer && renderer.onPointerUp(evt);});
	canvas.addEventListener("touchstart", function(evt) {renderer && renderer.onPointerDown(evt);});
	canvas.addEventListener("touchmove", function(evt) {renderer && renderer.onPointerMove(evt);});
	canvas.addEventListener("touchend", function(evt) {renderer && renderer.onPointerUp(evt);});

	if (window.env == "server") {
		updateCounter();
		updateWisesaying();
	}
});

function initializeHanulse(canvas, data, options) {
	$(document).ready(function() {
		setTitle(data.title || "어딘가");

		createHanulse(canvas, data.map || [], options);
	});
}

function setTitle(title) {
	$(".placeinfo").text(title);
}

function createHanulse(canvas, map, options) {
	if (renderer) {
		// TODO: fade out
		renderer.destroy();
	}
	// TODO: fade in
	renderer = new HanulseRenderer(canvas, map, options);
}

function updateCounter() {
	$.ajax({
		"url": "https://www.ahyane.net/counter/counter.php",
		"dataType": "json",
		"success": function(data) {
			var count = {"today": 0, "yesterday": 0, "total": 0};
			var updateCount = function() {
				$(".counter-count-today").text(parseInt(count.today));
				$(".counter-count-yesterday").text(parseInt(count.yesterday));
				$(".counter-count-total").text(parseInt(count.total));
			};

			$(count).animate({"today": data.today, "yesterday": data.yesterday, "total": data.total}, {
				"duration": 1000,
				"progress": updateCount,
				"done": updateCount
			});

			var ratioToday = data.today / (data.today + data.yesterday);
			var ratioYesterday = 1 - ratioToday;

			$(".counter-bar-today").animate({"width": ratioToday * 60});
			$(".counter-bar-yesterday").animate({"width": ratioYesterday * 60});
			$(".counter-bar-long-today").animate({"width": ratioToday * 160});
			$(".counter-bar-long-yesterday").animate({"width": ratioYesterday * 160});
		}
	});
}

function updateWisesaying() {
	$.ajax({
		"url": "https://www.ahyane.net/backend/wisesaying.php",
		"dataType": "json",
		"success": function(data) {
			if (!data.text) return;

			$(".wisesaying-text").text(data.text);
		}
	});
}
