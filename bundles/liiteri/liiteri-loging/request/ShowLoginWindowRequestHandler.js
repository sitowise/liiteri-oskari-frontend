/**
 * @class Oskari.liiteri.bundle.liiteri-servicepackages.request.SetServicePackageRequestHandler
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-loging.request.ShowLoginWindowRequestHandler',


    function (instance) {
        this.instance = instance;
    }, {
        /**
         * @method handleRequest
         * Handles requests regarding StatsGrid functionality.
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.liiteri.bundle.liiteri-servicepackages.request.SetServicePackageRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
		    this.instance.showLoginWindow();
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
