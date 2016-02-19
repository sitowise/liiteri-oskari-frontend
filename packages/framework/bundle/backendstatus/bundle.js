/**
 * @class Oskari.mapframework.bundle.backendstatus.BackendStatusBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.backendstatus.BackendStatusBundle", function() {

}, {
	"create" : function() {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.mapframework.bundle.backendstatus.BackendStatusBundleInstance");

		return inst;

	},
	"update" : function(manager, bundle, bi, info) {

	}
}, {

	"protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
	"source" : {

		"scripts" : [{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/backendstatus/instance.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/backendstatus/event/BackendStatusChangedEvent.js"
		}],
		"locales" : [{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/backendstatus/resources/locale/fi.js"
		}, {
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/backendstatus/resources/locale/sv.js"
		}, {
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/backendstatus/resources/locale/en.js"
		}, {
			"lang" : "sl",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/backendstatus/resources/locale/sl.js"
		}, {
			"lang" : "es",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/backendstatus/resources/locale/es.js"
		}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "backendstatus",
			"Bundle-Name" : "backendstatus",
			"Bundle-Author" : [{
				"Name" : "jjk",
				"Organisation" : "nls.fi",
				"Temporal" : {
					"Start" : "2012"
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
					"Name" : "backendstatus",
					"Title" : "backendstatus"
				},
				"en" : {}
			},
			"Bundle-Version" : "1.0.0",
			"Import-Namespace" : ["Oskari", "jquery"],
			"Import-Bundle" : {}

			/**
			 *
			 */

		}
	},

	/**
	 * @static
	 * @property dependencies
	 */
	"dependencies" : ["jquery"]

});

Oskari.bundle_manager.installBundleClass("backendstatus", "Oskari.mapframework.bundle.backendstatus.BackendStatusBundle");
