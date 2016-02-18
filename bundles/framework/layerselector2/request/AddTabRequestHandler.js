/**
 * @class Oskari.mapframework.bundle.layerselector2.request.AddTabRequestHandler
 */
Oskari.clazz.define('Oskari.mapframework.bundle.layerselector2.request.AddTabRequestHandler',
/**
 * @method create called automatically on construction
 */
function(sandbox, flyout) {
    this.sandbox = sandbox;
    this.flyout = flyout;
}, {
    /**
     * @method handleRequest 
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.mapframework.bundle.layerselector2.request.AddTabRequestHandler} request
     *      request to handle
     */
    handleRequest: function (core, request) {
        this.flyout.addTab({
            "first": request.isFirst(),
            "view": request.getView()
        });
   }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
