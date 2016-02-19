/**
 * @class Oskari.harava.bundle.mapmodule.plugin.HaravaWMSLayerPlugin
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.plugin.HaravaWMSLayerPlugin', function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._supportedFormats = {};
}, {
	/** @static @property __name plugin name */
    __name : 'HaravaWMSLayerPlugin',
    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule}
     * reference to map
     * module
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule}
     * reference to map
     * module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this.pluginName = mapModule.getName() + this.__name;
    },
    /**
     * @method hasUI
     * @return {Boolean}
     * This plugin doesn't have an UI so always returns false
     */
    hasUI : function() {
        return false;
    },
    /**
     * @method register
     * Interface method for the plugin protocol
     */
    register : function() {
        this.getMapModule().setLayerPlugin('wmslayer', this);
    },
    /**
     * @method unregister
     * Interface method for the plugin protocol
     */
    unregister : function() {
        this.getMapModule().setLayerPlugin('wmslayer', null);
    },
    /**
     * @method init
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    init : function(sandbox) {
    },
    /**
     * @method startPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        sandbox.register(this);
        for(p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }
    },
    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stopPlugin : function(sandbox) {

        for(p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
    },
    /**
     * @method start
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stop : function(sandbox) {
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        'AfterMapLayerAddEvent' : function(event) {
            this.afterMapLayerAddEvent(event);
        },
        'AfterMapLayerRemoveEvent' : function(event) {
            this.afterMapLayerRemoveEvent(event);
        },
        'AfterChangeMapLayerOpacityEvent' : function(event) {
            this.afterChangeMapLayerOpacityEvent(event);
        },
        'AfterChangeMapLayerStyleEvent' : function(event) {
            this.afterChangeMapLayerStyleEvent(event);
        }
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    /**
     * @method preselectLayers
     * Adds given layers to map if of type WMS
     * @param {Oskari.mapframework.domain.WmsLayer[]} layers
     */
    preselectLayers : function(layers) {

        var sandbox = this._sandbox;
        for(var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var layerId = layer.getId();

            if(!layer.isLayerOfType('WMS'))
                continue;

            sandbox.printDebug("preselecting " + layerId);
            this.addMapLayerToMap(layer, true, layer.isBaseLayer());
        }

    },
    /**
     * Handle _afterMapLayerAddEvent
     * @private
     * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent}
     *            event
     */
    afterMapLayerAddEvent : function(event) {
        this.addMapLayerToMap(event.getMapLayer(), event.getKeepLayersOrder(), event.isBasemap());
    },
    /**
     * @method _addMapLayerToMap
     * @private
     * Adds a single WMS layer to this map
     * @param {Oskari.mapframework.domain.WmsLayer} layer
     * @param {Boolean} keepLayerOnTop
     * @param {Boolean} isBaseMap
     */
    addMapLayerToMap : function(layer, keepLayerOnTop, isBaseMap) {

        if(!layer.isLayerOfType('WMS')) {
            return;
        }
        this._sandbox.printDebug(" [SnappyWMSLayer]  Creating " +
                                 layer.getId() +
                                 " KEEP ON TOP ? " +
                                 keepLayerOnTop +
                                 " BASE? " +
                                 isBaseMap);

        var markerLayer = this._map.getLayersByName("Markers");
        if (markerLayer) {
            for (var mlIdx = 0; mlIdx < markerLayer.length; mlIdx++) {
                if (markerLayer[mlIdx]) {
                    this._map.removeLayer(markerLayer[mlIdx], false);
                }
            }
        }

        if(layer.isGroupLayer() || layer.isBaseLayer() || isBaseMap == true) {
			if(layer.getSubLayers().length > 0) {
                /**
                 * loop all basemap layers and add these on the map
                 */
                for(var i = 0; i < layer.getSubLayers().length; i++) {

                    var layerUrls = "";
                    for(var j = 0; j < layer.getSubLayers()[i].getWmsUrls().length; j++) {
                        layerUrls += layer.getSubLayers()[i]
                        .getWmsUrls()[j];
                    }

                    var layerScales = this.getMapModule().calculateLayerScales(layer
                    .getSubLayers()[i].getMaxScale(), layer
                    .getSubLayers()[i].getMinScale());

                    var WMS = Oskari.$("SnappyWMSLayer");
                    var openLayer = new WMS('basemap_' + layer.getSubLayers()[i].getId(),
                                            layer.getSubLayers()[i].getWmsUrls(), {
                        layers : layer.getSubLayers()[i].getWmsName(),
                        transparent : true,
                        id : layer.getSubLayers()[i].getId(),
                        styles : layer.getSubLayers()[i].getCurrentStyle().getName(),
                        format : "image/png",
                        MAP: 'wms.map'
                    }, {
                        layerId : layer.getSubLayers()[i].getWmsName(),
                        scales : layerScales,
                        isBaseLayer : false,
                        displayInLayerSwitcher : true,
                        visibility : true,
                        buffer : 0
                    });

                    openLayer.opacity = layer.getOpacity() / 100;

                    this._map.addLayer(openLayer);

                    this._sandbox.printDebug(" [SnappyWMSLayer]  Created SnappyGrid for WMS WITH SUBLAYERS for " + layer.getId());

                    if(!keepLayerOnTop) {
                        this._map.setLayerIndex(openLayer, 0);
                    }

                }

            } else {
                var layerScales = this.getMapModule().calculateLayerScales(layer.getMaxScale(), layer.getMinScale());

                var WMS = Oskari.$("SnappyWMSLayer");
                var openLayer = new WMS('layer_' + layer.getId(), layer.getWmsUrls(), {
                    layers : layer.getWmsName(),
                    transparent : true,
                    id : layer.getId(),
                    styles : layer.getCurrentStyle().getName(),
                    format : "image/png",
                    MAP: 'wms.map'
                }, {
                    layerId : layer.getWmsName(),
                    scales : layerScales,
                    isBaseLayer : false,
                    displayInLayerSwitcher : true,
                    visibility : true,
                    buffer : 0
                });

                openLayer.opacity = layer.getOpacity() / 100;

                this._map.addLayer(openLayer);

                this._sandbox.printDebug(" [SnappyWMSLayer]  Created SnappyGrid for WMS WITH SUBLAYERS for " + layer.getId());

                if(keepLayerOnTop) {
                    this._map.setLayerIndex(openLayer, this._map.layers.length);
                } else {
                    this._map.setLayerIndex(openLayer, 0);
                }
            }

        } else {

            var layerScales = this.getMapModule().calculateLayerScales(layer.getMaxScale(), layer.getMinScale());
            var WMS = Oskari.$("SnappyWMSLayer");
            var openLayer = new WMS('layer_' + layer.getId(), layer.getWmsUrls(), {
                layers : layer.getWmsName(),
                transparent : true,
                id : layer.getId(),
                styles : layer.getCurrentStyle().getName(),
                format : "image/png",
                MAP: 'wms.map'
            }, {
                layerId : layer.getWmsName(),
                scales : layerScales,
                isBaseLayer : false,
                displayInLayerSwitcher : true,
                visibility : true,
                buffer : 0
            });

            openLayer.opacity = layer.getOpacity() / 100;

            this._map.addLayer(openLayer);

            this._sandbox.printDebug("#!#! CREATED OPENLAYER.LAYER.WMS for " + layer.getId());

            if(keepLayerOnTop) {
                this._map.setLayerIndex(openLayer, this._map.layers.length);
            } else {
                this._map.setLayerIndex(openLayer, 0);
            }

        }
        if (markerLayer) {
            for (var mlIdx = 0; mlIdx < markerLayer.length; mlIdx++) {
                if (markerLayer[mlIdx]) {
                    this._map.addLayer(markerLayer[mlIdx]);
                }
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
    afterMapLayerRemoveEvent : function(event) {
        var layer = event.getMapLayer();

        this.removeMapLayerFromMap(layer);
    },
    /**
     * @method _afterMapLayerRemoveEvent
     * Removes the layer from the map
     * @private
     * @param {Oskari.mapframework.domain.WmsLayer} layer
     */
    removeMapLayerFromMap : function(layer) {

        if(!layer.isLayerOfType('WMS'))
            return;

        if(layer.isBaseLayer()||layer.isGroupLayer()) {
            var baseLayerId = "";
            if(layer.getSubLayers().length > 0) {
                for(var i = 0; i < layer.getSubLayers().length; i++) {
		    var subtmp = layer.getSubLayers()[i];
                    var remLayer =
			this._map.getLayersByName('basemap_' + subtmp.getId());
		    if (remLayer && remLayer[0] && remLayer[0].destroy) {
			remLayer[0].destroy();
		    }
                }
            } else {
                var remLayer = this._map.getLayersByName('layer_' + layer.getId());
                remLayer[0].destroy();
            }
        } else {
            var remLayer = this._map.getLayersByName('layer_' + layer.getId());
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
    getOLMapLayers : function(layer) {

        if(!layer.isLayerOfType('WMS')) {
            return null;
        }

        if(layer.isBaseLayer()||layer.isGroupLayer()) {
            var baseLayerId = "";
            if(layer.getSubLayers().length > 0) {
                var olLayers = [];
                for(var i = 0; i < layer.getSubLayers().length; i++) {
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
    afterChangeMapLayerOpacityEvent : function(event) {
        var layer = event.getMapLayer();

        if(!layer.isLayerOfType('WMS'))
            return;

        if(layer.isBaseLayer() || layer.isGroupLayer()) {
            if(layer.getSubLayers().length > 0) {
                for(var bl = 0; bl < layer.getSubLayers().length; bl++) {
                    var mapLayer = this._map.getLayersByName('basemap_' + layer
                    .getSubLayers()[bl].getId());
                    mapLayer[0].setOpacity(layer.getOpacity() / 100);
                }
            } else {
                var mapLayer = this._map.getLayersByName('layer_' + layer.getId());
                if(mapLayer[0] != null) {
                    mapLayer[0].setOpacity(layer.getOpacity() / 100);
                }
            }
        } else {
            this._sandbox.printDebug("Setting Layer Opacity for " + layer.getId() + " to " + layer.getOpacity());
            var mapLayer = this._map.getLayersByName('layer_' + layer.getId());
            if(mapLayer[0] != null) {
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
    afterChangeMapLayerStyleEvent : function(event) {
        var layer = event.getMapLayer();

        /** Change selected layer style to defined style */
        if(!layer.isBaseLayer()) {
            var styledLayer = this._map.getLayersByName('layer_' + layer.getId());
            if(styledLayer != null) {
                styledLayer[0].mergeNewParams({
                    styles : layer.getCurrentStyle().getName()
                });
            }
        }
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
