/**
 * Definition for bundle. See source for details.
 *
 * @class Oskari.liiteri.bundle.liiteri-servicepackages.LiiteriServicePackages
 */
Oskari.clazz.define("Oskari.liiteri.bundle.liiteri-servicepackages.LiiteriServicePackages",

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
        return Oskari.clazz.create("Oskari.liiteri.bundle.liiteri-servicepackages.LiiteriServicePackagesInstance");
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
            "src" : "../../../../bundles/liiteri/bundle/liiteri-servicepackages/instance.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liiteri/bundle/liiteri-servicepackages/Tile.js"
		}, {
            "type" : "text/javascript",
            "src": "../../../../bundles/liiteri/bundle/liiteri-servicepackages/Flyout.js"
		}, {
		    "type": "text/javascript",
		    "src": "../../../../bundles/liiteri/bundle/liiteri-servicepackages/View.js"
		}, {
		    "type": "text/javascript",
		    "src": "../../../../bundles/liiteri/bundle/liiteri-servicepackages/service/ServicePackageService.js"            
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liiteri/bundle/liiteri-servicepackages/event/ServicePackageSelectedEvent.js"
		}, {
            "type": "text/javascript",
            "src" : "../../../../bundles/liiteri/bundle/liiteri-servicepackages/event/GroupingUpdatedEvent.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liiteri/bundle/liiteri-servicepackages/request/SetServicePackageRequest.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liiteri/bundle/liiteri-servicepackages/request/SetServicePackageRequestHandler.js"
		}, {
            "type": "text/css",
            "src": "../../../../resources/liiteri/bundle/liiteri-servicepackages/css/style.css"
        }],
        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/liiteri/bundle/liiteri-servicepackages/locale/fi.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/liiteri/bundle/liiteri-servicepackages/locale/en.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "liiteri-servicepackages",
            "Bundle-Name" : "liiteri-servicepackages",
            "Bundle-Author" : [{
                "Name" : "ev",
                "Organisation" : "nls.fi",
                "Temporal" : {
                    "Start" : "2009",
                    "End" : "2011"
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
            "Import-Bundle" : {
                "liiteri-groupings" : {
                    "bundlePath": "../../../../packages/liiteri/bundle/liiteri-groupings/"
                }
            },
            "Require-Bundle-Instance": ['liiteri-groupings']
        }
    },

    /**
     * @static
     * @property dependencies
     */
    "dependencies" : []
});

// Install this bundle by instantating the Bundle Class
Oskari.bundle_manager.installBundleClass("liiteri-servicepackages", "Oskari.liiteri.bundle.liiteri-servicepackages.LiiteriServicePackages");