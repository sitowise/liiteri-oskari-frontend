
Oskari.clazz
		.define(
				"Oskari.poc.bundle.DojoBundle",
				function() {

				},

				{
					"create" : function() {

						return Oskari.clazz
								.create("Oskari.poc.bundle.DojoBundleInstance");
					},
					"update" : function(manager, bundle, bi, info) {

					}

				},

				{

					"protocol" : [ "Oskari.bundle.Bundle",
							"Oskari.mapframework.bundle.extension.ExtensionBundle" ],
					"source" : {

						"scripts" : [{
							"type" : "text/javascript",
							"src" : "instance.js"
						},{
							"type" : "text/javascript",
							"src" : "../../../../bundles/framework/bundle/mapfull/enhancement/start-map-with-link-enhancement.js"
						}],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "dojo",
							"Bundle-Name" : "dojo",
							"Bundle-Author" : [ {
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
							} ],
							"Bundle-Name-Locale" : {
								"fi" : {
									"Name" : " kpI",
									"Title" : " kpI"
								},
								"en" : {}
							},
							"Bundle-Version" : "1.0.0",
							"Import-Namespace" : [ "Oskari" ],
							"Import-Bundle" : {}
						}
					}
				});

Oskari.bundle_manager.installBundleClass("dojo",
		"Oskari.poc.bundle.DojoBundle");

