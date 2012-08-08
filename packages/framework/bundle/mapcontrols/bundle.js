/**
 * @class Oskari.mapframework.bundle.DefaultMapControlsBundle
 */
Oskari.clazz.define("Oskari.mapframework.bundle.DefaultMapControlsBundle", function() {
	this.singleton = null;
}, {
	/*
	 * implementation for protocol 'Oskari.bundle.Bundle'
	 */
	"create" : function() {

		if(!this.singleton) {
			this.singleton = Oskari.clazz.create("Oskari.mapframework.bundle.DefaultMapControlsBundleInstance");
		}

		return this.singleton;
	},
	"update" : function(manager, bundle, bi, info) {
		manager.alert("RECEIVED update notification " + info);
	}
},

/**
 * metadata
 */
{

	"protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
	"source" : {

		"scripts" : [{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapcontrols/ui/module/map-controls-module.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapcontrols/request/ToolButtonRequest.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapcontrols/request/ToolButtonRequestHandler.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapcontrols/action/GeoAction.js"
		}, {
			"type" : "text/css",
			"src" : "../../../../resources/framework/bundle/mapcontrols/css/maptools.css"
		}, {
			"type" : "text/javascript",
			"src" : "instance.js"
		}],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "mapcontrols",
			"Bundle-Name" : "mapcontrols",
			"Bundle-Tag" : {
				"mapframework" : true
			},

			"Bundle-Icon" : {
				"href" : "icon.png"
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
					"Name" : "Haku",
					"Title" : "Haku"
				},
				"en" : {}
			},
			"Bundle-Version" : "1.0.0",
			"Import-Namespace" : ["Oskari", "Ext"]
		}
	}
});

/**
 * Install this bundle
 */
Oskari.bundle_manager.installBundleClass("mapcontrols", "Oskari.mapframework.bundle.DefaultMapControlsBundle");
