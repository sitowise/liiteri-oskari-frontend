Oskari.clazz.define("Oskari.liiteri.bundle.liiteri-chart.LiiteriChartBundle",

function() {
}, {
    "create" : function() {
        return Oskari.clazz.create("Oskari.liiteri.bundle.liiteri-chart.LiiteriChartBundleInstance",'liiteri-chart');
    },
    "update" : function(manager, bundle, bi, info) {
    }
},
{
    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {
        "scripts": [
        {
           "type": "text/javascript",
           "src": "../../../../libraries/jqplot/jquery.jqplot.js"
        }, {
            "type" : "text/javascript",
            "src": "../../../../bundles/liiteri/bundle/liiteri-chart/instance.js"
        }, {
            "type" : "text/javascript",
            "src": "../../../../bundles/liiteri/bundle/liiteri-chart/Tile.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/bundle/liiteri-chart/Flyout.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/bundle/liiteri-chart/View.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/bundle/liiteri-chart/request/ShowChartRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/liiteri/bundle/liiteri-chart/request/ShowChartRequestHandler.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../libraries/jqplot/plugins/jqplot.barRenderer.min.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../libraries/jqplot/plugins/jqplot.categoryAxisRenderer.min.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../libraries/jqplot/plugins/jqplot.canvasAxisTickRenderer.min.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../libraries/jqplot/plugins/jqplot.canvasTextRenderer.min.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../libraries/jqplot/plugins/jqplot.pointLabels.min.js"
        }, {
            "type": "text/css",
            "src": "../../../../resources/liiteri/bundle/liiteri-chart/css/style.css"
        }, {
            "type": "text/css",
            "src": "../../../../libraries/jqplot/jquery.jqplot.min.css"
        }
        ],
        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src": "../../../../bundles/liiteri/bundle/liiteri-chart/locale/fi.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src": "../../../../bundles/liiteri/bundle/liiteri-chart/locale/en.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "liiteri-chart",
            "Bundle-Name": "liiteri-chart",
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
                    "Name": "liiteri-chart",
                    "Title": "liiteri-chart"
                },
                "en": {
                    "Name": "liiteri-chart",
                    "Title": "liiteri-chart"
                },
                "sv": {
                    "Name": "liiteri-chart",
                    "Title": "liiteri-chart"
                },
                "pl": {
                    "Name": "liiteri-chart",
                    "Title": "liiteri-chart"
                }
            },
            "Bundle-Version" : "1.0.0",
            "Import-Namespace" : ["Oskari"],
            "Import-Bundle" : {}
        }
    },
    "dependencies" : ["jquery"]
});

Oskari.bundle_manager.installBundleClass("liiteri-chart", "Oskari.liiteri.bundle.liiteri-chart.LiiteriChartBundle");