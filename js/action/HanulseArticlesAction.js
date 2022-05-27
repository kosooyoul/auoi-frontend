class HanulseArticlesAction {
	static sampleArticles = [
		{"no": 1, "title": "해가 떨어지고 달이 떠오르면", "createdAt": "2022-01-01"},
		{"no": 2, "title": "달콤한 별빛이 민들레 차에 퐁당", "createdAt": "2022-01-02"},
		{"no": 3, "title": "아침엔 시리얼 먹고 힘을 내요", "createdAt": "2022-01-04"},
		{"no": 4, "title": "항상 맛있는 것 먹고 싶지만", "createdAt": "2022-01-07"},
		{"no": 5, "title": "해가 떨어지고 달이 떠오르면", "createdAt": "2022-01-09"},
		{"no": 6, "title": "달콤한 별빛이 민들레 차에 퐁당", "createdAt": "2022-01-13"},
		{"no": 7, "title": "아침엔 시리얼 먹고 힘을 내요", "createdAt": "2022-01-17"},
		{"no": 8, "title": "항상 맛있는 것 먹고 싶지만", "createdAt": "2022-01-22"},
		{"no": 9, "title": "건강하게 매일 유산균과 콜라겐 흡수!", "createdAt": "2022-01-27"},
		{"no": 10, "title": "살기 위해선 밥을 먹어야지", "createdAt": "2022-02-01"},
		// {"no": 11, "title": "해가 떨어지고 달이 떠오르면", "createdAt": "2022-03-01"},
		// {"no": 12, "title": "달콤한 별빛이 민들레 차에 퐁당", "createdAt": "2022-03-02"},
		// {"no": 13, "title": "아침엔 시리얼 먹고 힘을 내요", "createdAt": "2022-03-04"},
		// {"no": 14, "title": "항상 맛있는 것 먹고 싶지만", "createdAt": "2022-03-07"},
		// {"no": 15, "title": "해가 떨어지고 달이 떠오르면", "createdAt": "2022-03-09"},
		// {"no": 16, "title": "달콤한 별빛이 민들레 차에 퐁당", "createdAt": "2022-03-13"},
		// {"no": 17, "title": "아침엔 시리얼 먹고 힘을 내요", "createdAt": "2022-03-17"},
		// {"no": 18, "title": "항상 맛있는 것 먹고 싶지만", "createdAt": "2022-03-22"},
		// {"no": 19, "title": "건강하게 매일 유산균과 콜라겐 흡수!", "createdAt": "2022-03-27"},
		// {"no": 20, "title": "살기 위해선 밥을 먹어야지", "createdAt": "2022-04-01"},
	].sort((a, b) => b.no - a.no);

	act(data, onFinished) {
		var dialogBox = this.getDialogBox();
		var dialogBoxLayout = $("<div>").css({
			// "position": "absolute",
			"width": "100%",
			"height": "100%",
			"left": "0px",
			"top": "0px",
			"pointer-events": "auto",
		});
		var dialogBoxTop = $("<div>").css({
			// "position": "absolute",
			"width": "100%",
			"left": "0px",
			"top": "0px",
			"height": "60px",
			"color": "white",
			"font-size": "16px",
			"text-align": "center",
			"line-height": "60px",
		}).text(data.title || "제목 없음");
		var dialogBoxList = $("<div class='scrollbox'>").css({
			// "position": "absolute",
			"width": "100%",
			// "height": "100%",
			"left": "0px",
			"top": "60px",
			"bottom": "0px",
			// "max-height": "300px",
			"overflow": "auto",
			// "background-color": "yellow"
		});
		var dialogBoxBottom = $("<div>").css({
			// "position": "absolute",
			"width": "100%",
			"left": "0px",
			"top": "0px",
			"height": "60px",
			"color": "white",
			"font-size": "12px",
			"text-align": "center",
			"line-height": "60px",
		});
		dialogBoxBottom.append($("<div>").css({"display": "inline-block", "background-color": "rgba(255, 255, 255, 0.5)", "width": "32px", "height": "32px", "line-height": "32px", "text-align": "center", "margin-left": "4px", "margin-right": "4px", "border": "1px solid white", "border-radius": "8px"}).text("1"));
		dialogBoxBottom.append($("<div>").css({"display": "inline-block", "width": "32px", "height": "32px", "line-height": "32px", "text-align": "center", "margin-left": "4px", "margin-right": "4px", "border": "1px solid white", "border-radius": "8px"}).text("2"));
		dialogBoxBottom.append($("<div>").css({"display": "inline-block", "width": "32px", "height": "32px", "line-height": "32px", "text-align": "center", "margin-left": "4px", "margin-right": "4px", "border": "1px solid white", "border-radius": "8px"}).text("3"));
		dialogBoxBottom.append($("<div>").css({"display": "inline-block", "width": "32px", "height": "32px", "line-height": "32px", "text-align": "center", "margin-left": "4px", "margin-right": "4px", "border": "1px solid white", "border-radius": "8px"}).text("4"));
		dialogBoxBottom.append($("<div>").css({"display": "inline-block", "width": "32px", "height": "32px", "line-height": "32px", "text-align": "center", "margin-left": "4px", "margin-right": "4px", "border": "1px solid white", "border-radius": "8px"}).text("5"));
		dialogBoxLayout.append(dialogBoxTop);
		dialogBoxLayout.append(dialogBoxList);
		dialogBoxLayout.append(dialogBoxBottom);

		for (var article of HanulseArticlesAction.sampleArticles) {
			this.getArticleItem(article).appendTo(dialogBoxList);
		}

		dialogBoxLayout.appendTo(dialogBox)
		this.showOverlay(dialogBox, onFinished);
	}

	hideOverlay() {
		var overlay = $(".hanulse-overlay");
		var onFinished = overlay.data("onFinished");
		if (onFinished) {
			onFinished();
		}
		overlay.fadeOut(function() {
			overlay.remove();
		});
	}

	showOverlay(element, onFinished) {
		var _this = this;

		var overlay = $("<div class=\"hanulse-overlay\">").css({
			"display": "flex",
			"flex-direction": "column",
			"justify-content": "center",
			"align-items": "center",
			"position": "absolute",
			"left": "0px",
			"top": "0px",
			"width": "100%",
			"height": "100%",
			"background-color": "rgba(0, 0, 0, 0.5)",
			"z-index": "100001"
		});
		overlay.data("onFinished", onFinished);
		overlay.append(element);
		overlay.hide();

		overlay.on("click", function(event) {
			if (overlay.is(event.target)) {
				_this.hideOverlay();
			}
		});

		$(document).on("keyup", function(event) {
			if (event.which == 27) {
				_this.hideOverlay();
			}
		});

		overlay.appendTo(document.body).fadeIn();
	}

	getDialogBox() {
		return $("<div class='scrollbox'>").css({
			"position": "relative",
			"background-color": "rgba(0, 0, 60, 0.6)",
			"border": "1px solid rgba(255, 255, 255, 0.8)",
			"border-radius": "6px",
			"box-shadow": "0px 0px 5px 0px rgba(255, 255, 255, 0.4)",
			"margin": "0px",
			"padding": "10px 10px",
			"pointer-events": "none",
			"max-width": "100%",
			"max-height": "100%",
			"overflow": "auto"
		});
	}

	getArticleItem(article) {
		var _this = this;

		var articleItem = $("<a>").css({
			"display": "flex",
			"position": "relative",
			"border-radius": "4px",
			"color": "white",
			"margin": "2px 4px",
			"padding": "2px 8px",
			"font-size": "13px",
			"line-height": "24px",
			"word-break": "keep-all",
			"text-overflow": "ellipsis",
			"overflow": "hidden",
			"text-decoration": "none",
			"pointer-events": "all",
			"cursor": "pointer",
			"user-select": "none"
		});

		articleItem.one("click", function(event) {
			_this.hideOverlay();
		});

		$("<span>").css({
			"width": "40px",
			"margin-right": "10px",
		}).text(article.no).appendTo(articleItem);
		$("<span>").css({
			"text-overflow": "ellipsis",
			"overflow": "hidden",
			"white-space": "nowrap",
			"width": "100%"
		}).text(article.title).appendTo(articleItem);
		$("<span>").css({
			"width": "100px",
			"text-align": "center",
			"margin-left": "10px",
			"text-overflow": "ellipsis",
			"overflow": "hidden",
			"white-space": "nowrap",
		}).text("작성자").appendTo(articleItem);
		$("<span>").css({
			"width": "100px",
			"text-align": "right",
			"margin-left": "10px",
			// "text-overflow": "ellipsis",
			// "overflow": "hidden",
			"white-space": "nowrap",
		}).text(article.createdAt).appendTo(articleItem);

		return articleItem;
	}
}