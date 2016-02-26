/**
 * @class Oskari.mapframework.bundle.mapstats.plugin.StatsLayerPlugin
 * Provides functionality to draw Stats layers on the map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapstats.plugin.StatsLayerPlugin',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (config) {
        var me = this;
        this.mapModule = null;
        this.pluginName = null;
        this._sandbox = null;
        this._map = null;
        this._supportedFormats = {};
        this._statsDrawLayer = null;
        this._highlightCtrl = null;
        this._navCtrl = null;
        this._getFeatureControlHover = null;
        this._modeVisible = false;
        this.config = config;
        this.ajaxUrl = null;
        this.featureAttribute = 'koodi';
        this.useArcGis = false;
        this.defaultUrl = 'action_route=GetStatsTile';
        this.arcGisDefaultUrl = 'action_route=GetArcGisStatsTile';

        this.showAreaNames = false;
        this.showValues = false;
        this.showSymbols = true;
        this.columnValues = null;
        this.columnIds = null;
        this.columnNames = null;
        this.classificationParams = null;
        this.currentZoneType = 'administrative';

        if (config) {
            if (config.ajaxUrl)
                me.ajaxUrl = config.ajaxUrl;
            if (config.published)
                me._modeVisible = config.published;
            if (config.useArcGis) {
                me.useArcGis = config.useArcGis;
                me.featureAttribute = 'KuntaNro';
                me.defaultLayerId = '21';
            }                
        }
    }, {
        /** @static @property __name plugin name */
        __name: 'StatsLayerPlugin',

        /** @static @property _layerType type of layers this plugin handles */
        _layerType: 'STATS',

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
            this.getMapModule().setLayerPlugin('statslayer', this);
        },
        /**
         * @method unregister
         * Interface method for the plugin protocol
         * Unregisters self from mapmodules layerPlugins
         */
        unregister: function () {
            this.getMapModule().setLayerPlugin('statslayer', null);
        },
        /**
         * @method init
         * Interface method for the module protocol.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {
            var sandboxName = (this.config ? this.config.sandbox : null) || 'sandbox',
                sbx = Oskari.getSandbox(sandboxName),
                mapLayerService = sbx.getService('Oskari.mapframework.service.MapLayerService'); // register domain builder
            if (mapLayerService) {
                mapLayerService.registerLayerModel('statslayer', 'Oskari.mapframework.bundle.mapstats.domain.StatsLayer');

                var layerModelBuilder = Oskari.clazz.create('Oskari.mapframework.bundle.mapstats.domain.StatsLayerModelBuilder', sbx);
                mapLayerService.registerLayerModelBuilder('statslayer', layerModelBuilder);
            }
        },
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
            if (!this.ajaxUrl) {
                if (this.useArcGis)
                    this.ajaxUrl = sandbox.getAjaxUrl() + this.arcGisDefaultUrl;
                else
                    this.ajaxUrl = sandbox.getAjaxUrl() + this.defaultUrl;
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
            'AfterMapLayerRemoveEvent': function (event) {
                this._afterMapLayerRemoveEvent(event);
            },
            'MapLayerVisibilityChangedEvent': function (event) {
                this._mapLayerVisibilityChangedEvent(event);
            },
            'AfterChangeMapLayerOpacityEvent': function (event) {
                this._afterChangeMapLayerOpacityEvent(event);
            },
            'AfterChangeMapLayerStyleEvent': function (event) {
            },
            'MapStats.StatsVisualizationChangeEvent': function (event) {
                this._afterStatsVisualizationChangeEvent(event);
            },
            'StatsGrid.ModeChangedEvent': function (event) {
                this._afterModeChangedEvent(event);
            },
            'StatsGrid.SelectHilightsModeEvent': function (event) {
                this._hilightFeatures(event);
            },
            'StatsGrid.ClearHilightsEvent': function (event) {
                this._clearHilights(event);
            },
            //_clearHilights
            'MapStats.HoverTooltipContentEvent': function (event) {
                this._afterHoverTooltipContentEvent(event);
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

                if (layer.isLayerOfType(this._layerType)) {
                    sandbox.printDebug("preselecting " + layerId);
                    this.addMapLayerToMap(layer, true, layer.isBaseLayer());
                }
            }

        },

        /**
         * Activates the hover and select controls.
         *
         * @method activateControls
         */
        activateControls: function () {
            this._getFeatureControlHover.activate();
            this._loadingControl.activate();
        },

        /**
         * Deactivates the hover and select controls.
         *
         * @method deactivateControls
         */
        deactivateControls: function () {
            this._getFeatureControlHover.deactivate();
            this._loadingControl.deactivate();
        },
        addMapLayerArcGisToMap: function (layer, keepLayerOnTop, isBaseMap) {
            var me = this;
            var layerUrl = me.ajaxUrl + "&LAYERID=" + layer.getId();
            var openLayer;

            var layerScales = me.getMapModule().calculateLayerScales(layer.getMaxScale(), layer.getMinScale());
            var layerInfo = {};
            layerInfo.spatialReference = {};
            layerInfo.spatialReference.wkid = me._map.projection.substr(me._map.projection.indexOf(':') + 1);
            openLayer = new OpenLayers.Layer.ArcGIS93Rest("layer_" + layer.getId(), layerUrl, {
                TRANSPARENT: true,
                LAYERS: me.defaultLayerId,
                VIS_METHOD: 'administrative'
            }, {
                tileOptions : {
                    maxGetUrlLength: 3072
                },
                scales: layerScales,
                isBaseLayer: false,
                displayInLayerSwitcher: false,
                visibility: true,
                singleTile: true,
                buffer: 0
            });

            this._sandbox.printDebug("#!#! CREATED OPENLAYER.LAYER.ArcGis for ArcGisLayer " + layer.getId());

            return openLayer;
        },
        addMapLayerWMSToMap: function (layer, keepLayerOnTop, isBaseMap) {
            var me = this;
            var layerScales = me.getMapModule().calculateLayerScales(layer.getMaxScale(), layer.getMinScale());
            var openLayer = new OpenLayers.Layer.WMS('layer_' + layer.getId(), me.ajaxUrl + "&LAYERID=" + layer.getId(), {
                layers: layer.getWmsName(),
                transparent: true,
                format: "image/png"
            }, {
                scales: layerScales,
                isBaseLayer: false,
                displayInLayerSwitcher: false,
                visibility: true,
                singleTile: true,
                buffer: 0
            });

            return openLayer;
        },
        _createFeatureLayer: function (layer) {
            var me = this;
            var context = {
                getSize: function (feature) {
                    var array = feature.attributes ? feature.attributes : feature.properties;
                    return array["size"] ? array["size"] * 4 : 0;
                },
                getFillColor: function (feature) {
                    var array = feature.attributes ? feature.attributes : feature.properties;
                    if (array["value"] && array["value"] > 0)
                        return "#3182bd";
                    return "#e34a33";
                },
                getSymbolOpacity: function (feature) {
                    return me.showSymbols ? 0.8 : 0;
                },                
                getStrokeColor: function (feature) {
                    var array = feature.attributes ? feature.attributes : feature.properties;
                    if (array["value"] && array["value"] > 0)
                        return "#08519c";
                    return "#b30000";
                },
                getLabel: function (feature) {
                    var array = feature.attributes ? feature.attributes : feature.properties;

                    var result = "";
                    if (me.showAreaNames && array["name"])
                        result += array["name"];
                    if (me.showValues && array["value"]) {
                        if (result != "")
                            result += '\n';
                        result += array["value"];
                    }
                    return result;
                }
            };

            //NOTE: if style is changed change also statsgrid/instance.js:_createPrintParams
            var template = {
                strokeColor: "${getStrokeColor}",
                strokeWidth: 1,
                pointRadius: "${getSize}", // using context.getSize(feature)
                fillColor: "${getFillColor}",
                fillOpacity: "${getSymbolOpacity}",
                strokeOpacity: "${getSymbolOpacity}",
                label: "${getLabel}",
                graphicZIndex: 3,
            };

            var style = new OpenLayers.Style(template, { context: context });
            var styleMap = new OpenLayers.StyleMap({ 'default': style, 'select': { fillColor: '#ff6300' } });
            var openLayer = new OpenLayers.Layer.Vector("layer_feature_" + layer.getId(), {
                                strategies: [new OpenLayers.Strategy.Fixed(), new OpenLayers.Strategy.Refresh({force: true, active: true})],
                                protocol: new OpenLayers.Protocol.HTTP({
                                    url: "?action_route=GetStatsFeatures",
                                    format: new OpenLayers.Format.GeoJSON(),
                                    params : {
                                        LAYERID: me.defaultLayerId,
                                        LAYERATTRIBUTE: me.featureAttribute
                                    },
                                    parseFeatures: function(request) {
                                        return me._parseLayerFeatures(me, this, request);
                                    }
                                }),
                                styleMap: styleMap
            }, {
                visibility: true
            });

            openLayer.events.register('loadend', this, this.featureLayerLoadEnd);

            return openLayer;
        },
        featureLayerLoadEnd: function (evt) {
            var geoJsonData;
            var oLayer = evt.object;
            var format = new OpenLayers.Format.GeoJSON();
            var geoJsonString = format.write(oLayer.features);
            var geoJsonParsed = JSON.parse(geoJsonString);
            if (geoJsonParsed.features) {
                var features = [];
                var context = oLayer.styleMap.styles.default.context;
                for (var j = 0; j < geoJsonParsed.features.length; j++) {
                    var feature = geoJsonParsed.features[j];
                    if (feature.properties.size == null)
                        continue;

                    feature.properties["getLabel"] = context.getLabel(feature);
                    feature.properties["getSize"] = context.getSize(feature) * 2;
                    feature.properties["getFillColor"] = context.getFillColor(feature);
                    feature.properties["getStrokeColor"] = context.getStrokeColor(feature);

                    features.push(feature);
                }
                geoJsonParsed.features = features;

                geoJsonData = {};
                geoJsonData.id = oLayer.name;
                geoJsonData.name = oLayer.name;
                geoJsonData.type = "geojson";
                geoJsonData.data = geoJsonParsed;
                geoJsonData.styles = [
                    {
                        "name": "default",
                        "styleMap": {
                            "default": {
                                "graphicSize": "${getSize}",
                                "fillOpacity": context.getSymbolOpacity(),
                                'strokeWidth': context.getSymbolOpacity() == 0 ? 0 : 1,
                                'strokeColor': '${getStrokeColor}',
                                'fillColor': '${getFillColor}',
                                'strokeOpacity': context.getSymbolOpacity(),
                                'strokeLinecap': 'round',
                                'strokeDashstyle': 'solid',
                                'display': true,
                                'label': "${getLabel}",
                                'labelAlign': 'c',
                                'graphicName': 'circle'
                            }
                        }
                    }
                ];
            }
            if (geoJsonData != null) {
                var eventBuilder = this._sandbox.getEventBuilder('Printout.PrintableContentEvent');
                var event = eventBuilder(this.getName(), null, null, geoJsonData);
                this._sandbox.notifyAll(event);
            }            
        },
        _createGridMapLayer: function(layer) {
            var me = this;
            var layerUrl = me.ajaxUrl + "&LAYERID=" + layer.getId();
            var openLayer;
            var layerScales = me.getMapModule().calculateLayerScales(layer.getMaxScale(), layer.getMinScale());
            var layerInfo = {};
            layerInfo.spatialReference = {};
            layerInfo.spatialReference.wkid = me._map.projection.substr(me._map.projection.indexOf(':') + 1);
            openLayer = new OpenLayers.Layer.ArcGIS93Rest("layer_grid_" + layer.getId(), layerUrl, {
                TRANSPARENT: true,
                LAYERS: me.defaultLayerId,
                XLAYERTYPE: 'grid'
            }, {
                tileOptions: {
                    maxGetUrlLength: 3072
                },
                scales: layerScales,
                isBaseLayer: false,
                displayInLayerSwitcher: false,
                visibility: true,
                singleTile: true,
                buffer: 0
            });

            return openLayer;
        },
        /**
         * Adds a single WMS layer to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @param {Boolean} keepLayerOnTop
         */
        addMapLayerToMap: function (layer, keepLayerOnTop) {
            if (!layer.isLayerOfType(this._layerType)) {
                return;
            }
            var openLayer = null;  
            
            var me = this,
                sandbox = me.getSandbox(),
                eventBuilder = me.getSandbox().getEventBuilder(
                    'MapStats.FeatureHighlightedEvent'
                ),
                highlightEvent,
                layerScales = me.getMapModule().calculateLayerScales(
                    layer.getMaxScale(),
                    layer.getMinScale()
                ),
                openLayer = new OpenLayers.Layer.WMS(
                    'layer_' + layer.getId(),
                    me.ajaxUrl + '&LAYERID=' + layer.getId(),
                    {
                        layers: layer.getLayerName(),
                        transparent: true,
                        format: 'image/png'
                    },
                    {
                        scales: layerScales,
                        isBaseLayer: false,
                        displayInLayerSwitcher: false,
                        visibility: layer.isInScale(sandbox.getMap().getScale()) && layer.isVisible(),
                        singleTile: true,
                        buffer: 0
                    }
                );

            if (this.useArcGis) {
                openLayer = this.addMapLayerArcGisToMap(layer, keepLayerOnTop, isBaseMap);
            }
            else {
                openLayer = this.addMapLayerWMSToMap(layer, keepLayerOnTop, isBaseMap);
            }

            var gridLayer = me._createGridMapLayer(layer);
            var featureLayer = me._createFeatureLayer(layer);            

            // Select control
            me._statsDrawLayer = new OpenLayers.Layer.Vector("Stats Draw Layer", {
                styleMap: new OpenLayers.StyleMap({
                    "default": new OpenLayers.Style({
                        fillOpacity: 0.0,
                        strokeOpacity: 0.0,
                    }),
                    "temporary": new OpenLayers.Style({
                        strokeColor: "#333333",
                        strokeOpacity: 1.0,
                        strokeWidth: 3,
                        fillColor: "#000000",
                        fillOpacity: 0.2,
                        graphicZIndex: 2,
                        cursor: "pointer"
                    }),
                    "select": new OpenLayers.Style({})
                })
            });
            
            me._map.addLayers([me._statsDrawLayer]);

            // Hover control
            me._highlightCtrl = new OpenLayers.Control.SelectFeature(me._statsDrawLayer, {
                hover: true,
                highlightOnly: true,
                outFeature: function (feature) {
                    me._highlightCtrl.unhighlight(feature);
                    me._removePopup();
                },
                renderIntent: "temporary"
            });
            // Make sure selected feature doesn't swallow events so we can drag above it
            // http://trac.osgeo.org/openlayers/wiki/SelectFeatureControlMapDragIssues
            if (me._highlightCtrl.handlers !== undefined) { // OL 2.7
                me._highlightCtrl.handlers.feature.stopDown = false;
            } else if (me._highlightCtrl.handler !== undefined) { // OL < 2.7
                me._highlightCtrl.handler.stopDown = false;
                me._highlightCtrl.handler.stopUp = false;
            }
            me._map.addControl(this._highlightCtrl);
            me._highlightCtrl.activate();

            var queryableMapLayers = [openLayer];
            var hoverParams = {
                drillDown: false,
                hover: true,
                handlerOptions: {
                    "hover": {
                        delay: 50
                    },
                    "stopSingle": false
                },
                infoFormat: "application/vnd.ogc.gml",
                layers: queryableMapLayers,
                eventListeners: {
                    getfeatureinfo: function(event) {
                        var drawLayer = me._map.getLayersByName("Stats Draw Layer")[0],
                            i;
                        if (typeof drawLayer === "undefined") {
                            return;
                        }

                        if(me.currentZoneType !== 'administrative') {
                            return;
                        }
                        if (event.features.length === 0) {
                            for (i = 0; i < drawLayer.features.length; i++) {
                                if (!drawLayer.features[i].selected) {
                                    drawLayer.removeFeatures([drawLayer.features[i]]);
                                }
                            }
                            me._removePopup();
                            return;
                        }
                        var found = false,
                            attrText = me.featureAttribute;

                        for (i = 0; i < drawLayer.features.length; i++) {
                            if (drawLayer.features[i].attributes[attrText] === event.features[0].attributes[attrText]) {
                                found = true;
                            } else if (!drawLayer.features[i].selected) {
                                drawLayer.removeFeatures([drawLayer.features[i]]);
                            }
                        }

                        if (!found) {
                            drawLayer.addFeatures([event.features[0]]);
                            me._highlightCtrl.highlight(event.features[0]);

                            me._removePopup();
                            me._addPopup(event);
                        }
                        drawLayer.redraw();
                    },
                    beforegetfeatureinfo: function(event) {
                    },
                    nogetfeatureinfo: function(event) {}
                }
            };

            if (me.useArcGis) {
                me._getFeatureControlHover = new OpenLayers.Control.ArcGisGetFeatureInfo(hoverParams);
            } else {
                me._getFeatureControlHover = new OpenLayers.Control.WMSGetFeatureInfo(hoverParams);
            }
            

            // Add the control to the map
            me._map.addControl(me._getFeatureControlHover);
            // Activate only is mode is on.
            if (me._modeVisible) {
                me._getFeatureControlHover.activate();
            }

            var loadingPanelOptions = {
                layerNames: ['layer_' + layer.getId(), 'layer_grid_' + layer.getId(), 'layer_feature_' + layer.getId()]
            }

            me._loadingControl = new OpenLayers.Control.LoadingPanel(loadingPanelOptions);
            me._map.addControl(me._loadingControl);         

            for (i = 0; i < drawLayer.features.length; i += 1) {
            	if (drawLayer.features[i].attributes[attrText] === event.features[0].attributes[attrText]) {
            		foundInd = i;
            		break;
            	}
            }
            featureStyle = OpenLayers.Util.applyDefaults(
            		featureStyle,
            		OpenLayers.Feature.Vector.style['default']
            );
            featureStyle.fillColor = '#ff0000';
            featureStyle.strokeColor = '#ff3333';
            featureStyle.strokeWidth = 3;
            featureStyle.fillOpacity = 0.2;

            if (foundInd >= 0) {
            	drawLayer.features[i].selected =
            		!drawLayer.features[i].selected;
            	if (drawLayer.features[i].selected) {
            		drawLayer.features[i].style = featureStyle;
            	} else {
            		drawLayer.features[i].style = null;
            		me._highlightCtrl.highlight(drawLayer.features[i]);
            	}
            	if (eventBuilder) {
            		highlightEvent = eventBuilder(
            				drawLayer.features[i].attributes,
            				drawLayer.features[i].selected,
            				'click'
            		);
            	}
            } else {
            	drawLayer.addFeatures([newFeature]);
            	newFeature.selected = true;
            	newFeature.style = featureStyle;
            	if (eventBuilder) {
            		highlightEvent = eventBuilder(
            				newFeature.attributes,
            				newFeature.selected,
            				'click'
            		);
            	}
            }
            drawLayer.redraw();

            if (highlightEvent) {
            	me.getSandbox().notifyAll(highlightEvent);
            }
        },

        /**
         * Activates/deactivates the controls after the mode has changed.
         *
         * @method _afterModeChangedEvent
         * @private
         * @param {Oskari.statistics.bundle.statsgrid.event.ModeChangedEvent} event
         */
        _afterModeChangedEvent: function (event) {
            this._modeVisible = event.isModeVisible();
            var drawLayer = this._map.getLayersByName("Stats Draw Layer")[0];

            if (this._modeVisible) {
                this.activateControls();
            } else {
                this.deactivateControls();
                if (drawLayer) {
                    drawLayer.removeAllFeatures();
                }
                this._removePopup();
            }
        },
        /**
         * Clear hilighted features
         *
         * @method _clearHilights
         * @private
         * @param {Oskari.statistics.bundle.statsgrid.event.ClearHilightsEvent} event
         */
        _clearHilights: function (event) {
            var drawLayer = this._map.getLayersByName("Stats Draw Layer")[0],
                i;
            if (drawLayer) {
                for (i = 0; i < drawLayer.features.length; i++) {
                    //clear style
                    drawLayer.features[i].style = null;
                    // notify highlight control
                    this._highlightCtrl.highlight(drawLayer.features[i]);
                }
            }
            drawLayer.redraw();
            //remove popup also
            this._removePopup();
        },

        /**
         * Hilight features
         *
         * @method _hilightFeatures
         * @private
         * @param {Oskari.statistics.bundle.statsgrid.event.SelectHilightsModeEvent} event
         */
        _hilightFeatures: function (event) {
            // which municipalities should be hilighted
            var codes = event.getCodes(),
                drawLayer = this._map.getLayersByName("Stats Draw Layer")[0];

            // drawLayer can not be undefined
            if (typeof drawLayer === "undefined") {
                return;
            }

            var attrText = this.featureAttribute,
                featureStyle;


            // add hilight feature style
            featureStyle = OpenLayers.Util.applyDefaults(featureStyle, OpenLayers.Feature.Vector.style['default']);
            featureStyle.fillColor = "#ff0000";
            featureStyle.strokeColor = "#ff3333";
            featureStyle.strokeWidth = 3;
            featureStyle.fillOpacity = 0.2;

            // loop through codes and features to find out if feature should be hilighted
            var key,
                i;
            for (key in codes) {
                if (codes.hasOwnProperty(key)) {
                    for (i = 0; i < drawLayer.features.length; i++) {
                        if (drawLayer.features[i].attributes[attrText] === key && codes[key]) {
                            drawLayer.features[i].style = featureStyle;
                            this._highlightCtrl.highlight(drawLayer.features[i]);
                            break;
                        }
                    }
                }
            }
            drawLayer.redraw();
        },

        /**
         * @method _afterMapLayerRemoveEvent
         * Handle AfterMapLayerRemoveEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent}
         *            event
         */
        _afterMapLayerRemoveEvent: function (event) {
            var me = this,
                layer = event.getMapLayer();
            if (!layer.isLayerOfType(me._layerType)) {
                return;
            }
            me._removeMapLayerFromMap(layer);            
            me._highlightCtrl.deactivate();
            me._getFeatureControlHover.deactivate();
            me._loadingControl.deactivate();
            me._map.removeControl(me._highlightCtrl);
//            me._map.removeControl(me._navCtrl);
            me._map.removeControl(me._getFeatureControlHover);
            me._map.removeControl(me._loadingControl);
            me._map.removeLayer(me._statsDrawLayer);            
        },

        /**
         * @method _mapLayerVisibilityChangedEvent
         * Handle MapLayerVisibilityChangedEvent
         * @private
         * @param {Oskari.mapframework.event.common.MapLayerVisibilityChangedEvent}
         */
        _mapLayerVisibilityChangedEvent: function (event) {
            var mapLayer = event.getMapLayer();
            if (mapLayer._layerType !== "STATS") {
                return;
            }
            this._statsDrawLayer.setVisibility(mapLayer.isVisible());

            // Do nothing if not in statistics mode.
            if (this._modeVisible) {
                if (mapLayer.isVisible()) {
                    this._getFeatureControlHover.activate();
                    this._loadingControl.activate();
                } else {
                    this._getFeatureControlHover.deactivate();
                    this._loadingControl.deactivate();
                }
            }
        },

        /**
         * @method _afterMapLayerRemoveEvent
         * Removes the layer from the map
         * @private
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         */
        _removeMapLayerFromMap: function (layer) {

            if (!layer.isLayerOfType(this._layerType)) {
                return;
            }

            var mapLayers = this.getOLMapLayers(layer);
            /* This should free all memory */
            $.each(mapLayers, function (key, mapLayer) {
                mapLayer.destroy();
            });            
        },
        /**
         * @method getOLMapLayers
         * Returns references to OpenLayers layer objects for requested layer or null if layer is not added to map.
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @return {OpenLayers.Layer[]}
         */
        getOLMapLayers: function (layer) {
            var me = this;
            if (!layer.isLayerOfType(this._layerType)) {
                return null;
            }

            var ids = ['layer_' + layer.getId(), 'layer_grid_' + layer.getId(), 'layer_feature_' + layer.getId()];
            var result = [];

            $.each(ids, function (key, id) {
                var itemResult = me._map.getLayersByName(id);
                if (itemResult != null && itemResult.length > 0)
                    result.push(itemResult[0]);
//                else
//                    result.push(null);
            });
            return result;
        },

        /**
         * Removes popup from the map.
         *
         * @method _removePopup
         * @private
         * @param {OpenLayers.Popup} popup Optional, uses this._popup if not provided
         */
        _removePopup: function (popup) {
            popup = popup || this._popup;
            if (popup) {
                this._map.removePopup(popup);
            }
        },

        /**
         * Adds a popup to the map and sends a request to get content for it
         * from the statsgrid bundle.
         *
         * @method _addPopup
         * @private
         * @param {OpenLayers.Event} event event with xy and feature information
         */
        _addPopup: function (event) {
            var content = event.features[0].attributes.kuntanimi;
            this._popup = new OpenLayers.Popup('mapstatsHover',
                this._map.getLonLatFromPixel(new OpenLayers.Pixel(event.xy.x + 5, event.xy.y + 5)),
                new OpenLayers.Size(100, 100),
                content
                );
            this._popup.autoSize = true;
            this._popup.opacity = 0.8;
            this._map.addPopup(this._popup);

            var reqBuilder = this._sandbox.getRequestBuilder('StatsGrid.TooltipContentRequest');
            if (reqBuilder) {
                var request = reqBuilder(event.features[0]);
                this._sandbox.request(this, request);
            }
        },

        /**
         * Sets content for this._popup, if found.
         *
         * @method _afterHoverTooltipContentEvent
         * @private
         * @param {Oskari.mapframework.bundle.mapstats.event.HoverTooltipContentEvent} event
         */
        _afterHoverTooltipContentEvent: function (event) {
            var content = event.getContent();
            if (this._popup) {
                this._popup.setContentHTML(content);
            }
        },

        /**
         * @method _afterChangeMapLayerOpacityEvent
         * Handle AfterChangeMapLayerOpacityEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerOpacityEvent}
         *            event
         */
        _afterChangeMapLayerOpacityEvent: function (event) {
            var layer = event.getMapLayer();

            if (!layer.isLayerOfType(this._layerType)) {
                return;
            }

            this._sandbox.printDebug("Setting Layer Opacity for " + layer.getId() + " to " + layer.getOpacity());
            var mapLayers = this.getOLMapLayers(layer);
            $.each(mapLayers, function (key, mapLayer) {
                 mapLayer.setOpacity(layer.getOpacity() / 100);
            });            
        },
        _parseLayerFeatures: function(me, protocol, request) {
            var result = [];
            var features = protocol.format.read(request.responseText);
            var doUpdate = false;
            var idxLookup = {};
            var maxValue, minValue, spreadValue, maxSize;
            
            if (me.columnValues)
                doUpdate = true;

            if (doUpdate) {
                _.each(me.columnIds, function (val, idx) {
                    idxLookup[val] = idx;
                });
                maxValue = me.classificationParams.max;
                minValue = 0;
                spreadValue = maxValue - minValue;
                maxSize = me.classificationParams.maxSize;
            }            

            _.each(features, function (feature) {
                feature.geometry = feature.geometry.getCentroid();
                if (doUpdate) {
                    var id = feature.attributes[me.featureAttribute];
                    var idx = idxLookup[id];
                    var value = me.columnValues[idx];
                    var name = me.columnNames[idx];
                    var size;
                    if (value < 0) {
                        size = Math.sqrt((-value - minValue) / spreadValue) * maxSize;
                    } else {
                        size = Math.sqrt((value - minValue) / spreadValue) * maxSize;
                    }
                    feature.attributes.id = id;
                    feature.attributes.value = value;
                    feature.attributes.size = size;
                    feature.attributes.name = name;
                }
                result.push(feature);
            });

//            if (doUpdate) {
//                console.log('updated');
//            }
                
            return result;
        },
        _afterStatsVisualizationChangeEvent: function (event) {
            var me = this;
            var layer = event.getLayer(),
                params = event.getParams(),
                mapLayers = this.getOLMapLayers(layer);
            if (mapLayers == null || mapLayers[0] == null || mapLayers[1] == null || mapLayers[2] == null)
                return;

            var administrativeLayer = mapLayers[0];            
            var gridLayer = mapLayers[1];
            var featureLayer = mapLayers[2];

            var updateFeatureLayer = false;
            var layerChanged = this.layerName != params.VIS_NAME;

            this.featureAttribute = params.VIS_ATTR;
            this.layerName = params.VIS_NAME;
            this.currentZoneType = params.ZONE_TYPE;

            if (layerChanged) {
                featureLayer.protocol.params.LAYERID = this.layerName;
                featureLayer.protocol.params.LAYERATTRIBUTE = this.featureAttribute;
                updateFeatureLayer = true;
            }
            
            if (params.ZONE_TYPE == 'administrative') {

                    var featureLayerParametersChanged =
                        this.showAreaNames != params.VIS_SHOW_AREA_NAMES ||
                        this.showValues != params.VIS_SHOW_VALUES;
                    this.showAreaNames = params.VIS_SHOW_AREA_NAMES;
                    this.showValues = params.VIS_SHOW_VALUES;
                    if (params.COLUMN_VALUES) {
                        this.columnValues = params.COLUMN_VALUES;
                        this.columnIds = params.COLUMN_IDS;
                        this.columnNames = params.COLUMN_NAMES;
                        this.classificationParams = params.CLASSIFICATION_PARAMS;
                        updateFeatureLayer = true;
                    }

                    switch (params.VIS_METHOD) {
                        case 'choropletic':
                            featureLayerParametersChanged = featureLayerParametersChanged || this.showSymbols != false;
                            this.showSymbols = false;
                            gridLayer.setVisibility(false);
                            administrativeLayer.mergeNewParams({
                                VIS_ID: params.VIS_ID,
                                VIS_NAME: params.VIS_NAME,
                                VIS_ATTR: params.VIS_ATTR,
                                VIS_CLASSES: params.VIS_CLASSES,
                                VIS_COLORS: params.VIS_COLORS,
                                LAYERS: params.VIS_NAME
                            });
                            featureLayer.setVisibility(true);
                            break;
                        case 'graduated':
                            gridLayer.setVisibility(false);
                            administrativeLayer.mergeNewParams({
                                VIS_ID: params.VIS_ID,
                                VIS_NAME: params.VIS_NAME,
                                VIS_ATTR: params.VIS_ATTR,
                                VIS_CLASSES: params.VIS_CLASSES,
                                VIS_COLORS: params.VIS_COLORS,
                                LAYERS: params.VIS_NAME
                            });
                            featureLayerParametersChanged = featureLayerParametersChanged || this.showSymbols != true;
                            this.showSymbols = true;
                            featureLayer.setVisibility(true);                                                     
                            break;
                        default:
                            break;
                    }

                    if (featureLayerParametersChanged)
                        updateFeatureLayer = true;
                }
                else if (params.ZONE_TYPE.indexOf("grid") == 0) {
                    var visMethodType;
                    switch (params.VIS_METHOD) {
                        case 'choropletic':
                            visMethodType = 'SQUARE';
                            break;
                        case 'graduated':
                            visMethodType = 'CIRCLE';
                            break;
                        default:
                            break;
                    }

                    //this.showSymbols = false;
                    featureLayer.setVisibility(false);
                    administrativeLayer.mergeNewParams({
                        VIS_ID: params.VIS_ID,
                        VIS_NAME: params.VIS_NAME,
                        VIS_ATTR: params.VIS_ATTR,
                        VIS_CLASSES: params.VIS_CLASSES,
                        VIS_COLORS: params.VIS_COLORS,
                        LAYERS: params.VIS_NAME
                    });
                    administrativeLayer.redraw();
                    gridLayer.mergeNewParams({
                        VIS_ID: params.VIS_ID,
                        VIS_NAME: params.VIS_NAME,
                        VIS_ATTR: params.VIS_ATTR,
                        VIS_CLASSES: params.VIS_CLASSES,
                        VIS_COLORS: params.VIS_COLORS,
                        LAYERS: params.VIS_NAME,
                        VIS_METHOD: params.ZONE_TYPE,
                        VIS_METHOD_TYPE: visMethodType,
                        indicatorData: params.indicatorData != null ? JSON.stringify(params.indicatorData) : null,
                        classify: params.classify != null && params.classify.items != null && params.classify.items.length > 0 ? JSON.stringify(params.classify) : null,
                    });
                    gridLayer.setVisibility(true);

                    this._clearHilights();
                    var drawLayer = me._map.getLayersByName("Stats Draw Layer")[0],
                    i;
                    if (typeof drawLayer !== "undefined") {
                        for (i = 0; i < drawLayer.features.length; i++) {
                            if (!drawLayer.features[i].selected) {
                                drawLayer.removeFeatures([drawLayer.features[i]]);
                            }
                        }
                        me._removePopup();
                        return;
                    }
                } else {
                    console.log("Invalid method " + params.visualizationMethod);
                }
            

            if (updateFeatureLayer) {
                featureLayer.refresh();
            }
                
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });