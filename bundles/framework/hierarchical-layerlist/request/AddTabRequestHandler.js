/**
 * @class Oskari.mapframework.bundle.hierarchical-layerlist.request.AddTabRequestHandler
 */
Oskari.clazz.define('Oskari.framework.bundle.hierarchical-layerlist.request.AddTabRequestHandler',
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
     * @param {Oskari.mapframework.bundle.layerlist.request.AddTabRequestHandler} request
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
