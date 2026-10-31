// ==UserScript==
// @name        Onion Usher
// @namespace   io.github.poneyclairdelune.onionUsher
// @match       https://derpibooru.org/**
// @match       https://trixiebooru.org/**
// @homepage    https://github.com/PoneyClairDeLune/custom-utils/blob/main/derpibooru/onionUsher.js
// @grant       none
// @version     0.0.1
// @author      Lumière Élevé
// @description Personal score viewer for Derpibooru April Fool's 2025
// @run-at      document-start
// @license     GNU AGPL v3.0
// ==/UserScript==
"use strict";

let protocol = "http:";
let hostname;
switch (location.host) {
	case "derpibooru.org":
	case "trixiebooru.org": {
		protocol = "https:";
		hostname = "derpibooruqmsxtgwn3u4opg3jdtw7dhfggxsycoof5wrejt6palppad.onion";
	};
};

if (hostname) {
	location.href = location.href.replace(`${location.protocol}//${location.hostname}/`, `${protocol}//${hostname}/`);
};