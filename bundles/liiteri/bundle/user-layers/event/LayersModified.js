
/**
 * @class Oskari.liiteri.bundle.liiteri-servicepackages.event.ServicePackageSelectedEvent
 * 
 * Used to notify components that ... 
 */
Oskari.clazz.define('Oskari.liiteri.bundle.user-layers.event.LayersModified',
/**
 * @method create called automatically on construction
 * @static
 * @param {String} param some information you wish to communicate with the event
 */
function (operation) {
    this._operation = operation;
}, {
    /** @static @property __name event name */
    __name: "UserLayers.LayersModified",
    /**
     * @method getName
     * Returns event name
     * @return {String}
     */
    getName: function () {
        return this.__name;
    },
    getOperation: function () {
        return this._operation;
    }
}, {
    'protocol': ['Oskari.mapframework.event.Event']
});