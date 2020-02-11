/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.MapIconsPlugin
 * Provides map icons menu functionality
 * How to use it: 
 * me - object implementing Oskari.userinterface.Extension
 * 1) Icon will toogle extension
 *             var mapIconDesc = {
 *              'text': 'layerselector2',
 *              'iconCss': 'glyphicon glyphicon-map-marker',
 *				'tooltip': 'Layer selector',
 *              'actionType': 'toogle'
 *             }
 *            var request = sandbox.getRequestBuilder('MapIconsPlugin.AddMapIconRequest')(me, mapIconDesc, me);
 *            sandbox.request(me, request);
 * 2) Icon will execute custom action
 *             var mapIconDesc = {
 *              'text': 'layerselector2',
 *              'iconCss': 'glyphicon glyphicon-map-marker',
 *				'tooltip': 'Layer selector',
 *              'actionType': 'custom',
 *              'actionHandler' : function() { alert('custom action'); }
 *             }
 *            var request = sandbox.getRequestBuilder('MapIconsPlugin.AddMapIconRequest')(me, mapIconDesc);
 *            sandbox.request(me, request);
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.MapIconsPlugin',
    /**
     * @method create called automatically on construction
     * @static
     */

    function (conf) {
        var me = this;
        me.conf = conf;
        me.requestHandlers = {};
        me.element = null;
        me.mapModule = null;
        me.pluginName = null;
        me._sandbox = null;
        me._map = null;
        me._scalebar = null;
        me._registeredExtensions = {};
        me._state = {
            'icons' : {}
        };
    }, {

        templates: {
            main: jQuery('<div id="mapiconsplugin" class="mapplugin mapiconsplugin" data-clazz="Oskari.mapframework.bundle.mapmodule.plugin.MapIconsPlugin"><ul></ul></div>')
        },

        /** @static @property __name plugin name */
        __name: 'MapIconsPlugin',

        getClazz: function () {
            return "Oskari.mapframework.bundle.mapmodule.plugin.MapIconsPlugin";
        },

        /**
         * @method getName
         * @return {String} plugin name
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            if (mapModule) {
                this.pluginName = mapModule.getName() + this.__name;
            }
        },
        /**
         * @method hasUI
         * This plugin has an UI so always returns true
         * @return {Boolean} true
         */
        hasUI: function () {
            return true;
        },
        /**
         * @method init
         * Interface method for the module protocol.
         * Initializes the OpenLayers.Control.ScaleLine
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) { },
        /**
         * @method register
         * Interface method for the module protocol
         */
        register: function () { },
        /**
         * @method unregister
         * Interface method for the module protocol
         */
        unregister: function () { },

        /**
         * Sets the location of the scalebar.
         *
         * @method setLocation
         * @param {String} location The new location
         */
        setLocation: function (location) {
            var me = this;
            if (!me.conf) {
                me.conf = {};
            }
            me.conf.location.classes = location;

            // reset plugin if active
            if (me.element) {
                //me.stopPlugin();
                //me.startPlugin();
                me.getMapModule().setMapControlPlugin(me.element, location, 2);
            }
        },

        /**
         * @method startPlugin
         * Interface method for the plugin protocol.
         * Adds the scalebar to the map controls.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            //console.log("Starting MapIconsPlugin");
            var p;
            this._sandbox = sandbox || this.getMapModule().getSandbox();
            this._sandbox.register(this);            
            
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    //console.log("Register for event " + p);
                    this._sandbox.registerForEventByName(this, p);
                }
            }

            this.requestHandlers.add = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.plugin.request.AddMapIconRequestHandler', this);
            this._sandbox.addRequestHandler('MapIconsPlugin.AddMapIconRequest', this.requestHandlers.add);

            //this._sandbox.addRequestHandler('MapIconsPlugin.AddMapIconRequest', this.addMapIconRequestHandler);

            this._draw();
            //console.log("Started MapIconsPlugin");
        },
        /**
         * @method stopPlugin
         * Interface method for the plugin protocol.
         * Removes the scalebar from map controls.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {
            var me = this,
                p;
            if (me.element) {
                me.element.remove();
                delete me.element;
            }

            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me._sandbox.unregisterFromEventByName(me, p);
                }
            }

            me._sandbox.unregister(me);
            me._sandbox = null;
        },
        _draw : function() {
            var me = this;
            if (!me.element) {
                me.element = me.templates.main.clone();
            }

            var containerClasses = 'top right',
                position = 2;

            me.getMapModule().setMapControlPlugin(me.element, containerClasses, position);

            $.each(me._state.icons, function(name, conf) {
                me.addMapIcon(conf.extension, conf.description, conf.state);
            });
        },
        showIcons: function () {
            var me = this;
            me.element.find('ul').css('visibility', '');
        },
        hideIcons: function() {
            var me = this;
            var container = me.element.find('ul');
            container.find('span.glyphicon.mapicon.user-mapicon').trigger("click");
            container.css('visibility', 'hidden');
        },
        addMapIcon: function (extension, description, isSelected) {
            var me = this;
            if (!me.element)
                return;
            var container = me.element.find('ul');
            if (!container)
                return;

            var isNew = true;
            var itemElement = null;
            if (me._registeredExtensions[extension.getName()]) {
                itemElement = me._registeredExtensions[extension.getName()];
                itemElement.empty();
                isNew = false;
            } else {
                itemElement = jQuery('<li></li>');
            }            

            if (description.iconCss) {
                itemElement.append(jQuery('<span class="' + description.iconCss + (description.disabled ? " disabled" : "") + '" ' + (description.tooltip ? 'title="' + description.tooltip + '" ' : '') + '></span>'));
            } else {
                itemElement.text(description.text);
            }
            
            if (description.actionType == "toogle") {
                if (!description.disabled) {
                    itemElement.click(function (e) {
                        me._sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [extension, 'toggle']);
                    });
                }                
                me._registeredExtensions[extension.getName()] = itemElement;
            } else if (description.actionType == "custom") {
                if (description.actionHandler) {
                    itemElement.click(function (e) {
                        var el = $(e.target);
                        el = el.parent();
                        if (el.hasClass('selected')) {
                            el.removeClass('selected');
                            me._state.icons[extension.getName()].state = false;
                        } else {
                            el.addClass('selected');
                            me._state.icons[extension.getName()].state = true;
                        }
                        description.actionHandler();
                    });
                }
                if (isSelected) {
                    itemElement.addClass('selected');
                }
            }

            if (isNew)
                container.append(itemElement);

            me._state.icons[extension.getName()] = {
                'extension': extension,
                'description': description,
                'state' : isSelected
            };
        },
        /**
         * @method start
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        start: function (sandbox) { },
        /**
         * @method stop
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stop: function (sandbox) { },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            'userinterface.ExtensionUpdatedEvent': function (event) {
                var me = this;
                var name = event.getExtension().getName();

                if (me._registeredExtensions[name]) {
                    var isShown = event.getViewState() !== "close";
                    var item = me._registeredExtensions[name];
                    if (isShown) {
                        item.addClass('selected');
                    } else {
                        item.removeClass('selected');
                    }
                }               
            },
        },
        addMapIconRequestHandler: function (ctx, request) {
            //debugger;
        },
        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });