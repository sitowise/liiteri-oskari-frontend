/**
 * Used to notify other components of stats area establishes.
 * 
 * @class Oskari.statistics.bundle.statsgrid.event.StatsAreaEstablishedEvent
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.event.StatsAreaEstablishedEvent',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} featureCollection geojson feature collection contains stats areas
     */
    function (featureCollection) {
        this._featureCollection = featureCollection;
    }, {
    /**
     * @method getName
     * Returns event name
     * @return {String} The event name.
     */
    getName: function () {
        return "StatsGrid.StatsAreaEstablishedEvent";
    },
    /**
    * @method getFeatureCollection
    * Returns geojson feature collection contains stats areas.
    * @return {Boolean}
    */
    getFeatureCollection: function () {
        return this._featureCollection;
    }
}, {
    'protocol': ['Oskari.mapframework.event.Event']
});