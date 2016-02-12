/**
 * @class Oskari.mapframework.bundle.parcel.DrawingTool
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.parcel.DrawingTool",

    /**
     * @contructor
     * Called automatically on construction. At this stage bundle sources have been
     * loaded, if bundle is loaded dynamically.
     * @static
     */
        function () {

    }, {
        /*
         * @method create
         * called when a bundle instance will be created
         */
        "create": function () {
            var me = this;
            var inst = Oskari.clazz.create("Oskari.mapframework.bundle.parcel.DrawingToolInstance");
            return inst;

        },
        /**
         * @method update
         * Called by Bundle Manager to provide state information to
         * bundle
         */
        "update": function (manager, bundle, bi, info) {
            manager.alert("RECEIVED update notification " + info);
        }
    },
    /**
     * metadata
     */
    {
        "protocol": ["Oskari.bundle.Bundle"],
        "source": {
            "scripts": [
                /* event */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/event/FinishedDrawingEvent.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/event/SaveDrawingEvent.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/event/ParcelSelectedEvent.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/event/ParcelInfoLayerRegisterEvent.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/event/ParcelInfoLayerUnregisterEvent.js"
                },
                /* plugin */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/plugin/DrawPlugin.js"
                },
                /* request */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/request/SaveDrawingRequest.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/request/StopDrawingRequest.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/request/CancelDrawingRequest.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/request/StartDrawingRequest.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/request/SaveDrawingRequestHandler.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/request/StopDrawingRequestHandler.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/request/CancelDrawingRequestHandler.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/request/StartDrawingRequestHandler.js"
                },
                /* model */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/model/PreParcel.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/model/PreParcelData.js"
                },
                /* service */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/service/ParcelService.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/service/ParcelWfst.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/service/PreParcelWFSTStore.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/service/ParcelPlot.js"
                },
                /* splitter */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/split/ParcelSplit.js"
                },
                /* ui */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/view/MainView.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/view/StartPrintView.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/view/ParcelPrintForm1.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/view/ParcelPrintForm2.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/handler/ButtonHandler.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/handler/ParcelSelectorHandler.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/handler/PreParcelSelectorHandler.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/instance.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/Flyout.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../libraries/jquery/plugins/jquery.cookie.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../libraries/clipper/clipper.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../libraries/jsts/jsts.js"
                },
                // css
                {
                    "type": "text/css",
                    "src": "../../../../bundles/framework/parcel/resources/css/style.css"
                }
            ],
            "locales": [
                {
                    "lang": "fi",
                    "type": "text/javascript",
                    "src": "../../../../bundles/framework/parcel/resources/locale/fi.js"
                }
            ]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "parcel",
                "Bundle-Name": "parcel",
                "Bundle-Author": [
                    {
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
                    }
                ],
                "Bundle-Name-Locale": {
                    "fi": {
                        "Name": " style-1",
                        "Title": " style-1"
                    }
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

// Install this bundle by instantating the Bundle Class
Oskari.bundle_manager.installBundleClass("parcel", "Oskari.mapframework.bundle.parcel.DrawingTool");
