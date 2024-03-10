class HanulseActions {
	#variables = {};

	run(actions, onActionFinishedCallback, index = 0) {
		var action = actions[index];
		if (action) {
			return this.#run(action.type, action, () => {
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

	#run(type, data, onActionFinishedCallback) {
		switch (type) {
			case "articles": return this.#runArticles(data, onActionFinishedCallback);
			case "link": return this.#runLink(data, onActionFinishedCallback);
			case "menu": return this.#runMenu(data, onActionFinishedCallback);
			case "message": return this.#runMessage(data, onActionFinishedCallback);
			case "selection": return this.#runSelection(data, onActionFinishedCallback);
			case "cards": return this.#runCards(data, onActionFinishedCallback);
			case "gallery": return this.#runGallery(data, onActionFinishedCallback);
			case "calendar": return this.#runCalendar(data, onActionFinishedCallback);
			case "guestbook": return this.#runGuestbook(data, onActionFinishedCallback);
			case "article-writer": return this.#runArticleWriter(data, onActionFinishedCallback);
			case "pwa": return this.#runPwa(data, onActionFinishedCallback);
			case "variable": return this.#runVariable(data, onActionFinishedCallback);
			case "save": return this.#runSave(data, onActionFinishedCallback);
			case "load": return this.#runLoad(data, onActionFinishedCallback);
			case "if": return this.#runIf(data, onActionFinishedCallback);
			case "wait": return this.#runWait(data, onActionFinishedCallback);
			case "function": return this.#runFunction(data, onActionFinishedCallback);
		}
	}

	#format(format) {
		const keys = (format.match(/(\$\{[a-zA-Z0-9]{3,7}\})/g) || []);
		return keys.reduce((format, key) => {
			var variable = key.slice(2,-1);
			return format.replace(key, this.#variables[variable]);
		}, format)
	}

	#showWithOverlay(view, onActionFinishedCallback) {
		const overlayView = new HanulseOverlayView();
		overlayView.setContentView(view);
		overlayView.setOnHideCallback(onActionFinishedCallback);
		overlayView.show();
		return overlayView;
	}
	
	async #runArticles(data, onActionFinishedCallback) {
		const articleView = new HanulseArticleView();

		await articleView.load();

		articleView.setTitle(data.title);
		articleView.loadList({
			"tags": data.tags && data.tags.trim().split(/[,\s#]/g).map(tag => tag.trim()).filter(tag => !!tag),
			"owner": data.owner,
			"author": data.author
		});

		this.#showWithOverlay(articleView, onActionFinishedCallback);
	}

	async #runLink(data, onActionFinishedCallback) {
		location.assign(data.link);
		onActionFinishedCallback?.();
	}

	async #runMenu(data, onActionFinishedCallback) {
		const menuView = await new HanulseMenuView({
			"items": data["menu"],
		}).build();

		this.#showWithOverlay(menuView, onActionFinishedCallback);
	}

	async #runMessage(data, onActionFinishedCallback) {
		const messageView = await new HanulseMessageView({
			"message": this.#format(data["message"]),
		}).build();

		this.#showWithOverlay(messageView, onActionFinishedCallback);
	}

	async #runSelection(data, onActionFinishedCallback) {
		const selectionView = await new HanulseSelectionView({
			"message": this.#format(data["message"]),
			"options": data["options"].map(option => {
				return {
					... option,
					"title": this.#format(option.title),
				};
			}),
			"onSelectedListener": (option) => {
				const actions = option.actions || [option.action];
				if (actions) {
					overlayView.setOnHideCallback(null);
					this.run(actions, onActionFinishedCallback);
				}
				overlayView.hide();
			},
		}).build();

		const overlayView = this.#showWithOverlay(selectionView, onActionFinishedCallback);
	}

	async #runCards(data, onActionFinishedCallback) {
		const cardsView = await new HanulseCardsView({
			"title": data["title"],
			"cards": data["cards"],
		}).build();

		this.#showWithOverlay(cardsView, onActionFinishedCallback);
	}

	#runGallery(data, onActionFinishedCallback) {
		const galleryView = new HanulseGalleryView();
		galleryView.setTitle(data["title"]);

		this.#showWithOverlay(galleryView, onActionFinishedCallback);
	}

	async #runCalendar(data, onActionFinishedCallback) {
		const calendarView = await new HanulseCalendarView({
			"title": data["title"],
			"year": data["year"],
			"month": data["month"],
		}).build();

		this.#showWithOverlay(calendarView, onActionFinishedCallback);
	}

	async #runGuestbook(data, onActionFinishedCallback) {
		const guestbookView = new HanulseGuestbookView();

		await guestbookView.load();
		guestbookView.setTitle(data.title);
		guestbookView.setFilter({
			"owner": data.owner
		});

		this.#showWithOverlay(guestbookView, onActionFinishedCallback);
	}

	async #runArticleWriter(data, onActionFinishedCallback) {
		if (HanulseAuthorizationManager.hasAuthorization()) {
			const articleWriterView = await new HanulseArticleWriterView().build();

			articleWriterView.setTags(data.tags == null? null: data.tags.trim().split(/[,\s#]/g).map(tag => tag.trim()).filter(tag => !!tag));
			articleWriterView.setTitle(data.title);
			articleWriterView.setOwner(data.owner);

			const overlayView = this.#showWithOverlay(articleWriterView, onActionFinishedCallback);

			articleWriterView.setOnSaveCallback(() => {
				overlayView.hide();
			});
		} else {
			const loginView = new HanulseLoginView();
			loginView.setOnHideCallback(() => {
				if (HanulseAuthorizationManager.hasAuthorization()) {
					this.#runArticleWriter(data, onActionFinishedCallback);
				} else {
					if (onActionFinishedCallback) {
						onActionFinishedCallback();
					}
				}
			});
			loginView.show();
		}
	}

	async #runVariable(data, onActionFinishedCallback) {
		var name = data.name;
		var op = data.op || 'set'; // 'add' | 'mod' | 'inv' | 'set'
		var value = data.value ?? this.#variables[data.variable];

		if (op == 'add') {
			this.#variables[name] = (Number(this.#variables[name]) || 0) + value;
		} else if (op == 'mod') {
			this.#variables[name] = (Number(this.#variables[name]) || 0) % value;
		} else if (op == 'inv') {
			this.#variables[name] = -Number(this.#variables[name]) || 0;
		} else if (op == 'set') {
			this.#variables[name] = value;
		}

		onActionFinishedCallback();
	}

	async #runSave(data, onActionFinishedCallback) {
		var variables = data.variables;
		var storage = data.storage;
		var namespace = data.namespace;

		if (storage == 'local') {
			if (namespace) {
				variables.forEach((variable) => {
					window.localStorage.setItem('v.' + namespace + '.' + variable, JSON.stringify(this.#variables[variable]));
				});
			} else {
				variables.forEach((variable) => {
					window.localStorage.setItem('v.' + variable, JSON.stringify(this.#variables[variable]));
				});
			}
		} else if (storage == 'session') {
			if (namespace) {
				variables.forEach((variable) => {
					window.sessionStorage.setItem('v.' + namespace + '.' + variable, JSON.stringify(this.#variables[variable]));
				});
			} else {
				variables.forEach((variable) => {
					window.sessionStorage.setItem('v.' + variable, JSON.stringify(this.#variables[variable]));
				});
			}
		}

		onActionFinishedCallback();
	}

	async #runLoad(data, onActionFinishedCallback) {
		var variables = data.variables;
		var storage = data.storage;
		var namespace = data.namespace;

		if (storage == 'local') {
			if (namespace) {
				variables.forEach((variable) => {
					try {
						this.#variables[variable] = JSON.parse(window.localStorage.getItem('v.' + namespace + '.' + variable));
					} catch(e) {}
				});
			} else {
				variables.forEach((variable) => {
					try {
						this.#variables[variable] = JSON.parse(window.localStorage.getItem('v.' + variable));
					} catch(e) {}
				});
			}
		} else if (storage == 'session') {
			if (namespace) {
				variables.forEach((variable) => {
					try {
						this.#variables[variable] = JSON.parse(window.sessionStorage.getItem('v.' + namespace + '.' + variable));
					} catch(e) {}
				});
			} else {
				variables.forEach((variable) => {
					try {
						this.#variables[variable] = JSON.parse(window.sessionStorage.getItem('v.' + variable));
					} catch(e) {}
				});
			}
		}

		onActionFinishedCallback();
	}

	async #runIf(data, onActionFinishedCallback) {
		var name = data.name;
		var op = data.op || 'eq'; // 'eq' | 'neq' | 'gte' | 'gt' | 'lte' | 'lt'
		var value = data.value ?? this.#variables[data.variable];

		var flag = false;
		if (op == 'eq') {
			flag = this.#variables[name] == value;
		} else if (op == 'neq') {
			flag = this.#variables[name] != value;
		} else if (op == 'gte') {
			flag = this.#variables[name] >= value;
		} else if (op == 'gt') {
			flag = this.#variables[name] > value;
		} else if (op == 'gte') {
			flag = this.#variables[name] <= value;
		} else if (op == 'gt') {
			flag = this.#variables[name] < value;
		} else if (op == 'exists') {
			flag = this.#variables[name] != null;
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

	async #runWait(data, onActionFinishedCallback) {
		setTimeout(onActionFinishedCallback, data.duration);
	}

	async #runPwa(_, onActionFinishedCallback) {
		if (HanulsePwa.isInstalled()) {
			return this.#runMessage({"message": "앱을 이미 설치한 것 같아요!"}, onActionFinishedCallback);
		}

		if (HanulsePwa.isNotSupported()) {
			return this.#runMessage({"message": "설치할 수 있는 앱이 없어요."}, onActionFinishedCallback);
		}

		await this.#runMessage({
			"message": [
				"앱을 바로 설치할 수 있어요!",
				"프로그레시브 웹 앱이거든요~~",
				"브라우저가 앱 설치를 도와줄 거예요!"
			].join("\n"),
		}, onActionFinishedCallback);

		setTimeout(() => {
			HanulsePwa.askInstall();
		}, 400);
	}

	async #runFunction(data, onActionFinishedCallback) {
		// TODO
		console.log(this.#variables);
		onActionFinishedCallback();
	}
}