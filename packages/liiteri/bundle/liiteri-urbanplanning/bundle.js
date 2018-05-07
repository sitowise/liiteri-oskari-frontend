/**
 * Definition for bundle. See source for details.
 *
 * @class Oskari.liiteri.bundle.liiteri-urbanplanning.LiiteriUrbanPlanningBundle
 */
Oskari.clazz.define("Oskari.liiteri.bundle.liiteri-urbanplanning.LiiteriUrbanPlanningBundle",

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
        return Oskari.clazz.create(
            "Oskari.liiteri.bundle.liiteri-urbanplanning.LiiteriUrbanPlanningBundleInstance",
            'liiteri-urbanplanning');
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
    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {
        "scripts" : [{
            "type" : "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-urbanplanning/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-urbanplanning/service/UrbanPlanningService.js"
        }, {
            "type" : "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-urbanplanning/Tile.js"
        }, {
            "type" : "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-urbanplanning/MapViewTile.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-urbanplanning/plugin/TilePlugin.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-urbanplanning/view/UrbanPlanDetailsForm.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-urbanplanning/view/UrbanPlanFilterForm.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liiteri/liiteri-urbanplanning/view/NewModeView.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-urbanplanning/view/UrbanPlanMarkingsFilterForm.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-urbanplanning/view/UrbanPlanMarkingsDetailsForm.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-urbanplanning/view/UrbanPlanPeopleFilterForm.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-urbanplanning/view/UrbanPlanPeopleDetailsForm.js"
        }, {
            "type" : "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-urbanplanning/UrbanPlanningToolbar.js"
        }, {
            "src": "../../../../libraries/jquery/plugins/jquery-ui.datepicker.js",
            "type": "text/javascript"
        }, {
            "src": "../../../../libraries/jquery/plugins/DataTables-1.10.7/media/js/jquery.dataTables.js",
            "type": "text/javascript"
        }, {
            "src": "../../../../libraries/jquery/plugins/DataTables-1.10.7/media/css/jquery.dataTables.css",
            "type": "text/css"
        }, {
            "src": "../../../../libraries/jquery/plugins/PrintArea/jquery.PrintArea.js",
            "type": "text/javascript"
        }, {
            "src" : "../../../../libraries/chosen/1.5.1/chosen.jquery.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/chosen/1.5.1/chosen.css",
            "type" : "text/css"
        }, {
            "type": "text/css",
            "src": "../../../../bundles/liiteri/liiteri-urbanplanning/resources/css/style.css"
        }],
        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/liiteri/liiteri-urbanplanning/resources/locale/fi.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/liiteri/liiteri-urbanplanning/resources/locale/en.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "liiteri-urbanplanning",
            "Bundle-Name" : "liiteri-urbanplanning",
            "Bundle-Author" : [{
                "Name" : "Krzysztof Kozlowski & Artur Wlodarczyk",
                "Organisation" : "Sito Poland",
                "Temporal" : {
                    "Start" : "214",
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
Oskari.bundle_manager.installBundleClass(
    "liiteri-urbanplanning",
    "Oskari.liiteri.bundle.liiteri-urbanplanning.LiiteriUrbanPlanningBundle");
