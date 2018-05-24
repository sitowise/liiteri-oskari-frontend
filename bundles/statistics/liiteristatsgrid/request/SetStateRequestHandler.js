/**
 * @class Oskari.statistics.bundle.statsgrid.request.SetStateRequestHandler
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.request.SetStateRequestHandler',

    function (instance) {
        this.instance = instance;
    }, {

        handleRequest: function (core, request) {
            if (request.getName() === 'StatsGrid.SetStateRequest') {
				this.instance.setState(request.getState());
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
