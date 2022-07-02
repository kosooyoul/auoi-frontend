class HanulseArticlesAction {
	act(data, onFinishedCallback) {
		const articleView = new HanulseArticleView();
		articleView.setTag(data.tag);
		articleView.setTitle(data.title);
		articleView.setOnHideCallback(onFinishedCallback);
		articleView.show();
		articleView.load();
	}
}
