// js/database.js

import { db } from "./firebaseConfig.js";
import { displayLinks } from "./ui.js";

// Fetch links from database
export function fetchLinks() {
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

// Swap the order of two links
export function swapLinkOrder(link1, link2) {
  // Swap the order values
  const updates = {};
  updates[`links/${link1.id}/order`] = link2.order;
  updates[`links/${link2.id}/order`] = link1.order;

  db.ref().update(updates);
}

// Remove a link
export function removeLink(linkId) {
  db.ref(`links/${linkId}`).remove();
}

// Add a new link
export function addLink(name, url, callback) {
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

      if (callback) callback();
    });
}
