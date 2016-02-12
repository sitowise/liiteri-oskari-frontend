/**
 * @class Oskari.lupapiste.bundle.myplaces2.MyPlacesBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.lupapiste.bundle.myplaces2.MyPlacesBundle", function() {
}, {
	"create" : function() {
		return Oskari.clazz.create("Oskari.lupapiste.bundle.myplaces2.MyPlacesBundleInstance");
	},
	"update" : function(manager, bundle, bi, info) {
		manager.alert("RECEIVED update notification " + info);
	}
},
{
	"protocol" : ["Oskari.bundle.Bundle"],
	"source" : {
		"scripts" : [
		/* event */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/event/FinishedDrawingEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/event/MyPlaceHoverEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/event/MyPlacesChangedEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/event/MyPlaceSelectedEvent.js"
		},
		/* model */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/model/MyPlace.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/model/MyPlacesCategory.js"
		},
		/* plugin */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/plugin/DrawPlugin.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/plugin/HoverPlugin.js"
		},
		/* request */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/request/StopDrawingRequest.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/request/StartDrawingRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/request/GetGeometryRequest.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/request/GetGeometryRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/request/StartDrawingRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/request/StopDrawingRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/request/EditPlaceRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/request/EditCategoryRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/request/DeleteCategoryRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/request/PublishCategoryRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/request/EditRequestHandler.js"
		},
		/* service */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/service/MyPlacesService.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/service/MyPlacesWFSTStore.js"
		},
		/* ui */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/view/MainView.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/view/PlaceForm.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/view/CategoryForm.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/ButtonHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/CategoryHandler.js"
        }, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/instance.js"
        }, {
           // NOTE! EXTERNAL LIBRARY!
            "type" : "text/javascript",
            "src" : "../../../../libraries/jscolor/jscolor.js"
		}],

        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/resources/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/resources/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/lupapiste/lupapiste-myplaces2/resources/locale/en.js"
        }
       ]
	},
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "lupapiste-myplaces2",
            "Bundle-Name" : "lupapiste-myplaces2",
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
            "Import-Namespace" : ["Oskari", "jquery"],
            "Import-Bundle" : {}
        }
    },

    /**
     * @static
     * @property dependencies
     */
    "dependencies" : ["jquery"]

});

/**
 * Install this bundle
 */
Oskari.bundle_manager.installBundleClass("lupapiste-myplaces2", "Oskari.lupapiste.bundle.myplaces2.MyPlacesBundle");
