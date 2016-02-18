/**
 *
 * @class Oskari.statistics.bundle.statsgrid.event.CurrentStateEvent
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.event.CurrentStateEvent',
    /**
     * @method create called automatically on construction
     * @static
     */

    function (state, requestFrom, sharingType) {
        this._state = state;
        this._requestFrom = requestFrom;
        this._sharingType = sharingType;
    }, {
        /**
         * @method getName
         * Returns event name
         * @return {String} The event name.
         */
        getName: function () {
            return "StatsGrid.CurrentStateEvent";
        },

        getState: function () {
            return this._state;
        },
        
        getRequestFrom: function () {
            return this._requestFrom;
        },
        
        getSharingType: function () {
            return this._sharingType;
        },
    }, {
        'protocol': ['Oskari.mapframework.event.Event']
    });