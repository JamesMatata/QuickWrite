const startPage = document.getElementById("start_page");
const homePage = document.getElementById("home_page");
const settingPage = document.getElementById("setting_page");
const loginPage = document.getElementById("login_page");
const registerPage = document.getElementById("register_page");
const navLinks = document.getElementById("nav_links");
const logOutButton = document.getElementById("logout_button");
const notificationButton = document.getElementById("notifications_button");
const settingsButton = document.getElementById("settings_button");
const accountPage = document.getElementById("account_page");
const topupPage = document.getElementById("topup_page");
const notificationPage = document.getElementById("notifications_page")
const passwordResetPage = document.getElementById("password_reset_page");
const forgotPasswordButton = document.getElementById("forgot_password_link");

const recentTaskButton = document.getElementById("recent_task_button")

const logInButton = document.getElementById('login_button');

const loginForm = document.getElementById("login_form");
const registerForm = document.getElementById("register_form");
const passwordResetForm = document.getElementById("reset_password_form");


const accessToken = localStorage.getItem("accessToken");

const mpesaForm = document.getElementById("mpesa");
const paypalForm = document.getElementById("paypal");

var selectedTask = "";
var selectedTone = "";
var selectedLanguage = "";

const textToSpeechButton = document.getElementById("text_to_speech_button");

const modeSelectedText = document.getElementById('selected_task');
const selectTopUpMethod = document.getElementById("selected_topup_method")
const inputContainer = document.querySelector(".input_div");
const linkInput = document.getElementById("link-input");
const outputLabel = document.querySelector(".output_container_label");
const inputLabel = document.querySelector(".input_container_label");

const toneDropdown = document.querySelector(".tone-dropdown-btn").parentElement;
const languageOptions = document.getElementById("language-options-dropdown"); // Already correct
const outputTextarea = document.getElementById("output_textarea");
const inputTextarea = document.getElementById("input_textarea");

const copyTextButton = document.getElementById("copy_text_button");


const topup_methods = [
  {
    name: "M-Pesa",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M9.401 31.79S23.24 26.3 28.426 14.752c2.696 1.66 15.074 7.745 15.074 7.745c-3.527 6.361-22.68 16.042-39 7.191c4.979-1.66 10.096-7.537 10.096-7.537c1.521 2.558 3.758 4.458 3.758 4.458"/></svg>',
  },
  {
    name: "PayPal",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="0.85em" height="1em" viewBox="0 0 256 302"><path fill="#27346a" d="M217.168 23.507C203.234 7.625 178.046.816 145.823.816h-93.52A13.39 13.39 0 0 0 39.076 12.11L.136 259.077c-.774 4.87 2.997 9.28 7.933 9.28h57.736l14.5-91.971l-.45 2.88c1.033-6.501 6.593-11.296 13.177-11.296h27.436c53.898 0 96.101-21.892 108.429-85.221c.366-1.873.683-3.696.957-5.477q-2.334-1.236 0 0c3.671-23.407-.025-39.34-12.686-53.765"/><path fill="#27346a" d="M102.397 68.84a11.7 11.7 0 0 1 5.053-1.14h73.318c8.682 0 16.78.565 24.18 1.756a102 102 0 0 1 6.177 1.182a90 90 0 0 1 8.59 2.347c3.638 1.215 7.026 2.63 10.14 4.287c3.67-23.416-.026-39.34-12.687-53.765C203.226 7.625 178.046.816 145.823.816H52.295C45.71.816 40.108 5.61 39.076 12.11L.136 259.068c-.774 4.878 2.997 9.282 7.925 9.282h57.744L95.888 77.58a11.72 11.72 0 0 1 6.509-8.74"/><path fill="#2790c3" d="M228.897 82.749c-12.328 63.32-54.53 85.221-108.429 85.221H93.024c-6.584 0-12.145 4.795-13.168 11.296L61.817 293.621c-.674 4.262 2.622 8.124 6.934 8.124h48.67a11.71 11.71 0 0 0 11.563-9.88l.474-2.48l9.173-58.136l.591-3.213a11.71 11.71 0 0 1 11.562-9.88h7.284c47.147 0 84.064-19.154 94.852-74.55c4.503-23.15 2.173-42.478-9.739-56.054c-3.613-4.112-8.1-7.508-13.327-10.28c-.283 1.79-.59 3.604-.957 5.477"/><path fill="#1f264f" d="M216.952 72.128a90 90 0 0 0-5.818-1.49a110 110 0 0 0-6.177-1.174c-7.408-1.199-15.5-1.765-24.19-1.765h-73.309a11.6 11.6 0 0 0-5.053 1.149a11.68 11.68 0 0 0-6.51 8.74l-15.582 98.798l-.45 2.88c1.025-6.501 6.585-11.296 13.17-11.296h27.444c53.898 0 96.1-21.892 108.428-85.221c.367-1.873.675-3.688.958-5.477q-4.682-2.47-10.14-4.279a83 83 0 0 0-2.77-.865"/></svg>',
  },
];

const tones = ["Formal", "Casual", "Professional", "Friendly", "Serious"];
const languages = [
  "English",
  "Swahili",
  "French",
  "Spanish",
  "German",
  "Chinese",
  "Japanese",
];

const modeDropdownContent = document.getElementById("dropdown-content");
const topupDropdownContent = document.getElementById("topup_dropdown-content");
const toneDropdownContent = document.getElementById("tone-dropdown-content");
const summarizeOptionContent = document.getElementById(
  "summarize-option-input"
);
const languageOptionsContent = document.getElementById(
  "language-options-content"
);



