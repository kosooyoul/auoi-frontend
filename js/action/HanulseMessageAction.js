class HanulseMessageAction {
	act(data, onFinishedCallback) {
		const messageView = new HanulseMessageView();
		messageView.setMessage(data.message);
		messageView.setOnHideCallback(onFinishedCallback);
		messageView.show();
	}
}