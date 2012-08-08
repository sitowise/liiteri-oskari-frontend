/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/*
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.common.MapControlsModule', function() {
    // this._isCurrentlyFullscreen = false;
    this._mapIsFullScreen = false;
    this._sandbox = null;
    this._previousHistoryAvailable = false;
    this._nextHistoryAvailable = false;
    this._controlStatuses = [];

}, {
    __name : "MapControlsModule",
    getName : function() {
        return this.__name;
    },
    /**
     *
     */
    init : function(sandbox) {
        sandbox.printDebug("[MapControlsModule] init");
        this._sandbox = sandbox;
        var me = this;
        for(var p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }

        this.toolButtonRequestHandler = Oskari.clazz.create('Oskari.mapframework.mapcontrols.request.ToolButtonRequestHandler', sandbox, me);

        this.actions = {};
        this._createInitialToolbarActions(sandbox);

        // TODO: maybe just add to actions?
        this.extraActions = {};
        this.extraButtons = {};

        var panel = Ext.create('Ext.panel.Panel', {
            id : 'map_controls_toolbar',
            x : 10,
            y : 10,
            style : '{ z-index: 99999; }', // IE needs this
            bodyStyle : {
                background : 'transparent',
                padding : '0px 10px 0px 0px'
            },
            // width : 512,
            border : false,
            padding : 5,
            layout : {
                type : 'hbox'/*,
                align : 'stretch' ,
                padding : 5*/
                //pack: 'start'
            },
            items : me._getMapToolbarItems(sandbox)
        });
        this._mainpanel = panel;

        return panel;
    },
    /**
     *
     */
    start : function(sandbox) {
        sandbox.printDebug("Starting " + this.getName());
        this._previousHistoryAvailable = false;
        this._nextHistoryAvailable = false;

        sandbox.addRequestHandler('MapControls.ToolButtonRequest', this.toolButtonRequestHandler);

    },
    stop : function() {
        this._sandbox.removeRequestHandler('MapControls.ToolButtonRequest', this.toolButtonRequestHandler);
    },
    _requestToolSelection : function(toolId) {
        var b = this._sandbox.getRequestBuilder('ToolSelectionRequest');
        var r = b(toolId);
        this._sandbox.request(this, r);
    },
    _refreshToolbarButtons : function() {
        this._mainpanel.removeAll(true);
        this._createInitialToolbarActions(this._sandbox);
        var newToolbarItems = this._getMapToolbarItems(this._sandbox);
        this._mainpanel.add(newToolbarItems);
    },
    removeToolButton : function(config) {
        if(!config || !config.group) {
            return;
        }
        var group = config.group;
        var tool = config.toolId;
        if(this.extraActions[group]) {
            if(!tool) {
                // loop extraActions[group] and set buttons to null
                for(var group in this.extraActions) {
                    if(this.extraActions[group]) {
                        for(var toolId in this.extraActions[group]) {
                            if(toolId === tool) {
                                this.extraButtons[tool] = null;
                            }
                        }
                    }
                }
                // tool not defined, remove whole group
                this.extraActions[group] = null;
            } else {
                // tool  defined, remove it from group
                this.extraActions[group][tool] = null;
                this.extraButtons[tool] = null;
            }
        }
        this._refreshToolbarButtons();
    },
    setButtonDisabled : function(config, isDisable) {
        if(!config || !config.toolId) {
            return;
        }
        // bad kitty uses getCmp, keep the reference to button instead
        //var btn = Ext.getCmp(config.toolId);
        var btn = this.extraButtons[config.toolId];

        if(btn) {
            btn.setDisabled(isDisable);
            // update handler on enable if new handler present in config
            if(!isDisable && config.callback) {
                btn.setHandler(config.callback);
            }
        } else {
            this._sandbox.printDebug('Couldnt find button for toolId: ' + config.toolId);
        }
    },
    addToolButton : function(config) {
        if(!config) {
            // no config -> do nothing
            return;
        }
        var me = this;
        if(!config.toolId) {
            // no tool id -> tool selection request activates nothing if it
            // hasn't callback
            if(!config.callback) {
                // don't add since the buttons does nothing even if it's pressed
                // no callback -> button does nothing
                return;
            }
            // button has callback so it has hope of working -> assign dummy
            // toolid
            // TODO: the module requesting add can't control the button if it
            // doesn't provide id
            // -> should we throw exception instead?
            config.toolId = 'tool_' + Ext.id();
        }
        // preset to match existing buttons
        if(!config.group) {
            config.group = 'extra';
        }
        config.scale = 'large';
        config.componentCls = 'opacity_80';
        config.id = config.toolId;

        if(!config.callback) {
            // if has no callback, assign to toggle group
            // TODO: should this rather be a switch in config
            config.toggleGroup = 'mapcontrolsgroup';

            config.handler = function() {
                me.actions.map_control_measure_menu.menu.hide();
                me._requestToolSelection('map_control_navigate_tool');
            };
        } else {
            config.handler = config.callback;
        }
        if(!this.extraActions[config.group]) {
            // create group if not existing
            this.extraActions[config.group] = {};
        }
        // create button to requested group with requested (or generated) id
        this.extraActions[config.group][config.toolId] = config;

        this._refreshToolbarButtons();
    },
    _createInitialToolbarActions : function(sandbox) {

        var me = this;
        var ga = 'Oskari.mapframework.ui.module.common.mapmodule.GeoAction';
        var mapmodule = this._sandbox.findRegisteredModuleInstance('MainMapModule')

        // actionHistoryPrev
        this.actions.map_control_tool_prev = Ext.create('Ext.button.Button', Ext.create(ga, {
            iconCls : 'map_control_tool_prev',
            tooltip : sandbox.getText('map_control_tool_prev_tooltip'),
            scale : 'large',
            control : mapmodule._navigationHistoryTool.previous,
            componentCls : 'opacity_80',
            handler : function() {
                me.actions.map_control_measure_menu.menu.hide();
                mapmodule.notifyMoveEnd();
            }
        }));

        // actionHistoryNext;
        this.actions.map_control_tool_next = Ext.create('Ext.button.Button', Ext.create(ga, {
            iconCls : 'map_control_tool_next',
            tooltip : sandbox.getText('map_control_tool_next_tooltip'),
            scale : 'large',
            control : mapmodule._navigationHistoryTool.next,
            componentCls : 'opacity_80',
            handler : function() {
                me.actions.map_control_measure_menu.menu.hide();
                mapmodule.notifyMoveEnd();
            }
        }));

        // actionSelect
        this.actions.map_control_select_tool = Ext.create('Ext.button.Button', Ext.create(ga, {
            iconCls : 'map_control_navigate_tool',
            tooltip : sandbox.getText('map_control_navigate_tool_tooltip'),
            enableToggle : true,
            allowDepress : false,
            scale : 'large',
            pressed : true,
            toggleGroup : 'mapcontrolsgroup',
            componentCls : 'opacity_80',
            handler : function() {
                me.actions.map_control_measure_menu.menu.hide();
                me._requestToolSelection('map_control_navigate_tool');
            }
        }));

        // actionZoom
        this.actions.map_control_zoom_tool = Ext.create('Ext.button.Button', Ext.create(ga, {
            iconCls : 'map_control_zoom_tool',
            tooltip : sandbox.getText('map_control_zoom_tool_tooltip'),
            enableToggle : true,
            allowDepress : false,
            toggleGroup : 'mapcontrolsgroup',
            scale : 'large',
            componentCls : 'opacity_80',
            handler : function() {
                me.actions.map_control_measure_menu.menu.hide();
                me._requestToolSelection('map_control_zoom_tool');
            }
        }));

        // actionMeasureTool
        this.actions.map_control_measure_tool = Ext.create('Ext.button.Button', Ext.create(ga, {
            tooltip : sandbox.getText('map_control_measure_tool_tooltip'),
            scale : 'large',
            allowDepress : false,
            iconCls : 'map_control_measure_tool',
            componentCls : 'opacity_80',
            handler : function() {
                me.actions.map_control_measure_menu.menu.hide();
                me.actions.map_control_measure_menu.toggle(true, true);
                me.actions.map_control_select_tool.toggle(false, true);
                me._requestToolSelection('map_control_measure_tool');
            }
        }));

        // actionMeasureToolArea
        this.actions.map_control_measure_area_tool = Ext.create('Ext.button.Button', Ext.create(ga, {
            iconCls : 'map_control_measure_area_tool',
            tooltip : sandbox.getText('map_control_measure_area_tool_tooltip'),
            scale : 'large',
            allowDepress : false,
            componentCls : 'opacity_80',
            handler : function() {
                me.actions.map_control_measure_menu.menu.hide();
                me.actions.map_control_measure_menu.toggle(true, true);
                me.actions.map_control_select_tool.toggle(false, true);
                me._requestToolSelection('map_control_measure_area_tool');
            }
        }));

        // actionMeasure
        this.actions.map_control_measure_menu = Ext.create('Ext.button.Button', {
            iconCls : 'map_control_measure_menu',
            tooltip : sandbox.getText('map_control_measure_menu_tooltip'),
            arrowAlign : 'right',
            allowDepress : false,
            cls : 'x-btn-icon',
            scale : 'large',
            enableToggle : false,
            toggleGroup : 'mapcontrolsgroup',
            componentCls : 'opacity_80',
            menu : {
                xtype : 'menu',
                defaults : {
                    xtype : 'button',
                    cls : 'x-btn-icon',
                    enableToggle : true,
                    iconAlign : 'left',
                    scale : 'large'
                },
                minWidth : 45, // menu width smaller that default
                plain : true,
                items : [me.actions.map_control_measure_tool, me.actions.map_control_measure_area_tool]
            },
            listeners : {
                click : function() {
                    if(this.pressed && !me.actions.map_control_measure_tool.pressed && !me.actions.map_control_measure_area_tool.pressed) {
                        me.actions.map_control_select_tool.toggle(true, false);
                        this.toggle(false, true);
                        me._requestToolSelection('map_control_navigate_tool');
                    }
                }
            }
        });

        // actionPrint
        this.actions.map_print_tool = Ext.create('Ext.Button', Ext.create(ga, {
            iconCls : 'map_control_map_print_tool',
            tooltip : sandbox.getText('map_control_print_tool_tooltip'),
            scale : 'large',
            componentCls : 'opacity_80',
            handler : function() {
                me.actions.map_control_measure_menu.menu.hide();
                me._sandbox.request(me, sandbox.getRequestBuilder(
                'GenerateHtmlPrintToMapRequest')());
            }
        }));

        // actionLink
        this.actions.map_link_tool = Ext.create('Ext.Button', Ext.create(ga, {
            iconCls : 'map_control_map_link_tool',
            tooltip : sandbox.getText('map_control_map_link_tool_tooltip'),
            scale : 'large',
            componentCls : 'opacity_80',
            handler : function() {
                me.actions.map_control_measure_menu.menu.hide();
                me._sandbox.request(me, sandbox.getRequestBuilder(
                'GenerateHtmlLinkToMapRequest')());

            }
        }));

        // actionFullScreen
        this.actions.map_control_full_screen_tool = Ext.create('Ext.Button', Ext.create(ga, {
            id : 'map_control_full_screen_tool',
            iconCls : 'map_control_full_screen_tool',
            tooltip : sandbox.getText('map_control_full_screen_tool_tooltip'),
            scale : 'large',
            componentCls : 'opacity_80',
            handler : function() {
                if(me._mapIsFullScreen) {
                    me.setApplicationViewToNormal();
                } else {
                    me.setApplicationViewToFullscreen();
                }
            }
        }));

    },
    _getMapToolbarItems : function(sandbox) {

        var me = this;
        var toolbarItems = [me.actions.map_control_tool_prev, me.actions.map_control_tool_next];
        this._fillWithToolbarSpacers(toolbarItems, 6);

        toolbarItems.push(me.actions.map_control_select_tool);
        this._fillWithToolbarSpacers(toolbarItems, 5);

        toolbarItems.push(me.actions.map_control_zoom_tool);
        toolbarItems.push(me.actions.map_control_measure_menu);
        this._fillWithToolbarSpacers(toolbarItems, 4);

        toolbarItems.push(me.actions.map_print_tool);
        toolbarItems.push(me.actions.map_link_tool);
        //this._fillWithToolbarSpacers(toolbarItems, 4);

        // add extraActions that have been requested with ToolButtonRequest
        for(var group in this.extraActions) {
            if(this.extraActions[group]) {
                this._fillWithToolbarSpacers(toolbarItems, 4);
                for(var tool in this.extraActions[group]) {
                    if(this.extraActions[group][tool]) {
                        var extraToolBtn = Ext.create('Ext.Button', Ext.create('Oskari.mapframework.ui.module.common.mapmodule.GeoAction', this.extraActions[group][tool]));
                        this.extraButtons[tool] = extraToolBtn;
                        toolbarItems.push(extraToolBtn);
                    }
                }
            }
        }

        // align fullscreen to right
        toolbarItems.push({
            xtype : 'tbfill'
        });
        toolbarItems.push(me.actions.map_control_full_screen_tool);

        return toolbarItems;
    },
    _fillWithToolbarSpacers : function(toolbarItems, amount) {

        for(var i = 0; i < amount; ++i) {
            toolbarItems.push({
                xtype : 'tbspacer'
            });
        }
    },
    toggleButtonState : function(id) {
        if(id == 'map_control_map_publisher_tool') {
            this._sandbox.request(this, this._sandbox
            .getRequestBuilder(
            'StartMapPublisherRequest')());
        } else if(id == 'map_control_start_net_service_centre_tool') {
            this._sandbox.request(this, this._sandbox.getRequestBuilder(
            'ShowNetServiceCentreRequest')());
        }
    },
    eventHandlers : {
        'AfterGenerateHtmlLinkToMapEvent' : function(event) {
            var html = event.getHtml();
            this._sandbox.showPopupText("maplinkservice_link_generated_messagebox_title", "maplinkservice_link_generated_messagebox_message", [html]);
        },
        'AfterGenerateHtmlPrintToMapEvent' : function(event) {
            var html = event.getHtml();
            this.openPrintWindow(html);
        },
        'AfterStartMapPublisherEvent' : function(event) {
            window.location.href = event.getUrl();
        },
        'AfterMapMoveEvent' : function(event) {
            var navitool = this._sandbox.findRegisteredModuleInstance('MainMapModule')._navigationHistoryTool;
            if(navitool.previousStack.length > 0) {
                this.actions['map_control_tool_prev'].enable();
            } else {
                this.actions['map_control_tool_prev'].disable();
            }
            if(navitool.nextStack.length > 0) {
                this.actions['map_control_tool_next'].enable();
            } else {
                this.actions['map_control_tool_next'].disable();
            }
        },
        'CoreReadyEvent' : function(event) {
            this._sandbox.findRegisteredModuleInstance('MainMapModule')._navigationHistoryTool.clear();
        },
        'ToolSelectedEvent' : function(event) {
            if(event.getNamespace() !== this.__name) {
                for(var actIdx in this.actions) {
                    this.actions[actIdx].setActive(false);
                }
                this.actions['map_control_select_tool'].setActive(true);
            }
        },
        'EscPressedEvent' : function(event) {
            this.setApplicationViewToNormal();
        }
    },

    onEvent : function(event) {
        var handler = this.eventHandlers[event.getName()];

        if(!handler)
            return;

        return handler.apply(this, [event]);
    },
    openPrintWindow : function(url) {
        if(this.problemWithPrintingSafariCase()) {
            this._sandbox.showPopupText("mapcontrolsservice_problem_with_safari_printing_title", "mapcontrolsservice_problem_with_safari_printing_message", null);
            return;
        }

        var title = "tulostus";
        /* Reserve 60 px for print button */
        var windowHeight = parseInt(Oskari.$().startup.printWindowHeight) + 60;
        var windowWidth = parseInt(Oskari.$().startup.printWindowWidth);

        var windowSize = this._sandbox.getBrowserWindowSize();

        var scrollBar = 'scrollbars=no, ';

        if(windowSize.height < windowHeight) {
            windowHeight = windowSize.height;
            scrollBar = 'scrollbars=yes, ';
        }

        window.open(url, title, 'width=' + windowWidth + ', height=' + windowHeight + ', menubar=yes' + ', resizable=no, ' + scrollBar + ' location=no,' + ' status=no' + ', menubar=no');
    },
    /**
     * This will return true if browser is Safari and one of
     * selected layers has opacity < 100. In this case these two
     * browsers fail to print correctly.
     *
     */
    problemWithPrintingSafariCase : function() {

        if(Ext.isSafari) {
            selectedLayers = this._sandbox.findAllSelectedMapLayers();
            for(var i = 0; i < selectedLayers.length; i++) {
                if(selectedLayers[i].getOpacity() < 100) {
                    return true;
                }
            }
        }

        return false;
    },
    setApplicationViewToFullscreen : function() {
        if(this._mapIsFullScreen)
            return;
        this._mapIsFullScreen = true;
        // TODO: This doesn't work in IE :_(
        // var button = Ext.get('map_control_full_screen_tool');
        // button.setStyle('background-image',
        // 'url("/map-application-framework/resource/images/keita_kasaan.png")');
        // button.setStyle('background-position', 'center');

        this.actions.map_control_full_screen_tool.setIconCls('map_control_full_screen_tool_fs');

        var fs = Ext.getCmp('full_screen_viewport');
        if(fs) {
            fs.destroy();
        }

        var mainApp = Ext.getCmp('main-app');
        if(mainApp) {
            mainApp.hide();
        }

        var mainAppWindow = Ext.getCmp('main-app-window');
        if(mainAppWindow) {
            mainAppWindow.hide();
        }

        var mainAppPanel = Ext.getCmp('main-app-panel');
        fs = Ext.create('Ext.container.Viewport', {
            id : 'full_screen_viewport',
            layout : 'fit',
            floating : true,
            focusOnToFront : true,
            items : mainAppPanel
        });

        // TODO: find a sane way to do this
        var els = ['menu', 'dockWrapper', 'topWrapper', 'footer'];
        for(var elIdx in els) {
            var el = document.getElementById(els[elIdx]);
            if(el && el.style)
                el.style.display = 'none';
        }

        if(mainAppPanel) {
            mainAppPanel.doLayout();
        }
        if(fs) {
            fs.doLayout();
            fs.toFront();
            fs.show();
        }
    },
    setApplicationViewToNormal : function() {
        if(!this._mapIsFullScreen)
            return;
        this._mapIsFullScreen = false;
        // TODO: This does not work in IE :_/
        // var button = Ext.get('map_control_full_screen_tool');
        // button.setStyle('background-image',
        // 'url("/map-application-framework/resource/images/laajenna.png")');
        // button.setStyle('background-position', 'center');

        this.actions.map_control_full_screen_tool.setIconCls('map_control_full_screen_tool');

        var mainApp = Ext.getCmp('main-app');
        var mainAppPanel = Ext.getCmp('main-app-panel');
        var mainAppWindow = Ext.getCmp('main-app-window');
        var fs = Ext.getCmp('full_screen_viewport');
        if(fs) {
            fs.toBack();
        }
        if(fs.style) {
            fs.style.display = 'none';
        }

        var els = ['menu', 'dockWrapper', 'topWrapper', 'footer'];
        for(var elIdx in els) {
            var el = document.getElementById(els[elIdx]);
            if(el && el.style)
                el.style.display = 'block';
        }

        // Ext.getCmp('main-left-panel').expand(false);
        // Ext.getCmp('main-right-panel').expand(false);
        if(mainApp && mainAppPanel && mainAppWindow) {
            mainApp.add(mainAppPanel);
            mainAppWindow.show();
            mainApp.show();
            if (mainAppWindow.dom) {
                mainAppWindow.doLayout();
            }
            if (mainApp.dom) {
                mainApp.doLayout();
            }

            document.body.style['overflow'] = 'auto';
            document.body.style['overflow-x'] = 'auto';
            document.body.style['overflow-y'] = 'auto';
        }
    }
}, {
    'protocol' : ['Oskari.mapframework.module.Module']
});

