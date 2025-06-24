// ==UserScript==
// @name        Quick Artist Hide
// @namespace   io.github.poneyclairdelune.quickDerpiArtistHide
// @match       https://derpibooru.org/*
// @sandbox     raw
// @homepage    https://github.com/PoneyClairDeLune/custom-utils/blob/main/derpibooru/quickArtistHide.user.js
// @grant       none
// @version     0.0.1
// @author      -
// @description Adds a button to allow you hide the artist of a certain image.
// @run-at      document-idle
// @license     GNU AGPL v3.0
// ==/UserScript==
"use strict";

//console.debug("Mooffins and Mooreos with Mooswin.");

(() => {
	const createE = (tagName, classList, content) => {
		let el = document.createElement(tagName);
		if (classList?.length > 0) {
			for (let e of classList) {
				el.classList.add(e);
			};
		};
		if (content?.length > 0) {
			for (let e of content) {
				el.append(e);
			};
		};
		return el;
	};
	const getDerpiTag = (imageTag) => {
		let result = "";
		for (let e of imageTag) {
			switch (e) {
				case " ": {
					result += "+";
					break;
				};
				case "-": {
					result += "-dash-";
					break;
				};
				case ":": {
					result += "-colon-";
					break;
				};
				default: {
					result += e;
				};
			};
		};
		return result;
	};

	const csrfToken = document.querySelector("meta[name='csrf-token']").content;
	for (let mBox of document.querySelectorAll("div.media-box")) {
		let [mBoxH, mBoxB] = mBox.children;
		//console.debug(mBoxH);
		let hideArtistButton = createE("a", ["interaction--hide-artist"], [
			createE("i", ["fa-solid", "fa-triangle-exclamation"])
		]);
		hideArtistButton.style = "color: #ff0;";
		hideArtistButton.addEventListener("contextmenu", async function (ev) {
			ev.preventDefault();
			ev.stopImmediatePropagation();
			let isHiding = this.className === "interaction--hide-artist";
			hideArtistButton.style.color = "#0f5";
			// Extract the tags
			let tagString = mBoxB.querySelector("div.image-container > a").title,
			tagStringStart = tagString.indexOf("Tagged: ");
			if (tagStringStart !== -1) {
				tagStringStart += 8;
			} else {
				tagStringStart = 0;
			};
			let artistTags = [];
			for (let tag of tagString.substring(tagStringStart).split(", ")) {
				if (tag.substring(0, 7) === "artist:") {
					artistTags.push(tag);
				};
			};
			console.debug(artistTags);
			// Send the tag hiding/unhiding request
			for (let tag of artistTags) {
				console.debug(getDerpiTag(tag));
				let resp = await fetch(`https://derpibooru.org/filters/hide?tag=${getDerpiTag(tag)}`, {
					"credentials": "include",
					"method": isHiding ? "POST" : "DELETE",
					"headers": {
						"X-CSRF-Token": csrfToken
					}
				});
				console.debug(resp.status);
			};
			if (isHiding) {
				this.className = "interaction--show-artist";
				hideArtistButton.style.color = "#5f0";
			} else {
				this.className = "interaction--hide-artist";
				hideArtistButton.style.color = "#ff0";
			};
			// Visual notification
			console.debug("Moo!");
		});
		mBoxH.appendChild(hideArtistButton);
		console.debug("Moo?");
	};
})();