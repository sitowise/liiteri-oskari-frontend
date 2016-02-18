
/**
 * @class Oskari.liiteri.bundle.liiteri-servicepackages.event.ServicePackageSelectedEvent
 * 
 * Used to notify components that ... 
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-ui.request.UIAddTileRequestHandler',
/**
 * @method create called automatically on construction
 * @static
 * @param {String} param some information you wish to communicate with the event
 */
    function (plugin) {
        this.plugin = plugin;
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
            if (request.getName() === 'liiteri-ui.UIAddTileRequest') {
                this.plugin.addTile(request.getDescription());
            }
    }
}, {
    'protocol': ['Oskari.mapframework.core.RequestHandler']
});