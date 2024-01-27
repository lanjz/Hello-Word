chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: "start",
    title: "开始接单",
    contexts: ["all"]
  });

  chrome.contextMenus.create({
    id: "stop",
    title: "结束接单",
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (tab.id) {
    let message = info.menuItemId === "start" ? "beginWork" : "stopWork";
    chrome.tabs.sendMessage(tab.id, { action: message });
  }
});
