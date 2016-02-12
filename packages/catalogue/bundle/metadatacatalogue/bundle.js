/**
 * @class Oskari.catalogue.bundle.metadatacatalogue.MetadataCatalogueBundle
 * 
 */
Oskari.clazz.define("Oskari.catalogue.bundle.metadatacatalogue.MetadataCatalogueBundle", function() {

}, {
	"create" : function() {

		return Oskari.clazz.create("Oskari.catalogue.bundle.metadatacatalogue.MetadataCatalogueBundleInstance");

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

		"scripts" : [
			/* service */
			{
	            "type": "text/javascript",
	            "src": "../../../../bundles/catalogue/metadatacatalogue/service/MetadataOptionService.js"
	        }, {
	            "type": "text/javascript",
	            "src": "../../../../bundles/catalogue/metadatacatalogue/service/MetadataSearchService.js"
	        }, 
	        /* plugin */
	        {
	            "type": "text/javascript",
	            "src": "../../../../bundles/framework/featuredata2/plugin/MapSelectionPlugin.js"
	        }, 
	        /* event */
	        {
	            "type": "text/javascript",
	            "src": "../../../../bundles/catalogue/metadatacatalogue/event/FinishedDrawingEvent.js"
	        }, 
	        /* instance */
	        {
				"type" : "text/javascript",
				"src" : "../../../../bundles/catalogue/metadatacatalogue/instance.js"
			}, 
			/* request */
	        {
	            "type": "text/javascript",
	            "src": "../../../../bundles/catalogue/metadatacatalogue/request/AddSearchResultActionRequest.js"
	        }, {
	            "type": "text/javascript",
	            "src": "../../../../bundles/catalogue/metadatacatalogue/request/AddSearchResultActionRequestHandler.js"
	        },
	        /* css */
			{
				"type" : "text/css",
				"src" : "../../../../bundles/catalogue/metadatacatalogue/resources/css/style.css"
			}
		], 
		"locales" : [  
		{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/catalogue/metadatacatalogue/resources/locale/fi.js"
		},{
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/catalogue/metadatacatalogue/resources/locale/en.js"
		},{
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/catalogue/metadatacatalogue/resources/locale/sv.js"
		},{
			"lang" : "es",
			"type" : "text/javascript",
			"src" : "../../../../bundles/catalogue/metadatacatalogue/resources/locale/es.js"
		}],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "metadatacatalogue",
			"Bundle-Name" : "catalogue.bundle.metadatacatalogue",
			"Bundle-Author" : [{
				"Name" : "jjk",
				"Organisation" : "nls.fi",
				"Temporal" : {
					"Start" : "2012",
					"End" : "2012"
				},
				"Copyleft" : {
					"License" : {
						"License-Name" : "EUPL",
						"License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
					}
				}
			}],			
			"Bundle-Version" : "1.0.0",
			"Import-Namespace" : ["Oskari"],
			"Import-Bundle" : {}
		}
	}
});

Oskari.bundle_manager.installBundleClass("metadatacatalogue", "Oskari.catalogue.bundle.metadatacatalogue.MetadataCatalogueBundle");