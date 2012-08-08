/* This is a unpacked Oskari bundle (bundle script version Wed Feb 15 2012 20:10:12 GMT+0200 (Suomen normaaliaika)) */ 
/**
 * 
 *  
 */

/**
 * 
 * @class Oskari.mapframework.bundle.BundleManagerUI
 * 
 * UI for this Bundle Instance. Show a list of bundles in a grid.
 * 
 * 
 */
Oskari.clazz.define("Oskari.mapframework.bundle.BundleManagerUI", function(
		libs, bundle) {
	this.libs = libs;
	this.form = null;
	this.ui = null;
	this.store = null;
	this.form = null;
	this.grid = null;
	this.bundle = bundle;
	this.lang = null;

}, {
	clear : function() {
		this.store = null;
		this.form = null;
		this.libs = null;
		this.ui = null;
		this.grid = null;
	},
	setLibs : function(libs) {
		this.libs = libs;
	},
	get : function() {
		return this.form;
	},
	setStore : function(s) {
		this.store = s;
	},
	getStore : function() {
		return this.store;
	},
	getGrid : function() {
		return this.grid;
	},
	setLang : function(l) {
		this.lang = l;
	},
	getLang : function() {
		return this.lang;
	},
	/*
	 * ...
	 */

	playBundle : function(bundleRec) {
		this.bundle.playBundle(bundleRec);
	},
	
	pauseBundle: function(bundleRec) {
		this.bundle.pauseBundle(bundleRec);
	},
	resumeBundle: function(bundleRec) {
		this.bundle.resumeBundle(bundleRec);
	},
	stopBundle: function(bundleRec) {
		this.bundle.stopBundle(bundleRec);
	},
	
	refresh: function() {
		this.grid.getView().refresh();
	},

	/**
	 * @method create
	 * 
	 * create UI 
	 */
	create : function() {
		var xt = this.libs.ext;

		/**
		 * store
		 */
		var xt = this.libs.ext;

		/**
		 * grid
		 */
		var me = this;
		var lang = me.lang;
		
		var gridActionColumn = {
				xtype : 'actioncolumn',
				width : 64,
				items : [
						{
							text: 'Play',
							icon : '../../map-application-framework/resource/silk-icons/control_play.png',							
							handler : function(grid, rowIndex,
									colIndex) {
								var rec = me.getStore().getAt(rowIndex);
								me.playBundle(rec);
							},
							getClass : function(v, meta, rec) {
								
								var bundleinstancename = rec.get('bundleinstancename');
								
								var isSingleton = rec.get('metadata')["Singleton"];
								if( isSingleton && me.bundle.bundleInstances[bundleinstancename])
									return "hidden";
								
								
									return "";
									
							}
						},
						{
							text: 'Stop',
							icon : '.../../map-application-framework/resource/silk-icons/control_eject.png',
							handler : function(grid, rowIndex,
									colIndex) {
								var rec = me.getStore().getAt(rowIndex);
								me.stopBundle(rec);

							},
							getClass : function(v, meta, rec) {
								var isSingleton = rec.get('metadata')["Singleton"];
								if( !isSingleton )
									return "hidden";
								
								var bundleinstancename = rec.get('bundleinstancename');
								if( !me.bundle.bundleInstances[bundleinstancename])
									return "hidden";
								
									return "";
							}
						} ]
			};

		
		var grid = xt.create('Ext.grid.Panel', {
			defaults: { bodyPadding: 4 },
			store : me.getStore(),
			/*width : 400,
			height : 200,*/
			title : 'Bundles',
			columns : [ gridActionColumn/*{
				xtype : 'actioncolumn',
				width : 50,
				items : [ {
					icon : '../resource/silk-icons/control_play.png',
					tooltip : 'Apply',
					handler : function(grid, rowIndex, colIndex) {
					
					}
				} ]
			}*/, {
				text : 'Title',
				flex : 1,
				dataIndex : 'title',
				hidden: true
					
			}, {
				text : 'fi',
				flex : 1,
				dataIndex : 'fi',
				hidden : lang != 'fi'
			}, {
				text : 'sv',
				flex : 1,
				dataIndex : 'sv',
				hidden : lang != 'sv'
			}, {
				text : 'en',
				flex : 1,
				dataIndex : 'en',
				hidden : lang != 'en'
			},{
				text: "bundlename",
				dataIndex : "bundlename",
				hidden: true
			},{
				
				text: "bundleinstancename",
				dataIndex : "bundleinstancename",
				hidden: true
					
			}]
		});
		this.grid = grid;

		/*
		 * form
		 */

		var form = new xt.create('Ext.Panel', {
			//title : 'Data',
			bodyStyle : 'padding:5px 5px 5px 5px',
			height : 384,
			layout : 'fit',
			defaults : {
				bodyPadding : 4
			},
			items : [ grid ]
		});

		this.form = form;
		return form;
	}

});

