/**
 * Definition for bundle. See source for details.
 *
 * @class Oskari.liiteri.bundle.liiteri-layers-tabs.LiiteriLayersTabs
 */
Oskari.clazz.define("Oskari.liiteri.bundle.liiteri-layers-tabs.LiiteriLayersTabsBundle",

    /**
     * Called automatically on construction. At this stage bundle sources have been
     * loaded, if bundle is loaded dynamically.
     *
     * @contructor
     * @static
     */
    function () {

    }, {
        /*
         * called when a bundle instance will be created
         *
         * @method create
         */
        "create": function () {
            return Oskari.clazz.create("Oskari.liiteri.bundle.liiteri-layers-tabs.LiiteriLayersTabsBundleInstance", 'liiteri-layers-tabs');
        },
        /**
         * Called by Bundle Manager to provide state information to
         *
         * @method update
         * bundle
         */
        "update": function (manager, bundle, bi, info) {
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
                "src": "../../../../bundles/liiteri/liiteri-layers-tabs/instance.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/liiteri-layers-tabs/model/LayerGroup.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/liiteri-layers-tabs/view/LayersTab.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/liiteri-layers-tabs/view/Layer.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/liiteri-layers-tabs/resources/css/style.css"
            }
            ],
            "locales": [{
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/liiteri-layers-tabs/resources/locale/fi.js"
            }, {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/liiteri-layers-tabs/resources/locale/en.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "liiteri-layers-tabs",
                "Bundle-Name": "liiteri-layers-tabs",
                "Bundle-Author": [{
                    "Name": "Paulina Derkowska",
                    "Organisation": "Sito Poland",
                    "Temporal": {
                        "Start": "2019",
                        "End": "2019"
                    }
                }],
                "Bundle-Name-Locale": {
                    "fi": {
                        "Name": "liiteri-layers-tabs",
                        "Title": "liiteri-layers-tabs"
                    },
                    "en": {
                        "Name": "liiteri-layers-tabs",
                        "Title": "liiteri-layers-tabs"
                    }
                },
                "Bundle-Version": "1.0.0",
                "Import-Namespace": ["Oskari"],
                "Import-Bundle": {}
            }
        }
    });

// Install this bundle by instantating the Bundle Class
Oskari.bundle_manager.installBundleClass("liiteri-layers-tabs", "Oskari.liiteri.bundle.liiteri-layers-tabs.LiiteriLayersTabsBundle");