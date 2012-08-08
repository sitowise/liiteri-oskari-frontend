
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.Candy2Bundle",
				function() {

				},

				{
					"create" : function() {

						return Oskari.clazz
								.create("Oskari.mapframework.bundle.Candy2BundleInstance");
					},
					"update" : function(manager, bundle, bi, info) {

					}

				},

				{

					"protocol" : [ "Oskari.bundle.Bundle",
							"Oskari.mapframework.bundle.extension.ExtensionBundle" ],
					"source" : {

						"scripts" : [ {
							"type" : "text/javascript",
							"src" : "app.js"
						}, {

							"type" : "text/javascript",
							"src" : "ui/manager/sample-ui-facade.js"
						}, {

							"type" : "text/javascript",
							"src" : "ui/manager/sample-ui-manager.js"
						},{
							"type" : "text/css" ,
							"src" : "style.css"
							
						},{
							"type" : "text/javascript",
							"src" : "instance.js"
						}],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "candy2",
							"Bundle-Name" : "candy2",
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
									"Name" : " candy2",
									"Title" : " candy2"
								},
								"en" : {}
							},
							"Bundle-Version" : "1.0.0",
							"Import-Namespace" : [ "Oskari" ],
							"Import-Bundle" : {}
						}
					}
				});

Oskari.bundle_manager.installBundleClass("candy2",
		"Oskari.mapframework.bundle.Candy2Bundle");
