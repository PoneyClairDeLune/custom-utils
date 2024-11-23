// ==UserScript==
// @name        Custom Twitch Utils
// @namespace   io.github.poneyclairdelune.ctu
// @match       https://www.twitch.tv/*
// @grant       none
// @version     0.1.11
// @author      Lumière Élevé
// @description 19/04/2024, 17:33:32; 25/04/2024, 16:05:46; 23/11/2024, 14:15:53
// ==/UserScript==

"use strict";

const conf = {
	"minecraftBot": false,
	"pointCollector": true
};

// CRC32, direct rewrite of src/libbz3.c#L31-L66@github.com/kspalaiologos/bzip3
const crc32Table = [
	0x00000000, 0xF26B8303, 0xE13B70F7, 0x1350F3F4, 0xC79A971F, 0x35F1141C, 0x26A1E7E8, 0xD4CA64EB,
	0x8AD958CF, 0x78B2DBCC, 0x6BE22838, 0x9989AB3B, 0x4D43CFD0, 0xBF284CD3, 0xAC78BF27, 0x5E133C24,
	0x105EC76F, 0xE235446C, 0xF165B798, 0x030E349B, 0xD7C45070, 0x25AFD373, 0x36FF2087, 0xC494A384,
	0x9A879FA0, 0x68EC1CA3, 0x7BBCEF57, 0x89D76C54, 0x5D1D08BF, 0xAF768BBC, 0xBC267848, 0x4E4DFB4B,
	0x20BD8EDE, 0xD2D60DDD, 0xC186FE29, 0x33ED7D2A, 0xE72719C1, 0x154C9AC2, 0x061C6936, 0xF477EA35,
	0xAA64D611, 0x580F5512, 0x4B5FA6E6, 0xB93425E5, 0x6DFE410E, 0x9F95C20D, 0x8CC531F9, 0x7EAEB2FA,
	0x30E349B1, 0xC288CAB2, 0xD1D83946, 0x23B3BA45, 0xF779DEAE, 0x05125DAD, 0x1642AE59, 0xE4292D5A,
	0xBA3A117E, 0x4851927D, 0x5B016189, 0xA96AE28A, 0x7DA08661, 0x8FCB0562, 0x9C9BF696, 0x6EF07595,
	0x417B1DBC, 0xB3109EBF, 0xA0406D4B, 0x522BEE48, 0x86E18AA3, 0x748A09A0, 0x67DAFA54, 0x95B17957,
	0xCBA24573, 0x39C9C670, 0x2A993584, 0xD8F2B687, 0x0C38D26C, 0xFE53516F, 0xED03A29B, 0x1F682198,
	0x5125DAD3, 0xA34E59D0, 0xB01EAA24, 0x42752927, 0x96BF4DCC, 0x64D4CECF, 0x77843D3B, 0x85EFBE38,
	0xDBFC821C, 0x2997011F, 0x3AC7F2EB, 0xC8AC71E8, 0x1C661503, 0xEE0D9600, 0xFD5D65F4, 0x0F36E6F7,
	0x61C69362, 0x93AD1061, 0x80FDE395, 0x72966096, 0xA65C047D, 0x5437877E, 0x4767748A, 0xB50CF789,
	0xEB1FCBAD, 0x197448AE, 0x0A24BB5A, 0xF84F3859, 0x2C855CB2, 0xDEEEDFB1, 0xCDBE2C45, 0x3FD5AF46,
	0x7198540D, 0x83F3D70E, 0x90A324FA, 0x62C8A7F9, 0xB602C312, 0x44694011, 0x5739B3E5, 0xA55230E6,
	0xFB410CC2, 0x092A8FC1, 0x1A7A7C35, 0xE811FF36, 0x3CDB9BDD, 0xCEB018DE, 0xDDE0EB2A, 0x2F8B6829,
	0x82F63B78, 0x709DB87B, 0x63CD4B8F, 0x91A6C88C, 0x456CAC67, 0xB7072F64, 0xA457DC90, 0x563C5F93,
	0x082F63B7, 0xFA44E0B4, 0xE9141340, 0x1B7F9043, 0xCFB5F4A8, 0x3DDE77AB, 0x2E8E845F, 0xDCE5075C,
	0x92A8FC17, 0x60C37F14, 0x73938CE0, 0x81F80FE3, 0x55326B08, 0xA759E80B, 0xB4091BFF, 0x466298FC,
	0x1871A4D8, 0xEA1A27DB, 0xF94AD42F, 0x0B21572C, 0xDFEB33C7, 0x2D80B0C4, 0x3ED04330, 0xCCBBC033,
	0xA24BB5A6, 0x502036A5, 0x4370C551, 0xB11B4652, 0x65D122B9, 0x97BAA1BA, 0x84EA524E, 0x7681D14D,
	0x2892ED69, 0xDAF96E6A, 0xC9A99D9E, 0x3BC21E9D, 0xEF087A76, 0x1D63F975, 0x0E330A81, 0xFC588982,
	0xB21572C9, 0x407EF1CA, 0x532E023E, 0xA145813D, 0x758FE5D6, 0x87E466D5, 0x94B49521, 0x66DF1622,
	0x38CC2A06, 0xCAA7A905, 0xD9F75AF1, 0x2B9CD9F2, 0xFF56BD19, 0x0D3D3E1A, 0x1E6DCDEE, 0xEC064EED,
	0xC38D26C4, 0x31E6A5C7, 0x22B65633, 0xD0DDD530, 0x0417B1DB, 0xF67C32D8, 0xE52CC12C, 0x1747422F,
	0x49547E0B, 0xBB3FFD08, 0xA86F0EFC, 0x5A048DFF, 0x8ECEE914, 0x7CA56A17, 0x6FF599E3, 0x9D9E1AE0,
	0xD3D3E1AB, 0x21B862A8, 0x32E8915C, 0xC083125F, 0x144976B4, 0xE622F5B7, 0xF5720643, 0x07198540,
	0x590AB964, 0xAB613A67, 0xB831C993, 0x4A5A4A90, 0x9E902E7B, 0x6CFBAD78, 0x7FAB5E8C, 0x8DC0DD8F,
	0xE330A81A, 0x115B2B19, 0x020BD8ED, 0xF0605BEE, 0x24AA3F05, 0xD6C1BC06, 0xC5914FF2, 0x37FACCF1,
	0x69E9F0D5, 0x9B8273D6, 0x88D28022, 0x7AB90321, 0xAE7367CA, 0x5C18E4C9, 0x4F48173D, 0xBD23943E,
	0xF36E6F75, 0x0105EC76, 0x12551F82, 0xE03E9C81, 0x34F4F86A, 0xC69F7B69, 0xD5CF889D, 0x27A40B9E,
	0x79B737BA, 0x8BDCB4B9, 0x988C474D, 0x6AE7C44E, 0xBE2DA0A5, 0x4C4623A6, 0x5F16D052, 0xAD7D5351
];
let crc32Sum = (crc, u8Buf) => {
	if (u8Buf?.BYTES_PER_ELEMENT != 1) {
		throw(new TypeError(`Input is not Uint8Array`));
	};
	for (let i = 0; i < u8Buf.length; i ++) {
		crc = crc32Table[((crc & 255) ^ u8Buf[i]) & 255] ^ (crc >>> 8);
		//console.debug(`Round ${i + 1} sum is: ${crc}`);
	};
	return crc;
};
let u8Enc = new TextEncoder();
let crc32SumText = (text) => {
	let t = crc32Sum(0, u8Enc.encode(text));
	//console.debug(`Calculated sum: ${t}`);
	return t;
};
let createHashedArray = (input) => {
	let hashedArray = new Int32Array(input.length);
	input.forEach((e, i) => {
		let s = crc32SumText(e);
		hashedArray[i] = s;
		console.debug(`Created entry: ${s.toString(16)}`);
	});
	return hashedArray;
};

