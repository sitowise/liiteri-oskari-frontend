/**
 * @class Oskari.mapframework.bundle.hierarchical-layerlist.request.SelectTabRequestHandler
 */
Oskari.clazz.define('Oskari.framework.bundle.hierarchical-layerlist.request.SelectTabRequestHandler',
    /**
     * @method create called automatically on construction
     */
    function (sandbox, flyout) {
        this.sandbox = sandbox;
        this.flyout = flyout;
    }, {
        /**
         * @method handleRequest 
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.layerlist.request.SelectTabRequestHandler} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            this.flyout.selectTab(request.getTab());
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
