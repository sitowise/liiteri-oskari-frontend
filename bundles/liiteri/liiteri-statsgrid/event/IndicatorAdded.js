/**
 * Sends data of new indicator.
 *
 * @class IndicatorAdded
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.event.IndicatorAdded',
    /**
     * @method create called automatically on construction
     * @static
     */

    function (indicator, year) {
        this._indicator = indicator;
        this._year = year;
    }, {
        /**
         * @method getName
         * Returns event name
         * @return {String} The event name.
         */
        getName: function () {
            return "StatsGrid.IndicatorAdded";
        },
        getIndicator: function () {
            return this._indicator;
        },
        getYear: function () {
            return this._year;
        }
    }, {
        'protocol': ['Oskari.mapframework.event.Event']
    });