/**
 * @class Oskari.<mynamespace>.bundle.<bundle-identifier>.MyBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.metadata.MetadataSearch",

/**
 * @contructor
 * Called automatically on construction. At this stage bundle sources have been
 * loaded, if bundle is loaded dynamically.
 * @static
 */
function() {

}, {
    /*
     * @method create
     * called when a bundle instance will be created
     */
    "create" : function() {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.metadata.MetadataSearchInstance");
        return inst;

    },
    /**
     * @method update
     * Called by Bundle Manager to provide state information to
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
            "src" : "../../../../bundles/framework/metadata/instance.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/metadata/plugin/MapSelectionPlugin.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/metadata/event/MapSelectionEvent.js"
        },
		{
            "type" : "text/css",
            "src" : "../../../../bundles/framework/metadata/resources/css/buttons.css"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "metadata",
            "Bundle-Name" : "metadata",
            "Bundle-Author" : [{
                "Name" : "ev",
                "Organisation" : "nls.fi",
                "Temporal" : {
                    "Start" : "2012",
                    "End" : "2012"
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
Oskari.bundle_manager.installBundleClass("metadata", "Oskari.mapframework.bundle.metadata.MetadataSearch");