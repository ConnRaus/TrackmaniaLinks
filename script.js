// Firebase initialization and database setup
const firebaseConfig = {
  apiKey: "AIzaSyAdIT47uDjDsOq8QRe2lwEkrNgJDI1GqFA",
  authDomain: "tmwebsitedb-2477d.firebaseapp.com",
  databaseURL: "https://tmwebsitedb-2477d-default-rtdb.firebaseio.com",
  projectId: "tmwebsitedb-2477d",
  storageBucket: "tmwebsitedb-2477d.appspot.com",
  messagingSenderId: "972124262825",
  appId: "1:972124262825:web:701d5b9752c025992b74b8",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Elements
const container = document.getElementById("links-container");
const addButton = document.getElementById("add-button");
const removeButton = document.getElementById("remove-button");
const addModal = document.getElementById("add-modal");
const submitAdd = document.getElementById("submit-add");
const closeButton = document.querySelector(".close-button");
let removeMode = false;
let selectedLinks = new Set(); // To track selected links for removal
let isLoggedIn = false; // Track authentication state

// Fetch links from database
function fetchLinks() {
  db.ref("links").on("value", (snapshot) => {
    const data = snapshot.val();
    const links = data
      ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
      : [];
    // Sort the links by order
    links.sort((a, b) => a.order - b.order);
    displayLinks(links);
  });
}

// Fetch the favicon using a public favicon service
function getFavicon(linkUrl) {
  const domain = new URL(linkUrl).hostname;
  return Promise.resolve(`https://api.faviconkit.com/${domain}/32`);
}

// Display links in the UI
function displayLinks(links) {
  container.innerHTML = "";
  links.forEach((link, index) => {
    const linkContainer = document.createElement("div");
    linkContainer.classList.add("link-container");

    const button = document.createElement("button");
    button.classList.add("button");

    // Create an img element to display the favicon
    const icon = document.createElement("img");
    icon.alt = "Website Icon";
    icon.style.width = "20px";
    icon.style.height = "20px";
    icon.style.verticalAlign = "middle";
    icon.style.marginRight = "10px"; // Ensure proper spacing between icon and text

    // Use the updated getFavicon function
    getFavicon(link.url).then((faviconUrl) => {
      icon.src = faviconUrl;
    });

    button.appendChild(icon);
    const buttonText = document.createTextNode(link.name);
    button.appendChild(buttonText);

    if (removeMode) {
      button.classList.add("remove-select");
      button.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent any default action
        toggleLinkSelection(button, link.id);
      });
    } else {
      button.addEventListener("click", () => window.open(link.url, "_blank"));
    }

    linkContainer.appendChild(button);

    if (isLoggedIn) {
      // Create down arrow button
      const downButton = document.createElement("button");
      downButton.classList.add("down-button");
      downButton.innerHTML = "&#x2193;"; // Unicode down arrow

      if (index === links.length - 1) {
        // Last link, disable down button
        downButton.disabled = true;
      } else {
        // Add event listener to swap order with next link
        downButton.addEventListener("click", () => {
          swapLinkOrder(link, links[index + 1]);
        });
      }

      linkContainer.appendChild(downButton);
    }

    container.appendChild(linkContainer);
  });

  updateRemoveButtonText();
}

// Swap the order of two links
function swapLinkOrder(link1, link2) {
  // Swap the order values
  const updates = {};
  updates[`links/${link1.id}/order`] = link2.order;
  updates[`links/${link2.id}/order`] = link1.order;

  db.ref().update(updates);
}

// Add link to Firebase with order value
submitAdd.addEventListener("click", () => {
  const name = document.getElementById("link-name").value;
  let url = document.getElementById("link-url").value;

  if (name && url) {
    // Ensure URL has http:// or https://
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }

    // Fetch existing links to get max order
    db.ref("links")
      .once("value")
      .then((snapshot) => {
        const data = snapshot.val();
        const links = data
          ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
          : [];
        const maxOrder = links.reduce(
          (max, link) => (link.order > max ? link.order : max),
          0
        );

        const newLinkKey = db.ref().child("links").push().key;
        const newLink = { name, url, order: maxOrder + 1 };
        db.ref(`links/${newLinkKey}`).set(newLink);

        document.getElementById("link-name").value = "";
        document.getElementById("link-url").value = "";
        addModal.classList.add("hidden");
      });
  }
});

// Enter Remove Mode
removeButton.addEventListener("click", () => {
  if (removeMode && selectedLinks.size > 0) {
    removeSelectedLinks();
  } else {
    removeMode = !removeMode;
    selectedLinks.clear(); // Reset selected links when toggling remove mode
    removeButton.classList.toggle("remove-mode");
    fetchLinks();
  }
});

// Toggle link selection for removal
function toggleLinkSelection(button, linkId) {
  button.classList.toggle("selected");
  if (selectedLinks.has(linkId)) {
    selectedLinks.delete(linkId);
  } else {
    selectedLinks.add(linkId);
  }
  updateRemoveButtonText(); // Update the button text based on selections
}

// Update the remove button text
function updateRemoveButtonText() {
  if (removeMode) {
    if (selectedLinks.size > 0) {
      removeButton.textContent = `Confirm Remove (${selectedLinks.size})`;
    } else {
      removeButton.textContent = "Cancel";
    }
  } else {
    removeButton.textContent = "Remove Link";
  }
}

// Remove selected links
function removeSelectedLinks() {
  selectedLinks.forEach((linkId) => {
    db.ref(`links/${linkId}`).remove();
  });
  selectedLinks.clear();
  removeMode = false;
  removeButton.classList.remove("remove-mode");
  fetchLinks();
}

// Close the modal when clicking outside
window.addEventListener("click", (event) => {
  if (event.target === addModal) {
    addModal.classList.add("hidden");
  }
});

// Event Listeners for the modal and buttons
addButton.addEventListener("click", () => addModal.classList.remove("hidden"));
closeButton.addEventListener("click", () => addModal.classList.add("hidden"));

// Authentication Elements
const openLoginModalButton = document.getElementById("open-login-modal");
const loginModal = document.getElementById("login-modal");
const loginButton = document.getElementById("login-button");
const closeLoginButton = document.querySelector(".close-login");

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

// Check Authentication State
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    isLoggedIn = true;
    // User is signed in
    addButton.style.display = "inline-block";
    removeButton.style.display = "inline-block";
    openLoginModalButton.style.display = "none";
    logoutButton.style.display = "inline-block";
  } else {
    isLoggedIn = false;
    // No user is signed in
    addButton.style.display = "none";
    removeButton.style.display = "none";
    openLoginModalButton.style.display = "inline-block";
    logoutButton.style.display = "none";
  }
  fetchLinks(); // Re-fetch the links to update the UI
});

const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      alert("Logged out successfully!");
    });
});

// Fetch initial links
fetchLinks();
