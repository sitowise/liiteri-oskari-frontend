
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.KPIBundle",
				function() {

				},

				{
					"create" : function() {

						return Oskari.clazz
								.create("Oskari.mapframework.bundle.KPIBundleInstance");
					},
					"update" : function(manager, bundle, bi, info) {

					}

				},

				{

					"protocol" : [ "Oskari.bundle.Bundle",
							"Oskari.mapframework.bundle.extension.ExtensionBundle" ],
					"source" : {

						"scripts" : [{
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
							"Bundle-Identifier" : "kpI",
							"Bundle-Name" : "kpI",
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

Oskari.bundle_manager.installBundleClass("kpI",
		"Oskari.mapframework.bundle.KPIBundle");

