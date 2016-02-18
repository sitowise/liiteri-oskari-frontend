/**
 * @class Oskari.mapframework.bundle.mapmodule.event.MapClickedEvent
 *
 * Event is sent when the map is clicked so bundles can react to it.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.event.LayersLoadingEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {OpenLayers.LonLat} lonlat coordinates where the map was clicked
 * @param {Number} mouseX viewport mouse position x coordinate when click happened
 * @param {Number} mouseY viewport mouse position y coordinate when click happened
 */
function (operation) {
    this._operation = operation;
}, {
    /** @static @property __name event name */
    __name: "LayersLoadingEvent",
    /**
     * @method getName
     * @return {String} the name for the event
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getLonLat
     * @return {OpenLayers.LonLat}
     */
    getOperation : function() {
        return this._operation;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});