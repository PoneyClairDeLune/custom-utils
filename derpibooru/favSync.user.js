// ==UserScript==
// @name        Sync Favourites
// @namespace   io.github.poneyclairdelune.favSync
// @match       https://derpibooru.org/search*
// @sandbox     raw
// @homepage    https://github.com/PoneyClairDeLune/custom-utils/blob/main/derpibooru/favSync.user.js
// @grant       none
// @version     0.0.1
// @author      -
// @description Sync favourites from one account to another when searching for the prefix `!my:faves AND faved_by:<user> AND `.
// @run-at      document-idle
// @license     GNU AGPL v3.0
// ==/UserScript==

"use strict";

let sleepWait = async function (ms) {
	// From Twinkle Sprinkle
	return new Promise((proceed) => {
		if (self.AbortSignal) {
			AbortSignal.timeout(ms).addEventListener("abort", proceed);
		} else {
			setTimeout(proceed, ms);
		};
	});
}

if (decodeURIComponent(location.search).substring(1).search(/^q=\!my:faves\+AND\+faved_by:[A-Za-z_-]+\b\+AND\+/) > -1) {
	console.debug("Syncing started.");
	const stepIntervalMs = 500;
	let waitAllSettle = [], stepNumber = 0, stepWaitMs = 0;
	for (let imageEntry of document.querySelectorAll("div.media-box")) {
		let imageId = imageEntry.getAttribute("data-image-id"),
		favButton = imageEntry.querySelector("a.interaction--fave");
		if (!favButton.classList.contains("active")) {
			//console.debug(`Image "${imageId}": planned.`);
			waitAllSettle.push((async () => {
				await sleepWait(stepWaitMs);
				console.debug(`Image "${imageId}": started.`);
				favButton.click();
				await sleepWait(5000);
				console.debug(`Image "${imageId}": finished.`);
				/*let req = await fetch(`https://derpibooru.org/images/${imageId}/fave`, {
					"method": "POST",
					"credentials": "include",
					"referrer": "about:client",
					"body": `{"_method":"POST"}`
				});
				console.debug(`Image "${imageId}": finished.`);
				console.debug(req.status);*/
			})());
		} else {
			console.debug(`Image "${imageId}": skipped.`);
		};
		stepNumber ++;
		stepWaitMs += stepIntervalMs;
	};
	Promise.allSettled(waitAllSettle).then(async () => {
		console.debug(`Task finished.`);
		await sleepWait(5000);
		location.reload();
	});
};
