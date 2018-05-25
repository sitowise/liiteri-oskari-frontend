/**
 * @class Oskari.statistics.bundle.statsgrid.request.CurrentStateRequestHandler
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.request.CurrentStateRequestHandler',

    function (instance, from) {
        this.instance = instance;
        this.from = from;
    }, {

        handleRequest: function (core, request) {
            if (request.getName() === 'StatsGrid.CurrentStateRequest') {
                var sandbox = this.instance.getSandbox();
				var eventBuilder = sandbox.getEventBuilder('StatsGrid.CurrentStateEvent');
				
				var currentState = this.instance.getState();
				
				if (eventBuilder) {
					var evt = eventBuilder(currentState, request.getRequestFrom(), request.getSharingType());
					sandbox.notifyAll(evt);
				}
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
