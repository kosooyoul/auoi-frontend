class HanulseActionFactory {
	articlesAction = null;
	menuAction = null;
	messageAction = null;

	constructor() {

	}

	get(actionName) {
		switch (actionName) {
			case "articles": return this.articlesAction || (this.articlesAction = new HanulseArticlesAction());
			case "link": return this.linkAction || (this.linkAction = new HanulseLinkAction());
			case "menu": return this.menuAction || (this.menuAction = new HanulseMenuAction());
			case "message": return this.messageAction || (this.messageAction = new HanulseMessageAction());
		}
		return null;
	}
}