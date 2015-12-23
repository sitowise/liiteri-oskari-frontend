/**
 * @class Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin
 */
Oskari.clazz.define("Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin",
    /**
 * @method create called automatically on construction
 * @static

 * @param {Object} config
 */

    function (config) {
        this.config = config || {};

        this._sandbox = null;
        this._map = null;

        this.mapModule = null;
        this.pluginName = null;

        // connection and communication
        this._connection = null;
        this._io = null;

        // state
        this.tileSize = null;
        this.zoomLevel = null;
        this._isWFSOpen = 0;

        // printing
        this._printTiles = {};

        // wms layer handling
        this._tiles = {};
        this._tilesToUpdate = null;
        this._tileData = null;
        this._tileDataTemp = null;

        this.errorTriggers = {
            "connection_not_available": {
                limit: 1,
                count: 0
            },
            "connection_broken": {
                limit: 1,
                count: 0
            }
        };

        this.activeHighlightLayers = [];
    }, {
        __name: "WfsLayerPlugin",
        __layerPrefix: "wfs_layer_",
        __typeHighlight: "highlight",
        __typeNormal: "normal",

        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.pluginName;
        },

        /**
         * @method getMapModule
         * @return {Object} map module
         */
        getMapModule: function () {
            return this.mapModule;
        },

        /**
         * @method setMapModule
         * @param {Object} map module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            this.pluginName = mapModule.getName() + this.__name;
        },

        /**
         * @method init
         *
         * Initiliazes the connection to the CometD servlet and registers the domain model
         */
        init: function () {
            var sandboxName = (this.config ? this.config.sandbox : null) || "sandbox";
            var sandbox = Oskari.getSandbox(sandboxName);
            this._sandbox = sandbox;

            // service init
            if (this.config) {
                if (!this.config.hostname || this.config.hostname == "localhost") {
                    // convenience so the host isn't required
                    this.config.hostname = location.hostname;
                }
                if (!this.config.port) {
                    // convenience so the port isn't required
                    this.config.port = '' + location.port;
                    //this.config.port = '' + 2374;
                }
                if (this.config.port.length > 0) {
                    this.config.port = ":" + this.config.port;
                }
                if (!this.config.contextPath) {
                    // convenience so the contextPath isn't required
                    this.config.contextPath = '/transport';
                }
            }
            this._connection = Oskari.clazz.create("Oskari.mapframework.bundle.mapwfs2.service.Connection", this.config, this);
            this._io = Oskari.clazz.create("Oskari.mapframework.bundle.mapwfs2.service.Mediator", this.config, this);

            // register domain model
            var mapLayerService = sandbox.getService("Oskari.mapframework.service.MapLayerService");
            if (mapLayerService) {
                mapLayerService.registerLayerModel("wfslayer", "Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer");

                var layerModelBuilder = Oskari.clazz.create("Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder", sandbox);
                mapLayerService.registerLayerModelBuilder("wfslayer", layerModelBuilder);
            }

            // tiles to draw  - key: layerId + bbox
            this._tilesToUpdate = Oskari.clazz.create("Oskari.mapframework.bundle.mapwfs2.plugin.TileCache");
            // data for tiles - key: layerId + bbox
            this._tileData = Oskari.clazz.create("Oskari.mapframework.bundle.mapwfs2.plugin.TileCache");
            this._tileDataTemp = Oskari.clazz.create("Oskari.mapframework.bundle.mapwfs2.plugin.TileCache");
            this._visualizationForm = Oskari.clazz.create('Oskari.userinterface.component.GroupVisualizationForm', { groupMode: true });
        },

        /**
         * @method register
         *
         * Registers plugin into mapModule
         */
        register: function () {
            this.getMapModule().setLayerPlugin("wfslayer", this);
            this.getMapModule().setLayerPlugin('arcgislayer', this);
        },

        /**
         * @method unregister
         *
         * Removes registration of the plugin from mapModule
         */
        unregister: function () {
            this.getMapModule().setLayerPlugin("wfslayer", null);
            this.getMapModule().setLayerPlugin('arcgislayer', null);
        },

        /**
         * @method startPlugin
         *
         * Creates grid and registers event handlers
         */
        startPlugin: function (sandbox) {
            this._map = this.getMapModule().getMap();
            this.createTilesGrid();
            sandbox.register(this);
            var p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
            }

            this.requestHandlers = {
                showOwnStyleHandler: Oskari.clazz.create('Oskari.mapframework.bundle.mapwfs2.request.ShowOwnStyleRequestHandler', this),
				changeMapLayerOwnStyleRequestHandler: Oskari.clazz.create('Oskari.mapframework.bundle.mapwfs2.request.ChangeMapLayerOwnStyleRequestHandler', this)
            };

            sandbox.addRequestHandler('ShowOwnStyleRequest', this.requestHandlers.showOwnStyleHandler);
			sandbox.addRequestHandler('ChangeMapLayerOwnStyleRequest', this.requestHandlers.changeMapLayerOwnStyleRequestHandler);
        },

        /**
         * @method stopPlugin
         *
         * Removes event handlers from register
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
        },

        /*
         * @method start called from sandbox
         */
        start: function (sandbox) {},

        /**
         * @method stop called from sandbox
         *
         */
        stop: function (sandbox) {},

        /**
         * @method getSandbox
         * @return {Object} sandbox
         */
        getSandbox: function () {
            return this._sandbox;
        },

        /**
         * @method getConnection
         * @return {Object} connection
         */
        getConnection: function () {
            return this._connection;
        },

        /**
         * @method getIO
         * @return {Object} io
         */
        getIO: function () {
            return this._io;
        },

        /**
         * @method getVisualizationForm
         * @return {Object} io
         */
        getVisualizationForm: function () {
            return this._visualizationForm;
        },

        /**
         * @static
         * @property eventHandlers
         */
        eventHandlers: {
            /**
             * @method AfterMapMoveEvent
             * @param {Object} event
             */
            "AfterMapMoveEvent": function (event) {
                this.mapMoveHandler();
            },

            /**
             * @method AfterMapLayerAddEvent
             * @param {Object} event
             */
            "AfterMapLayerAddEvent": function (event) {
                this.mapLayerAddHandler(event);
            },

            /**
             * @method AfterMapLayerRemoveEvent
             * @param {Object} event
             */
            "AfterMapLayerRemoveEvent": function (event) {
                this.mapLayerRemoveHandler(event);
            },

            /**
             * @method WFSFeaturesSelectedEvent
             * @param {Object} event
             */
            "WFSFeaturesSelectedEvent": function (event) {
                this.featuresSelectedHandler(event);
            },

            /**
             * @method MapClickedEvent
             * @param {Object} event
             */
            "MapClickedEvent": function (event) {
                this.mapClickedHandler(event);
            },

            /**
             * @method AfterChangeMapLayerStyleEvent
             * @param {Object} event
             */
            "AfterChangeMapLayerStyleEvent": function (event) {
                this.changeMapLayerStyleHandler(event);
            },

            /**
             * @method MapLayerVisibilityChangedEvent
             * @param {Object} event
             */
            "MapLayerVisibilityChangedEvent": function (event) {
                this.mapLayerVisibilityChangedHandler(event);
            },

            /**
             * @method AfterChangeMapLayerOpacityEvent
             * @param {Object} event
             */
            "AfterChangeMapLayerOpacityEvent": function (event) {
                this.afterChangeMapLayerOpacityEvent(event);
            },


            /**
             * @method MapSizeChangedEvent
             * @param {Object} event
             */
            "MapSizeChangedEvent": function (event) {
                this.mapSizeChangedHandler(event);
            },

            /**
             * @method WFSSetFilter
             * @param {Object} event
             */
            "WFSSetFilter": function (event) {
                this.setFilterHandler(event);
            },
            "WFSLoadingFinishedEvent": function (event) {
                //FIXME: mapwfs2/transport Oskari module doesn't fire OpenLayers loadended event when
                //there are no features in bbox. To bypass it liiteri.emptyresult event is fired here.
                //It is used in OLLayerEventsControl
                var layerName = this.__layerPrefix + event.getLayer().getId() + "_normal";
                var layers = this._map.getLayersByName(layerName);
                if (layers != null && layers.length == 1) {
                    layers[0].events.triggerEvent("liiteri.loadingfinished");
                }
            },
            /**
             * @method WFSImageEvent
             * @param {Object} event
             */
            "WFSImageEvent": function (event) {
                this.drawImageTile(
                    event.getLayer(),
                    event.getImageUrl(),
                    event.getBBOX(),
                    event.getSize(),
                    event.getLayerType(),
                    event.isBoundaryTile(),
                    event.isKeepPrevious()
                );
            }
        },

        /**
         * @method onEvent
         * @param {Object} event
         * @return {Function} event handler
         */
        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        },
        fireError: function (layer) {
            var me = this;
            var layerName = me.__layerPrefix + layer.getId() + "_normal";
            var layers = me._map.getLayersByName(layerName);
            if (layers != null && layers.length == 1) {
                layers[0].events.triggerEvent("liiteri.error");
            }
        },
        _getCachedGridTiles: function (layers, grid) {
            var result = {};
            if (grid == null)
                return result;

            for (var i = 0; i < layers.length; ++i) {
                var layer = layers[i];
                var layerId = layer.getId();
                var cachedPrintTiles = this._getCachedPrintTiles(layerId, grid);

                if (cachedPrintTiles.length > 0)
                    result[layerId] = cachedPrintTiles;
            }

            return result;
        },
        /**
         * @method mapMoveHandler
         */
        mapMoveHandler: function () {
            var srs = this.getSandbox().getMap().getSrsName(),
                bbox = this.getSandbox().getMap().getExtent(),
                zoom = this.getSandbox().getMap().getZoom(),
                geomRequest = false,
                fids;            

            // clean tiles for printing
            // clean only tiles that are no cached       
//            console.log(new Date());
//            for (var id in this._printTiles) {
//                if (this._printTiles.hasOwnProperty(id))
//                    console.log(id + " " + this._printTiles[id].length);
//            }            

            // update cache
            this.refreshCaches();

            var layers = this.getSandbox().findAllSelectedMapLayers();

            // update location
            var grid = this.getGrid();

            this._printTiles = this._getCachedGridTiles(layers, grid);
            //this._printTiles = {};

            for (var i = 0; i < layers.length; ++i) {
                if (layers[i].hasFeatureData()) {
                    layers[i].setActiveFeatures([]); /// clean features lists
                    if (grid !== null && grid !== undefined) {
                        var layerId = layers[i].getId();
                        var tiles = this.getNonCachedGrid(layerId, grid);                        
                        this.getIO().setLocation(layerId, srs, [bbox.left, bbox.bottom, bbox.right, bbox.top], zoom, grid, tiles);
                        this._tilesLayer.redraw();
                    }
                }
            }

            // update zoomLevel and highlight pictures
            //highlighting of the feature should be refreshed after every map move (not only after changing zoom level), because some highlightings are not fully rendered when they are partly out of the map

            var zoomChange = this.zoomLevel != zoom;
            //if (this.zoomLevel != zoom) {
                this.zoomLevel = zoom;


                // TODO 472: if no connection or the layer is not registered, get highlight with URL
                for (var x = 0; x < this.activeHighlightLayers.length; ++x) {
                    if (this.getConnection().isLazy() && !this.getConnection().isConnected() || !this.getSandbox().findMapLayerFromSelectedMapLayers(this.activeHighlightLayers[x].getId())) {
                        srs = this.getSandbox().getMap().getSrsName();
                        bbox = this.getSandbox().getMap().getExtent();
                        zoom = this.getSandbox().getMap().getZoom();
                        fids = this.activeHighlightLayers[x].getClickedFeatureListIds();
                        this.removeHighlightImages(this.activeHighlightLayers[x]);
                        this.getHighlightImage(this.activeHighlightLayers[x], srs, [bbox.left, bbox.bottom, bbox.right, bbox.top], zoom, fids);
                    }
                }

                for (var j = 0; j < layers.length; ++j) {
                    if (layers[j].hasFeatureData()) {
                        fids = this.getAllFeatureIds(layers[j]);
                        this.removeHighlightImages(layers[j]);
                        if (fids.length > 0 || zoomChange)
                            this.getIO().highlightMapLayerFeatures(layers[j].getId(), fids, false, geomRequest);
                    }
                }
            //}
        },

        /**
         * @method mapLayerAddHandler
         */
        mapLayerAddHandler: function (event) {
            if (event.getMapLayer().hasFeatureData()) {
                if (this.getConnection().isLazy() && !this.getConnection().isConnected()) {
                    this.getConnection().connect();
                }

                this._isWFSOpen++;
                this.getConnection().updateLazyDisconnect(this.isWFSOpen());

                var styleName = null;
                if (event.getMapLayer().getCurrentStyle()) {
                    styleName = event.getMapLayer().getCurrentStyle().getName();
                }
                if (styleName === null || styleName === undefined || styleName === "") {
                    styleName = "default";
                }           

                this._addMapLayerToMap(event.getMapLayer(), this.__typeNormal); // add WMS layer

                // send together
                var self = this;
                this.getConnection().get().batch(function () {
                    self.getIO().addMapLayer(
                        event.getMapLayer().getId(),
                        styleName
                    );
                    self.mapMoveHandler(); // setLocation
                });
            }
        },

        /**
         * @method mapLayerRemoveHandler
         */
        mapLayerRemoveHandler: function (event) {
            var layer = event.getMapLayer();

            if (layer.hasFeatureData()) {
                this._isWFSOpen--;
                this.getConnection().updateLazyDisconnect(this.isWFSOpen());

                this.getIO().removeMapLayer(layer.getId()); // remove from transport
                this.removeMapLayerFromMap(layer); // remove from OL

                // clean tiles for printing
                this._printTiles[layer.getId()] = [];

                // delete possible error triggers
                delete this.errorTriggers["wfs_no_permissions_" + layer.getId()];
                delete this.errorTriggers["wfs_configuring_layer_failed_" + layer.getId()];
                delete this.errorTriggers["wfs_request_failed_" + layer.getId()];
                delete this.errorTriggers["features_parsing_failed_" + layer.getId()];
            }
        },

        /**
         * @method featuresSelectedHandler
         */
        featuresSelectedHandler: function (event) {
            if (event.getMapLayer().hasFeatureData()) {
                var layer = event.getMapLayer();
                var ids = layer.getClickedFeatureListIds();
                var tmpIds = event.getWfsFeatureIds();
                var geomRequest = true;
                
                if (!event.isKeepSelection()) {
                    layer.setClickedFeatureListIds(event.getWfsFeatureIds());
                } else {
                    var isFound = false;
                    for (var i = 0; i < tmpIds.length; ++i) {
                        isFound = false;
                        for (var j = 0; j < ids.length; ++j) {
                            if (tmpIds[i] == ids[j]) {
                                isFound = true;
                                continue;
                            }
                        }
                        if (!isFound) {
                            ids.push(tmpIds[i]);
                        }

                    }
                }

                // remove highlight image
                if (!event.isKeepSelection()) {
                    this.removeHighlightImages();
                }

//                // TODO 472: if no connection or the layer is not registered, get highlight with URl
//                if (this.getConnection().isLazy() && !this.getConnection().isConnected() || !this.getSandbox().findMapLayerFromSelectedMapLayers(layer.getId())) {
//                    var srs = this.getSandbox().getMap().getSrsName();
//                    var bbox = this.getSandbox().getMap().getExtent();
//                    var zoom = this.getSandbox().getMap().getZoom();
//                    layer.setClickedFeatureListIds(event.getWfsFeatureIds());
//                    this.getHighlightImage(layer, srs, [bbox.left, bbox.bottom, bbox.right, bbox.top], zoom, event.getWfsFeatureIds());
//                }

                this.getIO().highlightMapLayerFeatures(layer.getId(), event.getWfsFeatureIds(), event.isKeepSelection(), geomRequest);
            }
        },

        /**
         * @method mapClickedHandler
         */
        mapClickedHandler: function (event) {
            // don't process while moving
            if (this.getSandbox().getMap().isMoving()) {
                return;
            }
            var lonlat = event.getLonLat();
            var keepPrevious = this.getSandbox().isCtrlKeyDown();
            this.getIO().setMapClick(lonlat, keepPrevious);
        },

        /**
         * @method changeMapLayerStyleHandler
         */
        changeMapLayerStyleHandler: function (event) {
            if (event.getMapLayer().hasFeatureData()) {

                //update printTiles
                var layerId = event.getMapLayer().getId();
                var grid = this.getGrid();
                this._printTiles[layerId] = this._getCachedGridTiles([event.getMapLayer()], grid)[layerId];

                // render "normal" layer with new style
                var OLLayer = this.getOLMapLayer(event.getMapLayer(), this.__typeNormal);
                OLLayer.redraw();

                this.getIO().setMapLayerStyle(
                    event.getMapLayer().getId(),
                    event.getMapLayer().getCurrentStyle().getName()
                );
            }
        },

        /**
         * @method mapLayerVisibilityChangedHandler
         */
        mapLayerVisibilityChangedHandler: function (event) {
            if (event.getMapLayer().hasFeatureData()) {
                this.getIO().setMapLayerVisibility(
                    event.getMapLayer().getId(),
                    event.getMapLayer().isVisible()
                );
            }
        },

        /**
         * @method afterChangeMapLayerOpacityEvent
         * @param {Object} event
         */
        afterChangeMapLayerOpacityEvent: function (event) {
            var layer = event.getMapLayer();

            if (!layer.hasFeatureData()) {
                return;
            }
            var layers = this.getOLMapLayers(layer);
            for (var i = 0; i < layers.length; i++) {
                layers[i].setOpacity(layer.getOpacity() / 100);

            }
        },

        /**
         * @method mapSizeChangedHandler
         */
        mapSizeChangedHandler: function (event) {
            this.getIO().setMapSize(event.getWidth(), event.getHeight());

            // update tiles
            var srs = this.getSandbox().getMap().getSrsName();
            var bbox = this.getSandbox().getMap().getExtent();
            var zoom = this.getSandbox().getMap().getZoom();
            var grid = this.getGrid();

            // update cache
            this.refreshCaches();

            var layers = this.getSandbox().findAllSelectedMapLayers();
            for (var i = 0; i < layers.length; ++i) {
                if (layers[i].hasFeatureData()) {
                    layers[i].setActiveFeatures([]); /// clean features lists
                    if (grid !== null && grid !== undefined) {
                        var layerId = layers[i].getId();
                        var tiles = this.getNonCachedGrid(layerId, grid);
                        this.getIO().setLocation(layerId, srs, [bbox.left, bbox.bottom, bbox.right, bbox.top], zoom, grid, tiles);
                        this._tilesLayer.redraw();
                    }
                }
            }
        },

        /**
         * @method setFilterHandler
         */
        setFilterHandler: function (event) {
            /// clean selected features lists
            var layers = this.getSandbox().findAllSelectedMapLayers();
            for (var i = 0; i < layers.length; ++i) {
                if (layers[i].hasFeatureData()) {
                    layers[i].setSelectedFeatures([]);
                }
            }

            this.getIO().setFilter(event.getGeoJson());
        },

        /**
         * @method setCustomStyle
         */
        setCustomStyle: function (layerId, values) {
            // convert values to send (copy the values - don't edit the original)
            this.getIO().setMapLayerCustomStyle(layerId, values);
        },


        /**
         * @method clearConnectionErrorTriggers
         */
        clearConnectionErrorTriggers: function () {
            this.errorTriggers.connection_not_available = {
                limit: 1,
                count: 0
            };
            this.errorTriggers.connection_broken = {
                limit: 1,
                count: 0
            };
        },

        /**
         * @method preselectLayers
         */
        preselectLayers: function (layers) {
            _.each(layers, function (layer) {
                if (layer.hasFeatureData()) {
                    this.getSandbox().printDebug("[WfsLayerPlugin] preselecting " + layer.getId());
                }
            });
        },

        /**
         * @method removeHighlightImages
         *
         * Removes a tile from the Openlayers map
         *
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         *           WFS layer that we want to remove
         */
        removeHighlightImages: function (layer) {
            if (layer && !layer.hasFeatureData()) {
                return;
            }

            var layerPart = "(.*)";
            if (layer) {
                layerPart = layer.getId();
            }

            var layerName = new RegExp(this.__layerPrefix + layerPart + "_" + this.__typeHighlight);

            var removeLayers = this._map.getLayersByName(layerName);
            for (var i = 0; i < removeLayers.length; i++) {
                layerIndex = this._map.getLayerIndex(removeLayers[i]);
                removeLayers[i].destroy();
            }
        },

        /**
         * @method removeMapLayerFromMap
         * @param {Object} layer
         */
        removeMapLayerFromMap: function (layer) {
            var removeLayers = this.getOLMapLayers(layer);
            for (var i = 0; i < removeLayers.length; i++) {
                removeLayers[i].destroy();
            }
        },

        /**
         * @method getOLMapLayers
         * @param {Object} layer
         */
        getOLMapLayers: function (layer) {
            if (layer && !layer.hasFeatureData()) {
                return;
            }

            var layerPart = "";
            if (layer) {
                layerPart = layer.getId();
            }
            var wfsReqExp = new RegExp(this.__layerPrefix + layerPart + "_(.*)", "i"); // that's all folks
            return this._map.getLayersByName(wfsReqExp);
        },

        /**
         * @method getOLMapLayer
         * @param {Object} layer
         * @param {String} type
         */
        getOLMapLayer: function (layer, type) {
            if (!layer || !layer.hasFeatureData()) {
                return null;
            }

            var layerName = this.__layerPrefix + layer.getId() + "_" + type;
            var wfsReqExp = new RegExp(layerName);
            return this._map.getLayersByName(wfsReqExp)[0];
        },

        /**
         * @method drawImageTile
         *
         * Adds a tile to the Openlayers map
         *
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         *           WFS layer that we want to update
         * @param {String} imageUrl
         *           url that will be used to download the tile image
         * @param {OpenLayers.Bounds} imageBbox
         *           bounds for the tile
         * @param {Object} imageSize
         * @param {String} layerType
         *           postfix so we can identify the tile as highlight/normal
         * @param {Boolean} boundaryTile
         *           true if on the boundary and should be redrawn
         * @param {Boolean} keepPrevious
         *           true to not delete existing tile
         */
        drawImageTile: function (layer, imageUrl, imageBbox, imageSize, layerType, boundaryTile, keepPrevious) {
            var layerName = this.__layerPrefix + layer.getId() + "_" + layerType;
            var boundsObj = new OpenLayers.Bounds(imageBbox);

            /** Safety checks */
            if (!imageUrl || !layer || !boundsObj) {
                return;
            }

            var layerIndex = null;

            if (layerType == this.__typeHighlight) {
                var ols = new OpenLayers.Size(imageSize.width, imageSize.height);

                var layerScales = this.mapModule.calculateLayerScales(
                    layer.getMaxScale(),
                    layer.getMinScale()
                );

                var wfsMapImageLayer = new OpenLayers.Layer.Image(
                    layerName,
                    imageUrl,
                    boundsObj,
                    ols, {
                        scales: layerScales,
                        transparent: true,
                        format: "image/png",
                        isBaseLayer: false,
                        displayInLayerSwitcher: false,
                        visibility: true,
                        buffer: 0
                    }
                );

                wfsMapImageLayer.opacity = layer.getOpacity() / 100;
                this._map.addLayer(wfsMapImageLayer);
                wfsMapImageLayer.setVisibility(true);
                wfsMapImageLayer.redraw(true); // also for draw

                // if removed set to same index [but if wfsMapImageLayer created in add (sets just in draw - not needed then here)]
                if (layerIndex !== null && wfsMapImageLayer !== null) {
                    this._map.setLayerIndex(wfsMapImageLayer, layerIndex);
                }

                // highlight picture on top of normal layer images
                var normalLayerExp = new RegExp(this.__layerPrefix + layer.getId() + "_" + this.__typeNormal);
                var highlightLayerExp = new RegExp(this.__layerPrefix + layer.getId() + "_" + this.__typeHighlight);
                var normalLayer = this._map.getLayersByName(normalLayerExp);
                var highlightLayer = this._map.getLayersByName(highlightLayerExp);
                if (normalLayer.length > 0 && highlightLayer.length > 0) {
                    var normalLayerIndex = this._map.getLayerIndex(normalLayer[normalLayer.length - 1]);
                    this._map.setLayerIndex(highlightLayer[0], normalLayerIndex + 10);
                }
            } else { // "normal"
                var BBOX = boundsObj.toArray(false);
                var bboxKey = BBOX.join(",");

                var style = layer.getCurrentStyle().getName();
                var tileToUpdate = this._tilesToUpdate.mget(layer.getId(), "", bboxKey);

                // put the data in cache      
                if (!boundaryTile) { // normal case and cached
                    this._tileData.mput(layer.getId(), style, bboxKey, imageUrl);
                } else { // temp cached and redrawn if gotten better
                    var dataForTileTemp = this._tileDataTemp.mget(layer.getId(), style, bboxKey);
                    if (dataForTileTemp) {
                        return;
                    }
                    this._tileDataTemp.mput(layer.getId(), style, bboxKey, imageUrl);
                }

                if (tileToUpdate) {
                    tileToUpdate.draw(); // QUEUES updates! 
                }
            }
        },

        /**
         * @method _addMapLayerToMap
         *
         * @param {Object} layer
         * @param {String} layerType
         */
        _addMapLayerToMap: function (_layer, layerType) {
            if (!_layer.hasFeatureData()) return;

            var layerName = this.__layerPrefix + _layer.getId() + "_" + layerType,
                layerScales = this.getMapModule().calculateLayerScales(_layer.getMaxScale(), _layer.getMinScale()),
                key;

            // default params and options
            var defaultParams = {
                layers: "",
                transparent: true,
                id: _layer.getId(),
                styles: _layer.getCurrentStyle().getName(),
                format: "image/png"
            }, defaultOptions = {
                    layerId: _layer.getId(),
                    scales: layerScales,
                    isBaseLayer: false,
                    displayInLayerSwitcher: true,
                    visibility: true,
                    buffer: 0,
                    _plugin: this,

                    getURL: function (bounds, theTile) {
                        bounds = this.adjustBounds(bounds);

                        var BBOX = bounds.toArray(false);
                        var bboxKey = BBOX.join(",");

                        var layer = this._plugin.getSandbox().findMapLayerFromSelectedMapLayers(this.layerId);
                        var style = layer.getCurrentStyle().getName();
                        var dataForTile = this._plugin._tileData.mget(this.layerId, style, bboxKey);
                        if (dataForTile) {
                            this._plugin._tilesToUpdate.mdel(this.layerId, "", bboxKey); // remove from drawing
                        } else {
                            // temp cache
                            dataForTile = this._plugin._tileDataTemp.mget(this.layerId, style, bboxKey);

                            this._plugin._tilesToUpdate.mput(this.layerId, "", bboxKey, theTile); // put in drawing

                            // DEBUG image (red)
                            //dataForTile = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
                        }

                        return dataForTile;
                    },

                    addTile: function (bounds, position) {
                        var tileOpts = OpenLayers.Util.extend({}, this.tileOptions);
                        OpenLayers.Util.extend(tileOpts, {
                            setBounds: function (bounds) {
                                bounds = bounds.clone();
                                if (this.layer.map.baseLayer.wrapDateLine) {
                                    var worldExtent = this.layer.map.getMaxExtent(),
                                        tolerance = this.layer.map.getResolution();
                                    bounds = bounds.wrapDateLine(worldExtent, {
                                        leftTolerance: tolerance,
                                        rightTolerance: tolerance
                                    });
                                }
                                this.bounds = bounds;
                            },
                            renderTile: function () {
                                this.layer.div.appendChild(this.getTile());
                                if (this.layer.async) {
                                    // Asynchronous image requests call the asynchronous getURL method
                                    // on the layer to fetch an image that covers "this.bounds".
                                    var id = this.asyncRequestId = (this.asyncRequestId || 0) + 1;
                                    this.layer.getURLasync(this.bounds, function (url) {
                                        if (id == this.asyncRequestId) {
                                            this.url = url;
                                            this.initImage();
                                        }
                                    }, this);
                                } else {
                                    // synchronous image requests get the url immediately.
                                    this.url = this.layer.getURL(this.bounds, this);
                                    this.initImage();
                                }
                            }
                        });

                        var tile = new this.tileClass(this, position, bounds, null, this.tileSize, tileOpts);

                        this._plugin._tiles[tile.id] = tile;

                        var BBOX = bounds.toArray(false);
                        var bboxKey = BBOX.join(",");
                        var layer = this._plugin.getSandbox().findMapLayerFromSelectedMapLayers(this.layerId);
                        var style = layer.getCurrentStyle().getName();
                        this._plugin._tilesToUpdate.mput(this.layerId, "", bboxKey, tile);

                        tile.events.register("beforedraw", this, this.queueTileDraw);
                        return tile;
                    },

                    destroyTile: function (tile) {
                        this.removeTileMonitoringHooks(tile);
                        delete this._plugin._tiles[tile.id];

                        tile.destroy();
                    }
                }, layerParams = _layer.getParams(),
                layerOptions = _layer.getOptions();

            // override default params and options from layer
            for (key in layerParams) {
                defaultParams[key] = layerParams[key];
            }
            for (key in layerOptions) {
                defaultOptions[key] = layerOptions[key];
            }

            var openLayer = new OpenLayers.Layer.WMS(layerName, "", defaultParams, defaultOptions);
            openLayer.opacity = _layer.getOpacity() / 100;

            this._map.addLayer(openLayer);
        },

        // from tilesgridplugin

        /**
         * @method createTilesGrid
         *
         * Creates an invisible layer to support Grid operations
         * This manages sandbox Map's TileQueue
         *
         */
        createTilesGrid: function () {
            var tileQueue = Oskari.clazz.create("Oskari.mapframework.bundle.mapwfs2.domain.TileQueue");

            var strategy = Oskari.clazz.create("Oskari.mapframework.bundle.mapwfs2.plugin.QueuedTilesStrategy", {
                tileQueue: tileQueue
            });
            strategy.debugGridFeatures = false;
            this.tileQueue = tileQueue;
            this.tileStrategy = strategy;

            var styles = new OpenLayers.StyleMap({
                "default": new OpenLayers.Style({
                    pointRadius: 3,
                    strokeColor: "red",
                    strokeWidth: 2,
                    fillColor: "#800000"
                }),
                "tile": new OpenLayers.Style({
                    strokeColor: "#008080",
                    strokeWidth: 5,
                    fillColor: "#ffcc66",
                    fillOpacity: 0.5
                }),
                "select": new OpenLayers.Style({
                    fillColor: "#66ccff",
                    strokeColor: "#3399ff"
                })
            });

            this._tilesLayer = new OpenLayers.Layer.Vector(
                "Tiles Layer", {
                    strategies: [strategy],
                    styleMap: styles,
                    visibility: true
                });
            this._map.addLayer(this._tilesLayer);
            this._tilesLayer.setOpacity(0.3);
        },

        getTileSize: function () {
            var OLGrid = this.tileStrategy.getGrid().grid;
            this.tileSize = null;

            if (OLGrid) {
                this.tileSize = {};
                this.tileSize.width = OLGrid[0][0].size.w;
                this.tileSize.height = OLGrid[0][0].size.h;
            }

            return this.tileSize;
        },

        getGrid: function () {
            var grid = null;

            // get grid information out of tileStrategy
            this.tileStrategy.update();
            var OLGrid = this.tileStrategy.getGrid().grid;

            if (OLGrid) {
                grid = {
                    rows: OLGrid.length,
                    columns: OLGrid[0].length,
                    bounds: []
                };
                for (var iRow = 0, len = OLGrid.length; iRow < len; iRow++) {
                    var row = OLGrid[iRow];
                    for (var iCol = 0, clen = row.length; iCol < clen; iCol++) {
                        var tile = row[iCol];

                        // if failed grid
                        if (typeof tile.bounds.left === "undefined" ||
                            typeof tile.bounds.bottom === "undefined" ||
                            typeof tile.bounds.right === "undefined" ||
                            typeof tile.bounds.top === "undefined") {
                            return null;
                        }

                        // left, bottom, right, top
                        var bounds = [];
                        bounds[0] = tile.bounds.left;
                        bounds[1] = tile.bounds.bottom;
                        bounds[2] = tile.bounds.right;
                        bounds[3] = tile.bounds.top;
                        grid.bounds.push(bounds);
                    }
                }
            }
            return grid;
        },

        /*
         * @method getPrintTiles
         */
        getPrintTiles: function () {
            return this._printTiles;
        },
        getPrintTilesForLayer: function (layerId) {
            var result = {};
            result[layerId] = this._printTiles[layerId];
            return result;
        },

        /*
         * @method setPrintTile
         *
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         *           WFS layer that we want to update
         * @param {OpenLayers.Bounds} bbox
         * @param imageUrl
         */
        setPrintTile: function (layer, bbox, imageUrl) {
            if (typeof this._printTiles[layer.getId()] == "undefined") {
                this._printTiles[layer.getId()] = [];
            }
            this._printTiles[layer.getId()].push({
                "bbox": bbox,
                "url": imageUrl
            });
        },

        /*
         * @method refreshCaches
         */
        refreshCaches: function () {
            this._tileData.purgeOffset(4 * 60 * 1000);
            this._tileDataTemp.purgeOffset(4 * 60 * 1000);
        },
        _getCachedPrintTiles: function (layerId, grid) {
            var layer = this.getSandbox().findMapLayerFromSelectedMapLayers(layerId);
            var style = layer.getCurrentStyle().getName();
            var result = [];
            for (var i = 0; i < grid.bounds.length; i++) {
                var bboxKey = grid.bounds[i].join(",");
                var dataForTile = this._tileData.mget(layerId, style, bboxKey);
                if (dataForTile) {
                    result.push({
                        'bbox': grid.bounds[i],
                        'url' : dataForTile,
                    });
                }
            }
            return result;
        },


        /*
         * @method getNonCachedGrid
         *
         * @param grid
         */
        getNonCachedGrid: function (layerId, grid) {
            var layer = this.getSandbox().findMapLayerFromSelectedMapLayers(layerId);
            var style = layer.getCurrentStyle().getName();
            var result = [];
            for (var i = 0; i < grid.bounds.length; i++) {
                var bboxKey = grid.bounds[i].join(",");
                var dataForTile = this._tileData.mget(layerId, style, bboxKey);
                if (!dataForTile) {
                    result.push(grid.bounds[i]);
                }
            }
            return result;
        },

        /*
         * @method deleteTileCache
         *
         * @param layerId
         * @param styleName
         */
        deleteTileCache: function (layerId, styleName) {
            this._tileData.mdel(layerId, styleName);
            this._tileDataTemp.mdel(layerId, styleName);
        },

        /*
         * @method isWFSOpen
         */
        isWFSOpen: function () {
            if (this._isWFSOpen > 0)
                return true;
            return false;
        },

        /*
         * @method getLayerCount
         */
        getLayerCount: function () {
            return this._isWFSOpen;
        },

        /**
         * @method _isArrayEqual
         * @param {String[]} current
         * @param {String[]} old
         *
         * Checks if the arrays are equal
         */
        isArrayEqual: function (current, old) {
            if (old.length != current.length) { // same size?
                return false;
            }

            for (var i = 0; i < current.length; i++) {
                if (current[i] != old[i]) {
                    return false;
                }
            }

            return true;
        },

        /**
         * @method getLocalization
         * Convenience method to call from Tile and Flyout
         * Returns JSON presentation of bundles localization data for
         * current language. If key-parameter is not given, returns
         * the whole localization data.
         *
         * @param {String} key (optional) if given, returns the value for key
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function (key) {
            if (!this._localization) {
                this._localization = Oskari.getLocalization("MapWfs2");
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },

        /*
         * @method showErrorPopup
         *
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         *           WFS layer that we want to update
         * @param {OpenLayers.Bounds} bbox
         * @param imageUrl
         */
        showErrorPopup: function (message, layer, once) {
            if (once) {
                if (this.errorTriggers[message]) {
                    if (this.errorTriggers[message].count >= this.errorTriggers[message].limit) {
                        return;
                    }
                    this.errorTriggers[message].count++;
                } else {
                    if (this.errorTriggers[message + "_" + layer.getId()]) {
                        return;
                    } else {
                        this.errorTriggers[message + "_" + layer.getId()] = true;
                    }
                }
            }

            var dialog = Oskari.clazz.create("Oskari.userinterface.component.Popup");
            var popupLoc = this.getLocalization("error").title;
            var content = this.getLocalization("error")[message];
            if (layer) {
                content = content.replace(/\{layer\}/, layer.getName());
            }
            var okBtn = dialog.createCloseButton(this.getLocalization().button.close);

            okBtn.addClass("primary");
            dialog.addClass("error_handling");
            dialog.show(popupLoc, content, [okBtn]);
            dialog.fadeout(5000);
        },

        /**
         * @method getAllFeatureIds
         *
         * @param {Object} layer
         */
        getAllFeatureIds: function (layer) {
            var fids = layer.getClickedFeatureIds().slice(0);
            for (var k = 0; k < layer.getSelectedFeatures().length; ++k) {
                fids.push(layer.getSelectedFeatures()[k][0]);
            }
            return fids;
        },

        /**
         * @method getHighlightImage
         *
         * @param {Number} layerId
         * @param {String} srs
         * @param {Number[]} bbox
         * @param {Number} zoom
         * @param {String[]} featureIds
         *
         * sends message to /highlight*
         */
        getHighlightImage: function (layer, srs, bbox, zoom, featureIds) {

            // helper function for visibleFields
            var contains = function (a, obj) {
                for (var i = 0; i < a.length; i++) {
                    if (a[i] == obj)
                        return true;
                }
                return false;
            };

            if (!contains(this.activeHighlightLayers, layer)) {
                this.activeHighlightLayers.push(layer);
            }

            var imageSize = {
                width: this.getSandbox().getMap().getWidth(),
                height: this.getSandbox().getMap().getHeight()
            };

            var params = "?layerId=" + layer.getId() +
                "&session=" + this.getIO().getSessionID() +
                "&type=" + "highlight" +
                "&srs=" + srs +
                "&bbox=" + bbox.join(",") +
                "&zoom=" + zoom +
                "&featureIds=" + featureIds.join(",") +
                "&width=" + imageSize.width +
                "&height=" + imageSize.height;

            var imageUrl = this.getIO().getRootURL() + "/image" + params;

            // send as an event forward to WFSPlugin (draws)
            var event = this.getSandbox().getEventBuilder("WFSImageEvent")(layer, imageUrl, bbox, imageSize, "highlight", false, false);
            this.getSandbox().notifyAll(event);
        }

    }, {
        "protocol": ["Oskari.mapframework.module.Module",
            "Oskari.mapframework.ui.module.common.mapmodule.Plugin"
        ]
    });
