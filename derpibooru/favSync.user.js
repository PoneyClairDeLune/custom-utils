// ==UserScript==
// @name        Sync Favourites
// @namespace   io.github.poneyclairdelune.favSync
// @match       https://derpibooru.org/search*
// @sandbox     raw
// @homepage    https://github.com/PoneyClairDeLune/custom-utils/blob/main/derpibooru/favSync.user.js
// @grant       none
// @version     0.0.3
// @author      -
// @description Sync favourites from one account to another when searching for the prefix `!my:faves AND faved_by:<user> AND `.
// @run-at      document-idle
// @license     GNU AGPL v3.0
// ==/UserScript==

"use strict";

//console.debug("Synchronizer started.");

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
let runPass = async function (elementIterator) {
	const stepIntervalMs = 250;
	let waitAllSettle = [], stepNumber = 0, stepWaitMs = 0;
	for (let imageEntry of elementIterator) {
		let imageId = imageEntry.getAttribute("data-image-id"),
		favButton = imageEntry.querySelector("a.interaction--fave");
		if (!favButton.classList.contains("active")) {
			//console.debug(`Image "${imageId}": planned.`);
			waitAllSettle.push((async () => {
				await sleepWait(stepWaitMs);
				//console.debug(`Image "${imageId}": started.`);
				favButton.click();
				await sleepWait(2000);
				scrollTo(0, imageEntry.offsetTop);
				console.debug(`Image "${imageId}": finished.`);
			})());
		} else {
			console.debug(`Image "${imageId}": skipped.`);
		};
		stepNumber ++;
		stepWaitMs += stepIntervalMs;
	};
	await Promise.allSettled(waitAllSettle);
};

if (decodeURIComponent(location.search).substring(1).search(/^q=\!my:faves\+AND\+faved_by:[A-Za-z_-]+\b\+AND\+/) > -1) {
	(async () => {
		console.debug("Syncing started.");
		console.debug(`Pass #1: Initiation.`);
		await runPass(document.querySelectorAll("div.media-box"));
		console.debug(`Pass #2: Assurance.`);
		await runPass(document.querySelectorAll("div.media-box"));
		console.debug(`Task finished.`);
		await sleepWait(4000);
		location.reload();
	})();
};
