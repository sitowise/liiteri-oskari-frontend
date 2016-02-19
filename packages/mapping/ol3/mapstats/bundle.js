/**
 * @class Oskari.mapframework.bundle.mapstats.MapStatsBundle
 */
Oskari.clazz.define(
    "Oskari.mapframework.bundle.mapstats.MapStatsBundle",
    function () {},
    {
        /*
         * implementation for protocol 'Oskari.bundle.Bundle'
         */
        "create": function () {
            return null;
        },
        "update": function (manager, bundle, bi, info) {
            manager.alert("RECEIVED update notification " + info);
        }
    },

    /**
     * metadata
     */
    {

        "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
        "source": {

            "scripts": [{
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapstats/plugin/StatsLayerPlugin.ol3.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapstats/domain/StatsLayer.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapstats/domain/StatsLayerModelBuilder.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapstats/event/StatsVisualizationChangeEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapstats/event/FeatureHighlightedEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapstats/event/HoverTooltipContentEvent.js"
            }, {
                "type": "text/css",
                "src": "../../../../bundles/mapping/mapstats/resources/css/mapstats.css"
            }],
            "locales": [{
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapstats/resources/locale/fi.js"
            }, {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapstats/resources/locale/sv.js"
            }, {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapstats/resources/locale/en.js"
            }, {
                "lang": "es",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapstats/resources/locale/es.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "mapstats",
                "Bundle-Name": "mapstats",
                "Bundle-Tag": {
                    "mapframework": true
                },
                "Bundle-Icon": {
                    "href": "icon.png"
                },
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
                        "Name": "Stats",
                        "Title": "Stats"
                    },
                    "en": {}
                },
                "Bundle-Version": "1.0.0",
                "Import-Namespace": ["Oskari"]
            }
        }
    }
);

Oskari.bundle_manager.installBundleClass("mapstats", "Oskari.mapframework.bundle.mapstats.MapStatsBundle");