class HanulseActionFactory {
	menuAction = null;
	messageAction = null;

	constructor() {

	}

	get(actionName) {
		switch (actionName) {
			case "link": return this.linkAction || (this.linkAction = new HanulseLinkAction());
			case "menu": return this.menuAction || (this.menuAction = new HanulseMenuAction());
			case "message": return this.messageAction || (this.messageAction = new HanulseMessageAction());
		}
		return null;
	}
}