// js/ui.js

import { swapLinkOrder, removeLink, addLink, fetchLinks } from "./database.js";
import { authState } from "./auth.js";

// Elements
const container = document.getElementById("links-container");
const addButton = document.getElementById("add-button");
const removeButton = document.getElementById("remove-button");
const addModal = document.getElementById("add-modal");
const submitAdd = document.getElementById("submit-add");
const closeButton = document.querySelector(".close-button");

// UI State Object
export const uiState = {
  removeMode: false,
  selectedLinks: new Set(),
};

// Display links in the UI
export function displayLinks(links) {
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
    icon.style.marginRight = "10px";

    getFavicon(link.url).then((faviconUrl) => {
      icon.src = faviconUrl;
    });

    button.appendChild(icon);
    const buttonText = document.createTextNode(link.name);
    button.appendChild(buttonText);

    if (uiState.removeMode) {
      button.classList.add("remove-select");
      button.addEventListener("click", (e) => {
        e.preventDefault();
        toggleLinkSelection(button, link.id);
      });
    } else {
      button.addEventListener("click", () => window.open(link.url, "_blank"));
    }

    linkContainer.appendChild(button);

    if (authState.isLoggedIn) {
      const downButton = document.createElement("button");
      downButton.classList.add("down-button");
      downButton.innerHTML = "&#x2193;";

      if (index === links.length - 1) {
        downButton.disabled = true;
      } else {
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

// Fetch the favicon
function getFavicon(linkUrl) {
  const domain = new URL(linkUrl).hostname;
  return Promise.resolve(
    `https://external-content.duckduckgo.com/ip3/${domain}.ico`
  );
}

// Toggle link selection for removal
function toggleLinkSelection(button, linkId) {
  button.classList.toggle("selected");
  if (uiState.selectedLinks.has(linkId)) {
    uiState.selectedLinks.delete(linkId);
  } else {
    uiState.selectedLinks.add(linkId);
  }
  updateRemoveButtonText();
}

// Update the remove button text
function updateRemoveButtonText() {
  if (uiState.removeMode) {
    if (uiState.selectedLinks.size > 0) {
      removeButton.textContent = `Confirm Remove (${uiState.selectedLinks.size})`;
    } else {
      removeButton.textContent = "Cancel";
    }
  } else {
    removeButton.textContent = "Remove Link";
  }
}

// Remove selected links
function removeSelectedLinks() {
  uiState.selectedLinks.forEach((linkId) => {
    removeLink(linkId);
  });
  uiState.selectedLinks.clear();
  uiState.removeMode = false;
  removeButton.classList.remove("remove-mode");
  fetchLinks();
}

// Event Listeners
addButton.addEventListener("click", () => addModal.classList.remove("hidden"));
closeButton.addEventListener("click", () => addModal.classList.add("hidden"));

window.addEventListener("click", (event) => {
  if (event.target === addModal) {
    addModal.classList.add("hidden");
  }
});

// Add link functionality
submitAdd.addEventListener("click", () => {
  const name = document.getElementById("link-name").value;
  let url = document.getElementById("link-url").value;

  if (name && url) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }

    addLink(name, url, () => {
      document.getElementById("link-name").value = "";
      document.getElementById("link-url").value = "";
      addModal.classList.add("hidden");
    });
  }
});

// Enter Remove Mode
removeButton.addEventListener("click", () => {
  if (uiState.removeMode && uiState.selectedLinks.size > 0) {
    removeSelectedLinks();
  } else {
    uiState.removeMode = !uiState.removeMode;
    uiState.selectedLinks.clear();
    removeButton.classList.toggle("remove-mode");
    fetchLinks();
  }
});
