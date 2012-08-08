/**
 * @class Oskari.mapframework.bundle.CoreMapModuleBundle
 */
Oskari.clazz.define("Oskari.mapframework.bundle.CoreMapModuleBundle", function() {
	this.singleton = null;
}, {
	/*
	 * implementation for protocol 'Oskari.bundle.Bundle'
	 */
	"create" : function() {

		if(!this.singleton) {
			this.singleton = Oskari.clazz.create("Oskari.mapframework.bundle.CoreMapModuleBundleInstance");

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

		"scripts" : [
		/*
		 * map-module
		 */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/ui/module/map-module.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/Plugin.js"
		},
		/**
		 * controls plugin
		 */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/ControlsPlugin.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/PorttiKeyboard.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/PorttiMouse.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/PorttiZoomBar.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/PorttiDragPan.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/PorttiDrag.js"
		},

		/**
		 *
		 */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/getinfo/GetInfoAdapter.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/getinfo/GetFeatureInfoHandler.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/getinfo/GetInfoPlugin.js"
		},

		/**
		 * Markers plugin
		 */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/markers/MarkersPlugin.js"
		},
		/**
		 * Layers plugin
		 */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/layers/LayersPlugin.js"
		},
		/** Layers backport */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/wmslayer/WmsLayerPlugin.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/wmslayer/SnappyGrid.js"
		},

		/**
		 * Requests & handlers
		 */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/request/ToolSelectionRequest.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/ToolSelectionHandler.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/request/MapLayerUpdateRequest.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/request/MapLayerUpdateRequestHandler.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/request/MapMoveRequestHandler.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/event/MapClickedEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/event/EscPressedEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/request/ClearHistoryRequest.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/controls/ClearHistoryHandler.js"
		}, {
			"type" : "text/javascript",
			"src" : "instance.js"
		}],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "mapmodule-core",
			"Bundle-Name" : "mapmodule core",
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
					"Name" : "Kartta",
					"Title" : "Kartta"
				},
				"en" : {}
			},
			"Bundle-Version" : "1.0.0",
			"Import-Namespace" : ["Oskari", "Ext", "OpenLayers"]
		}
	}
});

/**
 * Install this bundle
 */
Oskari.bundle_manager.installBundleClass("mapmodule-core", "Oskari.mapframework.bundle.CoreMapModuleBundle");
