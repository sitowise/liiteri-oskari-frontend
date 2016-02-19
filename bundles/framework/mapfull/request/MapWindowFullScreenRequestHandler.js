/**
 * @class 'Oskari.mapframework.bundle.mapfull.request.MapWindowFullScreenRequestHandler
 * Tells the mapfull to toggle between normal and full screen mode.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapfull.request.MapWindowFullScreenRequestHandler',
/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.mapfull.MapFullBundleInstance} mapfull
 *          reference to mapfull bundle instance.
 */
function(mapfull) {
    this.mapfull = mapfull;
}, {
    /**
     * @method handleRequest
     * Toggles between the normal and the full screen mode of the map window.
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequest} request
     *      request to handle
     */
    handleRequest : function(core, request) {
        this.mapfull.toggleFullScreen();
   }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
