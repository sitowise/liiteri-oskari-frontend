/**
 * @class Oskari.liiteri.bundle.liiteri-feedback.LiiteriFeedback
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define(
    "Oskari.liiteri.bundle.liiteri-feedback.LiiteriFeedback",
    
	/**
     * @method create called automatically on construction
     * @static
     */
    function () {
	},
	{
        "create": function () {
            return Oskari.clazz.create("Oskari.liiteri.bundle.liiteri-feedback.LiiteriFeedbackBundleInstance");
        },
        "update": function (manager, bundle, bi, info) {
		}
    }, 
	{
        "protocol": [
            "Oskari.bundle.Bundle",
            "Oskari.mapframework.bundle.extension.ExtensionBundle"
        ],
        "source": {

            "scripts": [{
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/bundle/liiteri-feedback/instance.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/bundle/liiteri-feedback/Tile.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/bundle/liiteri-feedback/Flyout.js"
            }, {
                "type": "text/css",
                "src": "../../../../resources/liiteri/bundle/liiteri-feedback/css/style.css"
            }],
            "locales": [{
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/bundle/liiteri-feedback/locale/en.js"
            }, {
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/bundle/liiteri-feedback/locale/fi.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "liiteri-feedback",
                "Bundle-Name": "liiteri-feedback",
                "Bundle-Author": [{
                    "Name": "kk",
                    "Organisation": "Sito Poland",
                    "Temporal": {
                        "Start": "2014",
                        "End": "2014"
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

Oskari.bundle_manager.installBundleClass("liiteri-feedback", "Oskari.liiteri.bundle.liiteri-feedback.LiiteriFeedback");