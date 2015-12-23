
/**
 * @class Oskari.liiteri.bundle.liiteri-servicepackages.event.ServicePackageSelectedEvent
 * 
 * Used to notify components that ... 
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-loging.event.LoginEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {String} param some information you wish to communicate with the event
 */
function (type) {
    this._type = type;
}, {
    /** @static @property __name event name */
    __name: "liiteri-loging.LoginEvent",
    /**
     * @method getName
     * Returns event name
     * @return {String}
     */
    getName: function () {
        return this.__name;
    },
    getType: function () {
        return this._type;
    }
}, {
    'protocol': ['Oskari.mapframework.event.Event']
});