/* Inheritance */Oskari.clazz
        .define(
                'Oskari.mapframework.mapcontrols.request.ToolButtonRequest',
                function(config, type) {
                    this._creator = null;
                    
                    // check that we support the request type
                    for(var i=0; i < this.requestTypes.length; ++i) {
                    	if(type === this.requestTypes[i]) {
                    		this._type = type;
                    	}
                    }
	                if(!this._type) {
	                    throw "Unknown type '" + type + "'";
	                }
                    this._config = config;
                }, {
                    __name : "MapControls.ToolButtonRequest",
                    getName : function() {
                        return this.__name;
                    },
                    
                    requestTypes :  ['add', 'remove', 'disable', 'enable', 'toggle'],
                    
                    getConfig : function() {
                        return this._config;
                    },
                    
                    getType : function() {
                        return this._type;
                    }
                },
                {
                    'protocol' : ['Oskari.mapframework.request.Request']
                });

/* Inheritance */
Oskari.clazz.define(
        'Oskari.mapframework.mapcontrols.request.ToolButtonRequestHandler',
        
        function(sandbox, plugin) {
            
            this.sandbox = sandbox;
            this.plugin = plugin;
        },
        {
            handleRequest: function(core,request) {
            	var reqType = request.getType();
                this.sandbox.printDebug("[Oskari.mapframework.mapcontrols.request.ToolButtonRequestHandler] got requesttype " + reqType);
                
                if('add' === reqType) {
                	this.plugin.addToolButton(request.getConfig());
                }
                else if('remove' === reqType) {
                	this.plugin.removeToolButton(request.getConfig());
                }
                else if('enable' === reqType) {
                	this.plugin.setButtonDisabled(request.getConfig(), false);
                }
                else if('disable' === reqType) {
                	this.plugin.setButtonDisabled(request.getConfig(), true);
                }
                else if('toggle' === reqType) {
                	//this.plugin.toggleToolButton(request.getConfig());
                }
            }
        },{
            protocol: ['Oskari.mapframework.core.RequestHandler']
        });/**
 * Copyright (c) 2008-2010 The Open Source Geospatial Foundation
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

/**
 * Copyright (c) 2011 National Land Survey of Finland.
 */