const tasks = [
  {
    name: "Write Email",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><rect width="18.5" height="17" x="2.682" y="3.5" rx="4"/><path stroke-linecap="round" stroke-linejoin="round" d="m2.729 7.59l7.205 4.13a3.96 3.96 0 0 0 3.975 0l7.225-4.13"/></g></svg>',
  },
  {
    name: "Fill Form",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 10.75a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0M8.25 10a.75.75 0 1 0 0 1.5a.75.75 0 0 0 0-1.5m0 4a2.25 2.25 0 1 0 0 4.5a2.25 2.25 0 0 0 0-4.5m-.75 2.25a.75.75 0 1 1 1.5 0a.75.75 0 0 1-1.5 0m4.5-5.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75m.75 4.75a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5zM6 6.75A.75.75 0 0 1 6.75 6h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 6.75M6.25 3A3.25 3.25 0 0 0 3 6.25v11.5A3.25 3.25 0 0 0 6.25 21h11.5A3.25 3.25 0 0 0 21 17.75V6.25A3.25 3.25 0 0 0 17.75 3zM4.5 6.25c0-.966.784-1.75 1.75-1.75h11.5c.966 0 1.75.784 1.75 1.75v11.5a1.75 1.75 0 0 1-1.75 1.75H6.25a1.75 1.75 0 0 1-1.75-1.75z"/></svg>',
  },
  {
    name: "Write Review",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M5.616 20q-.667 0-1.141-.475T4 18.386V5.615q0-.666.475-1.14T5.615 4h12.77q.666 0 1.14.475T20 5.615v12.77q0 .666-.475 1.14t-1.14.475zm0-1h12.769q.269 0 .442-.173t.173-.442V7H5v11.385q0 .269.173.442t.443.173M12 16q-1.627 0-2.932-.834Q7.763 14.333 7.096 13q.667-1.333 1.972-2.166Q10.373 10 12 10t2.932.834T16.904 13q-.667 1.333-1.972 2.166Q13.627 16 12 16m-.004-1.884q-.467 0-.79-.327q-.321-.327-.321-.793q0-.467.326-.79q.327-.321.793-.321q.467 0 .79.326q.322.327.322.793q0 .467-.327.79q-.327.322-.793.322m.004.769q.78 0 1.333-.552T13.885 13t-.552-1.333q-.552-.552-1.333-.552t-1.333.552T10.115 13t.552 1.333t1.333.552"/></svg>',
  },
  {
    name: "Social Post",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><g fill="currentColor"><path d="M4 3.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5z"/><path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1"/></g></svg>',
  },
  {
    name: "Summarize",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M15 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V9zM5 19V5h9v5h5v9zM9 8c0 .55-.45 1-1 1s-1-.45-1-1s.45-1 1-1s1 .45 1 1m0 4c0 .55-.45 1-1 1s-1-.45-1-1s.45-1 1-1s1 .45 1 1m0 4c0 .55-.45 1-1 1s-1-.45-1-1s.45-1 1-1s1 .45 1 1"/></svg>',
  },
  {
    name: "Proofread & Tone",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"><path d="M42 20V39C42 40.6569 40.6569 42 39 42H9C7.34315 42 6 40.6569 6 39V9C6 7.34315 7.34315 6 9 6H30"/><path d="M16 20L26 28L41 7"/></g></svg>',
  },
  {
    name: "Translate",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="M5 5.828h2.7m3.3 0H9.5m-1.8 0h1.8m-1.8 0V5m1.8.828c-.316 1.131-.98 2.201-1.736 3.141M5.836 11a19 19 0 0 0 1.928-2.03m0 0c-.385-.453-.925-1.184-1.08-1.515m1.08 1.514l1.157 1.203M13.5 19l.833-2m4.167 2l-.833-2m-3.334 0L16 13l1.667 4m-3.334 0h3.334"/><path d="M14 10V8c0-2.828 0-4.243-.879-5.121C12.243 2 10.828 2 8 2s-4.243 0-5.121.879C2 3.757 2 5.172 2 8s0 4.243.879 5.121C3.757 14 5.172 14 8 14h2"/><path d="M10 16c0-2.828 0-4.243.879-5.121C11.757 10 13.172 10 16 10s4.243 0 5.121.879C22 11.757 22 13.172 22 16s0 4.243-.879 5.121C20.243 22 18.828 22 16 22s-4.243 0-5.121-.879C10 20.243 10 18.828 10 16m-6 .5c0 1.404 0 2.107.337 2.611a2 2 0 0 0 .552.552C5.393 20 6.096 20 7.5 20M20 7.5c0-1.404 0-2.107-.337-2.611a2 2 0 0 0-.552-.552C18.607 4 17.904 4 16.5 4"/></g></svg>',
  },
  {
    name: "Review Response",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M6.78 1.97a.75.75 0 0 1 0 1.06L3.81 6h6.44A4.75 4.75 0 0 1 15 10.75v2.5a.75.75 0 0 1-1.5 0v-2.5a3.25 3.25 0 0 0-3.25-3.25H3.81l2.97 2.97a.749.749 0 0 1-.326 1.275a.75.75 0 0 1-.734-.215L1.47 7.28a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0"/></svg>',
  },
];

// Create an EventTarget instance
const eventTarget = new EventTarget();

const apiUrl = "http://localhost:8080/"; // Update with your Django API URL

// Hide all pages initially
settingPage.style.display = "none";
startPage.style.display = "none";
loginPage.style.display = "none";
registerPage.style.display = "none";
homePage.style.display = "none";
topupPage.style.display = "none";
accountPage.style.display = "none";
notificationPage.style.display = "none";
recentTaskButton.style.display = "none"
passwordResetPage.style.display = "none";

// Function to check the login state and validate the token
async function checkLoginState() {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (accessToken) {
    const isValid = await isTokenValid(accessToken);

    if (isValid) {
      showHomePage(); // Token is valid, show the home page
    } else if (refreshToken) {
      // Try refreshing the token if it's invalid or expired
      const newAccessToken = await refreshTokenIfNeeded(refreshToken);

      if (newAccessToken) {
        localStorage.setItem("accessToken", newAccessToken); // Store new access token
        showHomePage();
      } else {
        clearTokens();
        showLoginPage(); // Failed to refresh, show login page
      }
    } else {
      clearTokens();
      showLoginPage(); // No valid tokens, show login page
    }
  } else {
    showLoginPage(); // No tokens, show the login page
  }
}

// Function to validate the token
async function isTokenValid(refreshToken) {
  try {
    const response = await fetch(`${apiUrl}accounts/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    return response.ok; // Returns true if the refresh token is valid, false if not
  } catch (error) {
    console.error("Token validation failed:", error);
    return false;
  }
}


// Function to refresh the access token using the refresh token
async function refreshTokenIfNeeded(refreshToken) {
  try {
    const response = await fetch(`${apiUrl}accounts/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.access; // Return the new access token
    } else {
      throw new Error("Token refresh failed");
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
}

// Function to fetch the CSRF token
async function fetchCsrfToken() {
  try {
    const response = await fetch(`${apiUrl}accounts/get-csrf-token/`); // Correct your CSRF URL
    const data = await response.json();
    return data.csrfToken; // Return the token
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
    return null;
  }
}

// Function to clear tokens from local storage
function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

// Function to handle login
async function loginUser(username, password) {
  try {
    const csrfToken = await fetchCsrfToken();
    const response = await fetch(`${apiUrl}accounts/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Login failed");
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);

    // Dispatch loginSuccess event
    const event = new CustomEvent("loginSuccess");
    eventTarget.dispatchEvent(event);

    showMessageBox("Success!", "Login successful!", "green");
    loginForm.reset();
    logInButton.style.display = 'none';
    logOutButton.style.display = 'inline';
    showHomePage();
  } catch (error) {
    showMessageBox("Error!", error.message, "red");
  }
}

// Listen for 'loginSuccess' and call fetchSettings
eventTarget.addEventListener("loginSuccess", async () => {
  await fetchSettings();
  await fetchUserDetails();
});


// Function to handle password reset
async function resetPassword(email) {
  try {
    const csrfToken = await fetchCsrfToken(); // Fetch the CSRF token

    const response = await fetch(`${apiUrl}accounts/reset_password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken, // Include the CSRF token in the headers
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Password reset failed");
    }

    // Use the message box to show success message
    showMessageBox(
      "Success",
      "Password reset link has been sent to your email.",
      "green"
    );
    passwordResetForm.reset();
    showLoginPage();
  } catch (error) {
    // Use the message box to show error message
    showMessageBox("Error", error.message, "red");
  }
}



// Function to handle user registration
async function registerUser(fullName, username, email, password) {
  try {
    const csrfToken = await fetchCsrfToken(); // Fetch the CSRF token

    // Split the fullName into first and last name
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0]; // First part of full name
    const lastName = nameParts.slice(1).join(" ") || ""; // The rest as last name, or empty string if none

    const response = await fetch(`${apiUrl}accounts/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken, // Include the CSRF token in the headers
      },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Registration failed");
    }

    // Use the message box to show success message
    showMessageBox(
      "Success",
      "Registration successful! Confirm your email to activate your account.",
      "green"
    );
    registerForm.reset()
    showLoginPage(); // Show the home page after registration
  } catch (error) {
    // Use the message box to show error message
    showMessageBox("Error", error.message, "red");
  }
}

// Handle login form submission
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  loginUser(username, password);
});

passwordResetForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const email = document.getElementById("reset_email").value;
  resetPassword(email);
});

// Function to validate email format
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Handle registration form submission
registerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const fullName = document.getElementById("full_name").value.trim();
  const username = document.getElementById("created_username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password1 = document.getElementById("pass1").value;
  const password2 = document.getElementById("pass2").value;

  // Check for empty fields
  if (!fullName || !username || !email || !password1 || !password2) {
    showMessageBox("Error", "All fields are required.", "red");
    return;
  }

  // Check if email is valid
  if (!isValidEmail(email)) {
    showMessageBox("Error", "Please enter a valid email address.", "red");
    return;
  }

  // Check if passwords match
  if (password1 !== password2) {
    showMessageBox("Error", "Passwords do not match. Please try again.", "red");
    return; // Stop further execution if passwords don't match
  }

  // Optionally, check for password strength (e.g., minimum length)
  if (password1.length < 8) {
    showMessageBox(
      "Error",
      "Password must be at least 8 characters long.",
      "red"
    );
    return;
  }

  // Proceed to register the user if all checks pass
  registerUser(fullName, username, email, password1);
});

// Check if the user is authenticated on page load
checkLoginState();

// Function to show the home page
function showHomePage() {
  document.getElementById('nav_links').style.display = 'inline'
  if (!localStorage.getItem("accessToken")) {
    showLoginPage(); // Redirect to login if not authenticated
  } else {
    settingPage.style.display = "none";
    startPage.style.display = "none";
    homePage.style.display = "flex";
    registerPage.style.display = "none";
    loginPage.style.display = "none";
    topupPage.style.display = "none";
    accountPage.style.display = "none";
    notificationPage.style.display = "none";
    recentTaskButton.style.display = "inline"
    passwordResetPage.style.display = "none";
  }
}

// Function to show the settings page
function showSettingPage() {
  if (!localStorage.getItem("accessToken")) {
    showLoginPage(); // Redirect to login if not authenticated
  } else {
    startPage.style.display = "none";
    settingPage.style.display = "flex";
    homePage.style.display = "none";
    registerPage.style.display = "none";
    loginPage.style.display = "none";
    topupPage.style.display = "none";
    accountPage.style.display = "none";
    notificationPage.style.display = "none";
    recentTaskButton.style.display = "none"
    passwordResetPage.style.display = "none";
  }
}

function showStartPage() {
  startPage.style.display = "flex";
  settingPage.style.display = "none";
  homePage.style.display = "none";
  registerPage.style.display = "none";
  loginPage.style.display = "none";
  topupPage.style.display = "none";
  accountPage.style.display = "none";
  notificationPage.style.display = "none";
  passwordResetPage.style.display = "none";
}

// Function to show the login page
function showLoginPage() {
  if (localStorage.getItem("accessToken")) {
    showHomePage();
  } else {
    startPage.style.display = "none";
    settingPage.style.display = "none";
    homePage.style.display = "none";
    registerPage.style.display = "none";
    loginPage.style.display = "flex";
    topupPage.style.display = "none";
    accountPage.style.display = "none";
    notificationPage.style.display = "none";
    recentTaskButton.style.display = "none"
    passwordResetPage.style.display = "none";
  }
}

// Function to show the register page
function showRegisterPage() {
  if (localStorage.getItem("accessToken")) {
    showLoginPage(); // Redirect to login if not authenticated
  } else {
    startPage.style.display = "none";
    settingPage.style.display = "none";
    homePage.style.display = "none";
    registerPage.style.display = "flex";
    loginPage.style.display = "none";
    topupPage.style.display = "none";
    accountPage.style.display = "none";
    notificationPage.style.display = "none";
    recentTaskButton.style.display = "none"
    passwordResetPage.style.display = "none";
  }
}


// Function to show the password reset page
function showPasswordResetPage() {
    startPage.style.display = "none";
    settingPage.style.display = "none";
    homePage.style.display = "none";
    registerPage.style.display = "none";
    loginPage.style.display = "none";
    topupPage.style.display = "none";
    accountPage.style.display = "none";
    notificationPage.style.display = "none";
    recentTaskButton.style.display = "none"
    passwordResetPage.style.display = "flex";
}

function showAccountPage() {
  if (!localStorage.getItem("accessToken")) {
    showLoginPage(); // Redirect to login if not authenticated
  } else {
    startPage.style.display = "none";
    settingPage.style.display = "none";
    homePage.style.display = "none";
    registerPage.style.display = "none";
    loginPage.style.display = "none";
    topupPage.style.display = "none";
    accountPage.style.display = "flex";
    notificationPage.style.display = "none";
    recentTaskButton.style.display = "none"
    passwordResetPage.style.display = "none";
  }
}

function showTopupPage() {
  if (!localStorage.getItem("accessToken")) {
    showLoginPage(); // Redirect to login if not authenticated
  } else {
    startPage.style.display = "none";
    settingPage.style.display = "none";
    homePage.style.display = "none";
    registerPage.style.display = "none";
    loginPage.style.display = "none";
    topupPage.style.display = "flex";
    accountPage.style.display = "none";
    notificationPage.style.display = "none";
    recentTaskButton.style.display = "none"
    passwordResetPage.style.display = "none";
  }
}

function showNotificationsPage() {
  if (!localStorage.getItem("accessToken")) {
    showLoginPage(); // Redirect to login if not authenticated
  } else {
    startPage.style.display = "none";
    settingPage.style.display = "none";
    homePage.style.display = "none";
    registerPage.style.display = "none";
    loginPage.style.display = "none";
    topupPage.style.display = "none";
    accountPage.style.display = "none";
    notificationPage.style.display = "flex";
    recentTaskButton.style.display = "none"
    passwordResetPage.style.display = "none";
  }
}

document.getElementById('top_up_button').addEventListener('click', function() {
  showTopupPage();
});

forgotPasswordButton.addEventListener('click', function() {
  showPasswordResetPage();
});

notificationButton.addEventListener('click', function() {
  showNotificationsPage();
});

document.getElementById('account_button').addEventListener('click', function() {
  showAccountPage();
});

document.getElementById('password_reset_login_link').addEventListener('click', function() {
  showLoginPage();
});

// Event Listeners
settingsButton.addEventListener("click", function () {
  showSettingPage();
});

document
  .getElementById("extension_logo")
  .addEventListener("click", function () {
    showHomePage();
  });

document
  .getElementById("to_login_page_link")
  .addEventListener("click", function () {
    showLoginPage();
  });

document
  .getElementById("to_registration_page_link")
  .addEventListener("click", function () {
    showRegisterPage();
  });

// Function to handle logout
logOutButton.addEventListener("click", async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    showMessageBox("Waaah!", "You are not logged in", "#2BC9DE");
    return;
  }

  try {
    await fetch(`${apiUrl}accounts/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    // Clear tokens from local storage
    clearTokens();
    logInButton.style.display = 'inline';
    logOutButton.style.display = 'none';
    showMessageBox("Success", "Logged out successfully", "green");
    showLoginPage(); // Show login page after logout
  } catch (error) {
    showMessageBox("Error!", "Logout failed", "red");
  }
});

function showMessageBox(title, message, headerColor) {
  const messageBox = document.getElementById("messageBox");
  const overlay = document.getElementById("overlay");

  // Set the title and message
  messageBox.querySelector(".message-title").innerText = title;
  messageBox.querySelector(".message-content p").innerText = message;

  // Set the header color
  messageBox.querySelector(".message-header").style.backgroundColor =
    headerColor;

  // Show the message box and overlay
  messageBox.style.display = "block";
  overlay.style.display = "block";

  // Close the message box after 3 seconds (3000 milliseconds)
  setTimeout(() => {
    closeMessageBox(); // Call the close function
  }, 6000);
}

function closeMessageBox() {
  const messageBox = document.getElementById("messageBox");
  const overlay = document.getElementById("overlay");
  messageBox.style.display = "none"; // Hide the message box
  overlay.style.display = "none"; // Hide the overlay
}

document.addEventListener("click", function () {
  closeMessageBox();
});

function clearTextareas() {
  const outputTextarea = document.getElementById("output_textarea");
  const inputTextarea = document.getElementById("input_textarea");

  if (outputTextarea) {
    outputTextarea.value = ""; // Clear the output textarea
  }

  if (inputTextarea) {
    inputTextarea.value = ""; // Clear the input textarea
  }
}

// Handle task selection
function handleTaskSelection(task) {
  clearTextareas();

  // Reset UI
  toneDropdown.classList.add("hidden");
  summarizeOptionContent.classList.add("hidden"); // Use correct variable name
  languageOptions.classList.add("hidden");
  inputContainer.classList.remove("hidden");
  outputLabel.innerText = "Refined Response";
  outputTextarea.style.height = "170px";
  outputTextarea.style.maxHeight = "170px";
  outputTextarea.style.minHeight = "170px";

  // Update based on selected task
  switch (task) {
    case "Summarize":
      summarizeOptionContent.classList.remove("hidden");
      outputLabel.innerText = "Summarized Text";
      break;
    case "Translate":
      languageOptions.classList.remove("hidden");
      inputLabel.innerText = "Text";
      outputLabel.innerText = "Translated Text";
      break;
    case "Review Response":
      toneDropdown.classList.remove("hidden");
      inputLabel.innerText = "Review";
      outputLabel.innerText = "Refined Response";
      break;
    case "Proofread & Tone":
      inputLabel.innerText = "Text";
      outputLabel.innerText = "Refined Text";
      toneDropdown.classList.remove("hidden");
      break;
    default:
      toneDropdown.classList.remove("hidden");
      inputLabel.innerText = "Thoughts to Words";
      outputLabel.innerText = "Refined Response";
  }
}

function populateDropdowns(settings) {
  // Set selected task
  const selectedTask = settings.defaultTask || "Write Email"; // Default if not set

  const taskObject = tasks.find(task => task.name === selectedTask);

  const taskDropdown = document.querySelector(".selected-text");
  // Set the innerHTML to display both the icon and the task name
  if (taskObject) {
    taskDropdown.innerHTML = ` ${taskObject.icon} ${taskObject.name}`;
  }

  handleTaskSelection(selectedTask); // Update the dropdown button text

  // Set selected tone
  const selectedTone = settings.preferredWritingStyle || "Formal"; // Default if not set
  const toneDropdown = document.querySelector(
    ".tone-dropdown-btn span:nth-child(2)"
  );
  toneDropdown.innerText = selectedTone; // Update the tone dropdown button text

  // Set selected language
  const selectedLanguage = settings.preferredLanguage || "English"; // Default if not set
  const languageDropdown = document.querySelector(
    ".language-options-btn span:nth-child(2)"
  );
  languageDropdown.innerText = selectedLanguage; // Update the language dropdown button text

  document.getElementById("summary_length").value =
    settings.summarizationLength || 100; // Default if not set
}

async function fetchSettings() {
  try {
    let token = localStorage.getItem("accessToken"); // Retrieve the access token from local storage
    const refreshToken = localStorage.getItem("refreshToken");

    // Check if the user is authenticated by verifying the existence of the token
    if (!token) {
      console.log("User is not authenticated. Fetch settings aborted.");
      return; // Exit the function if the user is not authenticated
    }

    // Validate the token first
    const isValid = await isTokenValid(token);

    if (!isValid && refreshToken) {
      // Token is invalid or expired, try refreshing it
      const newAccessToken = await refreshTokenIfNeeded(refreshToken);

      if (newAccessToken) {
        localStorage.setItem("accessToken", newAccessToken); // Store the new access token
        token = newAccessToken; // Use the new access token
      } else {
        // If token refresh fails, clear tokens and show login page
        clearTokens();
        showLoginPage();
        return;
      }
    }

    const csrfToken = await fetchCsrfToken(); // Fetch the CSRF token
    const response = await fetch(`${apiUrl}accounts/settings/get/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token
        "X-CSRFToken": csrfToken, // Include CSRF token in headers
      },
    });

    if (!response.ok) {
      throw new Error("Failed to retrieve settings. Please try again.");
    }

    const settings = await response.json();

    // Populate the settings form with the retrieved data
    document.querySelector("#default_task").value = settings.defaultTask;
    document.querySelector("#enable_notifications").checked =
      settings.enableNotifications;
    document.querySelector("#pre_difined_templates").checked =
      settings.preDefinedTemplates;
    document.querySelector("#enable_auto_fill").checked =
      settings.enableAutoFill;
    document.querySelector("#form_fields_validation").checked =
      settings.formFieldsValidation;
    document.querySelector("#summarization_length").value =
      settings.summarizationLength;
    document.querySelector("#languages").value = settings.preferredLanguage;
    document.querySelector("#writing_style").value =
      settings.preferredWritingStyle;
    document.querySelector("#save_custom_templates").checked =
      settings.saveCustomTemplates;
    document.querySelector("#text_to_speech").checked =
      settings.enableTextToSpeech;
    document.querySelector("#speech_to_text").checked =
      settings.enableSpeechToText;
    document.querySelector("#font_and_text_sizes").value = settings.fontSize;

    // Populate dropdowns for tasks and tones
    populateDropdowns(settings);
  } catch (error) {
    showMessageBox("Error", error.message, "red");
  }
}

document
  .getElementById("saveSettingsButton")
  .addEventListener("click", async () => {
    // Create settings object
    const settings = {
      defaultTask: document.getElementById("default_task").value || null, // Allow empty
      enableNotifications: document.getElementById("enable_notifications")
        .checked,
      preDefinedTemplates: document.getElementById("pre_difined_templates")
        .checked,
      enableAutoFill: document.getElementById("enable_auto_fill").checked,
      formFieldsValidation: document.getElementById("form_fields_validation")
        .checked,
      summarizationLength:
        document.getElementById("summarization_length").value || null, // Allow empty
      preferredLanguage: document.getElementById("languages").value || null, // Allow empty
      preferredWritingStyle:
        document.getElementById("writing_style").value || null, // Allow empty
      saveCustomTemplates: document.getElementById("save_custom_templates")
        .checked,
      enableTextToSpeech: document.getElementById("text_to_speech").checked,
      enableSpeechToText: document.getElementById("speech_to_text").checked,
      fontSize: document.getElementById("font_and_text_sizes").value || null, // Allow empty
    };

    try {
      const csrfToken = await fetchCsrfToken(); // Fetch the CSRF token
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${apiUrl}accounts/settings/save/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-CSRFToken": csrfToken, // Include CSRF token in headers
        },
        body: JSON.stringify(settings), // Send the settings to the backend
      });

      if (!response.ok) {
        throw new Error("Failed to save settings. Please try again.");
      }

      showMessageBox("Success", "Settings saved successfully!", "green");
      fetchSettings();
    } catch (error) {
      showMessageBox("Error", error.message, "red");
    }
  });

// Call fetchSettings when the settings page is loaded
document.addEventListener("DOMContentLoaded", fetchSettings);

// Function to copy text from the textarea to the clipboard
copyTextButton.addEventListener("click", async function () {
  try {
    await navigator.clipboard.writeText(outputTextarea.value);
    copyTextButton.style.color = "green";
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
});

// Function to convert text to speech or stop it
textToSpeechButton.addEventListener("click", function () {
  if (isSpeaking) {
    // If speech is ongoing, stop it
    window.speechSynthesis.cancel(); // Stop the speech
    isSpeaking = false;

    // Revert the button color to its original state
    textToSpeechButton.style.backgroundColor = ""; // Revert button color to default
  } else {
    const text = outputTextarea.value;

    // Create a new speech synthesis utterance
    utterance = new SpeechSynthesisUtterance(text);

    // Optional: Set the voice (you can choose from available voices)
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      utterance.voice = voices[0]; // You can customize the voice here
    }

    // Optional: Set speech rate, pitch, and volume (customize as needed)
    utterance.rate = 1; // Speed of speech (1 is normal)
    utterance.pitch = 1; // Pitch level (1 is normal)
    utterance.volume = 1; // Volume level (0 to 1)

    // Start speaking the text
    window.speechSynthesis.speak(utterance);

    // Set speaking status to true
    isSpeaking = true;

    // Change the button's background color to green while speech is active
    textToSpeechButton.style.backgroundColor = "green"; // Change button color to green

    // When speech ends, reset the button color to its original state
    utterance.onend = function () {
      isSpeaking = false;
      textToSpeechButton.style.backgroundColor = ""; // Revert button color to default
    };
  }
});

// Populate "Select Task" dropdown
tasks.forEach((task) => {
  const dropdownItem = document.createElement("div");
  dropdownItem.classList.add("dropdown-item");
  dropdownItem.innerHTML = `
          <span>${task.name}</span>
          <span>${task.icon}</span>
        `;
  dropdownItem.addEventListener("click", () => {
    modeSelectedText.innerHTML = `${task.icon} ${task.name}`;
    document.querySelector(".dropdown").classList.remove("open"); // Close dropdown on selection
    selectedTask = task.name;
    handleTaskSelection(task.name);
  });
  modeDropdownContent.appendChild(dropdownItem);
});


selectTopUpMethod.innerHTML = `${topup_methods[0].icon} ${topup_methods[0].name}`;

// Ensure M-Pesa is selected by default
mpesaForm.style.display = "block"; // Show M-Pesa form
paypalForm.style.display = "none"; // Hide PayPal form

// Populate "Select TopUp" dropdown
topup_methods.forEach((method) => {
  const dropdownItem = document.createElement("div");
  dropdownItem.classList.add("dropdown-item");
  dropdownItem.innerHTML = `
          <span>${method.name}</span>
          <span>${method.icon}</span>
        `;
  
  dropdownItem.addEventListener("click", () => {
    selectTopUpMethod.innerHTML = `${method.icon} ${method.name}`;
    document.getElementById("topup_dropdown").classList.remove("open"); // Close dropdown on selection
    
    // Toggle between M-Pesa and PayPal forms
    if (method.name === "M-Pesa") {
      mpesaForm.style.display = "block";   // Show M-Pesa form
      paypalForm.style.display = "none";   // Hide PayPal form
    } else if (method.name === "PayPal") {
      mpesaForm.style.display = "none";    // Hide M-Pesa form
      paypalForm.style.display = "block";  // Show PayPal form
    }
  });

  topupDropdownContent.appendChild(dropdownItem);
});

// Populate "Choose Tone" dropdown (no icons)
tones.forEach((tone) => {
  const dropdownItem = document.createElement("div");
  dropdownItem.classList.add("dropdown-item");
  dropdownItem.innerText = tone;
  dropdownItem.addEventListener("click", () => {
    document.querySelector(".tone-dropdown-btn span:nth-child(2)").innerText =
      tone;
    document
      .querySelector(".tone-dropdown-btn")
      .parentElement.classList.remove("open");
    selectedTone = tone;
  });
  toneDropdownContent.appendChild(dropdownItem);
});

// Populate "Choose Language" dropdown (no icons)
languages.forEach((language) => {
  const dropdownItem = document.createElement("div");
  dropdownItem.classList.add("dropdown-item");
  dropdownItem.innerText = language;
  dropdownItem.addEventListener("click", () => {
    document.querySelector(
      ".language-options-btn span:nth-child(2)"
    ).innerText = language;
    document
      .querySelector(".language-options-btn")
      .parentElement.classList.remove("open");
    selectedLanguage = language;
  });
  languageOptionsContent.appendChild(dropdownItem);
});

// Toggle the dropdown open/close
document.querySelectorAll(".dropdown-btn").forEach((button) => {
  button.addEventListener("click", function () {
    const dropdown = this.parentElement;
    dropdown.classList.toggle("open");
  });
});

// Close the dropdown if clicked outside
window.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
      dropdown.classList.remove("open");
    });
  }
});

// Select all toggle buttons
const toggles = document.querySelectorAll(".switch input");

// Add event listeners to each toggle button
toggles.forEach((toggle) => {
  toggle.addEventListener("change", function () {
    const toggleId = this.getAttribute("data-toggle-id"); // Get the unique ID
    const toggleState = this.checked ? "ON" : "OFF"; // Determine if it's ON or OFF
    console.log(`Toggle ${toggleId} is ${toggleState}`);
  });
});

async function chargeUser(inputText, outputText) {
  console.log('Charger called');
  const texts = {
    inputText: inputText,
    outputText: outputText
  };

  try {
    const csrfToken = await fetchCsrfToken(); // Fetch the CSRF token
    const token = localStorage.getItem("accessToken");

    const response = await fetch(`${apiUrl}core/charge-tokens/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-CSRFToken": csrfToken, // Include CSRF token in headers
      },
      body: JSON.stringify(texts), // Send the input and output texts to the backend
    });

    if (!response.ok) {
      throw new Error("Failed to charge. Please try again.");
    }

    // Parse the response JSON
    const data = await response.json();

    // Update the balance input field with the new balance
    document.getElementById("user_account_balance").value = data.new_balance; 

  } catch (error) {
    console.error("Error:", error);
  }
}

