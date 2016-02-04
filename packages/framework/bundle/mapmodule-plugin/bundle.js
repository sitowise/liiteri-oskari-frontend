/**
 * @class Oskari.mapframework.bundle.PluginMapModuleBundle
 */
Oskari.clazz.define(
    "Oskari.mapframework.bundle.PluginMapModuleBundle",
    function () {},
    {
        /*
         * implementation for protocol 'Oskari.bundle.Bundle'
         */
        "create": function () {
            return this;
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

            "scripts": [
                /*
                 * Abstract base
                 */

                {
                    "type": "text/javascript",
                    "src": "../../../../src/mapping/mapmodule/AbstractMapModule.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../src/mapping/mapmodule/plugin/AbstractMapModulePlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../src/mapping/mapmodule/plugin/BasicMapModulePlugin.js"
                },
                /*
                 * map-module
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/ui/module/map-module.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/Plugin.js"
                },
                /**
                 * controls plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/ControlsPlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/PorttiKeyboard.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/OskariNavigation.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/OskariPinchZoom.js"
                }, {


                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/request/DisableMapKeyboardMovementRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/request/DisableMapMouseMovementRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/request/EnableMapKeyboardMovementRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/request/EnableMapMouseMovementRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/request/MapMovementControlsRequestHandler.js"
                }, {


                    "type": "text/javascript",
                    "src": "../../../../sources/framework/request/common/show-map-measurement-request.js"
                },
                /**
                 * GFI
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/getinfo/GetFeatureInfoHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/request/GetFeatureInfoRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/request/GetFeatureInfoActivationRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/getinfo/GetInfoPlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/getinfo/GetFeatureInfoFormatter.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../resources/framework/bundle/mapmodule-plugin/plugin/getinfo/css/getinfo.css"
                },
                /**
                 * Markers plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/markers/MarkersPlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/request/AddMarkerRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/request/AddMarkerRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/request/RemoveMarkersRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/request/RemoveMarkersRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/request/ToggleFullScreenControlRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/request/ToggleFullScreenControlRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/event/AfterAddMarkerEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/event/AfterRemoveMarkersEvent.js"
                },
                /**
                 * Search plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/search/SearchPlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/search/service/searchservice.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../resources/framework/bundle/mapmodule-plugin/plugin/search/css/search.css"
                },
                /**
                 * Logo plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/logo/LogoPlugin.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../resources/framework/bundle/mapmodule-plugin/plugin/logo/css/logoplugin.css"
                },
                /**
                 * Data Source plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/datasource/DataSourcePlugin.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../resources/framework/bundle/mapmodule-plugin/plugin/datasource/css/datasource.css"
                },


                // IndexMap
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/indexmap/IndexMapPlugin.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../resources/framework/bundle/mapmodule-plugin/plugin/indexmap/css/indexmap.css"
                },

                // ScaleBar
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/scalebar/ScaleBarPlugin.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../resources/framework/bundle/mapmodule-plugin/plugin/scalebar/css/scalebar.css"
                },

                // MapIcons
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/mapicons/MapIconsPlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/mapicons/request/AddMapIconRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/mapicons/request/AddMapIconRequestHandler.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/mapicons/css/MapIconsPlugin.css"
                }, {
                    "type": "text/css",
                    "src": "../../../../resources/framework/bundle/mapmodule-plugin/plugin/mapicons/css/MapIconsPlugin.css"
                },
                /**
                 * PublisherToolbarPlugin plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/publishertoolbar/PublisherToolbarPlugin.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../resources/framework/bundle/mapmodule-plugin/plugin/publishertoolbar/css/publishertoolbar.css"
                },

                // FullScreen
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/fullscreen/FullScreen.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../resources/framework/bundle/mapmodule-plugin/plugin/fullscreen/css/fullscreen.css"
                },

                /**
                 * MapLayer selection plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/layers/LayerSelectionPlugin.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../resources/framework/bundle/mapmodule-plugin/plugin/layers/css/layersselection.css"
                },

                /**
                 * Background MapLayer selection plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/layers/BackgroundLayerSelectionPlugin.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../resources/framework/bundle/mapmodule-plugin/plugin/layers/css/backgroundlayerselection.css"
                },
                /**
                 * Layers loading plugin
                 */
                 {
                     "type": "text/javascript",
                     "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/layers/ol/OLLayerEventsControl.js"
                 },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/layers/LayersLoadingPlugin.js"
                },  {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/event/LayersLoadingEvent.js"
                },                
                /**
                 * Layers plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/layers/LayersPlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/request/MapLayerVisibilityRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/request/MapLayerVisibilityRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/request/MapMoveByLayerContentRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/request/MapMoveByLayerContentRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/event/MapLayerVisibilityChangedEvent.js"
                },

                /** Layers backport */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/wmslayer/WmsLayerPlugin.js"
                },

                /**
                 * Vector Layer plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/vectorlayer/VectorLayerPlugin.js"
                },
                /**
                 * GeoLocation plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/location/GeoLocationPlugin.js"
                },

                /**
                 * GeoLocation plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/DrawPlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/event/AddedFeatureEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/event/FinishedDrawingEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/event/SelectedDrawingEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/event/ActiveDrawingEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/request/GetGeometryRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/request/GetGeometryRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/request/StartDrawingRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/request/StartDrawingRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/request/StopDrawingRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/request/StopDrawingRequestHandler.js"
                },
                /**
                 * BackgroundDraw plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/backgrounddrawplugin/BackgroundDrawPlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/backgrounddrawplugin/InnerDrawPlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/backgrounddrawplugin/event/AddedFeatureEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/backgrounddrawplugin/event/FinishedDrawingEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/backgrounddrawplugin/event/SelectedDrawingEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/backgrounddrawplugin/event/ActiveDrawingEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/backgrounddrawplugin/request/GetGeometryRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/backgrounddrawplugin/request/GetGeometryRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/backgrounddrawplugin/request/StartDrawingRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/backgrounddrawplugin/request/StartDrawingRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/backgrounddrawplugin/request/StopDrawingRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/backgrounddrawplugin/request/StopDrawingRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/backgrounddrawplugin/request/RegisterForDrawingRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/backgrounddrawplugin/request/RegisterForDrawingRequestHandler.js"
                },
                /**
                 * Publishertoolbar plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/publishertoolbar/PublisherToolbarPlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/publishertoolbar/request/ToolContainerRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/publishertoolbar/request/ToolContainerRequestHandler.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../resources/framework/bundle/mapmodule-plugin/plugin/publishertoolbar/css/publishertoolbar.css"
                },

                /**
                 * Realtime plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/realtime/RealtimePlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/realtime/event/RefreshLayerEvent.js"
                },

                /**
                 * My Location plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/mylocation/MyLocationPlugin.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../resources/framework/bundle/mapmodule-plugin/plugin/mylocation/css/mylocation.css"
                },

                /**
                 * Requests & handlers
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/request/ToolSelectionRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/ToolSelectionHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/request/MapLayerUpdateRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/request/MapLayerUpdateRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/request/MapMoveRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/event/MapClickedEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/event/EscPressedEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/event/GetInfoResultEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/event/MapSizeChangedEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/zoombar/Portti2Zoombar.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../resources/framework/bundle/mapmodule-plugin/plugin/zoombar/css/porttizoombar.css"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/panbuttons/PanButtons.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../resources/framework/bundle/mapmodule-plugin/plugin/panbuttons/css/panbuttons.css"
                }, {
                    "type": "text/css",
                    "src": "../../../../resources/framework/bundle/mapmodule-plugin/css/mapmodule.css"
                }
            ],
            "locales": [{
                // when lang is undefined, loader loads each language file, publisher needs localization for each
                //"lang" : "hy",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/hy.js"
            }, {
                //"lang" : "bg",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/bg.js"
            }, {
                //"lang" : "cs",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/cs.js"
            }, {
                //"lang" : "da",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/da.js"
            }, {
                //"lang" : "de",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/de.js"
            }, {
                //"lang" : "en",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/en.js"
            }, {
                //"lang" : "es",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/es.js"
            }, {
                //"lang" : "et",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/et.js"
            }, {
                //"lang" : "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/fi.js"
            }, {
                //"lang" : "ka",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/ka.js"
            }, {
                //"lang" : "el",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/el.js"
            }, {
                //"lang" : "hr",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/hr.js"
            }, {
                //"lang" : "hu",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/hu.js"
            }, {
                //"lang" : "lv",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/lv.js"
            }, {
                //"lang" : "nl",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/nl.js"
            }, {
                //"lang" : "pl",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/pl.js"
            }, {
                //"lang" : "pt",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/pt.js"
            }, {
                //"lang" : "ro",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/ro.js"
            }, {
                //"lang" : "sr",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/sr.js"
            }, {
                //"lang" : "sl",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/sl.js"
            }, {
                //"lang" : "sk",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/sk.js"
            }, {
                //"lang" : "sq",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/sq.js"
            }, {
                //"lang" : "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/sv.js"
            }, {
                //"lang" : "uk",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/locale/uk.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "mapmodule-plugin",
                "Bundle-Name": "mapmodule",
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
                        "Name": "Kartta",
                        "Title": "Kartta"
                    },
                    "en": {}
                },
                "Bundle-Version": "1.0.0",
                "Import-Namespace": ["Oskari", "Ext", "OpenLayers"]
            }
        }
    }
);

/**
 * Install this bundle
 */
Oskari.bundle_manager.installBundleClass("mapmodule-plugin", "Oskari.mapframework.bundle.PluginMapModuleBundle");
