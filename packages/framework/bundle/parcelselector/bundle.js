/**
 * @class Oskari.mapframework.bundle.parcelselector.ParcelSelector
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.parcelselector.ParcelSelector",

/**
 * @contructor
 * Called automatically on construction. At this stage bundle sources have been
 * loaded, if bundle is loaded dynamically.
 * @static
 */
function() {

}, {
    "create" : function() {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.parcelselector.ParcelSelectorInstance");
        return inst;
    },
    "update" : function(manager, bundle, bi, info) {
    }
}, {

    "protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {

        "scripts" : [
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/parcelselector/instance.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/parcelselector/Flyout.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/parcelselector/Tile.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/parcelselector/event/ParcelSelectedEvent.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/parcelselector/event/RegisterUnitSelectedEvent.js"
        }, {
            "type" : "text/css",
            "src" : "../../../../bundles/framework/parcelselector/resources/css/parcelselector.css"
        }],

        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/parcelselector/resources/locale/fi.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "parcelselector",
            "Bundle-Name" : "parcelselector",
            "Bundle-Author" : [{
                "Name" : "jjk",
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
            "Import-Namespace" : ["Oskari", "jquery"],
            "Import-Bundle" : {}
        }
    },

    /**
     * @static
     * @property dependencies
     */
    "dependencies" : ["jquery"]

});

Oskari.bundle_manager.installBundleClass("parcelselector", "Oskari.mapframework.bundle.parcelselector.ParcelSelector");
