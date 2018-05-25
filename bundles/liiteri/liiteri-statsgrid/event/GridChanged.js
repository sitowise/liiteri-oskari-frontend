/**
 * Sends data of the open indicators.
 *
 * @class GridChanged
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.event.GridChanged',
    /**
     * @method create called automatically on construction
     * @static
     */

    function (_indicators, _functionalRows) {
        this._indicators = _indicators;
        this._functionalRows = _functionalRows;
    }, {
        /**
         * @method getName
         * Returns event name
         * @return {String} The event name.
         */
        getName: function () {
            return "StatsGrid.GridChanged";
        },

        /**
         * Returns the open indicators.
         *
         * @method getIndicators
         * @return {Object/null} returns the open indicators
         */
        getIndicators: function () {
            return this._indicators;
        },

        /**
         * Returns the open functional rows.
         *
         * @method getFunctionalRows
         * @return {Object/null} returns the open functional rows
         */
        getFunctionalRows: function () {
            return this._functionalRows;
        }
    }, {
        'protocol': ['Oskari.mapframework.event.Event']
    });