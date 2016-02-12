/**
 * @class Oskari.digiroad.bundle.personaldata.PersonalDataBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.digiroad.bundle.personaldata.PersonalDataBundle", function() {

}, {
	"create" : function() {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.digiroad.bundle.personaldata.PersonalDataBundleInstance");
		return inst;

	},
	"update" : function(manager, bundle, bi, info) {

	}
}, {

	"protocol" : ["Oskari.bundle.Bundle"],
	"source" : {

		"scripts" : [{
			"type" : "text/javascript",
			"src" : "../../../../bundles/digiroad/digiroad-personaldata/instance.js"

		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/digiroad/digiroad-personaldata/Flyout.js"

		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/digiroad/digiroad-personaldata/Tile.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/digiroad/digiroad-personaldata/MyPlacesTab.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/digiroad-personaldata/service/ViewService.js"
        }, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/digiroad/digiroad-personaldata/MyEditedFeaturesTab.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/digiroad/digiroad-personaldata/MyFeedbackTab.js"
		}, {
		    "type" : "text/css",
		    "src" : "../../../../bundles/digiroad/digiroad-personaldata/resources/css/personaldata.css"		  
		}],
		
		"locales" : [{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/digiroad/digiroad-personaldata/resources/locale/fi.js"
		}, {
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/digiroad/digiroad-personaldata/resources/locale/sv.js"
		}, {
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/digiroad/digiroad-personaldata/resources/locale/en.js"
		}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "digiroad-personaldata",
			"Bundle-Name" : "digiroad-personaldata",
			"Bundle-Author" : [{
				"Name" : "ejv",
				"Organisation" : "nls.fi",
				"Temporal" : {
					"Start" : "2009",
					"End" : "2011"
				},
				"Copyleft" : {
					"License" : {
						"License-Name" : "EUPL",
						"License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
					}
				}
			}],
			"Bundle-Name-Locale" : {
				"fi" : {
					"Name" : " style-1",
					"Title" : " style-1"
				},
				"en" : {}
			},
			"Bundle-Version" : "1.0.0",
			"Import-Namespace" : ["Oskari"],
			"Import-Bundle" : {}
		}
	},

	/**
	 * @static
	 * @property {String[]} dependencies
	 */
	"dependencies" : ["jquery"]

});

Oskari.bundle_manager.installBundleClass("digiroad-personaldata", "Oskari.digiroad.bundle.personaldata.PersonalDataBundle");
