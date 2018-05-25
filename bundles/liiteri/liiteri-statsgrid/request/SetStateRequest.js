/**
 * @class Oskari.statistics.bundle.statsgrid.request.SetStateRequest
 *
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.request.SetStateRequest',

    function (state) {
        this._state = state;
    }, {
        /** @static @property __name request name */
        __name: "StatsGrid.SetStateRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
		
        getState: function () {
            return this._state;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });
