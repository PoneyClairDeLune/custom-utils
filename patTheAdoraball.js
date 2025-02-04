"use strict";

let redeemName = "Patpat the pega";

let pattingJob = () => {
	if ($("div#channel-points-reward-center-body")) {
		if ($("div.rewards-list")) {
			// Try to proceed to the redeem
			$(`div.reward-list-item>div:has(p[title='${redeemName}']) button`)?.click();
		} else {
			// Try to redeem
			let redeemButton = $("div#channel-points-reward-center-body button");
			if (redeemButton && !redeemButton?.disabled) {
				// Redeem with enough points
				redeemButton.click();
			} else {
				// Close the redeem for now
				let redeemHeader = $("div.rewards-popover-header > div");
				redeemHeader.children[redeemHeader.children.length - 1]?.querySelector("button")?.click();
			};
		};
	} else {
		// Try to open the rewards panel
		$("button:has(.channel-points-icon)")?.click();
	};
};

self.pattingThread = setInterval(pattingJob, 2000);
