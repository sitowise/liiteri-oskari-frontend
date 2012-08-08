/**
 * @class Oskari.poc.kendoui.LayerSelectionBundle
 */
Oskari.clazz.define("Oskari.poc.kendoui.LayerSelectionBundle", function() {

}, {
	"create" : function() {

		return Oskari.clazz.create("Oskari.poc.kendoui.bundle.LayerSelectionBundleInstance");

	},
	"start" : function() {
	},
	"stop" : function() {
	},
	"update" : function(manager, bundle, bi, info) {

	}
}, {

	"protocol" : ["Oskari.bundle.Bundle", "Oskari.bundle.BundleInstance", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
	"source" : {

		"scripts" : [{
			"type" : "text/javascript",
			"src" : "../../../../proof-of-concepts/kendoui/bundle/layerselection/instance.js"

		}, {
			"type" : "text/javascript",
			"src" : "../../../../proof-of-concepts/kendoui/bundle/layerselection/Flyout.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../proof-of-concepts/kendoui/bundle/layerselection/Tile.js"
		}],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "kendoui-layerselection",
			"Bundle-Name" : "kendoui-layerselection",
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
					"Name" : " style-1",
					"Title" : " style-1"
				},
				"en" : {}
			},
			"Bundle-Version" : "1.0.0",
			"Import-Namespace" : ["Oskari"],
			"Import-Bundle" : {}
		}
	}
});

Oskari.bundle_manager.installBundleClass("kendoui-layerselection", "Oskari.poc.kendoui.LayerSelectionBundle");