const blockedUsers = createHashedArray("00_aaliyah,00_ava,00_darla,0livia_is_lonely,0__sophia,0_lonely_egirl,4jug,8hvdes,8roe,a_ok,aliceydra,anotherttvviewer,ashley_page,asmr_miyu,axfq,captainshadowthehedgehog8,commanderroot,confidence,coochieman6942021,d0nk7,david3cetqd,denyiai,dn9n,drapsnatt,edward4rijf4,feelssunnyman,framerates,fwoxty,georgew2ms8p,im_socurious,iwill_beback,jackerhikaru,jasonc8l4wl,jasonnvs1x4,jeffl0ab8p,joseph1zj6gg,lady94two,lilfuwafuw,markzynk,mersufy,michaelqmz35a,princessdark666,psh_aa,redterror_,regressz,richard9oipjx,richie_rich_9000,rockn__,rodorigesuuu,sarahaley011,scorpyl2,sukoxi,tarsai,tiggerbandit,vincenine,vlmercy,williamvea2rw,yosharpia,zhestykey,littleshyfim,mizoreai,pinkamena_usuario,princessoflovepinkyt,radiant_sword,tiniencdmxtv".split(","));
const ignoreChatRestrictionKeywords = "connec,verbind,csatlakozás,подключение,接続,連線,mode,modus,mód,modo,moda,режим,モード,模式,follow,suiv,folg,köve,segu,фолловеров,フォロー,追蹤".normalize("NFD").split(",");

let locationHash;

let selectMinecraftStream = () => {
	let targets = [], runCount = 0;
	document.querySelectorAll("a[data-a-target=preview-card-game-link]").forEach((e) => {
		if (e.innerText == "Minecraft") {
			console.debug(`[Custom Twitch Utils] Found!`);
			targets.push(e.parentElement.parentElement.querySelector("a.preview-card-channel-link").href);
		}/* else {
			console.debug(`Not "${e.innerText}"...`);
		}*/;
		runCount ++;
	});
	if (targets.length) {
		return {
			href: `${targets[Math.floor(Math.random() * targets.length)]}#minecraftGet`,
			stay: Math.min(1, targets * 0.2)
		};
	};
	if (!runCount) {
		return {
			href: `wait`,
			stay: 0
		};
	};
};

let switchAnotherStreamerTask;

let startObserver = (appMount) => {
	console.debug("[Custom Twitch Utils] Observer started.");
	let cssStyle = document.createElement("style");
	cssStyle.innerHTML = `/*Eyesore filter*/img[alt*="r/place 2023"],div.side-nav-section[aria-label*="recomm"],div.top-nav__prime,div[data-target=channel-header-right] div[data-a-target$=-label-text]:nth-child(n+2),div.top-nav__menu>div:nth-child(3) div[data-a-target$=-label-text]{display:none !important;}/*On-demand mod icons*/div[class*=" chat-line__no"]>div{display:inline-flex!important;flex-direction:column;width:100%}div[class*=" chat-line__no"]>div>*:nth-last-child(2n){display:none!important;order:3;text-align:right;position:relative;top:-1.8rem;max-height:0}div[class*=" chat-line__no"]:hover>div>div:nth-last-child(4){display:inline!important}div[class*=" chat-line__no"] button.mod-icon{background:#0007}span.chat-line__timestamp{text-align:right;height:0}div.chat-line__username-container{max-width:calc(100% - 4rem)}div.chat-line__username-container>span:nth-child(1){float:right;padding-right:0rem}div[class*=" chat-line__no"]:hover div.chat-line__username-container>span:nth-child(1){padding-right:1.6rem}`;
	document.head.append(cssStyle);
	let tickingTask = async (source = 0) => {
		let streamerPoints = document.querySelector("div.community-points-summary > div:nth-child(2) button");
		if (streamerPoints && conf.pointCollector) {
			streamerPoints.click();
			console.debug("[Custom Twitch Utils] Points collected!");
		} else if (!source) {
			//console.debug("Point collector idle.");
		};
		(async () => {
				document.querySelectorAll("div.chatter-list-item")?.forEach((e1) => {
				let c = e1.innerText.toLowerCase(), s = crc32SumText(c);
				if (blockedUsers.indexOf(s) > -1) {
					e1.parentElement.remove();
					console.debug(`[Custom Twitch Utils] Target observer blocked "${c}" (${s.toString(16)}).`);
				} else if (!e1.hashedOnce) {
					e1.hashedOnce = true;
					console.debug(`[Custom Twitch Utils] Skipped observer "${c}" (${s.toString(16)}).`);
				};
			});
		})();
		(async () => {
			if (!conf.minecraftBot) {
				return;
			};
			// Minecraft stream watcher
			switch (self.location.pathname) {
				case "/directory/all/tags/pony": {
					let selected = selectMinecraftStream();
					if (selected.href == "wait") {
						console.debug(`Waiting...`);
					} else if (selected.href && Math.random() < selected.stay) {
						location.href = selected.href;
					} else {
						location.href = "/directory/all/tags/minecraft";
					};
					break;
				};
				case "/directory/all/tags/minecraft": {
					let selected = selectMinecraftStream();
					if (selected.href == "wait") {
						console.debug(`Waiting...`);
					} else if (selected.href) {
						location.href = selected.href;
					} else {
						location.href = "/directory/all/tags/minecraft";
					};
					break;
				};
				default: {
					if (location.hash) {
						locationHash = location.hash.replace("#", "");
					};
					//console.debug(locationHash);
					switch (locationHash) {
						case "": {
							break;
						};
						case "minecraftGet": {
							let videoElement = document.querySelector("video");
							if (videoElement.volume > 0.05) {
								videoElement.volume = 0.02;
							};
							if (!switchAnotherStreamerTask?.constructor) {
								let timeLeft = 300000 + Math.floor(Math.random() * 600000);
								document.querySelector(".tw-animated-glitch-logo").innerHTML = `<img src="https://cdn.discordapp.com/emojis/1238166216426913803.webp?size=40&quality=lossless">`
								switchAnotherStreamerTask = setTimeout(() => {
									location.href = `https://www.twitch.tv/directory/all/tags/pony`;
								}, timeLeft);
								console.warn(`[Custom Twitch Utils] Will switch to the next stream ${timeLeft / 1000} seconds later: ${new Date(Date.now() + timeLeft)}.`);
							};
							let chatRestriction = document.querySelector("div.chat-input-tray__open--persistent p")?.innerText?.toLowerCase().normalize("NFD").trim();
							//console.debug(`[Custom Twitch Utils] "${ignoreChatRestrictionKeywords}".`);
							//console.debug(`[Custom Twitch Utils] ${chatRestriction}`);
							/*if (chatRestriction && chatRestriction.length > 2) {
								let restrictionRespected = true;
								for (let i = 0; i < ignoreChatRestrictionKeywords.length; i ++) {
									if (!restrictionRespected) {
										continue;
									};
									if (chatRestriction.indexOf(ignoreChatRestrictionKeywords[i]) > -1) {
										restrictionRespected = false;
					//console.debug(`[Custom Twitch Utils] "${ignoreChatRestrictionKeywords[i]}" found in "${chatRestriction}".`);
									} else {
										//console.debug(`[Custom Twitch Utils] "${ignoreChatRestrictionKeywords[i]}" not found in "${chatRestriction}".`);
									};
								};
								if (restrictionRespected) {
									// Freedom of speech shall be respected, blanket bans are not acceptable
									location.href = "/directory/all/tags/pony";
								};
							};*/
							break;
						};
						default: {
							console.debug(locationHash);
						};
					};
				};
			};
		})();
	};
	let cyclicId = setInterval(tickingTask, 5000);
	let removeObserver = new MutationObserver((records) => {
		tickingTask(1);
		records.forEach((e) => {
			e.addedNodes.forEach((e0) => {
				if (e0?.querySelector?.constructor != Function) {
					return;
				};
				e0?.querySelectorAll("div.tw-tower p[data-a-target=preview-card-channel-link]")?.forEach((e1) => {
					let c = e1.innerText.toLowerCase(), s = crc32SumText(c);
					if (blockedUsers.indexOf(s) > -1) {
						e1.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
						console.debug(`[Custom Twitch Utils] Target streamer blocked (${s.toString(16)}).`);
					} else {
						//console.debug(blockedUsers);
						console.debug(`[Custom Twitch Utils] Skipped streamer "${c}" (${s.toString(16)}).`);
					};
				});
			});
		})
	});
	removeObserver.observe(appMount, {
		subtree: true,
		childList: true
	});
};
let appMount = document.querySelector("div.root-scrollable.scrollable-area");
if (appMount) {
	startObserver(appMount);
} else {
	console.debug("[Custom Twitch Utils] Observer waiting...");
	let rootObserver = new MutationObserver((records) => {
		appMount = document.querySelector("div.root-scrollable.scrollable-area");
		if (appMount) {
			startObserver(appMount);
			rootObserver.disconnect();
		} else {
			console.debug("[Custom Twitch Utils] Observer skipped.");
		};
	});
	rootObserver.observe(document.body, {
		subtree: true,
		childList: true
	});
};
