/**
 * @class Oskari.mapframework.ui.manager.akp.Facade
 * 
 * Facade to support extension module lifecycle operations.
 * 
 * Extension bundles and modules can be registered on application startup or
 * later dynamically.
 * 
 * !UNFINISHED!
 * 
 * Parts Map is like this
 * {
											'Portlet' : {
												'W' : westPortalPanel,
												'E' : eastPortalPanel
											},
											'Drawer' : {
												'W' : westPanel,
												'E' : eastPanel
											},
											'S' : southPanel,
											'NW' : northWestPanel,
											'Center' : centerPanel,
											'Viewport' : viewport,
											'ViewportCenter' : viewportCenterPanel,
											'StatusRegion' : statusDocked
										}
  
 */
/*
 * @class Oskari.mapframework.ui.manager.akp.MapPortalUiManager
 * 
 * Portal kind of User Interface Manager for modules and bundles.
 * 
 * 
 */
Oskari.clazz
		.define(
				'Oskari.mapframework.ui.manager.akp.MapPortalUiManager',

				/**
				 * @constructor
				 * 
				 * Creates an UI Manager manager for Portlet oriented UI
				 * 
				 */
				function(conf) {

					/** Sandbox */
					this._sandbox;

					/** configuration for this ui manager * */
					this._conf = conf;

					/** Top level ext component that represents overlay popup */
					/** Map controls dom */
					/** ui modules * */
					this._uimodules = [];
					this._uimodulesByName = {};

				},
				{
					/**
					 * @method createModulesAndUi
					 * 
					 * Map framework callback
					 * 
					 * Creates actual modules and ui
					 * 
					 * @param {Object}
					 *            sandbox
					 */
					createModulesAndUi : function(sandbox) {
						sandbox.printDebug("Creating UI for Map full...");
						this._sandbox = sandbox;

						var conf = this._conf;

						/* setup core ui modules */
						/* extension modules */
						this.setupExtensionModules(sandbox);
						/*
						 * Modules created, next build up EXTjs Frame and fit
						 * modules to that. Yes, it is that simple.
						 */
						sandbox
								.printDebug("All modules created, next build up EXTJs frame...");
						this.createUi(sandbox);
						sandbox
								.printDebug("Map full UI construction completed.");
					},

					/**
					 * @method setupExtensionModules
					 * @private
					 * 
					 * Let's register module to sandbox (internal)
					 */
					setupExtensionModules : function(sandbox) {
						sandbox.printDebug("setupExtensionModules...");

						for ( var n = 0; n < this._uimodules.length; n++) {
							var def = this._uimodules[n];
							if (!def.module)
								continue;
							sandbox.printDebug("#*+---- registering ----+*#"
									+ def.identifier);

							def.component = sandbox.register(def.module);

						}
					},

					/**
					 * @method addExtensionModule
					 * 
					 * @param regionDef
					 *            Region options Center, W, S, E, NW, Mapster,
					 *            ...
					 * 
					 * interface to add extension module to ui
					 */
					addExtensionModule : function(module, identifier,
							regionDef, loc, comp) {
						var def = {
							module : module,
							identifier : identifier,
							region : regionDef,
							loc : loc,
							component : comp
						};
						this._uimodules.push(def);
						this._uimodulesByName[identifier] = def;

						return def;
					},

					/**
					 * @method getExtensionModule Returns extension ui module by
					 *         name
					 */
					getExtensionModule : function(identifier) {
						return this._uimodulesByName[identifier].module;
					},

					/**
					 * @method getExtensionModuleDefinition
					 */
					getExtensionModuleDefinition : function(identifier) {
						return this._uimodulesByName[identifier];
					},

					/*
					 * @method getExtensionModuleComponentsByRegion * Returns
					 * extension ui components by region def { 'NW' : true, 'N':
					 * true ... }
					 */
					getExtensionModuleComponentsByRegion : function(
							regionSelector) {
						var sandbox = this._sandbox;
						var results = [];
						var dbgStr = "";
						for (p in regionSelector) {
							dbgStr += p + "=" + regionSelector[p] + " ";
						}
						sandbox
								.printDebug("getExtensionModulesByRegion called with "
										+ dbgStr);
						for ( var n = 0; n < this._uimodules.length; n++) {
							var def = this._uimodules[n];
							if (!def.component)
								continue;
							if (regionSelector[def.region]) {
								results.push(def.component);
								sandbox.printDebug("- module " + def.identifier
										+ " matched");
							}
						}

						return results;
					},

					/**
					 * @method getExtensionModuleDefinitionsByRegion
					 * 
					 * Returns extension ui modules by region def { 'NW' : true,
					 * 'N': true ... }
					 */
					getExtensionModuleDefinitionsByRegion : function(
							regionSelector) {
						var results = [];
						for ( var n = 0; n < this._uimodules.length; n++) {
							var def = this._uimodules[n];
							if (regionSelector[def.region])
								results.push(def);
						}

						return results;
					},

					/**
					 * @method createUi
					 * 
					 * MapFramework callback
					 * 
					 * Constructs EXTJs Frame and inserts modules into that.
					 */
					createUi : function(sandbox) {

						var lang = sandbox.getLanguage();

						var mapConfigurations = Oskari.$().startup.mapConfigurations;

						var gridModuleHeight = 300;

						/** UI SOUTH * */

						var southItems = this
								.getExtensionModuleComponentsByRegion( {
									'S' : true
								});

						var southPanel = Ext.create('Ext.Panel', {
							region : 'south',
							split : true,
							layout : 'fit',
							region : 'south',
							collapsed : true,
							collapsible : true,
							animCollapse : false,
							titleCollapse : false,
							collapseMode : 'mini',
							id : 'main-app-bottom',
							height : gridModuleHeight,
							boxMinHeight : gridModuleHeight,
							width : mapConfigurations.width,
							animCollapse : false,
							titleCollapse : false,
							frame : true,
							header : false,
							items : southItems

						});

						/**
						 * UI NORTH
						 */
						/*
						 * var northItems =
						 * this.getExtensionModuleDefinitionsByRegion( { 'N' :
						 * true });
						 * 
						 * var northPortletItems =[]; for( var n = 0 ; n<
						 * northItems.length;n++) { var def = northItems[n];
						 * northPortletItems.push({ title: def.loc?
						 * def.loc[lang].title : '?', height: 64, collapsible:
						 * false, items: def.component }); }
						 * 
						 * var northPortlets = [{ xtype: 'portalpanel', items: [{
						 * id: 'col-2', items: northPortletItems }] }];
						 * 
						 * var northPanel = Ext.create('Ext.Panel', { region :
						 * 'north', height: 96, //collapsible : true,
						 * //collapsed: false, //split : true, layout : 'fit',
						 * items : northPortlets //collapseMode : 'mini' });
						 */

						/**
						 * UI EAST
						 */
						var eastItems = this
								.getExtensionModuleDefinitionsByRegion( {
									'E' : true
								});

						var eastPortletItems = [];
						for ( var n = 0; n < eastItems.length; n++) {
							var def = eastItems[n];
							eastPortletItems.push( {
								title : def.loc ? def.loc[lang].title : '?',
								height : 256,
								items : def.component
							});
						}

						var eastPortalPanel = Ext.create('Ext.app.PortalPanel',
								{
									xtype : 'portalpanel',
									items : [ {
										id : 'col-2',
										items : eastPortletItems
									} ]
								});

						var eastPortlets = [ eastPortalPanel ];

						var eastPanel = Ext.create('Ext.Panel', {
							region : 'east',
							width : 312,
							collapsible : true,
							collapsed : true,
							split : true,
							layout : 'fit',
							items : eastPortlets,
							collapseMode : 'mini',
							animCollapse : false

						});

						/**
						 * UI WEST
						 */
						var westPanelItems = [];

						var nwItems = this
								.getExtensionModuleDefinitionsByRegion( {
									'NW' : true
								});

						var northWestPanel = Ext.create('Ext.Panel', {
							height : 256,
							layout : 'fit',
							items : nwItems
						});

						westPanelItems.push(northWestPanel);

						var westItems = this
								.getExtensionModuleDefinitionsByRegion( {
									'W' : true
								});

						var westPortletItems = [];

						for ( var n = 0; n < westItems.length; n++) {
							var def = westItems[n];

							if (!def.component)
								continue;

							westPortletItems.push( {
								title : def.loc ? def.loc[lang].title : '?',
								height : 512,
								items : def.component
							});
						}

						var westPortalPanel = Ext.create('Ext.app.PortalPanel',
								{
									flex : 1,
									xtype : 'portalpanel',
									items : [ {
										id : 'col-1',
										items : westPortletItems
									} ]
								});

						westPanelItems.push(westPortalPanel);

						var westPanel = Ext.create('Ext.panel.Panel', {
							region : 'west',
							split : true,
							layout : {
								type : 'vbox',
								align : 'stretch',
								pack : 'start'
							},
							items : westPanelItems,
							id : 'main-left-panel',
							collapseMode : 'mini',
							collapsed : true,
							border : false,
							frame : false,
							region : 'west',
							width : 220,
							collapsible : true,
							animCollapse : false,
							split : true,
							animCollapse : false,
							titleCollapse : false,
							autoHeight : false,
							boxMaxWidth : 600,
							boxMinWidth : 220
						});

						/**
						 * UI MAIN (center)
						 */

						var centerItems = this
								.getExtensionModuleComponentsByRegion( {
									'Center' : true
								});

						var centerPanel = Ext.create('Ext.Panel', {
							region : 'center',
							split : true,
							items : centerItems,
							id : 'main-center',
							border : false,
							region : 'center',
							layout : 'fit',
							frame : false,
							header : false,
							collapsible : false,
							animCollapse : false,
							titleCollapse : false
						});

						/**
						 * Create viewport, where border layout is used
						 */

						var mainItems = [];
						if (westPanel)
							mainItems.push(westPanel);

						mainItems.push(centerPanel);

						if (eastPanel)
							mainItems.push(eastPanel);

						var bottomTools = [];

						bottomTools.push('-');
						/*
						 * { // xtype: 'button', // default for Toolbars text:
						 * 'Button' });
						 */

						/**
						 * placeholder for status tools
						 */
						var statusDocked = Ext.create('Ext.toolbar.Toolbar', {
							dock : 'bottom',
							items : bottomTools
						});

						;

						/**
						 * 
						 */
						var viewportCenterPanel = Ext.create('Ext.Panel', {
							layout : 'border',
							region : 'center',
							items : mainItems,
							bbar : statusDocked
						});

						/*
						 * Container for all UI items
						 */
						var viewport = Ext.create('Ext.Panel', {
							layout : 'border',
							id : 'main-app',
							width : mapConfigurations.width,
							height : mapConfigurations.height
									+ gridModuleHeight,
							split : true,
							items : [ viewportCenterPanel, southPanel ],

							tbar : [ {
								html: '<img src="logo.png" />'
							} ]

						});

						/**
						 * Show UI in full Browser Window
						 */
						Ext.create('Ext.container.Viewport', {
							style : {
								padding : '8px',
								overflow : 'hidden'
							},
							layout : 'fit',
							items : [ viewport ]
						});

						/**
						 * Publish UI parts as Facade
						 */
						this._facade = Oskari.clazz
								.create(
										'Oskari.mapframework.ui.manager.akp.Facade',
										sandbox,
										this,
										{
											'Portlet' : {
												'W' : westPortalPanel,
												'E' : eastPortalPanel
											},
											'Drawer' : {
												'W' : westPanel,
												'E' : eastPanel
											},
											'S' : southPanel,
											'NW' : northWestPanel,
											'Center' : centerPanel,
											'Viewport' : viewport,
											'ViewportCenter' : viewportCenterPanel,
											'StatusRegion' : statusDocked
										/*
										 * , 'ToolbarRegion': toolbarDocked
										 */
										});

						/**
						 * TEMP hack
						 */
						Oskari.$("UI.facade", this._facade);

						this._uiReady = true;

					},

					/**
					 * @method getFacade
					 */
					getFacade : function() {
						return this._facade;
					}

					

				});
