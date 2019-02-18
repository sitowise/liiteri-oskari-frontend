Oskari.clazz.define("Oskari.liiteri.bundle.liiteri-chart.LiiteriUIBundle",

function() {
}, {
    "create" : function() {
        return Oskari.clazz.create("Oskari.liiteri.bundle.liiteri-ui.LiiteriUIBundleInstance", 'liiteri-ui');
    },
    "update" : function(manager, bundle, bi, info) {
    }
},
{
    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {
        "scripts": [
        {
            "type" : "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-ui/instance.js"
        }, {
            "type" : "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-ui/Tile.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-ui/Flyout.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-ui/View.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-ui/plugin/TilePlugin.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-ui/plugin/MapTilePlugin.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-ui/service/UIConfigurationService.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-ui/plugin/ExpandPlugin.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-ui/plugin/AnalyticsPlugin.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-ui/plugin/ToolbarSequenceManagerPlugin.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-ui/component/FilterForm.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-ui/component/FilterCloud.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-ui/component/SharingForm.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-ui/event/UISizeChangedEvent.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-ui/request/UIAddTileRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-ui/request/UIAddTileRequestHandler.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-ui/request/UIUpdateTileRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-ui/request/UIUpdateTileRequestHandler.js"
        }, {
            "type": "text/css",
            "src": "../../../../bundles/liiteri/liiteri-ui/resources/css/style.css"
        }, {
            "src" : "../../../../libraries/chosen/1.5.1/chosen.jquery.js",
            "type" : "text/javascript"
        }, {
            "src": "../../../../libraries/chosen/1.5.1/chosen.css",
            "type": "text/css"
        }
        ],
        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-ui/resources/locale/fi.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src": "../../../../bundles/liiteri/liiteri-ui/resources/locale/en.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "liiteri-ui",
            "Bundle-Name": "liiteri-ui",
            "Bundle-Author" : [{
                "Name" : "Artur Wlodarczyk",
                "Organisation" : "Sito Poland",
                "Temporal" : {
                    "Start" : "2014",
                    "End" : "2014"
                }
            }],
            "Bundle-Name-Locale" : {
                "fi" : {
                    "Name": "liiteri-ui",
                    "Title": "liiteri-ui"
                },
                "en": {
                    "Name": "liiteri-ui",
                    "Title": "liiteri-ui"
                },
                "sv": {
                    "Name": "liiteri-ui",
                    "Title": "liiteri-ui"
                },
                "pl": {
                    "Name": "liiteri-ui",
                    "Title": "liiteri-ui"
                }
            },
            "Bundle-Version" : "1.0.0",
            "Import-Namespace" : ["Oskari"],
            "Import-Bundle" : {}
        }
    },
    "dependencies" : ["jquery"]
});

Oskari.bundle_manager.installBundleClass("liiteri-ui", "Oskari.liiteri.bundle.liiteri-chart.LiiteriUIBundle");