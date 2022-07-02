class HanulseMenuAction {
	act(data, onFinishedCallback) {
		const menuView = new HanulseMenuView();
		data.menu.forEach(menuItem => menuView.addMenuItem(menuItem));
		menuView.setOnHideCallback(onFinishedCallback);
		menuView.show();
	}
}