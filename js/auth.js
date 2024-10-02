// js/auth.js

import { fetchLinks } from "./database.js";

// Authentication Elements
const openLoginModalButton = document.getElementById("open-login-modal");
const loginModal = document.getElementById("login-modal");
const loginButton = document.getElementById("login-button");
const closeLoginButton = document.querySelector(".close-login");
const logoutButton = document.getElementById("logout-button");
const addButton = document.getElementById("add-button");
const removeButton = document.getElementById("remove-button");

// Create an object to hold the authentication state
export const authState = { isLoggedIn: false };

// Open Login Modal
openLoginModalButton.addEventListener("click", () => {
  loginModal.classList.remove("hidden");
});

// Close Login Modal
closeLoginButton.addEventListener("click", () => {
  loginModal.classList.add("hidden");
});

// Login Functionality
loginButton.addEventListener("click", () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      loginModal.classList.add("hidden");
      alert("Logged in successfully!");
    })
    .catch((error) => {
      document.getElementById("login-error-message").textContent =
        error.message;
    });
});

// Logout Functionality
logoutButton.addEventListener("click", () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      alert("Logged out successfully!");
    });
});

// Check Authentication State
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    authState.isLoggedIn = true;
    // User is signed in
    addButton.style.display = "inline-block";
    removeButton.style.display = "inline-block";
    openLoginModalButton.style.display = "none";
    logoutButton.style.display = "inline-block";
  } else {
    authState.isLoggedIn = false;
    // No user is signed in
    addButton.style.display = "none";
    removeButton.style.display = "none";
    openLoginModalButton.style.display = "inline-block";
    logoutButton.style.display = "none";
  }
  fetchLinks(); // Re-fetch the links to update the UI
});
