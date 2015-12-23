/**
 * Definition for bundle. See source for details.
 *
 * @class Oskari.liiteri.bundle.liiteri-usergisdata.LiiteriUserGisDataBundle
 */
Oskari.clazz.define("Oskari.liiteri.bundle.liiteri-usergisdata.LiiteriUserGisDataBundle",

/**
 * Called automatically on construction. At this stage bundle sources have been
 * loaded, if bundle is loaded dynamically.
 *
 * @contructor
 * @static
 */
function() {

}, {
    /*
     * called when a bundle instance will be created
     *
     * @method create
     */
    "create" : function() {
        return Oskari.clazz.create("Oskari.liiteri.bundle.liiteri-usergisdata.LiiteriUserGisDataBundleInstance");
    },
    /**
     * Called by Bundle Manager to provide state information to
     *
     * @method update
     * bundle
     */
    "update" : function(manager, bundle, bi, info) {
    }
},

/**
 * metadata
 */
{
    "protocol" : ["Oskari.bundle.Bundle"],
    "source" : {
        "scripts" : [{
            "type" : "text/javascript",
            "src" : "../../../../bundles/liiteri/bundle/liiteri-usergisdata/instance.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liiteri/bundle/liiteri-usergisdata/view/OwnDataLayer.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liiteri/bundle/liiteri-usergisdata/view/OwnLayersTab.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liiteri/bundle/liiteri-usergisdata/model/LayerGroup.js"
		}, {
            "type": "text/css",
            "src": "../../../../resources/liiteri/bundle/liiteri-usergisdata/css/style.css"
        }],
        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/liiteri/bundle/liiteri-usergisdata/locale/fi.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/liiteri/bundle/liiteri-usergisdata/locale/en.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "liiteri-usergisdata",
            "Bundle-Name" : "liiteri-usergisdata",
            "Bundle-Author" : [{
                "Name" : "kk",
                "Organisation" : "sito.fi",
                "Temporal" : {
                    "Start" : "2014",
                    "End" : "2014"
                },
                "Copyleft" : {
                    "License" : {
                        "License-Name" : "EUPL",
                        "License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
                    }
                }
            }],
            "Bundle-Name-Locale" : {
                "fi" : {
                    "Name" : " style-1",
                    "Title" : " style-1"
                },
                "en" : {}
            },
            "Bundle-Version" : "1.0.0",
            "Import-Namespace" : ["Oskari"],
            "Import-Bundle" : {}
        }
    },

    /**
     * @static
     * @property dependencies
     */
    "dependencies" : []
});

// Install this bundle by instantating the Bundle Class
Oskari.bundle_manager.installBundleClass("liiteri-usergisdata", "Oskari.liiteri.bundle.liiteri-usergisdata.LiiteriUserGisDataBundle");