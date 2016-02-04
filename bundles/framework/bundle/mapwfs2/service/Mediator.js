/**
 * @class Oskari.mapframework.bundle.mapwfs2.service.Mediator
 *
 * Handles Connection's IO
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapwfs2.service.Mediator',
    /**
     * @static @method create called automatically on construction
     *
     * @param {Object} config
     * @param {Object} plugin
     *
     */
    function (config, plugin) {
        this.config = config;
        this.plugin = plugin;
        this.connection = this.plugin.getConnection();
        this.cometd = this.connection.get();
        this.layerProperties = {};

        this.rootURL = location.protocol + '//' +
            this.config.hostname + this.config.port +
            this.config.contextPath;

        this.session = {
            session: jQuery.cookie('JSESSIONID') || '',
            route: jQuery.cookie('ROUTEID') || ''
        };

        this._previousTimer = null;
        this._featureUpdateFrequence = 200;
    }, {

        /**
         * @method getSessionID
         */
        getSessionID: function () {
            return this.session.session;
        },

        /**
         * @method getRootURL
         */
        getRootURL: function () {
            return this.rootURL;
        },

        /**
         * @method subscribe
         *
         * Subscribes client channels
         */
        subscribe: function () {
            var self = this,
                c;

            var channels = {
                '/wfs/properties': function () {
                    self.getWFSProperties.apply(self, arguments);
                },
                '/wfs/feature': function () {
                    self.getWFSFeature.apply(self, arguments);
                },
                '/wfs/featureGeometries': function () {
                    self.getWFSFeatureGeometries.apply(self, arguments);
                },
                '/wfs/mapClick': function () {
                    self.getWFSMapClick.apply(self, arguments);
                },
                '/wfs/filter': function () {
                    self.getWFSFilter.apply(self, arguments);
                },
                '/wfs/propertyfilter': function () {
                    self.getWFSFilter.apply(self, arguments);
                },
                '/wfs/image': function () {
                    self.getWFSImage.apply(self, arguments);
                },
                '/wfs/reset': function () {
                    self.resetWFS.apply(self, arguments);
                },
                '/wfs/defaultStyle': function () {
                    self.defaultStyle.apply(self, arguments);
                },
                '/wfs/status': function () {
                    self.status.apply(self, arguments);
                }
            };

            for (c in channels) {
                if (channels.hasOwnProperty(c)) {
                    this.cometd.subscribe(c, channels[c]);
                }
            }
        },

        /**
         * @method startup
         * @param {Object} session
         *
         * Sends init information to the backend
         */
        startup: function (session) {
            var self = this;
            if (session) { // use objects session if not defined as parameter
                this.session = session;
            }

            // update session and route
            this.session.session = jQuery.cookie('JSESSIONID') || '';
            this.session.route = jQuery.cookie('ROUTEID') || '';

            var layers = this.plugin.getSandbox().findAllSelectedMapLayers(), // get array of AbstractLayer (WFS|WMS..)
                initLayers = {},
                i;

            for (i = 0; i < layers.length; i += 1) {
                if (layers[i].hasFeatureData()) {
                    initLayers[layers[i].getId() + ''] = {
                        styleName: layers[i].getCurrentStyle().getName()
                    };
                }
            }

            var srs = this.plugin.getSandbox().getMap().getSrsName(),
                bbox = this.plugin.getSandbox().getMap().getExtent(),
                zoom = this.plugin.getSandbox().getMap().getZoom(),
                mapScales = this.plugin.getMapModule().getMapScales(),
                grid = this.plugin.getGrid();

            if (grid === null || grid === undefined) {
                grid = {};
            }

            var tileSize = this.plugin.getTileSize();

            if (tileSize === null || tileSize === undefined) {
                tileSize = {};
            }

            this.cometd.publish('/service/wfs/init', {
                session: this.session.session,
                route: this.session.route,
                language: Oskari.getLang(),
                browser: this.session.browser,
                browserVersion: this.session.browserVersion,
                location: {
                    srs: srs,
                    bbox: [bbox.left, bbox.bottom, bbox.right, bbox.top],
                    zoom: zoom
                },
                grid: grid,
                tileSize: tileSize,
                mapSize: {
                    width: self.plugin.getSandbox().getMap().getWidth(),
                    height: self.plugin.getSandbox().getMap().getHeight()
                },
                mapScales: mapScales,
                layers: initLayers
            });
        }
    });

