
/**
 * @class Oskari.liiteri.bundle.liiteri-servicepackages.event.ServicePackageSelectedEvent
 * 
 * Used to notify components that ... 
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-ui.request.UIUpdateTileRequest',
/**
 * @method create called automatically on construction
 * @static
 * @param {String} param some information you wish to communicate with the event
 */
function (name, operation) {
    this._name = name;
    this._operation = operation;
}, {
    /** @static @property __name event name */
    __name: "liiteri-ui.UIUpdateTileRequest",
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
    },
    getTileName: function () {
        return this._name;
    }
}, {
    'protocol': ['Oskari.mapframework.request.Request']
});