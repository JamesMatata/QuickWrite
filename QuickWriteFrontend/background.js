chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "updateFieldInfo") {
    // Store maxLength in local storage if received
    chrome.storage.local.set(
      { selectedInputMaxLength: request.maxLength },
      () => {
        console.log("MaxLength stored:", request.maxLength);
        sendResponse({ message: "MaxLength stored successfully" });
      }
    );

    return true; // Ensure the listener remains active until sendResponse is called
  }
});


let popupPort = null;

// Listen for the popup connecting
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "popup") {
    popupPort = port;

    // When the popup is closed, clear only specific keys from storage
    popupPort.onDisconnect.addListener(function () {
      // Remove only specific stored data (e.g., selectedInputInfo, inputFieldSelected)
      chrome.storage.local.remove(
        ["selectedInputInfo", "inputFieldSelected", "selectedInputMaxLength"],
        function () {
          if (chrome.runtime.lastError) {
            console.error(
              "Error removing specific data from chrome.storage.local:",
              chrome.runtime.lastError
            );
          } else {
            console.log(
              "Specific data removed from chrome.storage.local on popup close."
            );
          }
        }
      );
    });
  }
});

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install") {
    // First install detected, set a flag in chrome.storage.local
    chrome.storage.local.set({ firstInstall: true }, function () {
      console.log("First install detected. Flag set in storage.");
    });
  }
});
