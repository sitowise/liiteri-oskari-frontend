/**
 * @class Oskari.mapframework.bundle.postprocessor.PostProcessorBundleInstance
 *
 * Used for highlighting wfs features on pageload etc. Calls other bundles to accomplish stuff
 * after everything has been loaded and started.
 *
 * See Oskari.mapframework.bundle.postprocessor.PostProcessorBundle for bundle definition.
 *
 */
Oskari.clazz.define("Oskari.mapframework.bundle.postprocessor.PostProcessorBundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.sandbox = null;
        this.ready = false;
        this.completed = false;
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'PostProcessor',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        "getName": function () {
            return this.__name;
        },
        /**
         * @method start
         * implements BundleInstance protocol start methdod
         */
        "start": function () {
            var me = this;
            var conf = this.conf;
            var sandboxName = (conf ? conf.sandbox : null) || 'sandbox';
            var sandbox = Oskari.getSandbox(sandboxName);

            this.sandbox = sandbox;

            sandbox.register(this);
            for (var p in this.eventHandlers) {
                if (p) {
                    sandbox.registerForEventByName(this, p);
                }
            }
            if (this.state) {
                if(typeof this.state.highlightFeatureLayerId !== 'undefined' &&
                        typeof this.state.highlightFeatureId !== 'undefined' && this.state.highlightFeatureId.length > 0 &&
                        typeof this.state.featurePoints !== 'undefined' && this.state.featurePoints.length > 0) {
                    var hiliteLayerId = this.state.highlightFeatureLayerId;
                    this._highlightFeature(hiliteLayerId, this.state.highlightFeatureId);
                } else {
                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                    okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                    okBtn.setTitle("Sulje");
                    okBtn.addClass('primary');

                    okBtn.setHandler(function () {
                        dialog.close();
                    });
                    dialog.show('Virhe', 'Haettua asemakaava-aluetta ei l�ytynyt', [okBtn]);
                    this.completed = true;
                }
            }
        },
        /**
         * @method _highlightFeature
         * @private
         * Adds the layer if its not yet selected
         * @param {String} layerId
         * @param {String/String[]} featureId single or array of feature ids to hilight
         */
        _highlightFeature: function (layerId, featureId) {
            if (!featureId || !layerId) {
                return;
            }
            // move map to location
            var points = this.state.featurePoints;
            if (points) {
                this._showPoints(points);
            }
            var sb = this.sandbox;
            // allow the map to settle before asking for highlight. We could also wait after map move events stop coming
            // The whole feature should be rewritten using RPC and pushing the data on the map.
            // Currently it uses Oskari and transport "creatively" and isn't all that stable
            setTimeout(function () {
                // request for highlight image, note that the map must be in correct
                // location BEFORE this or we get a blank image
                var builder = sb.getEventBuilder('WFSFeaturesSelectedEvent');
                var featureIdList = [];
                // check if the param is already an array
                if (Object.prototype.toString.call(featureId) === '[object Array]') {
                    featureIdList = featureId;
                } else {
                    featureIdList.push(featureId);
                }
                // create dummy layer since the real one might not be available and we only need it for id
                var mapLayerService = sb.getService('Oskari.mapframework.service.MapLayerService');
                if (!mapLayerService) {
                    // service not found - should never happen
                    showError();
                    return;
                }

                if (mapLayerService.isAllLayersLoaded()) {
                    var layer = mapLayerService.findMapLayer(layerId);
                    if (!layer) {
                        showError();
                        return;
                    } else {
                        //put layer visible
                        this.sandbox.postRequestByName('AddMapLayerRequest', [layerId]);
                        //make sure zoom level is suitable for layer
                        this.sandbox.postRequestByName('MapModulePlugin.MapMoveByLayerContentRequest', [layerId]);
                        this.ready = true;
                    }
                    dummyLayer.setId(layerId);
                    dummyLayer.setOpacity(100);
                    var event = builder(featureIdList, dummyLayer, true);
                    sb.notifyAll(event);

                }
            }, 500);
        },
        /**
         * @method _showPoints
         * @private
         * Sends a mapmoverequest to fit the points on the map viewport
         * @param {Object[]} points array of objects containing lon/lat properties
         */
        _showPoints: function (points) {
            var olPoints = {
                _points: [],
                addPoint: function(lon, lat) {
                    this._points.push({lon:parseFloat(lon), lat:parseFloat(lat)});
                },
                getBounds: function() {
                    var top=0,
                        left=0,
                        bottom=0,
                        right=0;

                    // Calculate bbox
                    left = this._points[0].lon;
                    bottom = this._points[0].lat;

                    for(var i=0;i<this._points.length;i++){
                        var point = this._points[i];
                        if(point.lon > right) {
                            right = point.lon;
                        }
                        if(point.lat > top) {
                            top = point.lat;
                        }

                        if(point.lon < left) {
                            left = point.lon;
                        }
                        if(point.lat < bottom) {
                            bottom = point.lat;
                        }
                    }

                    return {
                        left: left,
                        bottom: bottom,
                        right: right,
                        top: top
                    };
                },
                getCentroid: function() {
                    var bbox = this.getBounds();
                    return {
                        x: bbox.left + (bbox.right - bbox.left)/2,
                        y: bbox.bottom + (bbox.top - bbox.bottom)/2
                    };

                }
            },
                count,
                point,
                olPoint;
            for (count = 0; count < points.length; ++count) {
                point = points[count];
                olPoints.addPoint(point.lon, point.lat);
            }
            var bounds = olPoints.getBounds();
            var centroid = olPoints.getCentroid();

            var rb = this.sandbox.getRequestBuilder('MapMoveRequest'),
                req;
            if (rb && count > 0) {
                if (count === 1) {
                    // zoom to level 9 if a single point
                    req = rb(centroid.x, centroid.y, 9);
                    this.sandbox.request(this, req);
                } else {
                    req = rb(centroid.x, centroid.y, bounds);
                    this.sandbox.request(this, req);
                }
            }
        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {

            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [event]);
        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method MapLayerEvent
             * If start has already campleted hilighting, this won't trigger, if not
             * this calls highlight no the selected target
             * @param {Oskari.mapframework.event.common.MapLayerEvent} event
             */
            'MapLayerEvent': function (event) {
                // layerId in event is null for initial ajax load
                if ('add' === event.getOperation() && !event.getLayerId()) {
                    this._highlightFeature(this.state.highlightFeatureLayerId, this.state.highlightFeatureId);
                }
            },
            'LayersLoadingEvent' : function (event) { 
                //set clicked feature after layers are drawn so that the highlighting works properly
                var mapLayerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
                if(event.getOperation() == 'stop' && this.ready && !this.completed && mapLayerService) {
                    var layerId = this.state.highlightFeatureLayerId;
                    var featureId = this.state.highlightFeatureId;
                    this.completed = true;
                    
                    // request for highlight image, note that the map must be in correct
                    // location BEFORE this or we get a blank image
                    var builder = this.sandbox.getEventBuilder('WFSFeaturesSelectedEvent');
                    var featureIdList = [];
                    // check if the param is already an array
                    if (Object.prototype.toString.call(featureId) === '[object Array]') {
                        featureIdList = featureId;
                    } else {
                        featureIdList.push(featureId);
                    }
                    var layer = mapLayerService.findMapLayer(layerId);
                    layer.setClickedFeatureIds(featureIdList);

                    var event = builder(featureIdList, layer, true);
                    this.sandbox.notifyAll(event);
                }
            }
        },
        /**
         * @method init
         * implements Module protocol init method - does nothing atm
         */
        "init": function () {
            return null;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        "update": function () {

        },
        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        "stop": function () {}
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        "protocol": ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module']
    });