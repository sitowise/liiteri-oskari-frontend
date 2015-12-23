/**
 * @class Oskari.statistics.bundle.statsgrid.request.CurrentStateRequest
 *
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.request.CurrentStateRequest',


    function (requestFrom, sharingType) {
		this.requestFrom = requestFrom;
		this.sharingType = sharingType;
    }, {
        /** @static @property __name request name */
        __name: "StatsGrid.CurrentStateRequest",
        
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        
        getRequestFrom: function() {
        	return this.requestFrom;
        },
        
        getSharingType: function() {
        	return this.sharingType;
        },
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });
