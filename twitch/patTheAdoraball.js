"use strict";

self.redeemName = "Patpat the pega";

let pattingJob = function () {
    if ($("div#channel-points-reward-center-body")) {
        if ($("div.rewards-list")) {
            // Try to proceed to the redeem
            let rE = $(`div.rewards-list>div>div:has(img[alt='${redeemName}']) button`);
            console.debug(`Selection phase: %o`, rE);
            rE?.click();
            return 1;
        } else {
            // Try to redeem
            console.debug(`Redeem phase.`);
            let redeemButton = $("div#channel-points-reward-center-body button");
            if (redeemButton && !redeemButton?.disabled) {
                // Redeem with enough points
                redeemButton.click();
            } else {
                // Close the redeem for now
                let redeemHeader = $("div.rewards-popover-header > div");
                redeemHeader.children[redeemHeader.children.length - 1]?.querySelector("button")?.click();
            };
            return 2;
        };
    } else {
        console.debug(`Idle phase.`);
        // Try to open the rewards panel
        $("button:has(div[data-test-selector='bits-balance-string'])")?.click();
        return 0;
    };
};

self.pattingThread = setInterval(pattingJob, 5000);
