/**
 * @class Oskari.mapframework.common.ui.Bundle
 *
 */
Oskari.clazz.define("Oskari.mapframework.common.ui.Bundle",
/**
 * @constructor
 *
 * Bundle's constructor is called when bundle is created. At
 * this stage bundle sources have been loaded, if bundle is
 * loaded dynamically.
 *
 */
function() {

	/*
	 * Any bundle specific classes may be declared within
	 * constructor to enable stealth mode
	 *
	 * When running within map application framework - Bundle
	 * may refer classes declared with Oskari.clazz.define() -
	 * Bundle may refer classes declared with Ext.define -
	 * Bundle may refer classes declared within OpenLayers
	 * libary
	 *
	 *
	 */
}, {
	/*
	 * @method create
	 *
	 * called when a bundle instance will be created
	 *
	 */
	"create" : function() {

		return null;
	},
	/**
	 * @method update
	 *
	 * Called by Bundle Manager to provide state information to
	 * bundle
	 *
	 */
	"update" : function(manager, bundle, bi, info) {

	}
},

/**
 * metadata
 */
{

	"protocol" : ["Oskari.bundle.Bundle"],
	"source" : {

		"scripts" : [{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/common/enhancement/disable-development-mode-enhancement.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/common/enhancement/set-default-map-control-active-enhancement.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/common/enhancement/openlayers-image-path-enhancement.js"
		}],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "common",
			"Bundle-Name" : "mapframework.common.ui.Bundle",
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
					"Name" : " mapframework.common.ui.Bundle",
					"Title" : " mapframework.common.ui.Bundle"
				},
				"en" : {}
			},
			"Bundle-Version" : "1.0.0",
			"Import-Namespace" : ["Oskari"],
			"Import-Bundle" : {}
		}
	}
});

/**
 * Install this bundle by instantating the Bundle Class
 *
 */
Oskari.bundle_manager.installBundleClass("common", "Oskari.mapframework.common.ui.Bundle");
