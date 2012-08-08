

Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.Sample12Bundle",
				function() {

				},

				{
					"create" : function() {

						if( this.singleton )
							throw "Oskari.mapframework.bundle.Sample12Bundle is singleton";
					
						
						this.singleton = Oskari.clazz
								.create("Oskari.mapframework.bundle.Sample12BundleInstance");
						return this.singleton;
						
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
						}],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "sample-12",
							"Bundle-Name" : "sample-12",
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
									"Name" : " sample-12",
									"Title" : " sample-12"
								},
								"en" : {}
							},
							"Bundle-Version" : "1.0.0",
							"Import-Namespace" : [ "Oskari" ],
							"Import-Bundle" : {}
						}
					}
				});

Oskari.bundle_manager.installBundleClass("sample-12",
		"Oskari.mapframework.bundle.Sample12Bundle");