/**
 * @class Oskari.mapframework.bundle.BundleManagerInstance
 * 
 * Bundle Instance
 */
Oskari.clazz.define("Oskari.mapframework.bundle.BundleManagerInstance",
		function(b) {

			this.name = 'bundlemanagerModule';

			this.mediator = null;
			this.sandbox = null;

			this.layerId = null;
			this.layer = null;

			this.ui = null;
			
			this.bundles = {};
			this.bundleInstances = {};

		},

		/*
		 * prototype
		 */
		{
			/*
			 * @method getStore
			 */
			getStore : function() {
				return this.store;
			},

			
			/**
			 * @method getUI
			 */
			getUI: function() {
				return this.ui;
			},
			
			/**
			 * @method playBundle
			 * 
			 * plays a bundle and !tries! to load any bundle and
			 * instance dependencies.
			 * 
			 * Work in Progress
			 * 
			 * 
			 */
			playBundle : function(rec) {
				// alert(bundleRec.get('title'));
				var recMetadata = rec.get('metadata');
				var bundlename = rec.get('bundlename');
				var bundleinstancename = rec.get('bundleinstancename');
				var fcd = Oskari.bundle_facade;
				
				var def = {
						title : bundleinstancename,
						fi : bundleinstancename,
						sv : '?',
						en : bundleinstancename,
						bundlename : bundlename,
						bundleinstancename : bundleinstancename,
						metadata: recMetadata
				};
				
				fcd.playBundle(def,function() { 
					
				});
			},
			
			/*
			 * @method pauseBundle
			 * NYI
			 * 
			 */
			pauseBundle: function(bundleRec) {
				
			},
			/*
			 * @method resumeBundle
			 * NYI
			 * 
			 */
			resumeBundle: function(bundleRec) {
				
			},
			/*
			 * @method stopBundle
			 * NYI
			 * 
			 */
			stopBundle: function(bundleRec) {
				
			},


			/**
			 * @method clear
			 */
			clear : function() {
				this.store.clearData();
				this.store.destroyStore();
				this.store = null;
			},

			/**
			 * @method start
			 * 
			 * start bundle instance
			 * 
			 */
			"start" : function() {

				if (this.mediator.getState() == "started")
					return;

				/**
				 * These should be SET BY Manifest begin
				 */
				this.libs = {
					ext : Oskari.$("Ext")
				};
				this.facade = Oskari.$('UI.facade');
				/**
				 * These should be SET BY Manifest end
				 */

				/*
				 * projection support
				 */
				this.projs = {
					"EPSG:4326" : new Proj4js.Proj("EPSG:4326"),
					"EPSG:3067" : new Proj4js.Proj("EPSG:3067")
				};

				/**
				 * data model
				 */
				var xt = this.libs.ext;

				var me = this;

				this.createModels();
				this.createStores();

				var me = this;

				/**
				 * throttled func
				 */

				this.func = xt.Function.createThrottled(function(n, e) {
					this.processQuery(n, e);
				}, 1000, me);

				/**
				 * register to framework and eventHandlers
				 */
				var def = this.facade.appendExtensionModule(this, this.name,
						this.eventHandlers, this, 'E', {
							'fi' : {
								title : ' bundlemanager'
							},
							'sv' : {
								title : '?'
							},
							'en' : {
								title : ' bundlemanager'
							}

						});
				this.def = def;

				this.mediator.setState("started");
				return this;
			},
			
			/**
			 * @method getStore
			 */
			getStore: function() {
				return this.store;
			},

			/**
			 * @method createModesl
			 */
			createModels : function() {
				var xt = this.libs.ext;
				var me = this;

				if (!xt.ClassManager.get('Bundle')) {
					xt.define('Bundle', {
						extend : 'Ext.data.Model',
						fields : [ "title", "fi", "en", "sv", "bundlename",
								"bundleinstancename", "metadata" ]
					});
				}
			},

			/**
			 * @method createStores
			 */
			createStores : function() {

				var data = this.defaultBundleData;

				var xt = this.libs.ext;
				var me = this;
				var store = xt.create('Ext.data.Store', {
					model : 'Bundle',
					autoLoad : false,
					data : data,
					proxy : {
						type : 'memory',
						/*
						 * url :
						 * "http://api.geonames.org/findNearbybundlemanagerJSON",
						 * pageParam : null, startParam : null, limitParam :
						 * null,
						 */
						reader : {

							type : 'json',
							model : 'Bundle',
							root : 'bundles'
						}

					}
				});
				this.store = store;
			},

			/**
			 * @method init
			 * 
			 * init UI module called after start
			 */
			init : function(sandbox) {
				this.sandbox = sandbox;
				/*
				 * build UI
				 */

				var ui = Oskari.clazz.create(
						'Oskari.mapframework.bundle.BundleManagerUI',
						this.libs, this);
				var lang = sandbox.getLanguage();
				ui.setLang(lang);
				this.ui = ui;
				ui.setLibs(this.libs);
				ui.setStore(this.getStore());
				ui.create();

				return ui.get();
			},

			/**
			 * 
			 * @method update
			 * 
			 * notifications from bundle manager
			 */
			"update" : function(manager, b, bi, info) {
				manager.alert("RECEIVED update notification @BUNDLE_INSTANCE: "
						+ info);
			},

			/**
			 * @method stop
			 * 
			 * stop bundle instance
			 * 
			 */
			"stop" : function() {

				this.facade.removeExtensionModule(this, this.name,
						this.eventHandlers, this, this.def);
				this.def = null;
				this.sandbox.printDebug("Clearing STORE etc");

				this.ui.clear();
				this.ui = null;
				this.clear();

				this.mediator.setState("stopped");

				return this;
			},

			/**
			 * @method onEvent
			 * 
			 * dispatches events to event handlers defined
			 * in hashmap 'eventHandlers'
			 * 
			 *  This receives only events registered to on startup
			 * 
			 */
			onEvent : function(event) {
				return this.eventHandlers[event.getName()].apply(this,
						[ event ]);
			},

			defaults : {
				minScale : 40000,
				maxScale : 1
			},

			/*
			 * @property eventHandlers
			 * eventHandlers to be bound to map framework
			 * 
			 */
			eventHandlers : {

			},

			/**
			 * 
			 */

			/**
			 * @method processResponse
			 * process bundlemanager JSON service response (in the future)
			 */
			processResponse : function(records) {
				var xt = this.libs.ext;
				var me = this;

			},

			/**
			 * @property defaultBundleData
			 */
			defaultBundleData : {
				bundles : [ /*{
					title : 'Terminal',
					fi : 'P\u00E4\u00E4te',
					sv : '?',
					en : '?',
					bundlename : 'terminal',
					bundleinstancename : 'terminal',
					metadata : {
						"Singleton": true,
						"Import-Bundle" : {
							"terminal" : {
								bundlePath: "../example-bundles/bundle/"
							}
						}
					}
				},*/ {
					title : 'Location Info',
					fi : 'Location Info',
					sv : '?',
					en : '?',
					bundlename : 'positioninfo',
					bundleinstancename : 'positioninfo',
					metadata : {
						
						"Import-Bundle" : {
							"positioninfo" : {
								bundlePath: "../complexbundle/bundle/"
							}
						}
					}
				}, {
					title : 'Search',
					fi : 'Hakutoiminnot',
					sv : '?',
					en : '?',
					bundlename : 'searchservice',
					bundleinstancename : 'searchservice',
					metadata : {
						"Singleton": true,
						"Import-Bundle" : {
							"searchservice" : {}
						}
					}
				}, {
					title : 'Selected Layers',
					fi : 'Valitut karttatasot',
					sv : '?',
					en : 'Selected Layers',
					bundlename : 'layerselection',
					bundleinstancename : 'layerselection',
					metadata : {
						"Singleton": true,
						"Import-Bundle" : {
							"layerselection" : {}
						}
					}
				}, {
					title : 'All Layers',
					fi : 'Karttatasojen haku ja valinta',
					sv : '?',
					en : 'Layer Selector',
					bundlename : 'layerselector',
					bundleinstancename : 'layerselector',
					metadata : {
						"Import-Bundle" : {
							"layerselector" : {}
						}
					}
				}, {
					title : 'Map Controls',
					fi : 'Karttaty\u00D6kalut',
					sv : '?',
					en : 'Map Toolbar',
					bundlename : 'mapcontrols',
					bundleinstancename : 'mapcontrols',
					metadata : {
						"Singleton": true,
						"Import-Bundle" : {
							"mapcontrols" : {},
							"mapmodule-plugin" : {}
						},
						"Require-Bundle-Instance" : [
						                      //"mapmodule"
						           
						]
					}
				}, {
					title : 'Map StatusBar',
					fi : 'Kartan tilatiedot',
					sv : '?',
					en : 'Map StatusBar',
					bundlename : 'mapposition',
					bundleinstancename : 'mapposition',
					metadata : {
						"Singleton": true,
						"Import-Bundle" : {
							"mapposition" : {}
						}
					}
				}, /*{
					title : 'Map Overlay',
					fi : 'Leijuke',
					sv : '?',
					en : 'Map Overlay',
					bundlename : 'mapoverlaypopup',
					bundleinstancename : 'MapOverlay',
					metadata : {
						"Import-Bundle" : {
							"mapoverlaypopup" : {}
						}
					}
				},*/ {
					title : 'WFS Grid',
					fi : 'Web Feature Service Taulukko',
					sv : '?',
					en : 'Web Feature Service Grid',
					bundlename : 'mapasker',
					bundleinstancename : 'mapasker',
					metadata : {
						"Singleton": true,
						"Import-Bundle" : {
							"mapasker" : {}
						}
					}
				}, {
					title : 'Wikipedia',
					fi : 'Wikipedia',
					sv : '?',
					en : 'Wikipedia',
					bundlename : 'wikipedia',
					bundleinstancename : 'wikipedia',
					metadata : {
						"Import-Bundle" : {
							"mapmodule-plugin" : {},
							"wikipedia" : {
								bundlePath: "../complexbundle/bundle/"
							},
							"mapoverlaypopup" : {},
							"layerhandler" : {}
						}
					}
				}, /*{
					title : 'Map',
					fi : 'Kartta',
					sv : '?',
					en : 'Map',
					bundlename : 'mapmodule',
					bundleinstancename : 'mapmodule',
					metadata : {
						"Singleton": true,
						"Import-Bundle" : {
							"mapmodule" : {},
							"layerhandler" : {},
							"mapoverlaypopup": {}
						},
						"Require-Bundle-Instance" : [
						 						    "layerhandler",
						 						     "mapoverlaypopup"
						 						]
					}
				},*/ {
					title : 'Sade From Demo 3',
					fi : 'SADE Lomakedemo 3',
					sv : '?',
					en : 'SADE Form Demo 3',
					bundlename : 'sade3',
					bundleinstancename : 'sade3',
					metadata : {
						"Singleton": true,
						"Import-Bundle" : {
							"sade3" : {
								bundlePath: "../example-bundles/bundle/"
							},
							"mapmodule-plugin" : {},
							"layerhandler" : {}
						},
						"Require-Bundle-Instance" : [
						]
					}
				}, {
					title : 'Map Sideview',
					fi : 'Oheiskartta',
					sv : '?',
					en : 'Map Sideview',
					bundlename : 'overview',
					bundleinstancename : 'overview',
					metadata : {
						"Import-Bundle" : {
							"overview" : {
								bundlePath: "../example-bundles/bundle/"
							}
						}
					}
				},{
					title : 'WMS Capabilities',
					fi : 'WMS Layers from Capabilities',
					sv : '?',
					en : 'WMS Layers from Capabilities',
					bundlename : 'wmscaps',
					bundleinstancename : 'wmscaps',
					metadata : {
						"Import-Bundle" : {
							"mapmodule-plugin" : {},
							"layerhandler": {},
							"wmscaps" : {
								bundlePath: "../example-bundles/bundle/"
							}
						},
						"Require-Bundle-Instance" : [
												]
				
					}
				},{
					title : 'Trains GeoRSS',
					fi : 'Trains GeoRSS',
					sv : '?',
					en : 'Trains GeoRSS',
					bundlename : 'trains',
					bundleinstancename : 'trains',
					metadata : {
						"Import-Bundle" : {
							"mapmodule-plugin" : {},
							"layerhandler": {},
							"trains" : {
								bundlePath: "../complexbundle/bundle/"
							}
						},
						"Require-Bundle-Instance" : [
												]
				
					}
				},{
					title : 'Google Projection Maps',
					fi : 'Google Projection Maps',
					sv : '?',
					en : 'Google Projection Maps',
					bundlename : 'thirdpartymaps',
					bundleinstancename : 'thirdpartymaps',
					metadata : {
						"Import-Bundle" : {
							"thirdpartymaps" : {
								bundlePath: "../example-bundles/bundle/"
							}
						}
					}
				},{
					title : 'WMTS Layer POC',
					fi : 'WMTS Layer POC',
					sv : '?',
					en : 'WMTS Layer POC',
					bundlename : 'wmts',
					bundleinstancename : 'wmts',
					metadata : {
						"Import-Bundle" : {
							"wmts" : {
								bundlePath: "../example-bundles/bundle/"
							}
						}
					}
				} ,{
					title : 'Grid Calc POC',
					fi : 'Grid Calc POC',
					sv : '?',
					en : 'Grid Calc POC',
					bundlename : 'gridcalc',
					bundleinstancename : 'gridcalc',
					metadata : {
						"Import-Bundle" : {
							"gridcalc" : {
								bundlePath: "../example-bundles/bundle/"
							}
						}
					}
				},{
					title : 'Minimal POC',
					fi : 'Minimal POC',
					sv : '?',
					en : 'Minimal POC',
					bundlename : 'minimal',
					bundleinstancename : 'minimal',
					metadata : {
						"Singleton": true,
						"Import-Bundle" : {
							"minimal" : {
								bundlePath: "../example-bundles/bundle/"
							}
						}
					}
				}  ]
			},

			getName : function() {
				return this.__name;
			},
			__name : "Oskari.mapframework.bundle.BundleManagerInstance"

		}, {
			"protocol" : [ "Oskari.bundle.BundleInstance",
					"Oskari.mapframework.module.Module",
					"Oskari.mapframework.bundle.extension.Extension",
					"Oskari.mapframework.bundle.extension.EventListener" ]
		});

