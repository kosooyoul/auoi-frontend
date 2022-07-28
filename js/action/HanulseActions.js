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
		articleView.setTitle(data.title);
		articleView.load({
			"tags": data.tags && data.tags.trim().split(/[,\s#]/g).map(tag => tag.trim()).filter(tag => !!tag),
			"author": data.author
		});

		const overlayView = new HanulseOverlayView();
		overlayView.setContentView(articleView);
		overlayView.setOnHideCallback(onActionFinishedCallback);
		overlayView.show();
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

		const overlayView = new HanulseOverlayView();
		overlayView.setContentView(menuView);
		overlayView.setOnHideCallback(onActionFinishedCallback);
		overlayView.show();
	}

	_actMessage(data, onActionFinishedCallback) {
		const messageView = new HanulseMessageView();
		messageView.setMessage(data.message);

		const overlayView = new HanulseOverlayView();
		overlayView.setContentView(messageView);
		overlayView.setOnHideCallback(onActionFinishedCallback);
		overlayView.show();
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
		if (window["deferredPrompt"] == null) {
			if (navigator.serviceWorker) {
				this._actMessage({"message": "앱을 이미 설치한 것 같아요!"}, onActionFinishedCallback);
			} else {
				this._actMessage({"message": "설치할 수 있는 앱이 없어요."}, onActionFinishedCallback);
			}
		}

		this._actMessage({
			"message": [
				"앱을 바로 설치할 수 있어요!",
				"프로그레시브 웹 앱이거든요~~",
				"브라우저가 앱 설치를 도와줄 거예요!"
			].join("\n")
		}, onActionFinishedCallback);

		this._actPwaInstall();
	}

	_actPwaInstall() {
		setTimeout(() => {
			const deferredPrompt = window["deferredPrompt"];

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