let selectedInput = null;

document.addEventListener("focusin", function (event) {
  if (
    event.target.tagName.toLowerCase() === "textarea" ||
    event.target.type === "text"
  ) {
    selectedInput = event.target;
    let maxLength = selectedInput.getAttribute("maxlength") || "No limit";
    console.log(maxLength);

    // Storing input info and maxLength in chrome storage
    chrome.storage.local.set(
      {
        selectedInputInfo: {
          inputId: selectedInput.id || null,
          inputName: selectedInput.name || null,
          inputIndex: Array.from(
            document.querySelectorAll('textarea, input[type="text"]')
          ).indexOf(selectedInput),
          maxLength: maxLength, // Store maxLength in storage
        },
        inputFieldSelected: true, // Store state for popup.js
      },
      () => {
        console.log(
          "Selected input field info and state stored in chrome.storage:",
          selectedInput
        );
      }
    );

    // Send a message to popup.js to update the button visibility
    chrome.runtime.sendMessage(
      {
        type: "inputFieldSelected",
        inputFieldId: selectedInput.id || null,
      },
      function (response) {
        if (chrome.runtime.lastError) {
          console.error("Error sending message to popup script:", chrome.runtime.lastError);
        } else {
          console.log("Message sent to popup script to show button, awaiting response...");
        }
      }
    );
  }
});

// Clear selection when the input loses focus
document.addEventListener("focusout", function (event) {
  if (
    event.target.tagName.toLowerCase() === "textarea" ||
    event.target.type === "text"
  ) {
    // Clear the input field selected state from chrome.storage
    chrome.storage.local.set({ inputFieldSelected: false }, () => {
      console.log("Input field deselected, state cleared.");
    });

    // Optionally send a message to the popup to hide the button
    chrome.runtime.sendMessage(
      { type: "inputFieldDeselected" },
      function (response) {
        if (chrome.runtime.lastError) {
          console.error("Error sending message to popup script:", chrome.runtime.lastError);
        } else {
          console.log("Message sent to popup script to hide button.");
        }
      }
    );
  }
});


// Listen for the message from the popup to populate the field
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in content script:", message);

  if (message.type === "populateField") {
    let { inputId, inputName, inputIndex, enhancedText } = message;

    let inputField;
    if (inputId) {
      // Find the input by its ID
      inputField = document.getElementById(inputId);
    } else if (inputName) {
      // Find the input by its name
      inputField = document.querySelector(`[name="${inputName}"]`);
    } else if (inputIndex !== undefined) {
      // Fallback: Use input index
      let inputs = document.querySelectorAll('textarea, input[type="text"]');
      inputField = inputs[inputIndex];
    }

    if (inputField) {
      inputField.value = enhancedText; // Populate the input field with the enhanced text
      console.log("Input field updated with enhanced text:", enhancedText);

      // After populating the input field, delete the stored data
      chrome.storage.local.remove(["selectedInputInfo", "selectedInputMaxLength"], () => {
        console.log("Input field data removed from chrome.storage");
      });

      sendResponse({ success: true }); // Send success response
    } else {
      console.error("Could not find the input field to populate.");
      sendResponse({ success: false, error: "Input field not found" });
    }
    return true; // Indicate asynchronous sendResponse
  }
});

