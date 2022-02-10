/* Wallapop wrapper v1.10 */
//Bidders: richaudience, appnexus, criteo, ix, smartadserver, rubicon

var raiGptScr = document.createElement("script");
raiGptScr.id = "gptSrc";
raiGptScr.setAttribute('async', '');
raiGptScr.src = "//www.googletagservices.com/tag/js/gpt.js";
document.getElementsByTagName("head")[0].appendChild(raiGptScr);


var raiPrebidScr = document.createElement("script");
raiPrebidScr.id = "prebidScr";
raiPrebidScr.src = "//bridge.richmediastudio.com/ab083674fb8200b877a6983126e4477d/wallapop/pb_wrapper/dev/prebid.js";

document.getElementsByTagName("head")[0].appendChild(raiPrebidScr);

var raiPlacementObj = [
    {
        adUnit: 'Desktop_Home/Bottom',
        desktop: {
            raiPlacement: '0qKAsxIFaE',
            apnPlacement: '19120843',
            ixPlacement: '556508',
            criPlacement: '6866',
            sizes: [[728, 90], [970, 90], [970, 250], [980, 90], [980, 200], [980, 250]]
        },
        tablet: {
            raiPlacement: '1Aw3Kggz0q',
            apnPlacement: '19120843',
            ixPlacement: '556508',
            criPlacement: '6866',
            sizes: [[728, 90], [970, 90], [970, 250], [980, 90], [980, 200], [980, 250]]
        }
    },
    {
        adUnit: 'Web_Mobile_Home/Bottom',
        mobile: {
            raiPlacement: '5ZndbTvqUy',
            apnPlacement: '19120843',
            ixPlacement: '556524',
            criPlacement: '6866',
            sizes: [[300, 50], [300, 100], [300, 250], [300, 600], [320, 50], [320, 100], [336, 280]]
        }
    },
    {
        adUnit: 'Desktop_Home/Topbanner',
        desktop: {
            raiPlacement: '0jsT3E4MXi',
            apnPlacement: '19120840',
            ixPlacement: '556506',
            criPlacement: '6866',
            smartFormat: 103908,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147914,
            sizes: [[728, 90], [970, 90], [970, 250], [980, 90], [980, 200], [980, 250]]
        },
        tablet: {
            raiPlacement: 'ikZGWhCYBF',
            apnPlacement: '19120840',
            ixPlacement: '556506',
            criPlacement: '6866',
            smartFormat: 103908,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147914,
            sizes: [[728, 90], [970, 90], [970, 250], [980, 90], [980, 200], [980, 250]]
        }
    },
    {
        adUnit: 'Web_Mobile_Home/Topbanner',
        mobile: {
            raiPlacement: '0AxWX9SzUX',
            apnPlacement: '19120840',
            ixPlacement: '556518',
            criPlacement: '6866',
            smartFormat: 103908,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147914,
            sizes: [[300, 50], [300, 100], [320, 50], [320, 100]]
        }
    },
    {
        adUnit: 'web/home1',
        desktop: {
            smartFormat: 103904,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147906,
            sizes: [[728, 90], [970, 90], [970, 250], [980, 90], [980, 200], [980, 250]]
        },
        tablet: {
            smartFormat: 103904,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147906,
            sizes: [[728, 90], [728, 250]]
        },
        mobile: {
            smartFormat: 103904,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147906,
            sizes: [[300, 50], [300, 100], [320, 50], [320, 100]]
        }
    },
    {
        adUnit: 'web/home2',
        desktop: {
            smartFormat: 103905,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147908,
            sizes: [[728, 90], [970, 90], [970, 250], [980, 90], [980, 200], [980, 250]]
        },
        tablet: {
            smartFormat: 103905,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147908,
            sizes: [[728, 90], [728, 250]]
        },
        mobile: {
            smartFormat: 103905,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147908,
            sizes: [[300, 50], [300, 100], [320, 50], [320, 100]]
        }
    },
    {
        adUnit: 'web/home3',
        desktop: {
            smartFormat: 103906,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147910,
            sizes: [[728, 90], [970, 90], [970, 250], [980, 90], [980, 200], [980, 250]]
        },
        tablet: {
            smartFormat: 103906,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147910,
            sizes: [[728, 90], [728, 250]]
        },
        mobile: {
            smartFormat: 103906,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147910,
            sizes: [[300, 50], [300, 100], [320, 50], [320, 100]]
        }
    },
    {
        adUnit: 'web/home4',
        desktop: {
            smartFormat: 103907,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147912,
            sizes: [[728, 90], [970, 90], [970, 250], [980, 90], [980, 200], [980, 250], [970, 90]]
        },
        tablet: {
            smartFormat: 103907,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147912,
            sizes: [[728, 90], [728, 250]]
        },
        mobile: {
            smartFormat: 103907,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147912,
            sizes: [[300, 50], [300, 100], [320, 50], [320, 100]]
        }
    },
    {
        adUnit: 'Desktop_Itemdetail/Topbanner',
        desktop: {
            raiPlacement: 'NJE3MjXZDz',
            apnPlacement: '19120819',
            ixPlacement: '556502',
            criPlacement: '6866',
            smartFormat: 103909,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147916,
            sizes: [[728, 90], [970, 90], [970, 250], [980, 90], [980, 200], [980, 250]]
        },
        tablet: {
            raiPlacement: 'Ld86HgRW6k',
            apnPlacement: '19120819',
            ixPlacement: '556502',
            criPlacement: '6866',
            smartFormat: 103909,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147916,
            sizes: [[728, 90], [970, 90], [970, 250], [980, 90], [980, 200], [980, 250]]
        }
    },
    {
        adUnit: 'Desktop_Itemdetail/Left',
        desktop: {
            raiPlacement: 'JgldZihUUa',
            apnPlacement: '19120822',
            ixPlacement: '554149',
            criPlacement: '6866',
            smartFormat: 103910,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147918,
            sizes: [[120, 600], [160, 600], [300, 250], [300, 600], [336, 280], [336, 280]]
        },
        tablet: {
            raiPlacement: 'fgoLHjLV6p',
            apnPlacement: '19120822',
            ixPlacement: '554149',
            criPlacement: '6866',
            smartFormat: 103910,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147918,
            sizes: [[300, 50], [300, 100], [300, 250], [320, 50], [320, 100], [336, 280]]
        }
    },
    {
        adUnit: 'Desktop_Itemdetail/Right',
        desktop: {
            raiPlacement: 'D8vrkLtNqH',
            apnPlacement: '19120825',
            ixPlacement: '556501',
            criPlacement: '6866',
            smartFormat: 103911,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147920,
            sizes: [[120, 600], [160, 600], [300, 250], [300, 600], [336, 280], [336, 280]]
        },
        tablet: {
            raiPlacement: '1wxobNXtQj',
            apnPlacement: '19120825',
            ixPlacement: '556501',
            criPlacement: '6866',
            smartFormat: 103911,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147920,
            sizes: [[120, 600], [160, 600], [300, 250], [300, 600], [336, 280], [336, 280]]
        }
    },
    {
        adUnit: 'Desktop_Search/Topbanner',
        desktop: {
            raiPlacement: 'AS9DeoRJyC',
            apnPlacement: '19120832',
            ixPlacement: '556505',
            criPlacement: '6866',
            smartFormat: 103912,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147922,
            sizes: [[728, 90], [970, 90], [970, 250], [980, 90], [980, 200], [980, 250]]
        },
        tablet: {
            raiPlacement: '1x4hyST08V',
            apnPlacement: '19120832',
            ixPlacement: '556505',
            criPlacement: '6866',
            smartFormat: 103912,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147922,
            sizes: [[728, 90], [970, 90], [970, 250], [980, 90], [980, 200], [980, 250]]
        }
    },
    {
        adUnit: 'Web_Mobile_Search/Topbanner',
        mobile: {
            raiPlacement: '1XCzxSu4V0',
            apnPlacement: '19120832',
            ixPlacement: '556517',
            criPlacement: '6866',
            smartFormat: 103912,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147922,
            sizes: [[300, 50], [300, 100], [320, 50], [320, 100], [300, 250]]
        }
    },
    {
        adUnit: 'Desktop_Search/Topbanner_Seo',
        desktop: {
            raiPlacement: 'CH067oViFu',
            apnPlacement: '19161057',
            ixPlacement: '556510',
            criPlacement: '6866',
            smartFormat: 103913,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147924,
            sizes: [[728, 90], [970, 90], [970, 250], [980, 90], [980, 200], [980, 250]]
        },
        tablet: {
            raiPlacement: '1x4hyST08V',
            apnPlacement: '19120832',
            ixPlacement: '556505',
            criPlacement: '6866',
            smartFormat: 103912,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147922,
            sizes: [[728, 90], [970, 90], [970, 250], [980, 90], [980, 200], [980, 250]]
        },
    },
    {
        adUnit: 'Web_Mobile_Search/Topbanner_Seo',
        mobile: {
            raiPlacement: 'pp5Z9wTY7p',
            apnPlacement: '19161057',
            ixPlacement: '556516',
            criPlacement: '6866',
            smartFormat: 103913,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147924,
            sizes: [[300, 50], [300, 100], [320, 50], [320, 100], [320, 250]]
        }
    },
    {
        adUnit: 'Desktop_Search/Pos1_Right',
        desktop: {
            raiPlacement: '08jl3Vm5sJ',
            apnPlacement: '19120830',
            ixPlacement: '556504',
            criPlacement: '6866',
            smartFormat: 103914,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147926,
            sizes: [[120, 600], [160, 600], [300, 250], [300, 600], [336, 280]]
        }
    },
    {
        adUnit: 'Web_Mobile_Search/Pos1',
        mobile: {
            raiPlacement: 'nKB67mDqw2',
            apnPlacement: '19120830',
            ixPlacement: '556515',
            criPlacement: '6866',
            smartFormat: 103914,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147926,
            sizes: [[300, 50], [300, 100], [320, 50], [320, 100], [300, 250], [336, 280]]
        }
    },
    {
        adUnit: 'Desktop_Search/Pos2_Right',
        desktop: {
            raiPlacement: '18aqH2bwYJ',
            apnPlacement: '19120835',
            ixPlacement: '556503',
            criPlacement: '6866',
            smartFormat: 103915,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147928,
            sizes: [[120, 600], [160, 600], [300, 250], [300, 600], [336, 280]]
        }
    },
    {
        adUnit: 'Web_Mobile_Search/Pos2',
        mobile: {
            raiPlacement: '1okqh33U1o',
            apnPlacement: '19120835',
            ixPlacement: '556514',
            criPlacement: '6866',
            smartFormat: 103915,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147928,
            sizes: [[300, 50], [300, 100], [320, 50], [320, 100], [300, 250], [336, 280], [300, 600]]
        }
    },
    {
        adUnit: 'Desktop_Chat/Right',
        desktop: {
            raiPlacement: '0mendYhhyP',
            apnPlacement: '20792658',
            ixPlacement: '611976',
            criPlacement: '6866',
            sizes: [[120, 600], [300, 250], [336, 280], [160, 600], [300, 600], [240, 400]]
        },
        tablet: {
            raiPlacement: '0mendYhhyP',
            apnPlacement: '20792658',
            ixPlacement: '611976',
            criPlacement: '6866',
            sizes: [[300, 250], [336, 280], [300, 600], [240, 400]]
        },
        mobile: {
            raiPlacement: '0mendYhhyP',
            apnPlacement: '20792658',
            ixPlacement: '611976',
            criPlacement: '6866',
            sizes: [[300, 250], [336, 280], [300, 600], [240, 400]]
        }
    },
    {
        adUnit: 'Desktop_Search/Pos2_Right_Seo',
        desktop: {
            raiPlacement: '0ocPQnPs30',
            apnPlacement: '20024269',
            ixPlacement: '562428',
            criPlacement: '6866',
            smartFormat: 103917,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147932,
            sizes: [[120, 600], [160, 600], [300, 250], [300, 600], [336, 280]]
        },
        tablet : {
            raiPlacement: 'kPVAyJU3Eg',
            apnPlacement: '20024269',
            ixPlacement: '562428',
            sizes: [[120, 600], [160, 600], [300, 250], [300, 600], [336, 280]]
        },
    },
    {
        adUnit: 'Web_Mobile_Search/Pos2_Seo',
        mobile: {
            raiPlacement: 't5Vgtg5uXD',
            apnPlacement: '20024269',
            ixPlacement: '562426',
            criPlacement: '6866',
            smartFormat: 103917,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147932,
            sizes: [[300, 50], [300, 100], [320, 50], [320, 100], [300, 250], [336, 280], [300, 600]]
        }
    },
    {
        adUnit: 'Desktop_Search/Pos1_Right_Seo',
        desktop: {
            raiPlacement: '0ALQlsQW4k',
            apnPlacement: '20024208',
            ixPlacement: '562429',
            criPlacement: '6866',
            smartFormat: 103918,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147934,
            sizes: [[120, 600], [160, 600], [300, 250], [300, 600], [336, 280]]
        },
        tablet : {
            raiPlacement: '1VqQEvAJCU',
            apnPlacement: '20024208',
            ixPlacement: '562429',
            sizes: [[120, 600], [160, 600], [300, 250], [300, 600], [336, 280]]
        }
    },
    {
        adUnit: 'Web_Mobile_Search/Pos1_Seo',
        mobile: {
            raiPlacement: '1jjzrs7d1W',
            apnPlacement: '20024208',
            ixPlacement: '562427',
            criPlacement: '6866',
            smartFormat: 103918,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147934,
            sizes: [[300, 50], [300, 100], [320, 50], [320, 100], [300, 250], [336, 280]]
        }
    },
    {
        adUnit: 'Web_Mobile_User/Pos1',
        desktop: {
            raiPlacement: 'zRMzXfn3Th',
            apnPlacement: '19161055',
            ixPlacement: '556522',
            criPlacement: '6866',
            smartFormat: 103916,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147930,
            sizes: [[728, 90], [728, 250], [970, 90], [970, 250], [980, 90], [980, 200], [980, 250], [336, 280], [320, 250]]
        },
        tablet: {
            raiPlacement: '1imHwqNUkh',
            apnPlacement: '19161055',
            ixPlacement: '556522',
            criPlacement: '6866',
            smartFormat: 103916,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147930,
            sizes: [[728, 90], [728, 250], [970, 90], [970, 250], [980, 90], [980, 200], [980, 250], [336, 280], [320, 250]]
        },
        mobile: {
            raiPlacement: 'p7YhrZ1s9u',
            apnPlacement: '19161055',
            ixPlacement: '556522',
            criPlacement: '6866',
            smartFormat: 103916,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147930,
            sizes: [[300, 50], [300, 100], [300, 250], [320, 50], [320, 100], [336, 280], [300, 600]]
        }
    },
    {
        adUnit: 'web/user2',
        desktop: {
            smartFormat: 103919,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147936,
            sizes: [[728, 90], [970, 90], [970, 250], [980, 90], [980, 200], [980, 250]]
        },
        tablet: {
            smartFormat: 103919,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147936,
            sizes: [[728, 90], [728, 250]]
        },
        mobile: {
            smartFormat: 103919,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147936,
            sizes: [[300, 50], [300, 100], [300, 250], [320, 50], [320, 100], [336, 280], [300, 600]]
        }
    },
    {
        adUnit: 'Web_Mobile_Itemdetail/Pos1',
        mobile: {
            raiPlacement: '0AAmyHCYPI',
            apnPlacement: '19120819',
            ixPlacement: '556512',
            criPlacement: '6866',
            smartFormat: 103909,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147916,
            sizes: [[300, 50], [300, 100], [300, 250], [320, 50], [320, 100], [336, 280]]
        }
    },
    {
        adUnit: 'Web_Mobile_Itemdetail/Pos2',
        mobile: {
            raiPlacement: 'e2KDKMHx5e',
            apnPlacement: '19120822',
            ixPlacement: '556513',
            criPlacement: '6866',
            smartFormat: 103910,
            smartPage: 1411039,
            smartSite: 430070,
            rubAccount: 17562,
            rubSite: 385672,
            rubZone: 2147918,
            sizes: [[300, 50], [300, 100], [300, 250], [320, 50], [320, 100], [336, 280], [300, 600]]
        }
    }
]


