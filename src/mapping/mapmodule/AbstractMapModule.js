/**
 * @class Oskari.mapping.mapmodule.AbstractMapModule
 *
 * Provides map functionality/Wraps actual map implementation (Openlayers).
 * Currently hardcoded at 13 zoomlevels (0-12) and SRS projection code 'EPSG:3067'.
 * There are plans to make these more configurable in the future.
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapmodule
 */
Oskari.AbstractFunc = function () {
    var name = arguments[0];
    return function () {
        throw 'AbstractFuncCalled: ' + name;
    };
};

Oskari.clazz.define(
    'Oskari.mapping.mapmodule.AbstractMapModule',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String} id
     *      Unigue ID for this map
     * @param {String} imageUrl
     *      base url for marker etc images
     * @param {Array} map options, example data:
     *  {
     *      resolutions : [2000, 1000, 500, 200, 100, 50, 20, 10, 4, 2, 1, 0.5, 0.25],
     *      maxExtent : {
     *          left : 0,
     *          bottom : 10000000,
     *          right : 10000000,
     *          top : 0
     *      },
     srsName : "EPSG:3067"
     *  }
     */
    function (id, imageUrl, options) {
        var me = this,
            key;

        me._id = id;
        me._imageUrl = imageUrl;
        me._options = {
            resolutions : [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5],
            srsName : 'EPSG:3067',
            units : 'm'
        };
        if (options) {
            for (key in options) {
                if (options.hasOwnProperty(key)) {
                    me._options[key] = options[key];
                }
            }
        }

        me._controls = {};
        me._layerPlugins = {};

        /** @static @property {String} _projectionCode SRS projection code, defaults
         * to 'EPSG:3067' */
        me._projection = null;
        me._projectionCode = me._options.srsName;
        me._supportedFormats = {};

        me._map = null;

        // _mapScales are calculated in _calculateScalesImpl based on resolutions in options
        me._mapScales = [];
        me._mapResolutions = me._options.resolutions;
        // arr
        me._maxExtent = me._options.maxExtent || {};
        // props: left,bottom,right, top
        if(me._maxExtent.left) {
            me._extent = [
                me._maxExtent.left,
                me._maxExtent.bottom,
                me._maxExtent.right,
                me._maxExtent.top
            ];
        }
        else {
            me._extent = [];   
        }
        // arr

        me._sandbox = null;
        me._stealth = false;

        me._pluginInstances = {};

        // mapcontrols assumes this to be present before init or start
        me._localization = null;

        /* array of { id: <id>, name: <name>, layer: layer, impl: layerImpl } */
        me.layerDefs = [];
        me.layerDefsById = {};
    }, {
        /**
         * @method getImageUrl
         * Returns a base url for plugins to show. Can be set in constructor and
         * defaults to "/Oskari/bundles" if not set.
         * @return {String}
         */
        getImageUrl: function () {
            if (!this._imageUrl) {
                // default if not set
                return '/Oskari/bundles';
            }
            return '/Oskari/bundles';
            // TODO Oskari2 change, fixed temporary to always return /Oskari/bundles -folder. Remove this when configs are updated.
            return this._imageUrl;
        },
        /**
         * @method getControls
         * Returns map controls - storage for controls by id. See getMapControl for getting single control.
         * @return {Object} contains control names as keys and control
         *      objects as values
         */
        getControls: function () {
            return this._controls;
        },
        /**
         * @method getMapControl
         * Returns a single map control that matches the given id/name.
         *  See getControls for getting all controls.
         * @param {String} id name of the map control
         * @return {OpenLayers.Control} control matching the id or undefined if not found
         */
        getMapControl: function (id) {
            return this._controls[id];
        },
        /**
         * @method addMapControl
         * Adds a control to the map and saves a reference so the control
         * can be accessed with getControls/getMapControl.
         * @param {String} id control id/name
         * @param {OpenLayers.Control} ctl
         */
        addMapControl: function (id, ctl) {
            this._controls[id] = ctl;
            this._addMapControlImpl(ctl);
        },
        /**
         * @method removeMapControl
         * Removes a control from the map matching the given id/name and
         * also removes it from references gotten by getControls()
         * @param {String} id control id/name
         */
        removeMapControl: function (id) {
            var ctl = this._controls[id];
            this._removeMapControlImpl(ctl);
            delete this._controls[id];
        },
        /**
         * @method setLayerPlugin
         * Adds a plugin to the map that is responsible for rendering maplayers on the map. Other types of
         * plugins doesn't need to be registered like this.
         * Saves a reference so the plugin so it can be accessed with getLayerPlugins/getLayerPlugin.
         *
         * The plugin handling rendering a layer is responsible for calling this method and registering
         * itself as a layersplugin.
         *
         * @param {String} id plugin id/name
         * @param {Oskari.mapframework.ui.module.common.mapmodule.Plugin} plug, set to null if you want to remove the entry
         */
        setLayerPlugin: function (id, plug) {
            if (id === null || id === undefined || !id.length) {
                this._sandbox.printWarn(
                    'Setting layer plugin', plug, 'with a non-existent ID:', id
                );
            }
            if (plug === null || plug === undefined) {
                delete this._layerPlugins[id];
            } else {
                this._layerPlugins[id] = plug;
            }
        },
        /**
         * @method getLayerPlugin
         * Returns a single map layer plugin that matches the given id
         * See getLayerPlugins for getting all plugins.
         * See setLayerPlugin for more about layerplugins.
         * @return {Oskari.mapframework.ui.module.common.mapmodule.Plugin} plugin matching the id or undefined if not found
         */
        getLayerPlugin: function (id) {
            return this._layerPlugins[id];
        },
        /**
         * @method getControls
         * Returns plugins that have been registered as layer plugins. See setLayerPlugin for more about layerplugins.
         * See getLayerPlugin for getting single plugin.
         * @return {Object} contains plugin ids keys and plugin objects as values
         */
        getLayerPlugins: function () {
            return this._layerPlugins;
        },

        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this._id + 'MapModule';
        },
        /**
         * @method getSandbox
         * Returns reference to Oskari sandbox
         * @return {Oskari.mapframework.sandbox.Sandbox}
         */
        getSandbox: function () {
            return this._sandbox;
        },
        /**
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for current
         * language.
         * If key-parameter is not given, returns the whole localization data.
         *
         * @param {String} key (optional) if given, returns the value for key
         * @param {Boolean} force (optional) true to force reload for localization data
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function (key, force) {
            if (!this._localization || force === true) {
                this._localization = Oskari.getLocalization('MapModule');
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },

        /**
         * @method init
         * Implements Module protocol init method. Creates the Map.
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         * @return {Map}
         */
        init: function (sandbox) {
            var me = this;
            sandbox.printDebug(
                'Initializing oskari map module...#############################################'
            );

            me._sandbox = sandbox;

            if (me._options) {
                if (me._options.resolutions) {
                    me._mapResolutions = me._options.resolutions;
                }
                if (me._options.srsName) {
                    me._projectionCode = me._options.srsName;
                    // set srsName to Oskari.mapframework.domain.Map
                    if (me._sandbox) {
                        me._sandbox.getMap().setSrsName(me._projectionCode);
                    }
                }
            }

            me._map = me._createMapImpl();

            // changed to resolutions based map zoom levels
            // -> calculate scales array for backward compatibility
            me._calculateScalesImpl(me._mapResolutions);

            return me._initImpl(me._sandbox, me._options, me._map);
        },

        /**
         * @method _initImpl
         * Init for implementation specific functionality.
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         * @param {Map} map
         * @return {Map}
         */
        _initImpl: function (sandbox, options, map) {
            return map;
        },

        /**
         * @method getPluginInstances
         * Returns object containing plugins that have been registered to the map.
         * @return {Object} contains plugin ids as keys and plugin objects as values
         */
        getPluginInstances: function () {
            return this._pluginInstances;
        },
        /**
         * @method getPluginInstance
         * Returns plugin with given name if it registered on the map
         * @param {String} pluginName name of the plugin to get
         * @return {Oskari.mapframework.ui.module.common.mapmodule.Plugin}
         */
        getPluginInstance: function (pluginName) {
            return this._pluginInstances[this.getName() + pluginName];
        },
        /**
         * @method isPluginActivated
         * Checks if a plugin matching the given name is registered to the map
         * @param {String} pluginName name of the plugin to check
         * @return {Boolean} true if a plugin with given name is registered to the map
         */
        isPluginActivated: function (pluginName) {
            var plugin = this._pluginInstances[this.getName() + pluginName];
            if (plugin) {
                return true;
            }
            return false;
        },
        /**
         * @method registerPlugin
         * Registers the given plugin to this map module. Sets the mapmodule reference to the plugin and
         * calls plugins register method. Saves a reference to the plugin that can be fetched through
         * getPluginInstances().
         * @param {Oskari.mapframework.ui.module.common.mapmodule.Plugin} plugin
         */
        registerPlugin: function (plugin) {
            var sandbox = this.getSandbox();
            plugin.setMapModule(this);
            var pluginName = plugin.getName();
            sandbox.printDebug(
                '[' + this.getName() + ']' + ' Registering ' + pluginName
            );
            plugin.register();
            this._pluginInstances[pluginName] = plugin;
        },
        /**
         * @method unregisterPlugin
         * Unregisters the given plugin from this map module. Sets the mapmodule reference on the plugin
         * to <null> and calls plugins unregister method. Removes the reference to the plugin from
         * getPluginInstances().
         * @param {Oskari.mapframework.ui.module.common.mapmodule.Plugin} plugin
         */
        unregisterPlugin: function (plugin) {
            var sandbox = this.getSandbox(),
                pluginName = plugin.getName();

            sandbox.printDebug(
                '[' + this.getName() + ']' + ' Unregistering ' + pluginName
            );
            plugin.unregister();
            this._pluginInstances[pluginName] = undefined;
            plugin.setMapModule(null);
            delete this._pluginInstances[pluginName];
        },
        /**
         * @method startPlugin
         * Starts the given plugin by calling its startPlugin() method.
         * @param {Oskari.mapframework.ui.module.common.mapmodule.Plugin} plugin
         */
        startPlugin: function (plugin) {
            var sandbox = this.getSandbox(),
                pluginName = plugin.getName();

            sandbox.printDebug(
                '[' + this.getName() + ']' + ' Starting ' + pluginName
            );
            plugin.startPlugin(sandbox);
        },
        /**
         * @method stopPlugin
         * Stops the given plugin by calling its stopPlugin() method.
         * @param {Oskari.mapframework.ui.module.common.mapmodule.Plugin} plugin
         */
        stopPlugin: function (plugin) {
            var sandbox = this.getSandbox(),
                pluginName = plugin.getName();

            sandbox.printDebug(
                '[' + this.getName() + ']' + ' Starting ' + pluginName
            );
            plugin.stopPlugin(sandbox);
        },
        /**
         * @method startPlugin
         * Starts all registered plugins (see getPluginInstances() and registerPlugin()) by
         * calling its startPlugin() method.
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         */
        startPlugins: function (sandbox) {
            var pluginName;
            for (pluginName in this._pluginInstances) {
                if (this._pluginInstances.hasOwnProperty(pluginName)) {
                    sandbox.printDebug(
                        '[' + this.getName() + ']' + ' Starting ' + pluginName
                    );
                    this._pluginInstances[pluginName].startPlugin(sandbox);
                }
            }
        },
        /**
         * @method stopPlugins
         * Stops all registered plugins (see getPluginInstances() and registerPlugin()) by
         * calling its stopPlugin() method.
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         */
        stopPlugins: function (sandbox) {
            var pluginName;
            for (pluginName in this._pluginInstances) {
                if (this._pluginInstances.hasOwnProperty(pluginName)) {
                    sandbox.printDebug(
                        '[' + this.getName() + ']' + ' Starting ' + pluginName
                    );
                    this._pluginInstances[pluginName].stopPlugin(sandbox);
                }
            }
        },
        /**
         * @method getStealth
         * Returns boolean true if map is in "stealth mode". Stealth mode means that the map doesn't send events
         * and doesn't update the map domain object in sandbox
         * @return {Boolean}
         */
        getStealth: function () {
            return this._stealth;
        },
        /**
         * @method setStealth
         * Enables/disables the maps "stealth mode". Stealth mode means that the map doesn't send events
         * and doesn't update the map domain object in sandbox
         * @param {Boolean} bln true to enable stealth mode
         */
        setStealth: function (bln) {
            this._stealth = !!bln;
        },
        /**
         * @method notifyAll
         * Calls sandbox.notifyAll with the parameters if stealth mode is not enabled
         * @param {Oskari.mapframework.event.Event} event - event to send
         * @param {Boolean} retainEvent true to not send event but only print debug which modules are listening, usually left undefined (optional)
         */
        notifyAll: function (event, retainEvent) {
            // propably not called anymore?
            if (this.getStealth()) {
                return;
            }

            this.getSandbox().notifyAll(event, retainEvent);
        },
        /**
         * @method getMap
         * Returns a reference to the actual OpenLayers implementation
         * @return {OpenLayers.Map}
         */
        getMap: function () {
            return this._map;
        },

        /**
         * @method getProjection
         * Returns the SRS projection code for the map.
         * Currently always 'EPSG:3067'
         * @return {String}
         */
        getProjection: function () {
            return this._projectionCode;
        },
        getProjectionObject: function () {
            return this._projection;
        },
        getResolutionArray: function () {
            return this._mapResolutions;
        },
        getExtentArray: function () {
            return this._extent;
        },

        /**
         * @method zoomIn
         * Adjusts the zoom level by one
         */
        zoomIn: function () {
            this.adjustZoomLevel(1);
        },
        /**
         * @method zoomOut
         * Adjusts the zoom level by minus one
         */
        zoomOut: function () {
            this.adjustZoomLevel(-1);
        },
        /**
         * @method zoomTo
         * Sets the zoom level to given value
         * @param {Number} zoomLevel the new zoom level
         */
        zoomTo: function (zoomLevel) {
            this.setZoomLevel(zoomLevel, false);
        },

        /**
         * @method moveMapByPixels
         * Moves the map by given amount of pixels.
         * @param {Number} pX amount of pixels to move on x axis
         * @param {Number} pY amount of pixels to move on y axis
         * @param {Boolean} suppressStart true to NOT send an event about the map starting to move
         *  (other components wont know that the map has started moving, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        moveMapByPixels: function (pX, pY, suppressStart, suppressEnd) {
            return this.panMapByPixels(pX, pY, suppressStart, suppressEnd);
        },

        /**
         * @method isValidLonLat
         * Checks that latitude is between 8 200 000 <> 6 250 000 and
         * that longitude is between 0 <> 1 350 000
         * @param {Number} lon longitude to check
         * @param {Number} lat latitude to check
         * @return {Boolean} true if coordinates are in said boundaries
         */
        isValidLonLat: function (lon, lat) {
            // FIXME isn't this projection dependent?
            var isOk = true;
            if (lat < 6250000 || lat > 8200000) {
                isOk = false;
                return isOk;
            }
            if (lon < 0 || lon > 1350000) {
                isOk = false;
            }
            return isOk;
        },

        /**
         * @method getClosestZoomLevel
         * Calculate closest zoom level given the given boundaries.
         * If map is zoomed too close -> returns the closest zoom level level possible within given bounds
         * If map is zoomed too far out -> returns the furthest zoom level possible within given bounds
         * If the boundaries are within current zoomlevel or undefined, returns the current zoomLevel
         * @param {Number} maxScale maximum scale boundary (optional)
         * @param {Number} minScale minimum scale boundary (optional)
         * @return {Number} zoomLevel (0-12)
         */
        getClosestZoomLevel: function (maxScale, minScale) {
            var zoomLevel = this.getZoomLevel();
            // FIXME: shouldn't we check appropriate level if even one is defined? '||' should be '&&'?
            if (!minScale || !maxScale) {
                return zoomLevel;
            }

            // FIXME: relies on OL2 implementation, refactor to use Impl
            var scale = this.getMap().getScale(),
                i;

            if (scale < minScale) {
                // zoom out
                //for(i = this._mapScales.length; i > zoomLevel; i--) {
                for (i = zoomLevel; i > 0; i -= 1) {
                    if (this._mapScales[i] >= minScale) {
                        return i;
                    }
                }
            } else if (scale > maxScale) {
                // zoom in
                for (i = zoomLevel; i < this._mapScales.length; i += 1) {
                    if (this._mapScales[i] <= maxScale) {
                        return i;
                    }
                }
            }
            return zoomLevel;
        },

        /**
         * Formats the measurement of the geometry.
         * Returns a string with the measurement and
         * an appropriate unit (m/km or m²/km²)
         * or an empty string for point.
         *
         * @public @method formatMeasurementResult
         *
         * @param  {OpenLayers.Geometry} geometry
         * @param  {String} drawMode
         * @return {String}
         *
         */
        formatMeasurementResult: function(geometry, drawMode) {
            var measurement,
                unit;

            if (drawMode === 'area') {
                measurement = (Math.round(100 * geometry.getGeodesicArea(this._projectionCode)) / 100);
                unit = ' m²';
                // 1 000 000 m² === 1 km²
                if (measurement >= 1000000) {
                    measurement = (Math.round(measurement) / 1000000);
                    unit = ' km²';
                }
            } else if (drawMode === 'line') {
                measurement = (Math.round(100 * geometry.getGeodesicLength(this._projectionCode)) / 100);
                unit = ' m';
                // 1 000 m === 1 km
                if (measurement >= 1000) {
                    measurement = (Math.round(measurement) / 1000);
                    unit = ' km';
                }
            } else {
                return '';
            }
            return measurement.toFixed(3).replace(
                '.',
                Oskari.getDecimalSeparator()
            ) + unit;
        },

        /**
         * @method start
         * implements BundleInstance protocol start method
         * Starts the plugins registered on the map and adds
         * selected layers on the map if layers were selected before
         * mapmodule was registered to listen to these events.
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         */
        start: function (sandbox) {
            if (this.started) {
                return;
            }

            sandbox.printDebug('Starting ' + this.getName());

            // register events handlers
            var p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
            }

            this.startPlugins(sandbox);
            this.updateCurrentState();
            this.started = this._startImpl();
        },

        _startImpl: function () {
            return true;
        },

        /**
         * @method stop
         * implements BundleInstance protocol stop method
         * Stops the plugins registered on the map.
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         */
        stop: function (sandbox) {

            if (!this.started) {
                return;
            }

            this.stopPlugins(sandbox);
            this.started = this._stopImpl();
        },
        _stopImpl: function () {
            return true;
        },

        /**
         * @property eventHandlers
         * @static
         */
        eventHandlers: {},

        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        },
        /**
         * @method updateCurrentState
         * Setup layers from selected layers
         * This is needed if map layers are added before mapmodule/plugins are started.
         * Should be called only on startup, preferrably not even then
         * (workaround for timing issues).
         * If layers are already in map, this adds them twice and they cannot be
         * removed anymore by removemaplayerrequest (it should be sent twice but ui doesn't
         * offer that).
         */
        updateCurrentState: function () {

            var me = this,
                sandbox = me._sandbox,
                layers = sandbox.findAllSelectedMapLayers(),
                lps = this.getLayerPlugins(),
                layersPlugin,
                p;

            for (p in lps) {
                if (lps.hasOwnProperty(p)) {
                    layersPlugin = lps[p];

                    sandbox.printDebug('preselecting ' + p);
                    layersPlugin.preselectLayers(layers);
                }
            }
        },

        /*
         * moved here to make generalization easier
         */
        getLayersByName: function (name) {
            var results = [],
                layerDefs = this.layerDefs,
                l,
                ldef;

            for (l = 0; l < layerDefs.length; l += 1) {

                ldef = layerDefs[l];

                if (ldef.name.indexOf(name) !== -1) {
                    results.push(ldef.impl);
                }

            }

            return results;
        },

        getLayers: function () {
            return this.layerDefs;
        },

        getLayerDefs: function () {
            return this.layerDefs;
        },

        addLayer: function (layerImpl, layer, name, index) {
            var ldef = {
                name: name,
                id: layer.getId(),
                impl: layerImpl,
                layer: layer
            };
            this.layerDefs.push(ldef);

            this.layerDefsById[layer.getId()] = ldef;

            this._addLayerImpl(layerImpl, index);
        },

        removeLayer: function (layerImpl, layer, name) {
            this._removeLayerImpl(layerImpl);
            delete this.layerDefsById[layer.getId()];

            var newDefs = [],
                n;

            for (n = 0; n < this.layerDefs.length; n += 1) {
                if (this.layerDefs[n].layer.getId() !== layer.getId()) {
                    newDefs.push(this.layerDefs[n]);
                    continue;
                }
                delete this.layerDefs[n];
            }
            this.layerDefs = newDefs;

        },

        setLayerIndex: function (layerImpl, index) {
            var layerArr = this.getLayerDefs(),
                layerIndex = this.getLayerIndex(layerImpl),
                newLayerArr = [],
                prevDef = layerArr[layerIndex],
                n;

            for (n = 0; n < layerArr.length; n += 1) {
                if (n === index && prevDef) {
                    newLayerArr.push(prevDef);
                    prevDef = null;
                }
                if (layerArr[n].impl !== layerImpl) {
                    newLayerArr.push(layerArr[n]);
                }
            }
            if (n === index && prevDef) {
                newLayerArr.push(prevDef);
            }

            this.layerDefs = newLayerArr;
            for (n = 0; n < layerArr.length; n += 1) {
                this._setLayerImplIndex(layerArr[n].impl, n);
            }

        },

        getLayerIndex: function (layerImpl) {
            var layerArr = this.getLayerDefs(),
                n;

            for (n = 0; n < layerArr.length; n += 1) {
                if (layerArr[n].impl === layerImpl) {
                    return n;
                }
            }
            return -1;

        },

        getMapScale: function () {
            var size = this.getMapSize(),
                extent = this.getMapExtent(),
                res = (extent[2] - extent[0]) / size[0];

            return OpenLayers.Util.getScaleFromResolution(res, 'm');
        },

        /**
         * @method calculateLayerScales
         * Calculate a subset of maps scales array that matches the given boundaries.
         * If boundaries are not defined, returns all possible scales.
         * @param {Number} maxScale maximum scale boundary (optional)
         * @param {Number} minScale minimum scale boundary (optional)
         * @return {Number[]} calculated mapscales that are within given bounds
         */
        calculateLayerMinMaxResolutions: function (maxScale, minScale) {
            var minScaleZoom,
                maxScaleZoom,
                i;

            for (i = 0; i < this._mapScales.length; i += 1) {
                if ((!minScale || minScale >= this._mapScales[i]) && (!maxScale || maxScale <= this._mapScales[i])) {
                    if (minScaleZoom === undefined) {
                        minScaleZoom = i;
                    }
                    maxScaleZoom = i;
                }
            }
            return {
                min: minScaleZoom,
                max: maxScaleZoom
            };
        },
        /**
         * @method getMapScales
         * @return {Number[]} calculated mapscales
         */
        getMapScales: function () {
            return this._mapScales;
        },
        /**
         * @method calculateLayerScales
         * Calculate a subset of maps scales array that matches the given boundaries.
         * If boundaries are not defined, returns all possible scales.
         * @param {Number} maxScale maximum scale boundary (optional)
         * @param {Number} minScale minimum scale boundary (optional)
         * @return {Number[]} calculated mapscales that are within given bounds
         */
        calculateLayerScales: function (maxScale, minScale) {
            var layerScales = [],
                i;

            for (i = 0; i < this._mapScales.length; i += 1) {
                if ((!minScale || minScale >= this._mapScales[i]) && (!maxScale || maxScale <= this._mapScales[i])) {
                    layerScales.push(this._mapScales[i]);
                }
            }
            return layerScales;
        },
        /**
         * @method calculateLayerResolutions
         * Calculate a subset of maps resolutions array that matches the given boundaries.
         * If boundaries are not defined, returns all possible resolutions.
         * @param {Number} maxScale maximum scale boundary (optional)
         * @param {Number} minScale minimum scale boundary (optional)
         * @return {Number[]} calculated resolutions that are within given bounds
         */
        calculateLayerResolutions: function (maxScale, minScale) {
            var layerResolutions = [],
                i;

            for (i = 0; i < this._mapScales.length; i += 1) {
                if ((!minScale || minScale >= this._mapScales[i]) && (!maxScale || maxScale <= this._mapScales[i])) {
                    // resolutions are in the same order as scales so just use them
                    layerResolutions.push(this._options.resolutions[i]);
                }
            }
            return layerResolutions;
        },
        /**
         * Returns state for mapmodule including plugins that have getState() function
         * @method getState
         * @return {Object} properties for each pluginName
         */
        getState : function() {
            var state = {
                    plugins: {}
                },
                pluginName;

            for (pluginName in this._pluginInstances) {
                if (this._pluginInstances.hasOwnProperty(pluginName) && this._pluginInstances[pluginName].getState) {
                    state.plugins[pluginName] = this._pluginInstances[pluginName].getState();
                }
            }
            return state;
        },
        /**
         * Returns state for mapmodule including plugins that have getStateParameters() function
         * @method getStateParameters
         * @return {String} link parameters for map state
         */
        getStateParameters: function () {
            var params = '',
                pluginName;

            for (pluginName in this._pluginInstances) {
                if (this._pluginInstances.hasOwnProperty(pluginName) && this._pluginInstances[pluginName].getStateParameters) {
                    params = params + this._pluginInstances[pluginName].getStateParameters();
                }
            }
            return params;
        },
        /**
         * Sets state for mapmodule including plugins that have setState() function
         * NOTE! Not used for now
         * @method setState
         * @param {Object} properties for each pluginName
         */
        setState : function(state) {
            var pluginName;

            for (pluginName in this._pluginInstances) {
                if (this._pluginInstances.hasOwnProperty(pluginName) && state[pluginName] && this._pluginInstances[pluginName].setState) {
                    this._pluginInstances[pluginName].setState(state[pluginName]);
                }
            }
        },
        /* IMPL specific */

        _crs2MapImpl: Oskari.AbstractFunc('_crs2MapImpl'),
        _map2CrsImpl: Oskari.AbstractFunc('_map2CrsImpl'),

        updateSize: Oskari.AbstractFunc('updateSize'),

        /**
         * @method _createMapImpl
         * @private
         * Creates the Implementation specific Map object
         * @return {Map}
         */
        _createMapImpl: Oskari.AbstractFunc('_createMapImpl'),

        /**
         * @method moveMapToLanLot
         * Moves the map to the given position. Alias for panMapToLonLat.
         */
        moveMapToLanLot: function () {
            return this.panMapToLonLat.apply(this, arguments);
        },
        /**
         * @method panMapToLonLat
         * Pans the map to the given position.
         * @param {OpenLayers.LonLat} lonlat coordinates to pan the map to
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        panMapToLonLat: Oskari.AbstractFunc('moveMapToLanLot'),
        /**
         * @method zoomToScale
         * Pans the map to the given position.
         * @param {float} scale the new scale
         * @param {Boolean} closest find the zoom level that most closely fits the specified scale.
         *   Note that this may result in a zoom that does not exactly contain the entire extent.  Default is false
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        zoomToScale: Oskari.AbstractFunc('zoomToScale'),
        /**
         * @method centerMap
         * Moves the map to the given position and zoomlevel.
         * @param {OpenLayers.LonLat} lonlat coordinates to move the map to
         * @param {Number} zoomLevel absolute zoomlevel to set the map to
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        centerMap: Oskari.AbstractFunc('centerMap'),
        /**
         * @method panMapByPixels
         * Pans the map by given amount of pixels.
         * @param {Number} pX amount of pixels to pan on x axis
         * @param {Number} pY amount of pixels to pan on y axis
         * @param {Boolean} suppressStart true to NOT send an event about the map starting to move
         *  (other components wont know that the map has started moving, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         * @param {Boolean} isDrag true if the user is dragging the map to a new location currently (optional)
         */
        panMapByPixels: Oskari.AbstractFunc('panMapByPixels'),

        /**
         * @method centerMapByPixels
         * Moves the map so the given pixel coordinates relative to the viewport is on the center of the view port.
         * @param {Number} pX pixel coordinates on x axis
         * @param {Number} pY pixel coordinates on y axis
         * @param {Boolean} suppressStart true to NOT send an event about the map starting to move
         *  (other components wont know that the map has started moving, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        centerMapByPixels: Oskari.AbstractFunc('centerMapByPixels'),

        /**
         * @method zoomToExtent
         * Zooms the map to fit given bounds on the viewport
         * @param {OpenLayers.Bounds} bounds BoundingBox that should be visible on the viewport
         * @param {Boolean} suppressStart true to NOT send an event about the map starting to move
         *  (other components wont know that the map has started moving, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        zoomToExtent: Oskari.AbstractFunc('zoomToExtent'),

        /**
         * @method setZoomLevel
         * Sets the maps zoom level to given absolute number
         * @param {Number} newZoomLevel absolute zoom level (0-12)
         * @param {Boolean} suppressEvent true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        setZoomLevel: Oskari.AbstractFunc('setZoomLevel'),

        /**
         * @method getZoomLevel
         * gets the maps zoom level to given absolute number
         * @return {Number} newZoomLevel absolute zoom level (0-12)
         */
        getZoomLevel: function () {
            return this.getMap().getZoom();
        },

        /**
         * @method _updateDomainImpl
         * @private
         * Updates the sandbox map domain object with the current map properties.
         * Ignores the call if map is in stealth mode.
         */
        _updateDomainImpl: Oskari.AbstractFunc('_updateDomainImpl'),

        _addLayerImpl: Oskari.AbstractFunc('_addLayerImpl(layerImpl, index)'),

        _setLayerImplIndex: Oskari.AbstractFunc('_setLayerImplIndex(layerImpl,n)'),

        _removeLayerImpl: Oskari.AbstractFunc('_removeLayerImpl(layerImpl)'),

        _setLayerImplVisible: Oskari.AbstractFunc('_setLayerImplVisible'),

        _setLayerImplOpacity: Oskari.AbstractFunc('_setLayerImplOpacity'),

        adjustZoomLevel: Oskari.AbstractFunc('adjustZoomLevel(amount, suppressEvent)'),

        notifyMoveEnd: function () {},

        _calculateScalesImpl: Oskari.AbstractFunc('_calculateScalesImpl(resolutions)'),

        _addMapControlImpl: Oskari.AbstractFunc('_addMapControlImpl(ctl)'),

        _removeMapControlImpl: Oskari.AbstractFunc('_removeMapControlImpl(ctl)'),

    }, {
        /**
         * @static @property {String[]} protocol
         */
        protocol: ['Oskari.mapframework.module.Module']
    }
);