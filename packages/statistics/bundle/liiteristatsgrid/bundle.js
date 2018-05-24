/**
 * @class Oskari.statistics.bundle.statsgrid.StatsGridBundle
 *
 * Definitpation for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.statistics.bundle.statsgrid.StatsGridBundle",
    /**
     * @method create called automatically on construction
     * @static
     */

    function () {

    }, {
        "create": function () {
            return Oskari.clazz.create("Oskari.statistics.bundle.statsgrid.StatsGridBundleInstance",
                'statsgrid');
        },
        "update": function (manager, bundle, bi, info) {
        }
    }, {
        "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
        "source": {
            "scripts": [{
                "type" : "text/javascript",
                "src" : "../../../../libraries/jquery/plugins/jquery.cookie.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/instance.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/Tile.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/StatsView.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/GridModeView.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/StatsToolbar.js"
            }, {
                "type" : "text/javascript",
                "src" : "../../../../bundles/statistics/liiteristatsgrid/AddOwnIndicatorForm.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/domain/AreaFilter.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/domain/GeometryFilter.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/domain/RequestQueue.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/plugin/ManageClassificationPlugin.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/plugin/ManageStatsPlugin.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/event/StatsDataChangedEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/event/ModeChangedEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/event/ClearHilightsEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/event/SelectHilightsModeEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/event/CurrentStateEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/event/IndicatorsEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/event/UserIndicatorEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/event/GridChanged.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/event/IndicatorAdded.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/event/GridVisualizationRowChanged.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/request/CurrentStateRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/request/CurrentStateRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/request/SetStateRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/request/SetStateRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/request/StatsGridRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/request/StatsGridRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/request/TooltipContentRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/request/TooltipContentRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/request/IndicatorsRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/request/IndicatorsRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/request/AddDataSourceRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/request/DataSourceRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/service/StatisticsService.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/service/UserIndicatorsService.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/UserIndicatorsTab.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/ButtonHandler.js"
            }, {
                "type": "text/css",
                "src": "../../../../bundles/statistics/liiteristatsgrid/resources/css/style.css"
            }, {
                "type": "text/css",
                "src": "../../../../bundles/statistics/liiteristatsgrid/resources/css/classifyplugin.css"
            }, {
                "type": "text/css",
                "src": "../../../../libraries/slickgrid/css/slick.grid.css"
            }, {
                "type": "text/css",
                "src": "../../../../libraries/slickgrid/css/municipality.css"
            }, {
                "type": "text/css",
                "src": "../../../../libraries/slickgrid/css/slick-default-theme.css"
            }, {
                "src": "../../../../libraries/jquery/jquery.event.drag-2.0.min.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/jquery/plugins/loading-overlay.css",
                "type": "text/css"
            }, {
                "src": "../../../../libraries/jquery/plugins/loading-overlay.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/jquery/plugins/jquery.collapse.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/slickgrid/slick.core.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/slickgrid/slick.formatters.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/slickgrid/slick.editors.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/slickgrid/plugins/slick.cellrangedecorator.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/slickgrid/plugins/slick.cellrangeselector.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/slickgrid/plugins/slick.cellselectionmodel.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/slickgrid/plugins/slick.headermenu2.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/slickgrid/plugins/slick.headermenu2.css",
                "type": "text/css"
            }, {
                "src": "../../../../libraries/slickgrid/plugins/slick.headerbuttons.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/slickgrid/plugins/slick.headerbuttons.css",
                "type": "text/css"
            }, {
                "src": "../../../../libraries/slickgrid/plugins/slick.rowselectionmodel.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/slickgrid/plugins/slick.checkboxselectcolumn2.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/slickgrid/plugins/slick.expander.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/slickgrid/plugins/slick.expander.css",
                "type": "text/css"
            }, {
                "src": "../../../../libraries/slickgrid/slick.grid.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/slickgrid/slick.groupitemmetadataprovider.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/slickgrid/slick.dataview.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/slickgrid/controls/slick.pager.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/slickgrid/controls/slick.columnpicker.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/chosen/1.5.1/chosen.jquery.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/chosen/1.5.1/chosen.css",
                "type": "text/css"
            }, {
                "src": "../../../../libraries/jquery/plugins/fancytree/jquery.fancytree-all.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/jquery/plugins/fancytree/skin-liiteri/ui.fancytree.css",
                "type": "text/css"
            }],
            "locales": [{
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/resources/locale/fi.js"
            }, {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/resources/locale/sv.js"
            }, {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/resources/locale/en.js"
            }, {
                "lang": "es",
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/liiteristatsgrid/resources/locale/es.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "statsgrid",
                "Bundle-Name": "statsgrid",
                "Bundle-Author": [{
                    "Name": "jjk",
                    "Organisatpation": "nls.fi",
                    "Temporal": {
                        "Start": "2013",
                        "End": "2013"
                    },
                    "Copyleft": {
                        "License": {
                            "License-Name": "EUPL",
                            "License-Online-Resource": "http://www.paikkatietoikkuna.fi/license"
                        }
                    }
                }],
                "Bundle-Verspation": "1.0.0",
                "Import-Namespace": ["Oskari"],
                "Import-Bundle": {}
            }
        },

        /**
         * @static
         * @property dependencies
         */
        "dependencies": ["jquery"]

    });

Oskari.bundle_manager.installBundleClass("statsgrid", "Oskari.statistics.bundle.statsgrid.StatsGridBundle");
