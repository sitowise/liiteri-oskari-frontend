/**
 * @class Oskari.mapframework.bundle.mapprint.PrintBundle
 */
Oskari.clazz.define("Oskari.mapframework.bundle.mapprint.PrintBundle", function() {

}, {
	"create" : function() {

		return Oskari.clazz.create("Oskari.mapframework.bundle.mapprint.PrintBundleInstance");
	},
	"update" : function(manager, bundle, bi, info) {

	}
}, {

	"protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
	"source" : {

		"scripts" : [{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapfull/enhancement/start-map-with-link-enhancement.js"
		}, {
			"type" : "text/javascript",
			"src" : "instance.js"
		}],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "print",
			"Bundle-Name" : "print",
			"Bundle-Tag" : {
				"mapframework" : true
			},

			"Bundle-Author" : [{
				"Name" : "jjk",
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
					"Name" : " print",
					"Title" : " print"
				},
				"en" : {}
			},
			"Bundle-Version" : "1.0.0",
			"Import-Namespace" : ["Oskari"],
			"Import-Bundle" : {}
		}
	}
});

Oskari.bundle_manager.installBundleClass("mapprint", "Oskari.mapframework.bundle.mapprint.PrintBundle");