// receive from backend

Oskari.clazz.category('Oskari.mapframework.bundle.mapwfs2.service.Mediator', 'getters', {
    /**
     * @method getWFSProperties
     * @param {Object} data
     *
     * Creates WFSPropertiesEvent
     */
    getWFSProperties: function (data) {
        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(data.data.layerId),
            self = this;

        if (layer.getLayerType() !== 'analysis') {
            var oldFields = layer.getFields(),
                oldLocales = layer.getLocales();

            if (oldFields.length > 0 && !this.plugin.isArrayEqual(data.data.fields, oldFields) && !this.plugin.isArrayEqual(data.data.locales, oldLocales)) {
                this.plugin.mapMoveHandler();
            }

            layer.setFields(data.data.fields);
            layer.setLocales(data.data.locales);

        }

        if (this._propertyTimer) {
            clearTimeout(this._propertyTimer);
            this._propertyTimer = null;
        }
        this._propertyTimer = setTimeout(function () {
            var event = self.plugin.getSandbox().getEventBuilder('WFSPropertiesEvent')(layer);
            self.plugin.getSandbox().notifyAll(event);
        }, this._featureUpdateFrequence);
    },

    /**
     * @method getWFSFeature
     * @param {Object} data
     *
     * Creates WFSFeatureEvent
     */
    getWFSFeature: function (data) {
        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(data.data.layerId),
            self = this;

        if (data.data.feature !== 'empty' && data.data.feature !== 'max') {
            layer.setActiveFeature(data.data.feature);
        }

        if (this._featureTimer) {
            clearTimeout(this._featureTimer);
            this._featureTimer = null;
        }
        this._featureTimer = setTimeout(function () {
            var event = self.plugin.getSandbox().getEventBuilder('WFSFeatureEvent')(
                layer,
                data.data.feature
            );
            self.plugin.getSandbox().notifyAll(event);
        }, this._featureUpdateFrequence);
    },

    /**
     * @method getWFSMapClick
     * @param {Object} data
     *
     * Collects every layer's responses - one layer's features per response and calls plugin's showInfoBox
     * Creates WFSFeaturesSelectedEvent
     */
    getWFSMapClick: function (data) {
        var sandbox = this.plugin.getSandbox(),
            me = this,
            layer = sandbox.findMapLayerFromSelectedMapLayers(data.data.layerId),
            keepPrevious = data.data.keepPrevious,
            featureIds = [],
            i;
		var featureSelected = false;

        if (data.data.features !== 'empty') {
            layer.setSelectedFeatures([]);
            // empty selected
            for (i = 0; i < data.data.features.length; i += 1) {
			
				if($.inArray(data.data.features[i][0], layer.getClickedFeatureIds()) === -1) {
					featureIds.push(data.data.features[i][0]);
					featureSelected = true;
				} else if (keepPrevious) {
					//remove clicked feature Id from layer.getClickedFeatureIds()
					for (var j = 0; j < layer.getClickedFeatureIds().length; j++) {
						var selectedFeatureId = layer.getClickedFeatureIds()[j];
						if (selectedFeatureId === data.data.features[i][0]) {
							layer.getClickedFeatureIds().splice(j, 1);
						}
					}
					
				}
            }
        }

        if (keepPrevious) {
            // No duplicates
            featureIds = me.filterDuplicates(layer.getClickedFeatureIds(), featureIds);
            if(featureIds.length < 1) return;
            layer.setClickedFeatureIds(layer.getClickedFeatureIds().concat(featureIds));
        } else {
            layer.setClickedFeatureIds(featureIds);
        }
		
		var event = sandbox.getEventBuilder("WFSFeaturesSelectedEvent")(featureIds, layer, keepPrevious);
		sandbox.notifyAll(event);

		if (featureSelected) {
			data.data.lonlat = this.lonlat;
			var infoEvent = sandbox.getEventBuilder('GetInfoResultEvent')(data.data);
			sandbox.notifyAll(infoEvent);
		}
    },
    /**
     * @method getWFSFeatureGeometries
     * @param {Object} data
     *
     * get highlighted fea geometries
     * Creates WFSFeatureGeometriesSelectedEvent
     */
    getWFSFeatureGeometries: function (data) {
        var sandbox = this.plugin.getSandbox();
        var layer = sandbox.findMapLayerFromSelectedMapLayers(data.data.layerId);
        var keepPrevious = data.data.keepPrevious;


        if (keepPrevious) {
            if (data.data.geometries) layer.addClickedGeometries(data.data.geometries);
        } else {
            if (data.data.geometries) layer.setClickedGeometries(data.data.geometries);
        }

        var event = sandbox.getEventBuilder("WFSFeatureGeometriesEvent")(layer, keepPrevious);
        sandbox.notifyAll(event);

    },
    /**
     * @method getWFSFeatureGeometries
     * @param {Object} data
     *
     * get highlighted feature geometries
     * Creates WFSFeatureGeometriesSelectedEvent
     */
    getWFSFeatureGeometries: function (data) {
        var sandbox = this.plugin.getSandbox(),
            layer = sandbox.findMapLayerFromSelectedMapLayers(data.data.layerId),
            keepPrevious = data.data.keepPrevious;

        if (keepPrevious) {
            if (data.data.geometries) {
                layer.addClickedGeometries(data.data.geometries);
            }
        } else {
            if (data.data.geometries) {
                layer.setClickedGeometries(data.data.geometries);
            }
        }

        var event = sandbox.getEventBuilder('WFSFeatureGeometriesEvent')(layer, keepPrevious);
        sandbox.notifyAll(event);

    },

    /**
     * @method getWFSFilter
     * @param {Object} data
     *
     * Handles one layer's features per response
     * Creates WFSFeaturesSelectedEvent
     */
    getWFSFilter: function (data) {
        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(data.data.layerId),
            featureIds = [],
            i;

        if (data.data.features !== 'empty') {
            layer.setClickedFeatureIds([]);
            for (i = 0; i < data.data.features.length; i += 1) {
                featureIds.push(data.data.features[i][0]);
            }
        }

        if (data.data.features !== 'empty') {
            layer.setSelectedFeatures(data.data.features);
        } else {
            layer.setSelectedFeatures([]);
        }

        var event = this.plugin.getSandbox().getEventBuilder('WFSFeaturesSelectedEvent')(featureIds, layer, false);
        this.plugin.getSandbox().notifyAll(event);
    },

    /**
     * @method getWFSImage
     * @param {Object} data
     *
     * Creates WFSImageEvent
     */
    getWFSImage: function (data) {
        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(
                data.data.layerId
            ),
            imageUrl = '';

        try {
            if (typeof data.data.data !== 'undefined') {
                imageUrl = 'data:image/png;base64,' + data.data.data;
            } else {
                imageUrl = this.rootURL + data.data.url + '&session=' + this.session.session;
            }
        } catch (error) {
            this.plugin.getSandbox().printDebug(error);
        }
        var layerType = data.data.type.toLowerCase(), // "highlight" | "normal"
            boundaryTile = data.data.boundaryTile,
            keepPrevious = data.data.keepPrevious,
            size = {
                width: data.data.width,
                height: data.data.height
            };

        // send as an event forward to WFSPlugin (draws)
        var event = this.plugin.getSandbox().getEventBuilder('WFSImageEvent')(
            layer,
            imageUrl,
            data.data.bbox,
            size,
            layerType,
            boundaryTile,
            keepPrevious
        );

        this.plugin.getSandbox().notifyAll(event);

        if (layerType === 'normal') {
            this.plugin.setPrintTile(
                layer,
                data.data.bbox,
                this.rootURL +
                data.data.url +
                '&session=' +
                this.session.session
            );

            var printoutEvent = this.plugin.getSandbox().getEventBuilder(
                    'Printout.PrintableContentEvent'
                ),
                evt;

            if (printoutEvent) {
                evt = printoutEvent(
                    this.plugin.getName(),
                    layer,
                    this.plugin.getPrintTilesForLayer(layer.getId()),
                    null
                );
                this.plugin.getSandbox().notifyAll(evt);
            }
        }
    },

    /**
     * @method resetWFS
     * @param {Object} data
     */
    resetWFS: function (data) {
        this.startup(null);
    },
    status: function (data) {
        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(data.data.layerId);
        var event = this.plugin.getSandbox().getEventBuilder("WFSLoadingFinishedEvent")(layer);
        this.plugin.getSandbox().notifyAll(event);
    },
    defaultStyle: function (data) {        
        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(data.data.layerId);

        if (data.data.style && !layer.getCustomStyle()) {
            var style = data.data.style;
            var customStyle = this._mapFromStyle(data.data.layerId, style);
//            console.log('Setting to');
//            console.log(customStyle);
            layer.setCustomStyle(customStyle);
        }                
    },
    _mapFromStyle: function (id, style) {
        var result = {};
        if (style.type == 'simple') {
            result.layerId = id;
            result.type = style.type;
            result.values = this._mapSymbol(style);
        } else if (style.type == 'uniqueValue') {
            result.layerId = id;
            result.type = style.type;
            result.field = style.field;
            result.values = [];
            for (var group in style.uniqueValuesInfo) {
                if (!style.uniqueValuesInfo.hasOwnProperty(group))
                    continue;
                var valueItem = {};
                valueItem.group = group;
                valueItem.symbol = this._mapFromSymbol(style.uniqueValuesInfo[group]);
                result.values.push(valueItem);
            }
        } else if (style.type == 'group') {
            result.layerId = id;
            result.type = style.type;
            result.values = [];
            for (var subStyle in style.subStyles) {
                if (!style.subStyles.hasOwnProperty(subStyle))
                    continue;
                var valueItem = {};
                valueItem.group = subStyle;
                valueItem.symbol = this._mapFromSymbol(style.subStyles[subStyle]);
                result.values.push(valueItem);
            }
        }

        return result;
    },
    _mapFromSymbol: function (symbolStyle) {
        return {
            area : {
                fillColor: this._mapFromColor(symbolStyle.fillColor),
                fillStyle: symbolStyle.fillPattern,
                lineColor: this._mapFromColor(symbolStyle.borderColor),
                lineCorner: symbolStyle.borderLinejoin,
                lineStyle: symbolStyle.borderDasharray,
                lineWidth: symbolStyle.borderWidth,
            },
            line : {
                cap: symbolStyle.strokeLinecap,
                color: this._mapFromColor(symbolStyle.strokeColor),
                corner: symbolStyle.strokeLinejoin,
                style: symbolStyle.strokeDasharray,
                width: symbolStyle.strokeWidth,
            },
            dot : {
                color: this._mapFromColor(symbolStyle.dotColor),
                shape: symbolStyle.dotShape,
                size: symbolStyle.dotSize,
            }
        };
    },
    _mapFromColor: function(color) {
        if (color.charAt(0) == '#')
            color = color.substr(1);
        if (color.length > 6)
            color = color.substr(0, 6);

        return color;
    },
});

