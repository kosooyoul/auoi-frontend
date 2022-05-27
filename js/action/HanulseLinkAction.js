class HanulseLinkAction {
	act(data, onFinished) {
		location.assign(data.link);
		if (onFinished) {
			onFinished();
		}
	}
}