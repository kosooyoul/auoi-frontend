class HanulseLinkAction {
	act(data, onFinishedCallback) {
		location.assign(data.link);
		if (onFinishedCallback) {
			onFinishedCallback();
		}
	}
}