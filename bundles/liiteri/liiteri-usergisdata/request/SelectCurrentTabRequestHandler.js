/**
 * @class Oskari.liiteri.bundle.liiteri-usergisdata.request.SelectCurrentTabRequestHandler
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-usergisdata.request.SelectCurrentTabRequestHandler',
    /**
     * @method create called automatically on construction
     */
    function (sandbox, instance) {
        this.sandbox = sandbox;
        this.instance = instance;
    }, {
        /**
         * @method handleRequest 
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.layerlist.request.SelectCurrentTabRequestHandler} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            this.instance.selectCurrentTab();
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
