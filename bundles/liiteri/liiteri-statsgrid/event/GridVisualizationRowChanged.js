/**
 * Sends data of the open indicators.
 *
 * @class GridVisualizationRowChanged
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.event.GridVisualizationRowChanged',
    /**
     * @method create called automatically on construction
     * @static
     */

    function (_indicator, _functionalArea) {
        this._indicator = _indicator;
        this._functionalArea = _functionalArea;
    }, {
        /**
         * @method getName
         * Returns event name
         * @return {String} The event name.
         */
        getName: function () {
            return "StatsGrid.GridVisualizationRowChanged";
        },

        /**
         * Returns the indicator to visualize.
         *
         * @method getIndicators
         * @return {Object/null} returns the indicator to visualize
         */
        getIndicator: function () {
            return this._indicator;
        },

        /**
         * Returns the functional area to send data for.
         *
         * @method getFunctionalArea
         * @return {Object/null} returns the functional area to send data for
         */
        getFunctionalArea: function () {
            return this._functionalArea;
        }
    }, {
        'protocol': ['Oskari.mapframework.event.Event']
    });