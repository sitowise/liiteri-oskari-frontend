
/**
 * @class Oskari.liiteri.bundle.liiteri-servicepackages.event.ServicePackageSelectedEvent
 * 
 * Used to notify components that ... 
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-ui.request.UIAddTileRequest',
/**
 * @method create called automatically on construction
 * @static
 * @param {String} param some information you wish to communicate with the event
 */
function (desc) {
    this._desc = desc;
}, {
    /** @static @property __name event name */
    __name: "liiteri-ui.UIAddTileRequest",
    /**
     * @method getName
     * Returns event name
     * @return {String}
     */
    getName: function () {
        return this.__name;
    },
    getDescription: function () {
        return this._desc;
    }
}, {
    'protocol': ['Oskari.mapframework.request.Request']
});