class HanulseActions {
	constructor() {

	}

	act(type, data, onActionFinishedCallback) {
		switch (type) {
			case "articles": return this._actArticles(data, onActionFinishedCallback);
			case "link": return this._actLink(data, onActionFinishedCallback);
			case "menu": return this._actMenu(data, onActionFinishedCallback);
			case "message": return this._actMessage(data, onActionFinishedCallback);
			case "selection": return this._actSelection(data, onActionFinishedCallback);
			case "table": return this._actTable(data, onActionFinishedCallback);
			case "cards": return this._actCards(data, onActionFinishedCallback);
			case "gallery": return this._actGallery(data, onActionFinishedCallback);
			case "calendar": return this._actCalendar(data, onActionFinishedCallback);
			case "guestbook": return this._actGuestbook(data, onActionFinishedCallback);
			case "article-writer": return this._actArticleWriter(data, onActionFinishedCallback);
			case "pwa": return this._actPwa(data, onActionFinishedCallback);
		}
	}
	
	_actArticles(data, onActionFinishedCallback) {
		const articleView = new HanulseArticleView();
		articleView.setTitle(data.title);
		articleView.load({
			"tags": data.tags && data.tags.trim().split(/[,\s#]/g).map(tag => tag.trim()).filter(tag => !!tag),
			"owner": data.owner,
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
		menuView.load(() => {
			data.menu.forEach(menuItem => (menuItem.visible !== false) && menuView.addMenuItem(menuItem));

			const overlayView = new HanulseOverlayView();
			overlayView.setContentView(menuView);
			overlayView.setOnHideCallback(onActionFinishedCallback);
			overlayView.show();
		});
	}

	_actMessage(data, onActionFinishedCallback) {
		const messageView = new HanulseMessageView();
		messageView.setMessage(data.message);

		const overlayView = new HanulseOverlayView();
		overlayView.setContentView(messageView);
		overlayView.setOnHideCallback(onActionFinishedCallback);
		overlayView.show();
	}

	_actSelection(data, onActionFinishedCallback) {
		const selectionView = new HanulseSelectionView();
		selectionView.setMessage(data.message);
		selectionView.setOptions(data.options);

		const overlayView = new HanulseOverlayView();
		overlayView.setContentView(selectionView);
		overlayView.setOnHideCallback(onActionFinishedCallback);
		overlayView.show();

		selectionView.setOnSelectOptionCallback((option) => {
			const action = option.action;
			if (action) {
				overlayView.setOnHideCallback(null);
				this.act(action.type, action, onActionFinishedCallback);
			}
			overlayView.hide();
		});
	}

	_actTable(data, onActionFinishedCallback) {
		const tableView = new HanulseTableView();
		tableView.setTitle(data["title"]);
		tableView.setColsOptions(data["cols-options"]);
		tableView.setTable(data["table"]);

		const overlayView = new HanulseOverlayView();
		overlayView.setContentView(tableView);
		overlayView.setOnHideCallback(onActionFinishedCallback);
		overlayView.show();
	}

	_actCards(data, onActionFinishedCallback) {
		const cardsView = new HanulseCardsView();
		cardsView.setTitle(data["title"]);
		cardsView.setCards(data["cards"]);

		const overlayView = new HanulseOverlayView();
		overlayView.setContentView(cardsView);
		overlayView.setOnHideCallback(onActionFinishedCallback);
		overlayView.show();
	}

	_actGallery(data, onActionFinishedCallback) {
		const galleryView = new HanulseGalleryView();
		galleryView.setTitle(data["title"]);

		const overlayView = new HanulseOverlayView();
		overlayView.setContentView(galleryView);
		overlayView.setOnHideCallback(onActionFinishedCallback);
		overlayView.show();
	}

	_actCalendar(data, onActionFinishedCallback) {
		const calendarView = new HanulseCalendarView();
		calendarView.setTitle(data["title"]);
		calendarView.setCalendar(data["year"], data["month"]);

		const overlayView = new HanulseOverlayView();
		overlayView.setContentView(calendarView);
		overlayView.setOnHideCallback(onActionFinishedCallback);
		overlayView.show();
	}

	_actGuestbook(data, onActionFinishedCallback) {
		const guestbookView = new HanulseGuestbookView();
		guestbookView.load(() => {
			guestbookView.setTitle(data.title);
			guestbookView.setFilter({
				"owner": data.owner
			});

			const overlayView = new HanulseOverlayView();
			overlayView.setContentView(guestbookView);
			overlayView.setOnHideCallback(onActionFinishedCallback);
			overlayView.show();
		});
	}

	_actArticleWriter(data, onActionFinishedCallback) {
		if (HanulseAuthorizationManager.hasAuthorization()) {
			const articleWriterView = new HanulseArticleWriterView();
			articleWriterView.setTags(data.tags == null? null: data.tags.trim().split(/[,\s#]/g).map(tag => tag.trim()).filter(tag => !!tag));
			articleWriterView.setTitle(data.title);
			articleWriterView.setOwner(data.owner);

			const overlayView = new HanulseOverlayView();
			overlayView.setContentView(articleWriterView);
			overlayView.setOnHideCallback(onActionFinishedCallback);
			overlayView.show();

			articleWriterView.setOnSaveCallback(() => {
				overlayView.hide();
			});
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
			return;
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