/**
 * @class Oskari.mapframework.ui.module.common.mapmodule.Plugin
 *
 * Interface/protocol definition for map plugins
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.LayersLoadingPlugin',
/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._control = null;
}, {
    __name: 'LayersLoadingPlugin',
    /**
     * @method getName
     * Interface method for all plugins, should return plugin name
     * @return {String} plugin name
     * @throws always override this
     */
    getName : function() {
        return this.pluginName;
    },

    /**
     * @method setMapModule
     * Sets reference to reference to map module
     * @param {Oskari.mapframework.ui.module.common.MapModule} mapModule
     */
    setMapModule: function (mapModule) {
        this.mapModule = mapModule;
        this.pluginName = mapModule.getName() + this.__name;
    },
    getMapModule: function () {
        return this.mapModule;
    },
    /**
     * @method register
     * Interface method for the module protocol
     */
    register : function() {
    },
    /**
     * @method unregister
     * Interface method for the module protocol
     */
    unregister : function() {
    },

    /**
     * @method startPlugin
     *
     * Interface method for the plugin protocol. Should registers requesthandlers and
     * eventlisteners.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    startPlugin: function (sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();
        sandbox.register(this);
        var p;
        for (p in this.eventHandlers) {
            if (this.eventHandlers.hasOwnProperty(p)) {
                sandbox.registerForEventByName(this, p);
            }
        }
        this._control = new OpenLayers.Control.OLLayerEventsControl({ subscribers: [this]});
        this._map.addControl(this._control);
    },
    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol. Should unregisters requesthandlers and
     * eventlisteners.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stopPlugin : function(sandbox) {
        var p;
        for (p in this.eventHandlers) {
            if (this.eventHandlers.hasOwnProperty(p)) {
                sandbox.unregisterFromEventByName(this, p);
            }
        }
        this._control.deactivate();
        this._map.removeControl(me._control);
        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
    },

    init: function (sandbox) {
    },
    loadingLayerEvent: function (operation) {
        //console.log('Before:LayersLoadingEvent ' + operation);

        var event = this._sandbox.getEventBuilder('LayersLoadingEvent')(operation);
        this._sandbox.notifyAll(event);
    },
    /**
     * @property {Object} eventHandlers
     * Best practices: defining which
     * events bundle is listening and how bundle reacts to them
     * @static
     */
    eventHandlers : {},

    /**
     * @public @method hasUI
     * Override if need be.
     *
     *
     * @return {Boolean} false
     */
    hasUI: function () {
        return false;
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    }
});
