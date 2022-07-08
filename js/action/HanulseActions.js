class HanulseActions {
	constructor() {

	}

	act(type, data, onActionFinishedCallback) {
		switch (type) {
			case "articles": return this._actArticles(data, onActionFinishedCallback);
			case "link": return this._actLink(data, onActionFinishedCallback);
			case "menu": return this._actMenu(data, onActionFinishedCallback);
			case "message": return this._actMessage(data, onActionFinishedCallback);
			case "writer": return this._actWriter(data, onActionFinishedCallback);
		}
	}
	
	_actArticles(data, onActionFinishedCallback) {
		const articleView = new HanulseArticleView();
		articleView.setAuthorId(data.author);
		articleView.setTag(data.tag);
		articleView.setTitle(data.title);
		articleView.setOnHideCallback(onActionFinishedCallback);
		articleView.show();
		articleView.load();
	}

	_actLink(data, onActionFinishedCallback) {
		location.assign(data.link);
		if (onActionFinishedCallback) {
			onActionFinishedCallback();
		}
	}

	_actMenu(data, onActionFinishedCallback) {
		const menuView = new HanulseMenuView();
		data.menu.forEach(menuItem => menuView.addMenuItem(menuItem));
		menuView.setOnHideCallback(onActionFinishedCallback);
		menuView.show();
	}

	_actMessage(data, onActionFinishedCallback) {
		const messageView = new HanulseMessageView();
		messageView.setMessage(data.message);
		messageView.setOnHideCallback(onActionFinishedCallback);
		messageView.show();
	}

	_actWriter(data, onActionFinishedCallback) {
		if (HanulseAuthorizationManager.hasAuthorization()) {
			const writerView = new HanulseWritterView();
			writerView.setTitle(data.title);
			writerView.setOnHideCallback(onActionFinishedCallback);
			writerView.show();
		} else {
			const loginView = new HanulseLoginView();
			loginView.setOnHideCallback(() => {
				if (HanulseAuthorizationManager.hasAuthorization()) {
					this._actWriter(data, onActionFinishedCallback);
				} else {
					if (onActionFinishedCallback) {
						onActionFinishedCallback();
					}
				}
			});
			loginView.show();
		}
	}
}