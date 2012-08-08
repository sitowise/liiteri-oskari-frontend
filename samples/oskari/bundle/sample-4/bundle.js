
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.Sample4Bundle",
				function() {

				},

				{
					"create" : function() {

						return Oskari.clazz
								.create("Oskari.mapframework.bundle.Sample4BundleInstance");
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
								"src" : "app.js"
							},{
								"type" : "text/javascript",
								"src" : "instance.js"
							}
						             
						 ],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "sample-4",
							"Bundle-Name" : "sample-4",
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
									"Name" : " sample-4",
									"Title" : " sample-4"
								},
								"en" : {}
							},
							"Bundle-Version" : "1.0.0",
							"Import-Namespace" : [ "Oskari" ],
							"Import-Bundle" : {}
						}
					}
				});

Oskari.bundle_manager.installBundleClass("sample-4",
		"Oskari.mapframework.bundle.Sample4Bundle");

