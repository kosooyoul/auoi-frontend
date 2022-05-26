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
		{"no": 11, "title": "해가 떨어지고 달이 떠오르면", "createdAt": "2022-03-01"},
		{"no": 12, "title": "달콤한 별빛이 민들레 차에 퐁당", "createdAt": "2022-03-02"},
		{"no": 13, "title": "아침엔 시리얼 먹고 힘을 내요", "createdAt": "2022-03-04"},
		{"no": 14, "title": "항상 맛있는 것 먹고 싶지만", "createdAt": "2022-03-07"},
		{"no": 15, "title": "해가 떨어지고 달이 떠오르면", "createdAt": "2022-03-09"},
		{"no": 16, "title": "달콤한 별빛이 민들레 차에 퐁당", "createdAt": "2022-03-13"},
		{"no": 17, "title": "아침엔 시리얼 먹고 힘을 내요", "createdAt": "2022-03-17"},
		{"no": 18, "title": "항상 맛있는 것 먹고 싶지만", "createdAt": "2022-03-22"},
		{"no": 19, "title": "건강하게 매일 유산균과 콜라겐 흡수!", "createdAt": "2022-03-27"},
		{"no": 20, "title": "살기 위해선 밥을 먹어야지", "createdAt": "2022-04-01"},
	].sort((a, b) => b.no - a.no);

	act(_data) {
		var dialogBox = this.getDialogBox();

		for (var article of HanulseArticlesAction.sampleArticles) {
			this.getArticleItem(article).appendTo(dialogBox);
		}

		this.showOverlay(dialogBox);
	}

	hideOverlay() {
		var overlay = $(".hanulse-overlay");
		overlay.fadeOut(function() {
			overlay.remove();
		});
	}

	showOverlay(element) {
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
			"background-color": "rgba(0, 0, 0, 0.5)"
		});
		overlay.append(element);
		overlay.hide();

		overlay.one("click", function(event) {
			if (overlay.is(event.target)) {
				_this.hideOverlay();
			}
		});

		$(document).one("keyup", function(event) {
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
			"pointer-events": "scroll",
			"max-height": "300px",
			"overflow": "auto",
		});
	}

	getArticleItem(article) {
		var _this = this;

		var articleItem = $("<a>").css({
			"display": "block",
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
			"display": "inline-block",
			"width": "20px",
			"float": "left",
			"margin-right": "20px"
		}).text(article.no).appendTo(articleItem);
		$("<span>").text(article.title).appendTo(articleItem);
		$("<span>").css({
			"float": "right",
			"margin-left": "20px"
		}).text(article.createdAt).appendTo(articleItem);

		return articleItem;
	}
}