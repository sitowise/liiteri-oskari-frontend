/**
 * @class Oskari.mapframework.mapmodule.WmsLayerPlugin
 * Provides functionality to draw WMS layers on the map
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.WmsLayerPlugin',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.mapModule = null;
        this.pluginName = null;
        this._sandbox = null;
        this._map = null;
        this._supportedFormats = {};
    }, {
        /** @static @property __name plugin name */
        __name: 'WmsLayerPlugin',

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
            this.pluginName = mapModule.getName() + this.__name;
        },
        /**
         * @method hasUI
         * This plugin doesn't have an UI that we would want to ever hide so always returns false
         * @return {Boolean}
         */
        hasUI: function () {
            return false;
        },
        /**
         * @method register
         * Interface method for the plugin protocol.
         * Registers self as a layerPlugin to mapmodule with mapmodule.setLayerPlugin()
         */
        register: function () {
            this.getMapModule().setLayerPlugin('wmslayer', this);
        },
        /**
         * @method unregister
         * Interface method for the plugin protocol
         * Unregisters self from mapmodules layerPlugins
         */
        unregister: function () {
            this.getMapModule().setLayerPlugin('wmslayer', null);
        },
        /**
         * @method init
         * Interface method for the module protocol.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {},
        /**
         * @method startPlugin
         * Interface method for the plugin protocol.
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
        },
        /**
         * @method stopPlugin
         * Interface method for the plugin protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {
            var p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            sandbox.unregister(this);

            this._map = null;
            this._sandbox = null;
        },
        /**
         * @method start
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        start: function (sandbox) {},
        /**
         * @method stop
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stop: function (sandbox) {},
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            'MapLayerEvent': function(event) {
                var op = event.getOperation(),
                    layer = this._sandbox.findMapLayerFromSelectedMapLayers(event.getLayerId());

                if (op === 'update' && layer && layer.isLayerOfType('WMS'))
                    this._updateLayer(layer);
            },
            'AfterMapLayerRemoveEvent': function (event) {
                this._afterMapLayerRemoveEvent(event);
            },
            'AfterChangeMapLayerOpacityEvent': function (event) {
                this._afterChangeMapLayerOpacityEvent(event);
            },
            'AfterChangeMapLayerStyleEvent': function (event) {
                this._afterChangeMapLayerStyleEvent(event);
            }
        },

        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        },
        /**
         * @method preselectLayers
         * Adds given layers to map if of type WMS
         * @param {Oskari.mapframework.domain.WmsLayer[]} layers
         */
        preselectLayers: function (layers) {

            var sandbox = this._sandbox,
                i,
                layer,
                layerId;
            for (i = 0; i < layers.length; i++) {
                layer = layers[i];
                layerId = layer.getId();


                if (layer.isLayerOfType('WMS')) {
                    sandbox.printDebug("preselecting " + layerId);
                    this.addMapLayerToMap(layer, true, layer.isBaseLayer());
                }
            }

        },
        /**
         * Adds a single WMS layer to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            if (!layer.isLayerOfType('WMS')) {
                return;
            }

            var layers = [],
                layerIdPrefix = 'layer_',
                i,
                ilen;
            // insert layer or sublayers into array to handle them identically
            if ((layer.isGroupLayer() || layer.isBaseLayer() || isBaseMap == true) && (layer.getSubLayers().length > 0)) {
                // replace layers with sublayers
                layers = layer.getSubLayers();
                layerIdPrefix = 'basemap_';
            } else {
                // add layer into layers
                layers.push(layer);
            }

            // loop all layers and add these on the map
            for (i = 0, ilen = layers.length; i < ilen; i++) {
                var _layer = layers[i];

                // default params and options
                var defaultParams = {
                        layers: _layer.getWmsName(),
                        transparent: true,
                        id: _layer.getId(),
                        styles: _layer.getCurrentStyle().getName(),
                        format: "image/png"
                    },
                    defaultOptions = {
                        layerId: _layer.getWmsName(),
                        isBaseLayer: false,
                        displayInLayerSwitcher: false,
                        visibility: true,
                        buffer: 0
                    },
                    layerParams = _layer.getParams(),
                    layerOptions = _layer.getOptions();
                if (_layer.getMaxScale() || _layer.getMinScale()) {
                    // use resolutions instead of scales to minimize chance of transformation errors
                    var layerResolutions = this.getMapModule().calculateLayerResolutions(_layer.getMaxScale(), _layer.getMinScale());
                    defaultOptions.resolutions = layerResolutions;
                }
                // override default params and options from layer
                var key;
                for (key in layerParams) {
                    if (layerParams.hasOwnProperty(key)) {
                        defaultParams[key] = layerParams[key];
                    }
                }
                for (key in layerOptions) {
                    if (layerOptions.hasOwnProperty(key)) {
                        defaultOptions[key] = layerOptions[key];
                    }
                }

                var openLayer = new OpenLayers.Layer.WMS(layerIdPrefix + _layer.getId(), _layer.getWmsUrls(), defaultParams, defaultOptions);
                openLayer.opacity = _layer.getOpacity() / 100;

                this._map.addLayer(openLayer);
                this._sandbox.printDebug("#!#! CREATED OPENLAYER.LAYER.WMS for " + _layer.getId());

                if (keepLayerOnTop) {
                    this._map.setLayerIndex(openLayer, this._map.layers.length);
                } else {
                    this._map.setLayerIndex(openLayer, 0);
                }
            }
        },

        /**
         * @method _afterMapLayerRemoveEvent
         * Handle AfterMapLayerRemoveEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent}
         *            event
         */
        _afterMapLayerRemoveEvent: function (event) {
            var layer = event.getMapLayer();

            this._removeMapLayerFromMap(layer);
        },
        /**
         * @method _afterMapLayerRemoveEvent
         * Removes the layer from the map
         * @private
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         */
        _removeMapLayerFromMap: function (layer) {

            if (!layer.isLayerOfType('WMS')) {
                return;
            }
            var remLayer;
            if (layer.isBaseLayer() || layer.isGroupLayer()) {
                var baseLayerId = "",
                    i;
                if (layer.getSubLayers().length > 0) {
                    for (i = 0; i < layer.getSubLayers().length; i++) {
                        var subtmp = layer.getSubLayers()[i];
                        remLayer = this._map.getLayersByName('basemap_' + subtmp.getId());
                        if (remLayer && remLayer[0] && remLayer[0].destroy) {
                            remLayer[0].destroy();
                        }
                    }
                } else {
                    remLayer = this._map.getLayersByName('layer_' + layer.getId());
                    remLayer[0].destroy();
                }
            } else {
                remLayer = this._map.getLayersByName('layer_' + layer.getId());
                /* This should free all memory */
                remLayer[0].destroy();
            }
        },
        /**
         * @method getOLMapLayers
         * Returns references to OpenLayers layer objects for requested layer or null if layer is not added to map.
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @return {OpenLayers.Layer[]}
         */
        getOLMapLayers: function (layer) {

            if (!layer.isLayerOfType('WMS')) {
                return null;
            }

            if (layer.isBaseLayer() || layer.isGroupLayer()) {
                var baseLayerId = "";
                if (layer.getSubLayers().length > 0) {
                    var olLayers = [],
                        i;
                    for (i = 0; i < layer.getSubLayers().length; i++) {
                        var tmpLayers = this._map.getLayersByName('basemap_' + layer.getSubLayers()[i].getId());
                        olLayers.push(tmpLayers[0]);
                    }
                    return olLayers;
                } else {
                    return this._map.getLayersByName('layer_' + layer.getId());
                }
            } else {
                return this._map.getLayersByName('layer_' + layer.getId());
            }
            return null;
        },
        /**
         * @method _afterChangeMapLayerOpacityEvent
         * Handle AfterChangeMapLayerOpacityEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerOpacityEvent}
         *            event
         */
        _afterChangeMapLayerOpacityEvent: function (event) {
            var layer = event.getMapLayer(),
                mapLayer;

            if (!layer.isLayerOfType('WMS')) {
                return;
            }

            if (layer.isBaseLayer() || layer.isGroupLayer()) {
                if (layer.getSubLayers().length > 0) {
                    var bl;
                    for (bl = 0; bl < layer.getSubLayers().length; bl++) {
                        mapLayer = this._map.getLayersByName('basemap_' + layer.getSubLayers()[bl].getId());
                        mapLayer[0].setOpacity(layer.getOpacity() / 100);
                    }
                } else {
                    mapLayer = this._map.getLayersByName('layer_' + layer.getId());
                    if (mapLayer[0] !== null && mapLayer[0] !== undefined) {
                        mapLayer[0].setOpacity(layer.getOpacity() / 100);
                    }
                }
            } else {
                this._sandbox.printDebug("Setting Layer Opacity for " + layer.getId() + " to " + layer.getOpacity());
                mapLayer = this._map.getLayersByName('layer_' + layer.getId());
                if (mapLayer[0] !== null && mapLayer[0] !== undefined) {
                    mapLayer[0].setOpacity(layer.getOpacity() / 100);
                }
            }
        },
        /**
         * Handle AfterChangeMapLayerStyleEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerStyleEvent}
         *            event
         */
        _afterChangeMapLayerStyleEvent: function (event) {
            if (event.getMapLayer().isLayerOfType("WMS")) {
                var layer = event.getMapLayer();

                // Change selected layer style to defined style
                if (!layer.isBaseLayer()) {
                    var styledLayer = this._map.getLayersByName('layer_' + layer.getId());
                    if (styledLayer !== null && styledLayer !== undefined) {
                        styledLayer[0].mergeNewParams({
                            styles: layer.getCurrentStyle().getName()
                        });
                    }
                }
            }
        },
        /**
         * Updates the OpenLayers and redraws them if scales have changed.
         *
         * @method _updateLayer
         * @param  {Oskari.mapframework.domain.WmsLayer} layer
         * @return {undefined}
         */
        _updateLayer: function(layer) {
            var oLayers = this.getOLMapLayers(layer),
                subs = layer.getSubLayers(),
                layerList = subs.length ? subs : [layer],
                llen = layerList.length,
                scale = this.getMapModule().getMap().getScale(),
                i, newRes, isInScale;

            for (i = 0; i < llen; ++i) {
                newRes = this._calculateResolutions(layerList[i]);
                isInScale = layerList[i].isInScale(scale);
                // Make sure the sub exists before mucking about with it
                if (newRes && isInScale && oLayers[i]) {
                    oLayers[i].addOptions({
                        resolutions: newRes
                    });
                    oLayers[i].setVisibility(isInScale);
                    oLayers[i].redraw(true);
                }
                
                if(oLayers[i] && oLayers[i].params.LAYERS !== layer._wmsName) {
                    oLayers[i].mergeNewParams({layers: layer._wmsName});
                }
            }
        },
        /**
         * Calculates the resolutions based on layer scales.
         *
         * @method _calculateResolutions
         * @param  {Oskari.mapframework.domain.WmsLayer} layer
         * @return {Array[Number]}
         */
        _calculateResolutions: function(layer) {
            var minScale = layer.getMinScale(),
                maxScale = layer.getMaxScale();

            if (minScale || maxScale) {
                // use resolutions instead of scales to minimize chance of transformation errors
                return this.getMapModule().calculateLayerResolutions(maxScale, minScale);
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });