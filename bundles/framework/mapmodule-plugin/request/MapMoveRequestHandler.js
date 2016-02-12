/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapMoveRequestHandler
 * Handles MapMoveRequest requests
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.request.MapMoveRequestHandler',

    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Oskari.mapframework.sandbox.Sandbox}
     *            sandbox reference to sandbox
     * @param {Oskari.mapframework.ui.module.common.MapModule}
     *            mapModule reference to mapmodule
     */
    function(sandbox, mapModule) {
        this.sandbox = sandbox;
        this.mapModule = mapModule;
    }, {
        /**
         * @method handleRequest
         * Handles the request.
         * If the request SrsName is not defined in Proj4js.defs then a "SrsName not supported!" exception is thrown.
         *
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.request.common.MapMoveRequest} request
         *      request to handle
         */
        handleRequest: function(core, request) {
            var longitude = request.getCenterX(),
                latitude = request.getCenterY(),
                zoom = request.getZoom(),
                srsName = request.getSrsName(),
                lonlat = new OpenLayers.LonLat(longitude, latitude);

            // transform coordinates to given projection
            if (srsName && (this.mapModule.getProjection() !== srsName)) {
                var isProjectionDefined = Proj4js.defs[srsName];
                if (!isProjectionDefined) {
                    throw 'SrsName not supported!';
                }
                lonlat = this.mapModule._transformCoordinates(lonlat, srsName);
            }

            this.mapModule.moveMapToLanLot(lonlat, zoom, false);
            // if zoom=0 -> if(zoom) is determined as false...
            if (zoom || zoom === 0) {
                if (zoom.CLASS_NAME === 'OpenLayers.Bounds') {
                    this.mapModule.zoomToExtent(zoom);
                } else if (zoom.scale) {
                    this.mapModule.zoomToScale(zoom.scale);
                } else {
                    this.mapModule.zoomTo(zoom);
                }
            }

            this.sandbox.printDebug('[MapMoveRequestHandler] map moved');
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    }
);
