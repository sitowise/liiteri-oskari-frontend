/**
 * @class Oskari.liiteri.bundle.liiteri-loging.LiiteriLogingBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define(
    "Oskari.liiteri.bundle.liiteri-loging.LiiteriLogingBundle",
    /**
     * @method create called automatically on construction
     * @static
     */

    function () {}, {
        "create": function () {
            var me = this;
            var inst = Oskari.clazz.create(
                "Oskari.liiteri.bundle.liiteri-loging.LiiteriLogingBundleInstance"
            );
            return inst;
        },
        "update": function (manager, bundle, bi, info) {}
    }, {

        "protocol": [
            "Oskari.bundle.Bundle",
            "Oskari.mapliiteri.bundle.extension.ExtensionBundle"
        ],
        "source": {

            "scripts": [{
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/bundle/liiteri-loging/instance.js"
            }, {
                "type" : "text/javascript",
                "src": "../../../../bundles/liiteri/bundle/liiteri-loging/request/ShowLoginWindowRequest.js"
            }, {
                "type" : "text/javascript",
                "src": "../../../../bundles/liiteri/bundle/liiteri-loging/request/ShowLoginWindowRequestHandler.js"
            }, {
                "type" : "text/javascript",
                "src": "../../../../bundles/liiteri/bundle/liiteri-loging/event/LoginEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../libraries/jquery/plugins/jquery.cookie.js"
            }, {
                "type": "text/css",
                "src": "../../../../resources/liiteri/bundle/liiteri-loging/css/style.css"
            }],
            "locales": [{
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/bundle/liiteri-loging/locale/en.js"
            }, {
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/bundle/liiteri-loging/locale/fi.js"
            }, {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/bundle/liiteri-loging/locale/sv.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "liiteri-loging",
                "Bundle-Name": "liiteri-loging",
                "Bundle-Author": [{
                    "Name": "aw",
                    "Organisation": "Sito Poland sp. z o. o.",
                    "Temporal": {
                        "Start": "2014",
                        "End": "2014"
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

Oskari.bundle_manager.installBundleClass(
    "liiteri-loging",
    "Oskari.liiteri.bundle.liiteri-loging.LiiteriLogingBundle"
);
