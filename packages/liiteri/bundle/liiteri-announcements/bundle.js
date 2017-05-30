/**
 * @class Oskari.liiteri.bundle.liiteri-announcements.LiiteriAnnouncements
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define(
    "Oskari.liiteri.bundle.liiteri-announcements.LiiteriAnnouncements",
    
	/**
     * @method create called automatically on construction
     * @static
     */
    function () {
	},
	{
        "create": function () {
            return Oskari.clazz.create("Oskari.liiteri.bundle.liiteri-announcements.LiiteriAnnouncementsBundleInstance");
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
                "src": "../../../../bundles/liiteri/liiteri-announcements/instance.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/liiteri-announcements/Tile.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/liiteri-announcements/request/ShowAnnouncementsFlyoutRequest.js"
            },{
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/liiteri-announcements/request/ShowAnnouncementsFlyoutRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/liiteri-announcements/request/ShowAnnouncementsRequest.js"
            },{
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/liiteri-announcements/request/ShowAnnouncementsRequestHandler.js"
            },{
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/liiteri-announcements/Flyout.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../libraries/jquery/plugins/jquery.cookie.js"
            }, {
                "type": "text/css",
                "src": "../../../../bundles/liiteri/liiteri-announcements/resources/css/style.css"
            }, {
                "src": "../../../../libraries/jquery/plugins/DataTables-1.10.7/media/js/jquery.dataTables.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/jquery/plugins/DataTables-1.10.7/media/css/jquery.dataTables.css",
                "type": "text/css"
            }, {
                "src": "../../../../libraries/jquery-te/jquery-te-1.4.0.min.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/jquery-te/jquery-te-1.4.0.css",
                "type": "text/css"
            }
            ],
            "locales": [{
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/liiteri-announcements/resources/locale/en.js"
            }, {
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/liiteri/liiteri-announcements/resources/locale/fi.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "liiteri-announcements",
                "Bundle-Name": "liiteri-announcements",
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

Oskari.bundle_manager.installBundleClass("liiteri-announcements", "Oskari.liiteri.bundle.liiteri-announcements.LiiteriAnnouncements");