class HanulsePwa {
	static isInstalled() {
		return window["deferredPrompt"] == null && navigator.serviceWorker;
	}

	static isNotSupported() {
		return window["deferredPrompt"] == null && navigator.serviceWorker == null;
	}

	static askInstall() {
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
	}
}