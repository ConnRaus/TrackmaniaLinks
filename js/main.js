// js/main.js

import "./firebaseConfig.js";
import "./auth.js";
import "./ui.js";
import { fetchLinks } from "./database.js";

// Fetch initial links
fetchLinks();
