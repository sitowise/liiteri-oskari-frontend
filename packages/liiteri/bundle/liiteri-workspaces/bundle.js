/**
 * Definition for bundle. See source for details.
 *
 * @class Oskari.liiteri.bundle.liiteri-workspaces.LiiteriWorkspaces
 */
Oskari.clazz.define("Oskari.liiteri.bundle.liiteri-workspaces.LiiteriWorkspaces",

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
        return Oskari.clazz.create("Oskari.liiteri.bundle.liiteri-workspaces.LiiteriWorkspacesInstance");
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
            "src" : "../../../../bundles/liiteri/liiteri-workspaces/instance.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liiteri/liiteri-workspaces/Tile.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liiteri/liiteri-workspaces/view/WorkspacesView.js"
		}, {
		    "src": "../../../../libraries/jquery/plugins/DataTables-1.10.7/media/js/jquery.dataTables.js",
		    "type": "text/javascript"
		}, {
		    "src": "../../../../libraries/jquery/plugins/DataTables-1.10.7/media/css/jquery.dataTables.css",
		    "type": "text/css"
		}, {
            "type": "text/css",
            "src": "../../../../bundles/liiteri/liiteri-workspaces/resources/css/style.css"
        }],
        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/liiteri/liiteri-workspaces/resources/locale/fi.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/liiteri/liiteri-workspaces/resources/locale/en.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "liiteri-workspaces",
            "Bundle-Name" : "liiteri-workspaces",
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
Oskari.bundle_manager.installBundleClass("liiteri-workspaces", "Oskari.liiteri.bundle.liiteri-workspaces.LiiteriWorkspaces");