/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.BackgroundDrawPlugin
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.BackgroundDrawPlugin', function (config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.registerLookup = {};

    if (config && config.graphicFill) {
        this.graphicFill = config.graphicFill;
    }
    this.multipart = (config && config.multipart === true);
}, {
    __name: 'BackgroundDrawPlugin',

    getName: function () {
        return this.__name;
    },
    getMapModule: function () {
        return this.mapModule;
    },
    setMapModule: function (mapModule) {
        this.mapModule = mapModule;

        if (mapModule) {
            this._map = mapModule.getMap();
            this.pluginName = mapModule.getName() + this.__name;
        } else {
            this._map = null;
            this.pluginName = null;
        }
    },
    registerForDrawing: function(name) {
        //console.log("Registering for drawing " + name);

        if (this.registerLookup[name])
            throw "Name " + name + " is already registered";

        var config = { 'id' : name, 'multipart' : true};
        var obj = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.plugin.InnerDrawPlugin', config);
        obj.setMapModule(this.mapModule);
        obj.startPlugin(this._sandbox);
        obj.init(this._sandbox);

        this.registerLookup[name] = obj;
    },
    unregisterForDrawing: function (name) {
        //console.log("Unregistering for drawing " + name);
        if (!this.registerLookup[name])
            throw "Name " + name + " is not registered";

        var obj = this.registerLookup[name];
        obj.stopPlugin(this._sandbox);
        obj.setMapModule(null);

        this.registerLookup[name] = null;
    },
    _getRegistered: function (name) {
        if (!this.registerLookup[name])
            throw "Name " + name + " is not registered";

        return this.registerLookup[name];
    },
    startDrawing: function (name, params) {
        var plugin = this._getRegistered(name);
        plugin.startDrawing(params);
    },
    stopDrawing : function(name) {
        var plugin = this._getRegistered(name);
        plugin.stopDrawing();
    },
    forceFinishDraw : function(name) {
        var plugin = this._getRegistered(name);
        plugin.forceFinishDraw();
    },
    getDrawing : function(name) {
        var plugin = this._getRegistered(name);
        return plugin.getDrawing();
    },
    getDrawingAsWKT : function(name) {
        var plugin = this._getRegistered(name);
        return plugin.getDrawingAsWKT();
    },
    init: function (sandbox) {
        var me = this;
        this.requestHandlers = {
            startDrawingHandler: Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.plugin.BackgroundDrawPlugin.request.StartDrawingRequestPluginHandler', sandbox, me),
            stopDrawingHandler: Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.plugin.BackgroundDrawPlugin.request.StopDrawingRequestPluginHandler', sandbox, me),
            getGeometryHandler: Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.plugin.BackgroundDrawPlugin.request.GetGeometryRequestPluginHandler', sandbox, me),
            registerForDrawingHandler: Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.plugin.BackgroundDrawPlugin.request.RegisterForDrawingRequestHandler', sandbox, me)
        };
    },
    register: function () {
    },
    unregister: function () { },
    startPlugin: function (sandbox) {
        this._sandbox = sandbox;

        sandbox.register(this);
        sandbox.addRequestHandler('BackgroundDrawPlugin.RegisterForDrawingRequest', this.requestHandlers.registerForDrawingHandler);
        sandbox.addRequestHandler('BackgroundDrawPlugin.StartDrawingRequest', this.requestHandlers.startDrawingHandler);
        sandbox.addRequestHandler('BackgroundDrawPlugin.StopDrawingRequest', this.requestHandlers.stopDrawingHandler);
        sandbox.addRequestHandler('BackgroundDrawPlugin.GetGeometryRequest', this.requestHandlers.getGeometryHandler);

    },
    stopPlugin: function (sandbox) {
        sandbox.removeRequestHandler('BackgroundDrawPlugin.RegisterForDrawingRequest', this.requestHandlers.registerForDrawingHandler);
        sandbox.removeRequestHandler('BackgroundDrawPlugin.StartDrawingRequest', this.requestHandlers.startDrawingHandler);
        sandbox.removeRequestHandler('BackgroundDrawPlugin.StopDrawingRequest', this.requestHandlers.stopDrawingHandler);
        sandbox.removeRequestHandler('BackgroundDrawPlugin.GetGeometryRequest', this.requestHandlers.getGeometryHandler);
        sandbox.unregister(this);

        this._sandbox = null;
    },
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
    /* @method start
     * called from sandbox
     */
    start: function (sandbox) { },
    /**
     * @method stop
     * called from sandbox
     *
     */
    stop: function (sandbox) { }
}, {
    'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});