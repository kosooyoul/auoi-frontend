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

	templateArticleList = null;
	templateArticleListItem = null
	templateArticleListPaginationItem = null

	constructor() {
		this.initialize();
	}

	initialize() {
		this.templateArticleList = HanulseArticlesAction.loadTemplate("./template/article-list.html");
		this.templateArticleListItem = HanulseArticlesAction.loadTemplate("./template/article-list-item.html");
		this.templateArticleListPaginationItem = HanulseArticlesAction.loadTemplate("./template/article-list-pagination-item.html");
	}

	static loadTemplate(url) {
		const result = $.ajax({
			"url": url,
			"async": false
		});
		return result && result.responseText;
	}

	act(data, onFinished) {
		const articleList = $($.parseHTML(this.templateArticleList));
		articleList.find("._title").text(data.title || "제목 없음");

		const articleListItems = articleList.find("._list")
		HanulseArticlesAction.sampleArticles.forEach(article => {
			const articleListItem = $($.parseHTML(this.templateArticleListItem));
			
			articleListItem.one("click", () => this.hideOverlay());
			articleListItem.find("._no").text(article.no);
			articleListItem.find("._title").text(article.title);
			articleListItem.find("._author").text(article.author);
			articleListItem.find("._created-at").text(article.createdAt);

			articleListItems.append(articleListItem);
		});

		this.showOverlay($(articleList), onFinished);
	}

	hideOverlay() {
		var overlay = $(".hanulse-overlay");
		var onFinished = overlay.data("onFinished");
		if (onFinished) {
			onFinished();
		}
		overlay.css({"pointer-events": "none"}).fadeOut(function() {
			overlay.remove();
		});
	}

	showOverlay(element, onFinished) {
		var _this = this;

		var overlay = $("<div class=\"hanulse-overlay _dismiss\">").css({
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
			if ($(event.target).is("._dismiss")) {
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
}