/**
 * api: (define) 
 * module = Oskari 
 * class = GeoAction 
 * base_link = 
 *     `Ext.Action <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Action>`_
 */
Ext.namespace("Oskari");

/**
 * api: example Sample code to create a toolbar with an OpenLayers control into
 * it.
 * .. 
 * code-block:: javascript
 *    var action = new Oskari.GeoAction({ 
 *        text: "max extent", 
 *        control: new OpenLayers.Control.ZoomToMaxExtent(), 
 *        map: map 
 *    }); 
 *    var toolbar = new Ext.Toolbar([action]);
 */

/**
 * api: constructor 
 * .. 
 * class:: GeoAction(config)
 * 
 * Create a Oskari.GeoAction instance. A Oskari.GeoAction is created to insert
 * an OpenLayers control in a toolbar as a button or in a menu as a menu item.
 * A Oskari.GeoAction instance can be used like a regular Ext.Action, look 
 * at the Ext.Action API doc for more detail.
 */
Ext.define('Oskari.mapframework.ui.module.common.mapmodule.GeoAction', {
    extend : Ext.Action,
    control : null,

    /**
     * api: config[map] ``OpenLayers.Map`` 
     * The OpenLayers map that the control should be added to. 
     * For controls that don't need to be added to a map or have 
     * already been added to one, this config property may be omitted.
     */
    map : null,

    /**
     * private: property[uScope] ``Object`` 
     * The user-provided scope, used when calling uHandler, uToggleHandler, 
     * and uCheckHandler.
     */
    uScope : null,

    /**
     * private: property[uHandler] ``Function`` 
     * References the function the user passes through the 
     * "handler" property.
     */
    uHandler : null,

    /**
     * private: property[uToggleHandler] ``Function`` 
     * References the function the user passes through 
     * the "toggleHandler" property.
     */
    uToggleHandler : null,

    /**
     * private: property[uCheckHandler] ``Function`` 
     * References the function the user passes through the "checkHandler" 
     * property.
     */
    uCheckHandler : null,

    /* private */
    constructor : function(config) {
        // store the user scope and handlers
        this.uScope = config.scope;
        this.uHandler = config.handler;
        this.uToggleHandler = config.toggleHandler;
        this.uCheckHandler = config.checkHandler;

        this.activateHandler = config.activateHandler;
        this.deactivateHandler = config.deactivateHandler;

        config.scope = this;
        config.handler = this.pHandler;
        config.toggleHandler = this.pToggleHandler;
        config.checkHandler = this.pCheckHandler;

        // set control in the instance, the Ext.Action
        // constructor won't do it for us
        this.control = config.control;
        delete config.control;

        // register "activate" and "deactivate" listeners
        // on the control
        if (this.control) {
            // If map is provided in config, add control to map.
            if (config.map) {
                config.map.addControl(this.control);
                delete config.map;
            }
            if ((config.pressed || config.checked) && this.control.map) {
                this.control.activate();
            }
            this.control.events.on({
                activate : this.onCtrlActivate,
                deactivate : this.onCtrlDeactivate,
                scope : this
            });
        }

        this.callParent(arguments);
    },

    /**
     * private: method[pHandler] 
     * :param cmp: ``Ext.Component`` 
     *   The component that triggers the shandler.
     * 
     * The private handler.
     */
    pHandler : function(cmp) {
        if (this.control && this.control.type == OpenLayers.Control.TYPE_BUTTON) {
            this.control.trigger();
        }
        if (this.uHandler) {
            this.uHandler.apply(this.uScope, arguments);
        }
    },

    /**
     * private: method[pTogleHandler] 
     * :param cmp: ``Ext.Component`` 
     *   The component that triggers the toggle handler. 
     * :param state: ``Boolean`` 
     *   The state of the toggle.
     * 
     * The private toggle handler.
     */
    pToggleHandler : function(cmp, state) {
        this.changeControlState(state);
        if (this.uToggleHandler) {
            this.uToggleHandler.apply(this.uScope, arguments);
        }
    },

    /**
     * private: method[pCheckHandler] 
     * :param cmp: ``Ext.Component`` 
     *   The component that triggers the check handler. 
     * :param state: ``Boolean`` 
     *   The state of the toggle.
     * 
     * The private check handler.
     */
    pCheckHandler : function(cmp, state) {
        this.changeControlState(state);
        if (this.uCheckHandler) {
            this.uCheckHandler.apply(this.uScope, arguments);
        }
    },

    /**
     * private: method[changeControlState] 
     * :param state: ``Boolean`` 
     *   The state of the toggle.
     * 
     * Change the control state depending on the state boolean.
     */
    changeControlState : function(state) {
        if (state) {
            if (!this._activating) {
                this._activating = true;
                if (this.control)
                    this.control.activate();
                this._activating = false;
            }
        } else {
            if (!this._deactivating) {
                this._deactivating = true;
                if (this.control)
                    this.control.deactivate();
                this._deactivating = false;
            }
        }
    },

    /**
     * private: method[onCtrlActivate]
     * 
     * Called when this action's control is activated.
     */
    onCtrlActivate : function() {
        if (this.activateHandler) 
            this.activateHandler();
        if (this.control && this.control.type == OpenLayers.Control.TYPE_BUTTON) {
            this.enable();
        } else {
            // deal with buttons
            this.safeCallEach("toggle", [ true ]);
            // deal with check items
            this.safeCallEach("setChecked", [ true ]);
        }
    },

    /**
     * private: method[onCtrlDeactivate]
     * 
     * Called when this action's control is deactivated.
     */
    onCtrlDeactivate : function() {
        if (this.deActivateHandler) 
            this.deActivateHandler();
        if (this.control && this.control.type == OpenLayers.Control.TYPE_BUTTON) {
            this.disable();
        } else {
            // deal with buttons
            this.safeCallEach("toggle", [ false ]);
            // deal with check items
            this.safeCallEach("setChecked", [ false ]);
        }
    },

    /**
     * private: method[safeCallEach]
     * 
     */
    safeCallEach : function(fnName, args) {
        var cs = this.items;
        for ( var i = 0, len = cs.length; i < len; i++) {
            if (cs[i][fnName]) {
                cs[i].rendered ? cs[i][fnName].apply(cs[i], args) : cs[i].on({
                    "render" : cs[i][fnName].createDelegate(cs[i], args),
                    single : true
                });
            }
        }
    }
});
/**
 * @class Oskari.mapframework.bundle.DefaultMapControlsBundleInstance
 */
Oskari.clazz.define("Oskari.mapframework.bundle.DefaultMapControlsBundleInstance", function(b) {
	this.name = 'mapcontrols';
	this.mediator = null;
	this.sandbox = null;

	this.impl = null;

	this.ui = null;
},
/*
 * prototype
 */
{

	/**
	 * start bundle instance
	 *
	 */
	"start" : function() {

		if(this.mediator.getState() == "started")
			return;

		this.libs = {
			ext : Oskari.$("Ext")
		};

		this.facade = Oskari.$('UI.facade');
		this.impl = Oskari.clazz.create('Oskari.mapframework.ui.module.common.MapControlsModule');

		var def = this.facade.appendExtensionModule(this.impl, this.name, {}, this, 'Mapster', {
			'fi' : {
				title : ''
			},
			'sv' : {
				title : '?'
			},
			'en' : {
				title : ''
			}

		});

		def.cmp.addListener('close', function() {
			def.bundleInstance.stop();
			var manager = def.bundleInstance.mediator.manager;
			var instanceid = def.bundleInstance.mediator.instanceid;
			manager.destroyInstance(instanceid);
			def.bundleInstance = null;
		});

		this.def = def;

		this.impl.start(this.facade.getSandbox());

		this.mediator.setState("started");
		return this;
	},
	/**
	 * notifications from bundle manager
	 */
	"update" : function(manager, b, bi, info) {
		manager.alert("RECEIVED update notification @BUNDLE_INSTANCE: " + info);
	},
	/**
	 * stop bundle instance
	 */
	"stop" : function() {

		this.impl.stop();

		this.facade.removeExtensionModule(this.impl, this.name, this.impl.eventHandlers, this, this.def);
		this.def = null;

		this.mediator.setState("stopped");

		return this;
	},
	getName : function() {
		return this.__name;
	},
	__name : "Oskari.mapframework.bundle.DefaultMapControlsBundleInstance"

}, {
	"protocol" : ["Oskari.bundle.BundleInstance", "Oskari.mapframework.bundle.extension.Extension"]
});
