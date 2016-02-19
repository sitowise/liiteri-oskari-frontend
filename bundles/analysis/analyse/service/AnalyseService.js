/**
 * @class Oskari.analysis.bundle.analyse.AnalyseService
 * Methods for sending out analysis data to backend
 */
Oskari.clazz.define(
    'Oskari.analysis.bundle.analyse.service.AnalyseService',

    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function (instance) {
        this.instance = instance;
        this.sandbox = instance.sandbox;
        this.loc = instance.getLocalization('AnalyseView');
    }, {
        __name: 'Analyse.AnalyseService',
        __qname: 'Oskari.analysis.bundle.analyse.service.AnalyseService',

        getQName: function () {
            return this.__qname;
        },

        getName: function () {
            return this.__name;
        },

        /**
         * @public @method init
         * Initializes the service
         *
         *
         */
        init: function () {

        },

        /**
         * @public @method sendAnalyseData
         * Sends the data to backend for analysis.
         *
         * @param {Object} data the data to send
         * @param {Function} success the success callback
         * @param {Function} failure the failure callback
         *
         */
        sendAnalyseData: function (data, success, failure) {
            var url = this.sandbox.getAjaxUrl() + 'action_route=CreateAnalysisLayer';
            jQuery.ajax({
                type: 'POST',
                dataType: 'json',
                url: url,
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType('application/j-son;charset=UTF-8');
                    }
                },
                data: data,
                success: success,
                error: failure
            });
        },

        /**
         * @method getAnalyseLayers
         * Get analysis layers.
         *
         * @param {Function} success2 the success callback
         * @param {Function} failure the failure callback
         *
         */
        _getAnalysisLayers: function (mysuccess, failure) {
            var url = this.sandbox.getAjaxUrl() + 'action_route=GetAnalysisLayers';
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                url: url,
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType('application/j-son;charset=UTF-8');
                    }
                },
                success: mysuccess,
                error: failure,
                cache: false
            });
        },

        /**
         * @private @method _loadAnalyseLayers
         * Load analysis layers in start.
         *
         *
         */
        loadAnalyseLayers: function () {
            var me = this,
                sandbox = me.instance.getSandbox(),
                url = sandbox.getAjaxUrl(),
                loc = Oskari.getLocalization(me.instance.getName());

            // Request analyis layers via the backend
            me._getAnalysisLayers(
                // Success callback
                function (response) {
                    if (response) {
                        me._handleAnalysisLayersResponse(response);
                    }
                },
                // Error callback
                function (jqXHR, textStatus, errorThrown) {
                    me.instance.showMessage(me.loc.error.title, me.loc.error.loadLayersFailed);
                }
            );

        },

        /**
         * @private @method handleAnalysisLayersResponse
         * Put analysislayers to map and subsequently to be used in further analysis.
         *
         * @param {JSON} analyseJson analysislayers JSON returned by server.
         *
         */
        _handleAnalysisLayersResponse: function (analysislayersJson) {
            // TODO: some error checking perhaps?
            var me = this,
                sandbox = me.instance.getSandbox(),
                mapLayerService,
                mapLayer,
                requestBuilder,
                request,
                layerarr = analysislayersJson.analysislayers,
                i,
                analyseJson;

            this.analyseLayers = [];

            for (i in layerarr) {
                if (layerarr.hasOwnProperty(i)) {
                    analyseJson = layerarr[i];
                    this.analyseLayers.push(analyseJson);
                    // TODO: Handle WPS results when no FeatureCollection eg. aggregate
                    if (analyseJson.wpsLayerId + '' === '-1') {
                        // no analyse layer case  eg. aggregate wps function
                        //  this.instance.showMessage("Tulokset", analyseJson.result);
                    } else {
                        mapLayerService = this.instance.mapLayerService;
                        mapLayer = mapLayerService.createMapLayer(analyseJson);
						if (!mapLayerService.findMapLayer(mapLayer.getId())) {
							// Add the layer to the map layer service
							mapLayerService.addLayer(mapLayer, true);
						}

                    }
                }
            }

            if (layerarr && layerarr.length > 0) {
                // notify components of added layer if not suppressed
                var evt = sandbox.getEventBuilder('MapLayerEvent')(null, 'add');
                sandbox.notifyAll(evt); // add the analysis layers programmatically since normal link processing
            }
        },

        /**
         * @private @method _returnAnalysisOfTypeAggregate
         *
         * @param {Function} cb Callback
         *
         */
        _returnAnalysisOfTypeAggregate: function (cb) {
            this.analyselayers = [];
            this._getAnalysisLayers(function (response) {
                this.analyselayers = response.analysislayers;
                var analysisOfTypeAggregate = _.where(
                    this.analyselayers, {
                        method: 'aggregate'
                    }
                );
                cb(analysisOfTypeAggregate);
            });
        },

        /**
         * @private @method _getWFSLayerPropertiesAndTypes
         * Get WFS layer properties and property types
         *
         * @param {Function} success2 the success callback
         * @param {Function} failure the failure callback
         *
         */
        _getWFSLayerPropertiesAndTypes: function (layer_id, success2, failure) {
            var url = this.sandbox.getAjaxUrl() + 'action_route=GetWFSDescribeFeature&layer_id=' + layer_id;
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                url: url,
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType('application/j-son;charset=UTF-8');
                    }
                },
                success: success2,
                error: failure
            });
        },

        /**
         * @private @method loadWFSLayerPropertiesAndTypes
         * Load analysis layers in start.
         *
         *
         */
        loadWFSLayerPropertiesAndTypes: function (layer_id) {
            var me = this,
                sandbox = me.instance.getSandbox(),
                url = sandbox.getAjaxUrl(),
                loc = Oskari.getLocalization(me.instance.getName());

            // Request analyis layers via the backend
            me._getWFSLayerPropertiesAndTypes(layer_id,
                // Success callback
                function (response) {
                    if (response) {
                        me._handleWFSLayerPropertiesAndTypesResponse(response);
                    }
                },
                // Error callback
                function (jqXHR, textStatus, errorThrown) {
                    me.instance.showMessage(me.loc.error.title, me.loc.error.loadLayerTypesFailed);
                });

        },

        /**
         * @private @method _handleWFSLayerPropertiesAndTypesResponse
         * Put property types to WFS and analysis layer
         *
         * @param {JSON} propertyJson properties and property types of WFS layer JSON returned by server.
         *
         */
        _handleWFSLayerPropertiesAndTypesResponse: function (propertyJson) {
            var me = this,
                layer = null;

            if (propertyJson.layer_id) {
                layer = me.instance.getSandbox().findMapLayerFromSelectedMapLayers(propertyJson.layer_id);
            }
            if (layer) {
                layer.setPropertyTypes(propertyJson.propertyTypes);
                if(propertyJson.wps_params) {
                    layer.setWpsLayerParams(propertyJson.wps_params);
                }
            }
        }
    }, {
        protocol: ['Oskari.mapframework.service.Service']
    }
);