var PREBID_TIMEOUT = 1000;
var FAILSAFE_TIMEOUT = 3000;

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

function initAdserver() {
    headerBidderBack('prebid');
}

// in case PBJS doesn't load
setTimeout(function () {
    initAdserver;
}, FAILSAFE_TIMEOUT);

/* Wallapop code adaptation */

function headerBidderBack() {
};

var nExecution = 0;
var cont = 0
fetchHeaderBids = function (allowSegmentation, adSlots, definedSlots) {
    var bidTimeout = 2000;
    allowSegmentation = allowSegmentation || false;

    var bidders = ['a9', 'prebid'];


    var apstagSlots = adSlots.map(function (slot) {
        return {slotID: slot.id, sizes: slot.sizeMapping[deviceType].mapping, slotName: slot.name}
        //return { slotID: slot.id, sizes: slot.sizes, slotName: slot.name}
    });

    var adUnits = {
        "placements": adSlots.map(function (slot) {
            return {slotid: slot.id, networkId: slot.networkId}
        })
    };

    var requestManager = {
        adserverRequestSent: false
    };

    bidders.forEach(function (bidder) {
        requestManager[bidder] = false;
    });

    function allBiddersBack() {
        var allBiddersBack = bidders
            .map(function (bidder) {
                return requestManager[bidder];
            })
            .filter(Boolean)
            .length === bidders.length;
        return allBiddersBack;
    }

    headerBidderBack = function (bidder) {


        if (requestManager.adserverRequestSent === true) {
            return;
        }
        if (bidder === 'a9') {
            requestManager.a9 = true;
        } else if (bidder === 'prebid') {
            requestManager.prebid = true;
        }

        if (allBiddersBack()) {
            sendAdserverRequest();
        }
    }

    function sendAdserverRequest() {

        if (requestManager.adserverRequestSent === true) {
            return;
        }

        requestManager.adserverRequestSent = true;
        requestManager.sendAdserverRequest = true;


        googletag.cmd.push(function () {
            if (existBid('a9')) {
                apstag.setDisplayBids();
            }

            if (existBid('prebid')) {
                if (pbjs.initAdserverSet) return;
                pbjs.initAdserverSet = true;
                googletag.cmd.push(function () {
                    pbjs.setTargetingForGPTAsync && pbjs.setTargetingForGPTAsync();
                });
            }

            googletag.pubads().setRequestNonPersonalizedAds(allowSegmentation ? 0 : 1);
            googletag.pubads().setTargeting('allowSegmentation', allowSegmentation ? 'true' : 'false');
            googletag.pubads().refresh(definedSlots);
        });

    }

    function assignAdUnitsRaiPlacement(adUnitName) {
        return raiPlacementObj.find(x => x.adUnit == adUnitName) || false;
    }

    function requestBids(apstagSlots, adUnits, bidTimeout) {

        nExecution++;

        if (nExecution > 1) {
            requestManager.adserverRequestSent = false;
            requestManager.sendAdserverRequest = false;
            bidders.forEach(function (bidder) {
                requestManager[bidder] = false;
            });
            pbjs.initAdserverSet = false;
        }

        if (existBid('a9')) {
            apstag.fetchBids({
                slots: apstagSlots,
                timeout: bidTimeout
            }, function (bids) {
                headerBidderBack('a9');
            });
        }

        if (existBid('prebid')) {
            var pbAdUnits = adSlots.map(function (slot) {
                raiPlacement = assignAdUnitsRaiPlacement(slot.name.replace('130868815/', ''));
                let raiObj = {}
                if (raiPlacement) {
                    raiObj = {
                        code: slot.name,
                        mediaTypes: {
                            banner: {
                                sizes: raiPlacement[deviceType].sizes
                            }
                        },
                        bids: [{
                            bidder: 'richaudience',
                            params: {
                                pid: raiPlacement[deviceType].raiPlacement,
                                supplyType: 'site'
                            }
                        },
                            {
                                bidder: 'appnexus',
                                params: {
                                    placementId: raiPlacement[deviceType].apnPlacement
                                }
                            },
                            {
                                bidder: 'criteo',
                                params: {
                                    networkId: raiPlacement[deviceType].criPlacement
                                }
                            },
                            {
                                bidder: 'smartadserver',
                                params: {
                                    siteId: raiPlacement[deviceType].smartSite,
                                    pageId: raiPlacement[deviceType].smartPage,
                                    formatId: raiPlacement[deviceType].smartFormat
                                }
                            },
                            {
                                bidder: 'rubicon',
                                params: {
                                    accountId: raiPlacement[deviceType].rubAccount,
                                    siteId: raiPlacement[deviceType].rubSite,
                                    zoneId: raiPlacement[deviceType].rubZone
                                }
                            }
                        ]
                    }

                    for (let x = 0; x < raiPlacement[deviceType].sizes.length; x++) {
                        raiObj.bids.push({
                            bidder: 'ix',
                            params: {
                                siteId: raiPlacement[deviceType].ixPlacement,
                                size: raiPlacement[deviceType].sizes[x]
                            }
                        })
                    }
                }

                return raiObj;

            });


            pbjs.que.push(function () {
                pbjs.setConfig({
                    consentManagement: {
                        cmpApi: 'iab',
                        timeout: 8000,
                        allowAuctionWithoutConsent: true
                    },
                    userSync: {
                        iframeEnabled: true,
                        syncsPerBidder: 5
                    },
                    enableSendAllBids: false,
                    priceGranularity: "dense"
                });
                pbjs.addAdUnits(pbAdUnits);
                pbjs.requestBids({
                    bidsBackHandler: initAdserver,
                    timeout: PREBID_TIMEOUT
                });
            });

        }

    }

    function existBid(bidName) {
        if (!bidName) return;
        return bidders.indexOf(bidName) > -1;
    }

    requestBids(apstagSlots, adUnits, bidTimeout);

    window.setTimeout(function () {
        sendAdserverRequest();
    }, bidTimeout);
};

refreshHeaderBids = function (allowSegmentation, adSlots, definedSlots) {
    var bidders = ['a9', 'prebid'];
    allowSegmentation = allowSegmentation || false;

    let raiAd = [];
    adSlots.map(x => raiAd.push(x.name))

    var apstagSlots = adSlots.map(function (slot) {
        return {slotID: slot.id, sizes: slot.sizeMapping[deviceType].mapping, slotName: slot.name}
    });

    if (existBid('a9')) {
        apstag.fetchBids({
            slots: apstagSlots,
            timeout: 2000
        })
    }

    googletag.cmd.push(function () {

        if (existBid('a9')) {
            apstag.setDisplayBids();
        }
        if (existBid('prebid')) {
            pbjs.que.push(function () {
                pbjs.requestBids({
                    timeout: PREBID_TIMEOUT,
                    adUnitCodes: raiAd,
                    bidsBackHandler: function () {
                        pbjs.setTargetingForGPTAsync(raiAd);
                    }
                });
            });
        }

        googletag.pubads().setRequestNonPersonalizedAds(allowSegmentation ? 0 : 1);
        googletag.pubads().setTargeting('allowSegmentation', allowSegmentation ? 'true' : 'false');
        googletag.pubads().refresh(definedSlots);
    })

    function existBid(bidName) {
        if (!bidName) return;
        return bidders.indexOf(bidName) > -1;
    }
}