/**
 * @class Oskari.liiteri.bundle.liiteri-groupings.LiiteriGroupingsBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.liiteri.bundle.liiteri-groupings.LiiteriGroupingsBundle", function () {

}, {
    "create": function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.liiteri.bundle.liiteri-groupings.LiiteriGroupingsBundleInstance");

        return inst;

    },
    "update": function (manager, bundle, bi, info) {

    }
}, {

    "protocol": ["Oskari.bundle.Bundle", "Oskari.liiteri.bundle.extension.ExtensionBundle"],
    "source": {

        "scripts": [{
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-groupings/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-groupings/Flyout.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-groupings/Tile.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-groupings/service/GroupingsService.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-groupings/request/ShowGroupingsFlyoutRequestHandler.js"
        },{
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-groupings/request/ShowGroupingsFlyoutRequest.js"
        },        {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-groupings/GroupingsToolbar.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-groupings/view/EditView.js"
        },/* {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-groupings/event/GroupingUpdatedEvent.js"
        },*/ {
            "type": "text/css",
            "src": "../../../../bundles/liiteri/liiteri-groupings/resources/css/style.css"
        }, {
            "type": "text/css",
            "src": "../../../../bundles/liiteri/liiteri-groupings/resources/css/groupings.css"
        }, {
		    "src": "../../../../libraries/jquery/plugins/DataTables-1.10.7/media/js/jquery.dataTables.js",
		    "type": "text/javascript"
		}, {
		    "src": "../../../../libraries/jquery/plugins/DataTables-1.10.7/media/css/jquery.dataTables.css",
		    "type": "text/css"
		}, {
		    "src": "../../../../libraries/dynatree/jquery.dynatree.js",
		    "type": "text/javascript"
		}, {
		    "src": "../../../../libraries/dynatree/skin-vista/ui.dynatree.css",
		    "type": "text/css"
		}, {
            "src" : "../../../../libraries/chosen/1.5.1/chosen.jquery.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/chosen/1.5.1/chosen.css",
            "type" : "text/css"
        }],

        "locales": [{
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-groupings/resources/locale/en.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-groupings/resources/locale/fi.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "liiteri-groupings",
            "Bundle-Name": "liiteri-groupings",
            "Bundle-Author": [{
                "Name": "jjk",
                "Organisation": "nls.fi",
                "Temporal": {
                    "Start": "2009",
                    "End": "2011"
                },
                "Copyleft": {
                    "License": {
                        "License-Name": "EUPL",
                        "License-Online-Resource": "http://www.paikkatietoikkuna.fi/license"
                    }
                }
            }],
            "Bundle-Name-Locale": {
                "fi": {
                    "Name": " style-1",
                    "Title": " style-1"
                },
                "en": {}
            },
            "Bundle-Version": "1.0.0",
            "Import-Namespace": ["Oskari", "jquery"],
            "Import-Bundle": {}
        }
    },

    /**
     * @static
     * @property dependencies
     */
    "dependencies": ["jquery"]

});

Oskari.bundle_manager.installBundleClass("liiteri-groupings", "Oskari.liiteri.bundle.liiteri-groupings.LiiteriGroupingsBundle");
