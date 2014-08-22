/**
 * @class Oskari.mapframework.mapmodule.MarkersPlugin
 * Provides marker functionality for the map.
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.MarkersPlugin',

    /**
     * @method create called automatically on construction
     * @static
     */
    function (conf, state) {
        var me = this;
        me.conf = conf;
        me.state = state;
        me.mapModule = null;
        me.pluginName = null;
        me.dotForm = null;
        me._markers = [];
        me._sandbox = null;
        me._map = null;
        me._svg = false;
        me._defaultIconUrl = '/Oskari/resources/framework/bundle/mapmodule-plugin/images/marker.png';
        me._defaultIconUrlSize = 32;
        me._prevIconUrl = '';
        me._preSVGIconUrl = 'data:image/svg+xml;base64,';
        me._font = {
            name: 'dot-markers',
            baseIndex: 57344
        };
        me._defaultData = {
            x: 0,
            y: 0,
            color: 'ffde00',
            msg : '',
            shape: 2,
            size: 1
        };
        me._strokeStyle = {
            'stroke-width': 1,
            'stroke': '#b4b4b4'
        };
        me._localization = null;
        me.buttonGroup = 'selectiontools';
        me.buttons = null;
        me.dialog = null;
        me._buttonsAdded = false;
    }, {
        /** @static @property __name plugin name */
        __name: 'MarkersPlugin',

        /**
         * @method getName
         * Returns the plugin name
         * @return {String} plugin name
         */
        getName: function () {
            return this.pluginName;
        },

        /**
         * @method getMapModule
         * Return the map module
         * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map module
         */
        getMapModule: function () {
            return this.mapModule;
        },

        /**
         * @method setMapModule
         * Sets the map module
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            if (mapModule) {
                this.pluginName = mapModule.getName() + this.__name;
            }
        },

        /**
         * @method hasUI
         * @return {Boolean} true
         * This plugin has an UI so always returns true
         */
        hasUI: function () {
            return true;
        },
        /**
         * @method init
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {
            var me = this;
            this.requestHandlers = {
                addMarkerHandler: Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.AddMarkerRequestHandler', sandbox, me),
                removeMarkersHandler: Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.RemoveMarkersRequestHandler', sandbox, me)
            };
            return null;
        },

        /**
         * @method register
         * Interface method for the plugin protocol
         */
        register: function () {
            this.getMapModule().setLayerPlugin('markers', this);
        },
        /**
         * @method unregister
         * Interface method for the plugin protocol
         */
        unregister: function () {
            this.getMapModule().setLayerPlugin('markers', null);
        },

        /**
         * @method startPlugin
         * Interface method for the plugin protocol.
         * Creates the base marker layer.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            var me = this,
                p;
            this._sandbox = sandbox;

            this._map = this.getMapModule().getMap();
            this._createMapMarkerLayer();

            sandbox.register(this);
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
            }
            this._sandbox.addRequestHandler('MapModulePlugin.AddMarkerRequest', me.requestHandlers.addMarkerHandler);
            this._sandbox.addRequestHandler('MapModulePlugin.RemoveMarkersRequest', me.requestHandlers.removeMarkersHandler);

            var loc = this.getLocalization();
            this.dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');


            this.buttons = {
                'add': {
                    iconCls: 'marker-share',
                    tooltip: loc.buttons.add,
                    sticky: true,
                    callback: function () {
                        me.enableGfi(false);
                        me._map.events.register('click', me, me._showForm);
                        var diaLoc = loc.dialog,
                            controlButtons = [],
                            clearBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                            cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.CancelButton');

                        clearBtn.setTitle(loc.buttons.clear);
                        clearBtn.setHandler(function () {
                            me.removeMarkers();
                            me.stopMarkerAdd();
                            me.enableGfi(true);
                        });
                        controlButtons.push(clearBtn);
                        cancelBtn.setHandler(function () {
                            me.stopMarkerAdd();
                            me.enableGfi(true);
                        });
                        cancelBtn.setPrimary(true);
                        controlButtons.push(cancelBtn);

                        me.dialog.show(diaLoc.title, diaLoc.message, controlButtons);
                        me.mapModule.getMapEl().addClass('cursor-crosshair');
                        me.dialog.moveTo('#toolbar div.toolrow[tbgroup=default-selectiontools]', 'bottom');
                    }
                }
                /*,
                'clear': {
                    iconCls: 'selection-remove',
                    tooltip: loc.buttons.clear,
                    sticky: true,
                    callback: function () {
                        me.removeMarkers();
                    }
                }*/
            };

            // Is SVG supported?
            this._svg = document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1');

            // Register marker tools
            this._registerTools();

            // Creates markers on the map
            this.setState(this.state);
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
            sandbox.removeRequestHandler('MapModulePlugin.RemoveMarkersRequest', this.requestHandlers.removeMarkersHandler);
            sandbox.removeRequestHandler('MapModulePlugin.AddMarkerRequest', this.requestHandlers.addMarkerHandler);
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
            'AfterHideMapMarkerEvent': function (event) {
                this.afterHideMapMarkerEvent(event);
            },
            'Toolbar.ToolbarLoadedEvent': function (event) {
                this._registerTools();
            },
            'SearchClearedEvent': function (event) {
                this.removeMarkers();
            },
            'AfterRearrangeSelectedMapLayerEvent': function (event) {
                this.raiseMarkerLayer();
            }
        },

        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        },

        /**
         * Creates a marker layer
         * @private
         */
        _createMapMarkerLayer: function () {
            var markerLayer = new OpenLayers.Layer.Vector('Markers');
            this._map.addLayer(markerLayer);
            this.raiseMarkerLayer(markerLayer);
        },

        /**
         *
         * @returns {Function}
         */
        addMapLayerToMap: function () {
            var me = this;
            return function () {
                me.raiseMarkerLayer();
            };
        },

        /***********************************************************
         * Handle HideMapMarkerEvent
         *
         * @param {Object}
         *            event
         */
        afterHideMapMarkerEvent: function (event) {
            var markerLayer = this._map.getLayersByName('Markers');
            if (markerLayer !== null && markerLayer !== undefined && markerLayer[0] !== null && markerLayer[0] !== undefined) {
                markerLayer[0].setVisibility(false);
            }
        },

        /**
         * Removes all markers from the layer
         */
        removeMarkers: function (noEvent) {
            console.log("removeMarkers");
            var me = this,
                sandbox = me.getSandbox(),
                markerLayers = me._map.getLayersByName('Markers');
            if (markerLayers !== null && markerLayers !== undefined && markerLayers[0] !== null && markerLayers[0] !== undefined) {
                markerLayers[0].removeAllFeatures();
            }
            me._markers.length = 0;

            if (!noEvent) {
                var removeEvent = sandbox.getEventBuilder('AfterRemoveMarkersEvent')();
                sandbox.notifyAll(removeEvent);
            }
        },

        /**
         * Gets marker bounds in the map
         * @returns {*}
         */
        getMapMarkerBounds: function () {
            var markerLayer = this._map.getLayersByName('Markers');
            if (markerLayer  && markerLayer[0]) {
                return markerLayer[0].getDataExtent();
            }
        },

        /**
         * Shows a configuration form for new marker visualization
         * @param e
         * @private
         */
        _showForm: function (e) {
            var me = this;
            me.stopMarkerAdd();
            var lonlat = me._map.getLonLatFromPixel(e.xy),
                loc = me.getLocalization().form;
            me.dotForm = Oskari.clazz.create('Oskari.userinterface.component.visualization-form.DotForm', me, loc, me._defaultData);
            var dialog = me.dotForm.getDialog();
            if (dialog) {
                dialog.close(true);
            }
            me.dotForm.showForm(jQuery('div.selection-line')[0], {
                messageEnabled: true
            }, 'right');

            me.dotForm.setSaveHandler(function () {
                var values = me.dotForm.getValues(),
                    reqBuilder = me._sandbox.getRequestBuilder('MapModulePlugin.AddMarkerRequest');
                if (reqBuilder) {
                    var data = {
                        x: lonlat.lon,
                        y: lonlat.lat,
                        msg: values.message,
                        color: values.color,
                        shape: values.shape,
                        size: values.size
                    };
                    var request = reqBuilder(data);
                    me._sandbox.request(me.getName(), request);
                }
                me.dotForm.getDialog().close(true);
                me.enableGfi(true);
            });

            me.dotForm.setCancelHandler(function () {
                me.dotForm.getDialog().close();
                me.enableGfi(true);
            });
        },

        /**
         * Stops the marker location selector
         */
        stopMarkerAdd: function () {
            var me = this;
            me._map.events.unregister('click', me, me._showForm);
            if (me.dialog) {
                me.mapModule.getMapEl().removeClass('cursor-crosshair');
                me.dialog.close(true);
            }
            jQuery('div.tool.marker-share.selected').removeClass('selected'); // Todo: more elegant way?
        },

        /**
         * Adds an array of markers to the map
         * @param markers
         */
        addMapMarkers: function (markers) {
            var i;
            for (i = 0; i < markers.length; i += 1) {
                this.addMapMarker(markers[i], null, null, true);
            }

        },

        /**
         * Adds a marker to the map
         * @param markerData
         * @param events
         */
        addMapMarker: function (markerData, id, events, noEvent) {
            var me = this,
                size,
                i;

            // Combine default values with given values
            var data = jQuery.extend(true, me._defaultData, markerData);

            // Coordinates are needed
            if ((typeof markerData.x === 'undefined') || (typeof markerData.y === 'undefined')) {
                me._sandbox.printWarn('Undefined coordinate in', markerData, ' combined data is', data);
                return;
            }

            // Image data already available
            var iconSrc = null;
            if (me._svg) {
                if ((typeof data.iconUrl !== 'undefined') && (data.iconUrl !== null)) {
                    iconSrc = data.iconUrl;
                    if (jQuery.isNumeric(markerData.size)) {
                        size = data.size;
                    } else {
                        size = me._defaultIconUrlSize;
                    }
                } else {
                    // Construct image
                    iconSrc = this.constructImage(data);
                    size = this._getSizeInPixels(data.size);
                }
            } else {
                iconSrc = me._defaultIconUrl;
                size = this._getSizeInPixels(data.size);
            }

            var markerLayers = this._map.getLayersByName('Markers'),
                point = new OpenLayers.Geometry.Point(data.x, data.y),
                newMarker = new OpenLayers.Feature.Vector(point, null, {
                    externalGraphic: iconSrc,
                    graphicWidth: size,
                    graphicHeight: size,
                    fillOpacity: 1,
                    label: decodeURIComponent(data.msg),
                    fontColor: '$000000',
                    fontSize: '16px',
                    fontFamily: 'Arial',
                    fontWeight: 'bold',

                    labelAlign: 'lm',
                    labelXOffset: 8 + 2 * data.size,
                    labelYOffset: 8,
                    labelOutlineColor: 'white',
                    labelOutlineWidth: 1
                });

            if (events) {
                for (i in events) {
                    if (events.hasOwnProperty(i)) {
                        newMarker.events.register(i, newMarker, events[i]);
                    }
                }
            }

            this._markers.push(data);
            markerLayers[0].addFeatures([newMarker]);
            this.raiseMarkerLayer(markerLayers[0]);

            // Save generated icon
            me._prevIconUrl = iconSrc;

            // Update the state
            me.updateState();

            if (!noEvent) {
                var addEvent = me._sandbox.getEventBuilder('AfterAddMarkerEvent')(data, id, events);
                me._sandbox.notifyAll(addEvent);
            }
        },

        /**
         * Constructs a marker image dynamically
         * @param marker
         * @returns {*}
         */
        constructImage: function (marker) {
            var me = this,
                size,
                color,
                iconSrc = me._defaultIconUrl;

            if (typeof Raphael !== 'undefined') {
                // Handling the size parameter
                if (typeof marker.size !== 'number') {
                    marker.size = parseInt(marker.size, 10);
                }
                size = marker.size;
                if (isNaN(size)) {
                    return;
                }
                size = this._getSizeInPixels(size);
                var paper = Raphael(0, 0, size, size);
                paper.clear();

                // Test lines for pixel level accuracy
                // var lines = paper.path("M0 0L"+size+" "+size+" M0 "+size+" L"+size+" 0");
                // lines.attr("stroke", "#000");

                // Construct marker parameters
                var font = paper.getFont(me._font.name),
                    charIndex = me.getFont().baseIndex;
                if (typeof marker.shape === 'number') {
                    charIndex += marker.shape;
                } else {
                    var parsedShape = parseInt(marker.shape, 10);
                    if (!isNaN(parsedShape)) {
                        charIndex += parsedShape;
                    } else {
                        charIndex += me._defaultData.shape;
                    }
                }

                if (typeof marker.color === 'string') {
                    color = '#' + marker.color;
                } else {
                    color = me._defaultData.color;
                }

                // Create image
                paper.print(0, 55 * size / 100, String.fromCharCode(charIndex), font, size).attr({
                    'fill': color,
                    'stroke_width': me._strokeStyle.stroke_width,
                    'stroke': me._strokeStyle.stroke
                });

                // Base64 encoding for cross-browser compatibility
                iconSrc = me._preSVGIconUrl + jQuery.base64.encode(paper.toSVG());
                // Remove paper (unfortunately it's a visible SVG element in document.body)
                paper.remove();
            }
            return iconSrc;
        },

        /**
         * Converts from abstract marker size to real pixel size
         *
         * @param size Abstract size
         * @returns {number} Size in pixels
         * @private
         */
        _getSizeInPixels: function (size) {
            return 40 + 10 * size;
        },

        /**
         * Raises the marker layer above the other layers
         *
         * @param markerLayer
         */
        raiseMarkerLayer: function (markerLayer) {
            var layer = null;
            if (typeof markerLayer !== 'undefined') {
                layer = markerLayer;
            } else {
                layer = this._map.getLayersByName('Markers')[0];
            }
            var index = Math.max(this._map.Z_INDEX_BASE.Feature, layer.getZIndex()) + 1;
            layer.setZIndex(index);
            layer.setVisibility(true);
        },

        /**
         * Requests the tools to be added to the toolbar.
         *
         * @method registerTool
         */
        _registerTools: function () {
            var me = this;
            // Already registered?
            if (me._buttonsAdded) {
                return;
            }
            var sandbox = this.getSandbox(),
                reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
            if (typeof reqBuilder === 'undefined') {
                return;
            }
            var request,
                tool;
            for (tool in me.buttons) {
                if (me.buttons.hasOwnProperty(tool)) {
                    if (reqBuilder) {
                        request = reqBuilder(tool, me.buttonGroup, me.buttons[tool]);
                        sandbox.request(me.getName(), request);
                    }
                }
            }
            me._buttonsAdded = true;
        },

        /**
         * Converts hexadecimal color values to decimal values (255,255,255)
         * Green: hexToRgb("#0033ff").g
         * http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
         *
         * @method hex
         * hexadecimal color value e.g. '#00ff99'
         */
        hexToRgb: function (hex) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        /**
         * Convert rgb values to hexadecimal color values
         *
         * @method rgbToHex
         * @param {String} rgb decimal color values e.g. 'rgb(255,0,0)'
         */
        rgbToHex: function (rgb) {
            if (rgb.charAt(0) === '#') {
                return rgb.substring(1);
            }
            var parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/),
                j;
            delete (parts[0]);
            for (j = 1; j <= 3; ++j) {
                parts[j] = parseInt(parts[j], 10).toString(16);
                if (parts[j].length === 1) {
                    parts[j] = '0' + parts[j];
                }
            }
            return parts.join('');
        },

        /**
         * @method enableGfi
         * Enables/disables the gfi functionality
         * @param {Boolean} blnEnable true to enable, false to disable
         */
        enableGfi: function (blnEnable) {
            var sandbox = this._sandbox,
                evtB = sandbox.getEventBuilder(
                    'DrawFilterPlugin.SelectedDrawingEvent'
                ),
                gfiReqBuilder = sandbox.getRequestBuilder(
                    'MapModulePlugin.GetFeatureInfoActivationRequest'
                ),
                hiReqBuilder = sandbox.getRequestBuilder(
                    'WfsLayerPlugin.ActivateHighlightRequest'
                );

            // notify components to reset any saved "selected place" data
            if (evtB) {
                sandbox.notifyAll(evtB());
            }

            // enable or disable gfi requests
            if (gfiReqBuilder) {
                sandbox.request(this.pluginName, gfiReqBuilder(blnEnable));
            }

            // enable or disable wfs highlight
            if (hiReqBuilder) {
                sandbox.request(this.pluginName, hiReqBuilder(blnEnable));
            }

            gfiReqBuilder = this._sandbox.getRequestBuilder('MapModulePlugin.GetFeatureInfoActivationRequest');
            if (gfiReqBuilder) {
                this._sandbox.request(this, gfiReqBuilder(blnEnable));
            }
        },

        /**
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for current language.
         * If key-parameter is not given, returns the whole localization data.
         *
         * @param {String} key (optional) if given, returns the value for key
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function (key) {
            if (!this._localization) {
                this._localization = this.getMapModule().getLocalization('plugin', true)[this.__name];
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },

        /**
         * @method getSandbox
         *
         * Returns sandbox for binding to Oskari app functionality
         */
        getSandbox: function () {
            return this._sandbox;
        },

        /**
         * @method setState
         * Set the bundle state
         * @param {Object} state bundle state as JSON
         */
        setState: function (state) {
            this.state = state;
            this.removeMarkers(true); // remove markers without sending an AfterRemoveMarkersEvent
            if (this.state && this.state.markers) {
                this.addMapMarkers(this.state.markers, null);
            }
        },
        /**
         * Returns markers parameter for map link if any markers on map
         * @return {String} link parameters
         */
        getStateParameters: function () {
            var state = this.getState();
            if (!state || !state.markers) {
                return '';
            }

            var FIELD_SEPARATOR = '|',
                MARKER_SEPARATOR = '___',
                markerParams = [];
            _.each(state.markers, function (marker) {
                var str = marker.shape + FIELD_SEPARATOR +
                    marker.size + FIELD_SEPARATOR +
                    marker.color + FIELD_SEPARATOR +
                    marker.x + '_' + marker.y + FIELD_SEPARATOR +
                    encodeURIComponent(marker.msg);
                markerParams.push(str);
            });
            if (markerParams.length > 0) {
                //markers=shape|size|hexcolor|x_y|User input text___shape|size|hexcolor|x_y|input 2";
                return '&markers=' + markerParams.join(MARKER_SEPARATOR);
            }
            return '';
        },
        /**
         * @method getState
         * Returns the bundle state
         * @return {Object} bundle state as JSON
         */
        getState: function () {
            this.updateState();
            return jQuery.extend({}, this.state);
        },

        /**
         *  Updates the bundle state.
         */
        updateState: function () {
            var me = this,
                i;
            if ((typeof me.state === 'undefined') || (me.state === null)) {
                me.state = {};
            }
            me.state.markers = [];
            for (i = 0; i < me._markers.length; i++) {
                me.state.markers.push(me._markers[i]);
            }
        },

        /**
         * @method getFont
         * Returns a marker shape font
         * @return {Object} font
         */
        getFont: function () {
            return this._font;
        },

        /**
         * @method getIcon
         * Return a marker icon
         * @return {Object} icon
         */
        getIcon: function () {
            return this._prevIconUrl;
        },
        /**
         * @method getOLMapLayers
         * Returns references to OpenLayers layer objects for requested layer or null if layer is not added to map.
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @return null
         */
        getOLMapLayers: function (layer) {
            return null;
        }

    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin']
    });
