/**
 * @class Oskari.statistics.bundle.statsgrid.StatsGridBundleInstance
 *
 * Sample extension bundle definition which inherits most functionalty
 * from DefaultExtension class.
 *
 */
Oskari.clazz.define(
    'Oskari.statistics.bundle.statsgrid.StatsGridBundleInstance',
    /**
     * @static constructor function
     */

    function () {
		this.servicePackageData = null;
        this.defaultConf = {
            "name": "StatsGrid",
            "sandbox": "sandbox",
            "stateful": true,
            "tileClazz": null,//"Oskari.statistics.bundle.statsgrid.Tile",
            "viewClazz": "Oskari.statistics.bundle.statsgrid.StatsView",
            "isFullScreenExtension": false,
            "hideLayers" : false,
        };
        this.state = {
            indicators: [],
            layerId: null
        };
        this.drawPluginId = this.getName();
    }, {
        afterStart: function (sandbox) {
            var me = this;
            var tooltipRequestHandler = Oskari.clazz.create(
                'Oskari.statistics.bundle.statsgrid.request.TooltipContentRequestHandler',
                me
            );
            sandbox.addRequestHandler(
                'StatsGrid.TooltipContentRequest',
                tooltipRequestHandler
            );

            var indicatorRequestHandler = Oskari.clazz.create(
                'Oskari.statistics.bundle.statsgrid.request.IndicatorsRequestHandler',
                me
            );
            sandbox.addRequestHandler(
                'StatsGrid.IndicatorsRequest',
                indicatorRequestHandler
            );

			var currentStateRequestHandler = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.request.CurrentStateRequestHandler', this);
            sandbox.addRequestHandler('StatsGrid.CurrentStateRequest', currentStateRequestHandler);
			
			var setStateRequestHandler = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.request.SetStateRequestHandler', this);
            sandbox.addRequestHandler('StatsGrid.SetStateRequest', setStateRequestHandler);

            var locale = me.getLocalization(),
                mapModule = sandbox.findRegisteredModuleInstance(
                    'MainMapModule'
                );
            me.mapModule = mapModule;

            // create the StatisticsService for handling ajax calls
            // and common functionality.
            var statsService = Oskari.clazz.create(
                'Oskari.statistics.bundle.statsgrid.StatisticsService',
                me
            );
            sandbox.registerService(statsService);
            me.statsService = statsService;

            // Handles user indicators
            var userIndicatorsService = Oskari.clazz.create(
                'Oskari.statistics.bundle.statsgrid.UserIndicatorsService',
                me
            );
            sandbox.registerService(userIndicatorsService);
            userIndicatorsService.init();
            me.userIndicatorsService = userIndicatorsService;

            // Register stats plugin for map which creates
            // - the indicator selection UI (unless 'published' param in the conf is true)
            // - the grid.
            var gridConf = {
                state: me.getState(),
                //'csvDownload' : true,
                statistics: [{
                    id: 'min',
                    visible: true
                }, {
                    id: 'max',
                    visible: true
                }, {
                    id: 'avg',
                    visible: true
                }, {
                    id: 'mde',
                    visible: true
                }, {
                    id: 'mdn',
                    visible: true
                }, {
                    id: 'std',
                    visible: true
                }, {
                    id: 'sum',
                    visible: false
                }]
            };
            var gridPlugin = Oskari.clazz.create(
                'Oskari.statistics.bundle.statsgrid.plugin.ManageStatsPlugin',
                gridConf,
                locale
            );
            mapModule.registerPlugin(gridPlugin);
            mapModule.startPlugin(gridPlugin);
            me.gridPlugin = gridPlugin;

            // Register classification plugin for map.
            var classifyPlugin = Oskari.clazz.create(
                'Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin',
                {
                    'state': me.getState()
                },
                locale
            );
            mapModule.registerPlugin(classifyPlugin);
            mapModule.startPlugin(classifyPlugin);
            me.classifyPlugin = classifyPlugin;

            var dataSourceRequestHandler = Oskari.clazz.create(
                'Oskari.statistics.bundle.statsgrid.request.DataSourceRequestHandler',
                me.gridPlugin
            );
            sandbox.addRequestHandler(
                'StatsGrid.AddDataSourceRequest',
                dataSourceRequestHandler
            );

            this.setState(me.state);
            me._enableTile();

            this.buttons = Oskari.clazz.create("Oskari.statistics.bundle.statsgrid.ButtonHandler", this);
            this.buttons.start();

            var drawRequest = sandbox.getRequestBuilder('BackgroundDrawPlugin.RegisterForDrawingRequest')(true);
            sandbox.request(this, drawRequest);

            var tileDescriptions = [
                {
                    'title': locale.tile.standardStats,
                    'sequenceNumber' : 30,
                    'handler': function () {
                        me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [me, 'attach']);
                        if(me.getView().isVisible) {
                            window.setTimeout(function() {
                                if (me.gridPlugin.mode != 'servicePackage')
                                    me.changeMode('all');
                                }, 250);
                        } else {
                            me.changeMode(me.gridPlugin.mode);
                        }
                    }
                }
            ];
            
            if(this.conf.gridDataAllowed) {
                tileDescriptions.push(
                {
                    'title': locale.tile.twoWayStats,
                    'hidden': true,
                    'sequenceNumber' : 40,
                    'handler': function () {
                        me.changeMode('twoway');
                    },
                    'indent': true
                });
            }
            
            for (var i = 0; i < tileDescriptions.length; i++) {
                var tileRequest = sandbox.getRequestBuilder('liiteri-ui.UIAddTileRequest')(tileDescriptions[i]);
                sandbox.request(this, tileRequest);
            }
        },
        __addIndicatorTab : function() {
            if(this.userIndicatorsTab) {
                return;
            }
            var locale = this.getLocalization();
            if (this.sandbox.getUser().isLoggedIn()) {
                var userIndicatorsTab = Oskari.clazz.create(
                    'Oskari.statistics.bundle.statsgrid.UserIndicatorsTab',
                    this, locale.tab
                );
                this.userIndicatorsTab = userIndicatorsTab;
            }
        },
        eventHandlers: {
            'Personaldata.PersonaldataLoadedEvent': function () {
                // personal data has been loaded after this bundle
                this.__addIndicatorTab();
            },
            /**
             * @method userinterface.ExtensionUpdatedEvent
             */
            'userinterface.ExtensionUpdatedEvent': function (event) {
                var me = this,
                    view = this.getView();

                if (event.getExtension().getName() !== me.getName() || !me._isLayerPresent()) {
                    // not me -> do nothing
                    return;
                }

                var isShown = event.getViewState() !== 'close';
                view.prepareMode(isShown, null, true);

                var operation = isShown ? 'show' : 'hide';
                var tileRequest = me.sandbox.getRequestBuilder('liiteri-ui.UIUpdateTileRequest')(me.getLocalization().tile.twoWayStats, operation);                
                me.sandbox.request(me, tileRequest);

                if (!isShown) {
                    var tileRequest2 = me.sandbox.getRequestBuilder('liiteri-ui.UIUpdateTileRequest')(me.getLocalization().tile.standardStats, 'unselect');
                    me.sandbox.request(me, tileRequest2);
                }
            },
            /**
             * @method MapStats.StatsVisualizationChangeEvent
             */
            'MapStats.StatsVisualizationChangeEvent': function (event) {
                this._afterStatsVisualizationChangeEvent(event);
            },
            /**
             * @method AfterMapMoveEvent
             */
            AfterMapMoveEvent: function (event) {
                var view = this.getView();
                if (view.isVisible && view._layer) {
                    this._createPrintParams(view._layer);
                }
            },
            AfterMapLayerRemoveEvent: function (event) {
                this._afterMapLayerRemoveEvent(event);
            },
            /**
             * @method MapLayerEvent
             * @param {Oskari.mapframework.event.common.MapLayerEvent} event
             *
             */
            MapLayerEvent: function (event) {
                // Enable tile when stats layer is available
                this._enableTile();
            },
			'liiteri-servicepackages.ServicePackageSelectedEvent': function (event) {
				//this.gridPlugin.getServicePackageIndicators(event.getThemes())
				this.servicePackageData = event.getThemes();
			},
			'liiteri-ui.UISizeChangedEvent': function(event) {
			    var me = this;
			    me.getView().resize();
			}
        },

        _enableTile: function () {
            var layerPresent = this._isLayerPresent(),
                tile = this.plugins['Oskari.userinterface.Tile'];
            if (layerPresent && tile) {
                tile.enable();
            }
        },

        isLayerVisible: function () {
            var ret,
                layer = this.sandbox.findMapLayerFromSelectedMapLayers(this.conf.defaultLayerId);
            ret = layer !== null && layer !== undefined;
            return ret;
        },

        _isLayerPresent: function () {
            var service = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
            if (this.conf && this.conf.defaultLayerId) {
                var layer = service.findMapLayer(this.conf.defaultLayerId);
                return (layer !== null && layer !== undefined && layer.isLayerOfType('STATS'));
            }
            var layers = service.getLayersOfType('STATS');
            if (layers && layers.length > 0) {
                this.conf.defaultLayerId = layers[0].getId();
                return true;
            }
            return false;
        },

        /**
         * Returns the user indicators service.
         *
         * @method getUserIndicatorsService
         * @return {Oskari.statistics.bundle.statsgrid.UserIndicatorsService}
         */
        getUserIndicatorsService: function () {
            return this.userIndicatorsService;
        },

        /**
         * @method addUserIndicator
         * @param {Object} indicator
         */
        addUserIndicator: function (indicator) {
            var me = this,
                view = me.getView(),
                state = me.getState(),
                s = me.getSandbox();

            state.indicators = state.indicators || [];
            state.indicators.push(indicator);
            if (!view.isVisible) {
                view.prepareMode(true, null, true);
            }

            if (view.isVisible) {
                // AH-1110 ugly hack, we have to wait until ManageStatsPlugin has initialized
                // If we set the state as below and then prepareMode(true), slickgrid breaks with no visible error
                window.setTimeout(
                    function () {
                        me.gridPlugin.changeGridRegion(indicator.category);
                        me.gridPlugin.addIndicatorDataToGrid(
                            null,
                            indicator.id,
                            indicator.gender,
                            indicator.year,
                            indicator.data,
                            indicator.meta
                        );
                        me.gridPlugin.addIndicatorMeta(indicator);
                        s.postRequestByName(
                            'userinterface.UpdateExtensionRequest',
                            [me, 'attach']
                        );
                    }, 1000
                );
            } else {
                // show the view.
                state.layerId = indicator.layerId || state.layerId;
                state.regionCategory = indicator.category;
                me.setState(state);
            }
        },

        /**
         * Sets the map state to one specified in the parameter. State is bundle specific, check the
         * bundle documentation for details.
         *
         * @method setState
         * @param {Object} state bundle state as JSON
         * @param {Boolean} ignoreLocation true to NOT set map location based on state
         */
        setState: function (state, ignoreLocation) {
            this.state = jQuery.extend({}, {
                indicators: [],
                layerId: null
            }, state);

            // We need to notify the grid of the current state
            // so it can load the right indicators.

            //this.visualizationPlugin.setState(this.state);
            this.gridPlugin.setState(this.state);
            this.classifyPlugin.setState(this.state);
            // Reset the classify plugin
            this.classifyPlugin.resetUI();

            if (state.isActive) {
                var view = this.getView(),
                    layerId = this.state.layerId,
                    layer = null;

                if (layerId !== null && layerId !== undefined) {
                    layer = this.sandbox.getService('Oskari.mapframework.service.MapLayerService').findMapLayer(layerId);
                }
                // view._layer isn't set if we call this without a layer...
                view.prepareMode(true, layer, false);
            }
        },

        getState: function () {
            return this.state;
        },

        /**
         * Get state parameters.
         * Returns string with statsgrid state. State value keys are before the '-' separator and
         * the indiators are after the '-' separator. The indicators are further separated by ',' and
         * both state values and indicator values are separated by '+'.
         *
         * @method getStateParameters
         * @return {String} statsgrid state
         */
        getStateParameters: function () {
            var me = this,
                view = me.getView(),
                state = me.state;

            // If there's no view or it's not visible, nothing to do here!
            if (!view || !view.isVisible) {
                return null;
            }
            // If the state is null or an empty object, nothing to do here!
            if (!state || jQuery.isEmptyObject(state)) {
                return null;
            }

            var i = null,
                ilen = null,
                ilast = null,
                statsgridState = 'statsgrid=',
                valueSeparator = '+',
                indicatorSeparator = ',',
                stateValues = null,
                indicatorValues = null,
                colorsValues = null,
                colors = state.colors || {},
                keys = [
                    'layerId',
                    'currentColumn',
                    'methodId',
                    'numberOfClasses',
                    'classificationMode',
                    'manualBreaksInput',
                    'allowClassification'
                ],
                colorKeys = ['set', 'index', 'flipped'],
                indicators = state.indicators || [],
                value;
            // Note! keys needs to be handled in the backend as well.
            // Therefore the key order is important as well as actual values.
            // 'classificationMode' can be an empty string but it must be the
            // fifth value.
            // 'manualBreaksInput' can be an empty string but it must be the
            // sixth value.
            for (i = 0, ilen = keys.length, ilast = ilen - 1; i < ilen; i += 1) {
                value = state[keys[i]];
                if (value !== null && value !== undefined) {
                    // skip undefined and null
                    stateValues += value;
                }
                if (i !== ilast) {
                    stateValues += valueSeparator;
                }
            }

            // handle indicators separately
            for (i = 0, ilen = indicators.length, ilast = ilen - 1; i < ilen; i += 1) {
                if (indicators[i].id === null || indicators[i].id === undefined) {
                    indicators[i].id = indicators[i].indicator;
                }
                indicatorValues += indicators[i].id;
                indicatorValues += valueSeparator;
                indicatorValues += indicators[i].year;
                indicatorValues += valueSeparator;
                indicatorValues += indicators[i].gender;
                if (i !== ilast) {
                    indicatorValues += indicatorSeparator;
                }
            }

            // handle colors separately
            var colorArr = [],
                cKey;

            colors.flipped = colors.flipped === true;
            for (i = 0, ilen = colorKeys.length; i < ilen; i += 1) {
                cKey = colorKeys[i];
                if (colors.hasOwnProperty(cKey) && colors[cKey] !== null && colors[cKey] !== undefined) {
                    colorArr.push(colors[cKey]);
                }
            }
            if (colorArr.length === 3) {
                colorsValues = colorArr.join(',');
            }

            var ret = null;
            if (stateValues && indicatorValues) {
                ret = statsgridState + stateValues + '-' + indicatorValues + '-';
                if (colorsValues) {
                    ret += colorsValues;
                }
                // Should the mode be open or not
                ret += (view && view.isVisible) ? '-1' : '-0';
            }

            return ret;
        },

        getView: function () {
            return this.plugins['Oskari.userinterface.View'];
        },

        /**
         * Gets the instance sandbox.
         *
         * @method getSandbox
         * @return {Object} return the sandbox associated with this instance
         */
        getSandbox: function () {
            return this.sandbox;
        },

        /**
         * Returns the open indicators of the instance's grid plugin.
         *
         * @method getGridIndicators
         * @return {Object/null} returns the open indicators of the grid plugin, or null if no grid plugin
         */
        getGridIndicators: function () {
            return (this.gridPlugin ? this.gridPlugin.indicatorsMeta : null);
        },
        changeMode: function (mode) {
            var me = this;
            var locale = me.getLocalization();
            var requests = [];
            var ix;
            if (mode == 'twoway') {
                me.gridPlugin.changeMode(mode);
                requests.push(me.sandbox.getRequestBuilder('liiteri-ui.UIUpdateTileRequest')(locale.tile.standardStats, 'unselect'));
                requests.push(me.sandbox.getRequestBuilder('liiteri-ui.UIUpdateTileRequest')(locale.tile.twoWayStats, 'select'));
                for (ix in requests)
                    me.sandbox.request(me, requests[ix]);
            } else if (mode == 'all') {
                me.gridPlugin.changeMode(mode);
                requests.push(me.sandbox.getRequestBuilder('liiteri-ui.UIUpdateTileRequest')(locale.tile.twoWayStats, 'unselect'));
                requests.push(me.sandbox.getRequestBuilder('liiteri-ui.UIUpdateTileRequest')(locale.tile.standardStats, 'select'));
                for (ix in requests)
                    me.sandbox.request(me, requests[ix]);
            } else if (mode == 'servicePackage') {
                me.gridPlugin.changeMode(mode);
                requests.push(me.sandbox.getRequestBuilder('liiteri-ui.UIUpdateTileRequest')(locale.tile.twoWayStats, 'unselect'));
                requests.push(me.sandbox.getRequestBuilder('liiteri-ui.UIUpdateTileRequest')(locale.tile.standardStats, 'select'));
                for (ix in requests)
                    me.sandbox.request(me, requests[ix]);
            }
             
        },
        /**
         * Creates parameters for printout bundle and sends an event to it.
         * Params include the BBOX and the image url of the layer with current
         * visualization parameters.
         *
         * @method _createPrintParams
         * @private
         * @param {Object} layer
         */
        _createPrintParams: function (layer, indicatorData) {
            if (!layer) {
                return;
            }

            var oLayers = this.mapModule.getOLMapLayers(layer.getId());
            if (!oLayers) {
                return;
            }
            var data = {},
                geoJsonData = {},
                retainEvent,
                eventBuilder;

            data[layer.getId()] = [];
            geoJsonData = null;
            $.each(oLayers, function (key, oLayer) {
                if (oLayer.visibility == true) {
                    if (oLayer.getURL) {
                        var tile = {
                            // The max extent of the layer
                            bbox: oLayer.maxExtent.toArray(),
                            // URL of the image with current viewport
                            // bounds and all the original parameters
                            url: oLayer.getURL(oLayer.maxExtent),
                            indicator: indicatorData,
                        };
                        data[layer.getId()].push(tile);
                    }
                    //Feature layers moved to StatsLayerPlugin
                }
                if (oLayer.visibility == false && !oLayer.getURL) {
                    geoJsonData = {};
                    geoJsonData.id = oLayer.name;
                }
            });                       

            // If the event is already defined, just update the data.
            if (this.printEvent) {
                retainEvent = true;
                this.printEvent.setLayer(layer);
                this.printEvent.setTileData(data);
                this.printEvent.setGeoJsonData(geoJsonData);
            } else {
                // Otherwise create the event with the data.
                retainEvent = false;
                eventBuilder = this.sandbox.getEventBuilder('Printout.PrintableContentEvent');
                if (eventBuilder) {
                    this.printEvent = eventBuilder(this.getName(), layer, data, geoJsonData);
                }
            }

            if (this.printEvent) {
                this.sandbox.notifyAll(this.printEvent, retainEvent);
            }
        },

        /**
         * Saves params to the state and sends them to the print service as well.
         *
         * @method _afterStatsVisualizationChangeEvent
         * @private
         * @param {Object} event
         */
        _afterStatsVisualizationChangeEvent: function (event) {
            var me = this,
                params = event.getParams(),
                layer = event.getLayer();

            // Saving state
            me.state.methodId = params.methodId;
            me.state.numberOfClasses = params.numberOfClasses;
            me.state.manualBreaksInput = params.manualBreaksInput;
            me.state.colors = params.colors;
            me.state.classificationMode = params.classificationMode;
            // Send data to printout bundle
            me._createPrintParams(layer, params.indicatorData);
        },

        /**
         * Exits the stats mode after the stats layer gets removed.
         *
         * @method _afterMapLayerRemoveEvent
         * @private
         * @param {Object} event
         */
        _afterMapLayerRemoveEvent: function (event) {
            var layer = event.getMapLayer(),
                layerId = layer.getId(),
                view = this.getView();

            // Exit the mode
            if (view._layer && (layerId === view._layer.getId())) {
                view.prepareMode(false);
            }
        }
    }, {
        extend: ['Oskari.userinterface.extension.DefaultExtension']
    }
);