// Function to call the backend OpenAI API
async function callOpenAI(selectedTask, input, tone, language, summarizationLength = 100) {
  const backendUrl = `${apiUrl}core/call_openai`;
  const csrfToken = await fetchCsrfToken(); // Fetch the CSRF token
  const token = localStorage.getItem("accessToken");

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Assuming you need a bearer token for authentication
        "X-CSRFToken": csrfToken, // Include CSRF token in headers
      },
      body: JSON.stringify({
        task: selectedTask,
        input: input,
        tone: tone,
        language: language,
        summarizationLength: summarizationLength,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error calling backend.");
    }

    const data = await response.json();
    return data.output;
  } catch (error) {
    throw new Error(`Backend call failed: ${error.message}`);
  }
}

// Event listener for the Process button
document.getElementById("process_button").addEventListener("click", async () => {
  const inputText = document.getElementById("input_textarea").value; // Get input from the textarea
  const selectedTone = document.querySelector(
    ".tone-dropdown-btn span:nth-child(2)"
  ).innerText; // Get selected tone
  const selectedTask = document.querySelector(".selected-text").innerText;
  const selectedLanguage = document.querySelector(
    ".language-options-btn span:nth-child(2)"
  ).innerText;

  // Validate input
  if (!inputText.trim()) {
    showMessageBox("Error", "Please enter some text.", "red");
    return;
  }

  // For summarization, get the length if necessary
  let summarizationLength = 100; // Default summarization length

  // Check if the selected task is "Summarize"
  if (selectedTask === "Summarize") {
    // Get the value from the 'summary_length' input field
    let summaryLengthInput = document.getElementById("summary_length").value;

    // If the input is empty or invalid, use the default length of 100
    if (
      summaryLengthInput.trim() === "" ||
      isNaN(parseInt(summaryLengthInput, 10)) ||
      parseInt(summaryLengthInput, 10) <= 0
    ) {
      showMessageBox("Notice", "Using default summary length of 100.", "blue");
      summarizationLength = 100;
    } else {
      summarizationLength = parseInt(summaryLengthInput, 10);
    }
  }

  console.log(
    selectedTask,
    inputText,
    selectedTone,
    selectedLanguage,
    summarizationLength
  );
    const defaultTask = selectedTask;
    const preferredWritingStyle = selectedTone;
    const preferredLanguage = selectedLanguage;

  // Store the current values in Chrome's local storage
  chrome.storage.local.set({
    defaultTask,
    preferredWritingStyle,
    preferredLanguage,
    summarizationLength,
    inputText,
  });

  try {
    // Call OpenAI directly
    const output = await callOpenAI(selectedTask, inputText, selectedTone, selectedLanguage, summarizationLength);
    console.log("Output from OpenAI:", output);
    // Display output
    document.getElementById("output_textarea").value = output;
    chargeUser(inputText, output); // Assuming this function exists

    // Store output in Chrome's local storage
    chrome.storage.local.set({ outputText: output });
  } catch (error) {
    showMessageBox("Error", error.message, "red");
  }
});


document.getElementById("confirm_button").addEventListener("click", () => {
  let enhancedText = document.getElementById("output_textarea").value;
  // Retrieve the selected input info from chrome.storage
  chrome.storage.local.get("selectedInputInfo", function (data) {
    console.log("Data retrieved from chrome.storage in popup:", data); // Debugging line

    if (data.selectedInputInfo) {
      const { inputId, inputName, inputIndex } = data.selectedInputInfo;

      // Send a message to the content script to populate the selected field
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            type: "populateField",
            inputId: inputId,
            inputName: inputName,
            inputIndex: inputIndex,
            enhancedText: enhancedText,
          },
          function (response) {
            if (chrome.runtime.lastError) {
              console.error(
                "Could not send message to content script:",
                chrome.runtime.lastError.message
              );
              showMessageBox(
                "Error",
                "Failed to populate field. Content script is not available on this page.",
                "red"
              );
            } else {
              console.log(
                "Message successfully sent to content script:",
                response
              );
            }
          }
        );
      });
    } else {
      console.error("No selected input info found in storage.");
      showMessageBox(
        "Error",
        "No selected input info found in storage.",
        "red"
      );
    }
  });
});



async function fetchUserDetails() {
  try {
    let token = localStorage.getItem("accessToken"); // Retrieve the access token from local storage
    const refreshToken = localStorage.getItem("refreshToken");

    // Check if the user is authenticated by verifying the existence of the token
    if (!token) {
      console.log("User is not authenticated. Fetch user details aborted.");
      return; // Exit the function if the user is not authenticated
    }

    // Validate the token first
    const isValid = await isTokenValid(token);

    if (!isValid && refreshToken) {
      // Token is invalid or expired, try refreshing it
      const newAccessToken = await refreshTokenIfNeeded(refreshToken);

      if (newAccessToken) {
        localStorage.setItem("accessToken", newAccessToken); // Store the new access token
        token = newAccessToken; // Use the new access token
      } else {
        // If token refresh fails, clear tokens and show login page
        clearTokens();
        showLoginPage();
        return;
      }
    }

    const csrfToken = await fetchCsrfToken(); // Fetch the CSRF token
    const response = await fetch(`${apiUrl}accounts/user/details/`, { // No userId in the URL
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token
        "X-CSRFToken": csrfToken, // Include CSRF token in headers
      },
    });

    if (!response.ok) {
      throw new Error("Failed to retrieve user details. Please try again.");
    }

    const user = await response.json();

    // Populate the account page with the retrieved user data
    document.getElementById("user_fullname").innerText = user.full_name || 'N/A';
    document.getElementById("user_username").value = user.username || 'N/A';
    document.getElementById("user_email").value = user.email || 'N/A';
    document.getElementById("user_account_balance").value = user.account_balance || '0';
  } catch (error) {
    showMessageBox("Error", error.message, "red");
  }
}

document.addEventListener("DOMContentLoaded", fetchUserDetails);

// Listen for 'loginSuccess' and call fetchSettings
eventTarget.addEventListener("loginSuccess", async () => {
  await fetchSettings();
  await fetchUserDetails();
  await fetchNotifications();
});


async function initiateMpesaPayment(phoneNumber, amount) {
  console.log('M-Pesa payment initiation called');
  const paymentData = {
    phone_number: phoneNumber,
    amount: amount
  };

  try {
    const csrfToken = await fetchCsrfToken(); // Fetch the CSRF token
    const token = localStorage.getItem("accessToken");

    const response = await fetch(`${apiUrl}core/topup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Assuming you need a bearer token for authentication
        "X-CSRFToken": csrfToken, // Include CSRF token in headers
      },
      body: JSON.stringify(paymentData), // Send the phone number and amount to the backend
    });

    if (!response.ok) {
      throw new Error("Failed to initiate payment. Please try again.");
    }

    // Parse the response JSON
    const data = await response.json();

    if (data.status === 'success') {
      showMessageBox("Success", 'M-Pesa payment initiated successfully. Please confirm on your phone to complete', "green");
      showAccountPage()
    } else {
      showMessageBox("Error", data.message + 'Try Again', "red");
      showAccountPage()
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

// Event listener for form submission (assuming the form is the same as in your initial request)
document.getElementById('mpesa_form').addEventListener('submit', function(event) {
  event.preventDefault();  // Prevent the form from submitting normally

  const phoneNumber = document.getElementById('phone_number').value;
  const amount = document.getElementById('topup_amount').value;

  // Call the M-Pesa payment initiation function
  initiateMpesaPayment(phoneNumber, amount);
});

document.getElementById('get_started_button').addEventListener('click', function(event) {
  showHomePage()
});


document.addEventListener("DOMContentLoaded", function () {
  const confirmButton = document.getElementById('confirm_button');

  const port = chrome.runtime.connect({ name: "popup" });

  // Check chrome.storage for the inputFieldSelected state when the popup opens
  chrome.storage.local.get('inputFieldSelected', function (result) {
    if (result.inputFieldSelected) {
      // Show the button if an input field was selected
      confirmButton.style.display = "block";
    } else {
      // Hide the button if no input field was selected
      confirmButton.style.display = "none";
    }
  });

  // Listen for messages from content.js
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "inputFieldSelected") {
      console.log("Message received in popup.js:", message);
      confirmButton.style.display = "block";
      sendResponse({ status: "Button shown" });
    } else if (message.type === "inputFieldDeselected") {
      console.log("Message received in popup.js to hide button");
      confirmButton.style.display = "none";
      sendResponse({ status: "Button hidden" });
    }
  });

  // Clear input selection state when popup closes
  window.addEventListener('unload', function () {
    chrome.storage.local.clear(function () {
      console.log("Input field data cleared from chrome.storage.local on popup close.");
    });
  });


  // Check if this is the first install
  chrome.storage.local.get('firstInstall', function(result) {
    if (result.firstInstall) {
      document.getElementById('nav_links').style.display = 'none';
      // Show the special div for first-time users
      showStartPage();

      // Optionally, clear the flag so the div is only shown once
      chrome.storage.local.remove('firstInstall', function() {
        console.log("First install section shown and flag cleared.");
      });
    } else {
      // Hide the div if it's not the first install
      showHomePage();
    }
  });

  if (!localStorage.getItem("accessToken")) {
      logInButton.style.display = 'inline';
      logOutButton.style.display = 'none';
  }
  else {
    logInButton.style.display = 'none';
    logOutButton.style.display = 'inline';
  }

});


document.getElementById('recent_task_button').addEventListener('click', function(event) {
  // Retrieve dropdown-related settings and populate them using populateDropdowns
  chrome.storage.local.get(
    ["defaultTask", "preferredWritingStyle", "preferredLanguage", "summarizationLength"],
    (result) => {
      // Call the function to populate dropdowns
      populateDropdowns(result);
      
      console.log(result);

      // After populating dropdowns, retrieve the input and output text separately
      chrome.storage.local.get(["inputText", "outputText"], (textData) => {
        // Set input text if available
        console.log(textData);
        inputTextarea.value = textData.inputText || ""; // Default to empty if not set

        // Set output text if available
        outputTextarea.value = textData.outputText || ""; // Default to empty if not set
      });
    }
  );
})


// Helper function to mark a notification as read
async function markAsRead(notificationId, notificationElement) {
  try {
    let token = localStorage.getItem("accessToken");
    const csrfToken = await fetchCsrfToken();

    const response = await fetch(`${apiUrl}core/notifications/${notificationId}/mark_as_read/`, {
      method: "PATCH", // We use PATCH to only update the is_read field
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-CSRFToken": csrfToken,
      },
    });

    if (response.ok) {
      console.log(`Notification ${notificationId} marked as read`);

      // Remove the 'unread' class from the notification element
      if (notificationElement.classList.contains('unread')) {
        notificationElement.classList.remove('unread');
      }
    } else {
      throw new Error("Failed to mark notification as read.");
    }
  } catch (error) {
    showMessageBox("Error", error.message, "red");
  }
}




async function fetchNotifications() {
  try {
    let token = localStorage.getItem("accessToken"); // Retrieve the access token from local storage
    const refreshToken = localStorage.getItem("refreshToken");

    // Check if the user is authenticated by verifying the existence of the token
    if (!token) {
      console.log("User is not authenticated. Fetch notifications aborted.");
      return; // Exit the function if the user is not authenticated
    }

    // Validate the token first
    const isValid = await isTokenValid(token);

    if (!isValid && refreshToken) {
      // Token is invalid or expired, try refreshing it
      const newAccessToken = await refreshTokenIfNeeded(refreshToken);

      if (newAccessToken) {
        localStorage.setItem("accessToken", newAccessToken); // Store the new access token
        token = newAccessToken; // Use the new access token
      } else {
        // If token refresh fails, clear tokens and show login page
        clearTokens();
        showLoginPage();
        return;
      }
    }

    const csrfToken = await fetchCsrfToken(); // Fetch the CSRF token
    const response = await fetch(`${apiUrl}core/notifications/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token
        "X-CSRFToken": csrfToken, // Include CSRF token in headers
      },
    });

    if (!response.ok) {
      throw new Error("Failed to retrieve notifications. Please try again.");
    }

    const notifications = await response.json();

    // Get the notifications container
    const notificationsContainer = document.querySelector("#notifications_page");

    // Clear existing notifications
    notificationsContainer.innerHTML = "";

    // Check if there are no notifications
    if (notifications.length === 0) {
      const noNotificationsMessage = document.createElement("h3");
      noNotificationsMessage.style.textAlign = 'center';
      noNotificationsMessage.style.marginTop = '30px';
      noNotificationsMessage.textContent = "No notifications available";
      notificationsContainer.appendChild(noNotificationsMessage);
      return; // Stop further execution since there are no notifications
    }

    // Add each notification to the DOM
    notifications.forEach((notification) => {
      const notificationElement = document.createElement("div");
      notificationElement.className = "notification";

      // Add a class or style if the notification is unread
      if (notification.is_read) {
        notificationElement.classList.add("unread");
      }

      // Create the notification header with title and delete button
      const header = document.createElement("div");
      header.style.display = "flex";
      header.style.flexDirection = "row";
      header.style.justifyContent = "space-between";
      header.style.alignItems = "center";

      const title = document.createElement("h4");
      title.textContent = notification.title;

      const deleteButton = document.createElement("button");
      deleteButton.style.border = "none";
      deleteButton.style.padding = "0";
      deleteButton.style.background = "none";
      deleteButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" color="red">
          <g fill="none">
            <path fill="currentColor" d="M20 5a1 1 0 1 1 0 2h-1l-.003.071l-.933 13.071A2 2 0 0 1 16.069 22H7.93a2 2 0 0 1-1.995-1.858l-.933-13.07L5 7H4a1 1 0 0 1 0-2zm-3.003 2H7.003l.928 13h8.138zM14 2a1 1 0 1 1 0 2h-4a1 1 0 0 1 0-2z"/>
          </g>
        </svg>
      `;
      deleteButton.onclick = () => deleteNotification(notification.id);

      header.appendChild(title);
      header.appendChild(deleteButton);

      // Add onclick to mark notification as read, pass the notificationElement
      notificationElement.onclick = () => markAsRead(notification.id, notificationElement);


      // Create the message content
      const message = document.createElement("p");
      message.textContent = notification.message;

      let link = null
      // Create the anchor link if available
      if (notification.link) {
        link = document.createElement("a");
        link.id = `${notification.link}`;
        if (notification.link == 'top_up') {
          link.textContent = "Top Up";
        }
        else if (notification.link == 'account_dashboard') {
          link.textContent = "Account Dashboard";
        }
        else {
          link.textContent = "";
        }
      }

      // Add the date
      const date = document.createElement("div");
      date.className = "date";
      date.textContent = new Date(notification.dateCreated).toLocaleDateString();

      // Append the elements to the notification div
      notificationElement.appendChild(header);
      notificationElement.appendChild(document.createElement("hr"));
      notificationElement.appendChild(message);
      if (notification.link) {
        notificationElement.appendChild(link);
      }
      notificationElement.appendChild(date);

      // Append the notification element to the container
      notificationsContainer.appendChild(notificationElement);
    });


  } catch (error) {
    showMessageBox("Error", error.message, "red");
  }
}

// Helper function to delete a notification
async function deleteNotification(notificationId) {
  try {
    let token = localStorage.getItem("accessToken");
    const csrfToken = await fetchCsrfToken();

    const response = await fetch(`${apiUrl}core/delete_notification/${notificationId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-CSRFToken": csrfToken,
      },
    });

    if (response.ok) {
      console.log(`Notification ${notificationId} deleted successfully`);
      fetchNotifications(); // Refresh notifications after deletion
    } else {
      throw new Error("Failed to delete notification.");
    }
  } catch (error) {
    showMessageBox("Error", error.message, "red");
  }
}

fetchNotifications()


async function initiatePayPalTopup(amount) {
  console.log('PayPal top-up initiation called');
  
  const paymentData = {
      amount: amount  // Only sending the amount for PayPal
  };

  try {
      const csrfToken = await fetchCsrfToken(); // Assuming you have a function to fetch the CSRF token
      const token = localStorage.getItem("accessToken"); // Fetch the access token if needed

      // Send the top-up request to the backend
      const response = await fetch(`${apiUrl}core/paypal/topup/`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,  // Assuming you need a bearer token for authentication
              "X-CSRFToken": csrfToken,  // Include CSRF token in headers
          },
          body: JSON.stringify(paymentData)  // Send the top-up amount to the backend
      });

      if (!response.ok) {
          throw new Error("Failed to initiate PayPal top-up. Please try again.");
      }

      // Parse the response JSON
      const data = await response.json();
      console.log(data)

      if (data.approval_url) {
        // Open the approval URL in a new window
        window.open(data.approval_url, '_blank');
    } else {
        console.error('Error initiating PayPal payment:', data.message);
    }

  } catch (error) {
      console.error("Error:", error);
  }
}

// Event listener for PayPal top-up form submission
document.getElementById('paypal_form').addEventListener('submit', function(event) {
  event.preventDefault();  // Prevent the form from submitting normally

  const amount = document.getElementById('paypal_topup_amount').value;

  // Call the PayPal top-up initiation function
  initiatePayPalTopup(amount);
});





