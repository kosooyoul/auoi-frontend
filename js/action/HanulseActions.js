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

	_actWriter(data, onActionFinishedCallback) {
		if (HanulseAuthorizationManager.hasAuthorization()) {
			const writerView = new HanulseWritterView();
			writerView.setTags(data.tags && data.tags.trim().split(/[,\s#]/g).map(tag => tag.trim()).filter(tag => !!tag));
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

	_actPwa(_data, onActionFinishedCallback) {
		const deferredPrompt = window["deferredPrompt"];
		if (deferredPrompt == null) {
			if (navigator.serviceWorker) {
				const messageView = new HanulseMessageView();
				messageView.setMessage("앱을 이미 설치한 것 같아요!");
				messageView.setOnHideCallback(onActionFinishedCallback);
				messageView.show();
			} else {
				const messageView = new HanulseMessageView();
				messageView.setMessage("설치할 수 있는 앱이 없어요.");
				messageView.setOnHideCallback(onActionFinishedCallback);
				messageView.show();
			}
		} else {
			const messageView = new HanulseMessageView();
			messageView.setMessage("앱을 바로 설치할 수 있어요!\n프로그레시브 웹 앱이거든요~~\n브라우저가 앱 설치를 도와줄 거예요!");
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