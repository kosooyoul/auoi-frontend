class HanulseActions {
	_variables = {};

	constructor() {

	}

	run(actions, onActionFinishedCallback, index = 0) {
		var action = actions[index];
		if (action) {
			return this._run(action.type, action, () => {
				var nextIndex = index + 1;
				if (nextIndex < actions.length) {
					return setTimeout(() => {
						this.run(actions, onActionFinishedCallback, nextIndex);
					}, 0);
				}
				onActionFinishedCallback && onActionFinishedCallback();
			});
		}
		onActionFinishedCallback && onActionFinishedCallback();
	}

	_run(type, data, onActionFinishedCallback) {
		switch (type) {
			case "articles": return this._runArticles(data, onActionFinishedCallback);
			case "link": return this._runLink(data, onActionFinishedCallback);
			case "menu": return this._runMenu(data, onActionFinishedCallback);
			case "message": return this._runMessage(data, onActionFinishedCallback);
			case "selection": return this._runSelection(data, onActionFinishedCallback);
			case "table": return this._runTable(data, onActionFinishedCallback);
			case "cards": return this._runCards(data, onActionFinishedCallback);
			case "gallery": return this._runGallery(data, onActionFinishedCallback);
			case "calendar": return this._runCalendar(data, onActionFinishedCallback);
			case "guestbook": return this._runGuestbook(data, onActionFinishedCallback);
			case "article-writer": return this._runArticleWriter(data, onActionFinishedCallback);
			case "pwa": return this._runPwa(data, onActionFinishedCallback);
			case "variable": return this._runVariable(data, onActionFinishedCallback);
			case "save": return this._runSave(data, onActionFinishedCallback);
			case "load": return this._runLoad(data, onActionFinishedCallback);
			case "if": return this._runIf(data, onActionFinishedCallback);
			case "wait": return this._runWait(data, onActionFinishedCallback);
			case "function": return this._runFunction(data, onActionFinishedCallback);
		}
	}
	
	_runArticles(data, onActionFinishedCallback) {
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

	_runLink(data, onActionFinishedCallback) {
		location.assign(data.link);
		if (onActionFinishedCallback) {
			onActionFinishedCallback();
		}
	}

	_runMenu(data, onActionFinishedCallback) {
		const menuView = new HanulseMenuView();
		menuView.load(() => {
			data.menu.forEach(menuItem => (menuItem.visible !== false) && menuView.addMenuItem(menuItem));

			const overlayView = new HanulseOverlayView();
			overlayView.setContentView(menuView);
			overlayView.setOnHideCallback(onActionFinishedCallback);
			overlayView.show();
		});
	}

	_runMessage(data, onActionFinishedCallback) {
		const messageView = new HanulseMessageView();
		messageView.load(() => {
			messageView.setMessage(data.message);

			const overlayView = new HanulseOverlayView();
			overlayView.setContentView(messageView);
			overlayView.setOnHideCallback(onActionFinishedCallback);
			overlayView.show();
		});
	}

	_runSelection(data, onActionFinishedCallback) {
		const selectionView = new HanulseSelectionView();
		selectionView.load(() => {
			selectionView.setMessage(data.message);
			selectionView.setOptions(data.options);

			const overlayView = new HanulseOverlayView();
			overlayView.setContentView(selectionView);
			overlayView.setOnHideCallback(onActionFinishedCallback);
			overlayView.show();

			selectionView.setOnSelectOptionCallback((option) => {
				const actions = option.actions || [option.action];
				if (actions) {
					overlayView.setOnHideCallback(null);
					this.run(actions, onActionFinishedCallback);
				}
				overlayView.hide();
			});
		});
	}

	_runTable(data, onActionFinishedCallback) {
		const tableView = new HanulseTableView();
		tableView.load(() => {
			tableView.setTitle(data["title"]);
			tableView.setColsOptions(data["cols-options"]);
			tableView.setTable(data["table"]);

			const overlayView = new HanulseOverlayView();
			overlayView.setContentView(tableView);
			overlayView.setOnHideCallback(onActionFinishedCallback);
			overlayView.show();
		});
	}

	_runCards(data, onActionFinishedCallback) {
		const cardsView = new HanulseCardsView();
		cardsView.load(() => {
			cardsView.setTitle(data["title"]);
			cardsView.setCards(data["cards"]);

			const overlayView = new HanulseOverlayView();
			overlayView.setContentView(cardsView);
			overlayView.setOnHideCallback(onActionFinishedCallback);
			overlayView.show();
		});
	}

	_runGallery(data, onActionFinishedCallback) {
		const galleryView = new HanulseGalleryView();
		galleryView.setTitle(data["title"]);

		const overlayView = new HanulseOverlayView();
		overlayView.setContentView(galleryView);
		overlayView.setOnHideCallback(onActionFinishedCallback);
		overlayView.show();
	}

	_runCalendar(data, onActionFinishedCallback) {
		const calendarView = new HanulseCalendarView();
		calendarView.setTitle(data["title"]);
		calendarView.setCalendar(data["year"], data["month"]);

		const overlayView = new HanulseOverlayView();
		overlayView.setContentView(calendarView);
		overlayView.setOnHideCallback(onActionFinishedCallback);
		overlayView.show();
	}

	_runGuestbook(data, onActionFinishedCallback) {
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

	_runArticleWriter(data, onActionFinishedCallback) {
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
					this._runArticleWriter(data, onActionFinishedCallback);
				} else {
					if (onActionFinishedCallback) {
						onActionFinishedCallback();
					}
				}
			});
			loginView.show();
		}
	}

	_runVariable(data, onActionFinishedCallback) {
		var name = data.name;
		var op = data.op || 'set'; // 'add' | 'mod' | 'inv' | 'set'
		var value = data.value ?? this._variables[data.variable];

		if (op == 'add') {
			this._variables[name] = (Number(this._variables[name]) || 0) + value;
		} else if (op == 'mod') {
			this._variables[name] = (Number(this._variables[name]) || 0) % value;
		} else if (op == 'inv') {
			this._variables[name] = -Number(this._variables[name]) || 0;
		} else if (op == 'set') {
			this._variables[name] = value;
		}

		onActionFinishedCallback();
	}

	_runSave(data, onActionFinishedCallback) {
		var variables = data.variables;
		var storage = data.storage;
		var namespace = data.namespace;

		if (storage == 'local') {
			if (namespace) {
				variables.forEach((variable) => {
					window.localStorage.setItem('v.' + namespace + '.' + variable, JSON.stringify(this._variables[variable]));
				});
			} else {
				variables.forEach((variable) => {
					window.localStorage.setItem('v.' + variable, JSON.stringify(this._variables[variable]));
				});
			}
		} else if (storage == 'session') {
			if (namespace) {
				variables.forEach((variable) => {
					window.sessionStorage.setItem('v.' + namespace + '.' + variable, JSON.stringify(this._variables[variable]));
				});
			} else {
				variables.forEach((variable) => {
					window.sessionStorage.setItem('v.' + variable, JSON.stringify(this._variables[variable]));
				});
			}
		}

		onActionFinishedCallback();
	}

	_runLoad(data, onActionFinishedCallback) {
		var variables = data.variables;
		var storage = data.storage;
		var namespace = data.namespace;

		if (storage == 'local') {
			if (namespace) {
				variables.forEach((variable) => {
					try {
						this._variables[variable] = JSON.parse(window.localStorage.getItem('v.' + namespace + '.' + variable));
					} catch(e) {}
				});
			} else {
				variables.forEach((variable) => {
					try {
						this._variables[variable] = JSON.parse(window.localStorage.getItem('v.' + variable));
					} catch(e) {}
				});
			}
		} else if (storage == 'session') {
			if (namespace) {
				variables.forEach((variable) => {
					try {
						this._variables[variable] = JSON.parse(window.sessionStorage.getItem('v.' + namespace + '.' + variable));
					} catch(e) {}
				});
			} else {
				variables.forEach((variable) => {
					try {
						this._variables[variable] = JSON.parse(window.sessionStorage.getItem('v.' + variable));
					} catch(e) {}
				});
			}
		}

		onActionFinishedCallback();
	}

	_runIf(data, onActionFinishedCallback) {
		var name = data.name;
		var op = data.op || 'eq'; // 'eq' | 'neq' | 'gte' | 'gt' | 'lte' | 'lt'
		var value = data.value ?? this._variables[data.variable];

		var flag = false;
		if (op == 'eq') {
			flag = this._variables[name] == value;
		} else if (op == 'neq') {
			flag = this._variables[name] != value;
		} else if (op == 'gte') {
			flag = this._variables[name] >= value;
		} else if (op == 'gt') {
			flag = this._variables[name] > value;
		} else if (op == 'gte') {
			flag = this._variables[name] <= value;
		} else if (op == 'gt') {
			flag = this._variables[name] < value;
		} else if (op == 'exists') {
			flag = this._variables[name] != null;
		}

		if (flag) {
			if (data.then) {
				this.run(data.then, onActionFinishedCallback);
			} else {
				onActionFinishedCallback();
			}
		} else {
			if (data.else) {
				this.run(data.else, onActionFinishedCallback);
			} else {
				onActionFinishedCallback();
			}
		}
	}

	_runWait(data, onActionFinishedCallback) {
		setTimeout(onActionFinishedCallback, data.duration);
	}

	_runPwa(_data, onActionFinishedCallback) {
		if (window["deferredPrompt"] == null) {
			if (navigator.serviceWorker) {
				this._runMessage({"message": "앱을 이미 설치한 것 같아요!"}, onActionFinishedCallback);
			} else {
				this._runMessage({"message": "설치할 수 있는 앱이 없어요."}, onActionFinishedCallback);
			}
			return;
		}

		this._runMessage({
			"message": [
				"앱을 바로 설치할 수 있어요!",
				"프로그레시브 웹 앱이거든요~~",
				"브라우저가 앱 설치를 도와줄 거예요!"
			].join("\n")
		}, onActionFinishedCallback);

		this._runPwaInstall();
	}

	_runPwaInstall() {
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

	_runFunction(data, onActionFinishedCallback) {
		// TODO
		console.log(this._variables);
		onActionFinishedCallback();
	}
}