// send to backend

Oskari.clazz.category(
    'Oskari.mapframework.bundle.mapwfs2.service.Mediator',
    'setters', {
        /**
         * @method addMapLayer
         * @param {Number} id
         * @param {String} style
         *
         * sends message to /service/wfs/addMapLayer
         */
        addMapLayer: function (id, style) {
            if (this.connection.isConnected()) {
                this.cometd.publish('/service/wfs/addMapLayer', {
                    'layerId': id,
                    'styleName': style
                });
            }
        },

        /**
         * @method removeMapLayer
         * @param {Number} id
         *
         * sends message to /service/wfs/removeMapLayer
         */
        removeMapLayer: function (id) {
            if (this.connection.isConnected()) {
                this.cometd.publish('/service/wfs/removeMapLayer', {
                    layerId: id
                });
            }
        },

        /**
         * @method highlightMapLayerFeatures
         * @param {Number} id
         * @param {String[]} featureIds
         * @param {Boolean} keepPrevious
         * @param {Boolean} geomRequest  response geometries, if true
         *
         * sends message to /service/wfs/highlightFeatures
         */
        highlightMapLayerFeatures: function (id, featureIds, keepPrevious, geomRequest) {
            if (this.connection.isConnected()) {
                this.cometd.publish('/service/wfs/highlightFeatures', {
                    layerId: id,
                    featureIds: featureIds,
                    keepPrevious: keepPrevious,
                    geomRequest: geomRequest
                });
            }
        },

        /**
         * @method setLocation
         * @param {Number} layerId
         * @param {String} srs
         * @param {Number[]} bbox
         * @param {Number} zoom
         * @param {Object} grid
         * @param {Object} tiles
         *
         * sends message to /service/wfs/setLocation
         */
        setLocation: function (layerId, srs, bbox, zoom, grid, tiles) {
            if (this.connection.isConnected()) {
                this.cometd.publish('/service/wfs/setLocation', {
                    layerId: layerId,
                    srs: srs,
                    bbox: bbox,
                    zoom: zoom,
                    grid: grid,
                    tiles: tiles
                });
            }
        },

        /**
         * @method setMapSize
         * @param {Number} width
         * @param {Number} height
         *
         * sends message to /service/wfs/setMapSize
         */
        setMapSize: function (width, height) {
            if (this.connection.isConnected()) {
                this.cometd.publish('/service/wfs/setMapSize', {
                    width: width,
                    height: height
                });
            }
        },

        /**
         * @method setMapLayerStyle
         * @param {Number} id
         * @param {String} style
         *
         * sends message to /service/wfs/setMapLayerStyle
         */
        setMapLayerStyle: function (id, style) {
            if (this.connection.isConnected()) {
                this.cometd.publish('/service/wfs/setMapLayerStyle', {
                    layerId: id,
                    styleName: style
                });
            }
        },

    /**
     * @method setMapLayerStyle
     * @param {Number} id
     * @param {Object} style
     *
     * sends message to /service/wfs/setMapLayerCustomStyle
     */
    setMapLayerCustomStyle: function (id, style) {
        if (this.connection.isConnected()) {

            var mappedStyle = this._mapToStyle(id, style);
            //console.log('Style sent to transport module');
            //console.log(mappedStyle);
            this.cometd.publish('/service/wfs/setMapLayerCustomStyle', mappedStyle);
        }
    },
    _mapToStyle: function (id, style) {
        var result = {};
        var i, uvItem, valueItem;

        if (style.type == 'simple') {
            result.layerId = id;
            result.type = style.type;
            result.symbol = this._mapToSymbol(style.values[0].symbol);
        } else if ((style.type == 'uniqueValue' || style.type == 'group') && style.isDefaultValue) {
            result.layerId = id;
            result.type = 'simple';
            result.symbol = this._mapToSymbol(style.defaultValue.symbol);
        } else if (style.type == 'uniqueValue') {
            result.layerId = id;
            result.type = style.type;
            result.field = style.field;
            result.uniqueValueInfos = [];
            for (i = 0; i < style.values.length; i++) {
                valueItem = style.values[i];
                uvItem = {
                    'symbol': this._mapToSymbol(valueItem.symbol),
                    'value': valueItem.group,
                    };
                result.uniqueValueInfos.push(uvItem);
            }
        } else if (style.type == 'group') {
            result.layerId = id;
            result.type = style.type;
            result.subStyles = [];
            for (i = 0; i < style.values.length; i++) {
                valueItem = style.values[i];
                uvItem = {
                    'symbol': this._mapToSymbol(valueItem.symbol),
                    'value': valueItem.group,
                };
                result.subStyles.push(uvItem);
            }
        }

        return result;
    },
    _mapToSymbol: function(symbolStyle) {
        return {
            "fill_color": symbolStyle.area.fillColor, // check somewhere that first char is # - _prefixColorForServer @ MyPlacesWFSTStore.js
            "fill_pattern": symbolStyle.area.fillStyle,
            "border_color": symbolStyle.area.lineColor, // check somewhere that first char is # - _prefixColorForServer @ MyPlacesWFSTStore.js
            "border_linejoin": symbolStyle.area.lineCorner,
            "border_dasharray": symbolStyle.area.lineStyle,
            "border_width": symbolStyle.area.lineWidth,

            }
            return a3;
        }


    }
);
