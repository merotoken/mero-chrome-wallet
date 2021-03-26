chrome.browserAction.onClicked.addListener(function (activeTab) {
	var popupWindow = window.open(
		chrome.extension.getURL("popup/popup.html"),
		"Mero",
		"width=400, height=500"
	);
});
