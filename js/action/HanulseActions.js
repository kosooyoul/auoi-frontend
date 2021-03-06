class HanulseActions {
	constructor() {

	}

	act(type, data, onActionFinishedCallback) {
		switch (type) {
			case "articles": return this._actArticles(data, onActionFinishedCallback);
			case "link": return this._actLink(data, onActionFinishedCallback);
			case "menu": return this._actMenu(data, onActionFinishedCallback);
			case "message": return this._actMessage(data, onActionFinishedCallback);
			case "article-writer": return this._actArticleWriter(data, onActionFinishedCallback);
			case "pwa": return this._actPwa(data, onActionFinishedCallback);
		}
	}
	
	_actArticles(data, onActionFinishedCallback) {
		const articleView = new HanulseArticleView();
		articleView.setAuthorId(data.author);
		articleView.setTags(data.tags && data.tags.trim().split(/[,\s#]/g).map(tag => tag.trim()).filter(tag => !!tag));
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

	_actArticleWriter(data, onActionFinishedCallback) {
		if (HanulseAuthorizationManager.hasAuthorization()) {
			const articleWriterView = new HanulseArticleWriterView();
			articleWriterView.setTags(data.tags && data.tags.trim().split(/[,\s#]/g).map(tag => tag.trim()).filter(tag => !!tag));
			articleWriterView.setTitle(data.title);
			articleWriterView.setOnHideCallback(onActionFinishedCallback);
			articleWriterView.show();
		} else {
			const loginView = new HanulseLoginView();
			loginView.setOnHideCallback(() => {
				if (HanulseAuthorizationManager.hasAuthorization()) {
					this._actArticleWriter(data, onActionFinishedCallback);
				} else {
					if (onActionFinishedCallback) {
						onActionFinishedCallback();
					}
				}
			});
			loginView.show();
		}
	}

	_actPwa(_data, onActionFinishedCallback) {
		const deferredPrompt = window["deferredPrompt"];
		if (deferredPrompt == null) {
			if (navigator.serviceWorker) {
				const messageView = new HanulseMessageView();
				messageView.setMessage("?????? ?????? ????????? ??? ?????????!");
				messageView.setOnHideCallback(onActionFinishedCallback);
				messageView.show();
			} else {
				const messageView = new HanulseMessageView();
				messageView.setMessage("????????? ??? ?????? ?????? ?????????.");
				messageView.setOnHideCallback(onActionFinishedCallback);
				messageView.show();
			}
		} else {
			const messageView = new HanulseMessageView();
			messageView.setMessage("?????? ?????? ????????? ??? ?????????!\n?????????????????? ??? ???????????????~~\n??????????????? ??? ????????? ????????? ?????????!");
			messageView.setOnHideCallback(onActionFinishedCallback);
			messageView.show();

			setTimeout(() => {
				// The user has had a postive interaction with our app and Chrome
				// has tried to prompt previously, so let's show the prompt.
				deferredPrompt.prompt();
			
				// Follow what the user has done with the prompt.
				deferredPrompt.userChoice.then(function(choiceResult) {
					console.log(choiceResult.outcome);
			
					if(choiceResult.outcome == "dismissed") {
						console.log("User cancelled home screen install");
					} else {
						console.log("User added to home screen");
					}
			
					// We no longer need the prompt.  Clear it up.
					delete window["deferredPrompt"];
				});
			}, 500);
		}
	}
}