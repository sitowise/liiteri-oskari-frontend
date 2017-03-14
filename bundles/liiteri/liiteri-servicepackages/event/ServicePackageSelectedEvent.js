/**
 * @class Oskari.liiteri.bundle.liiteri-servicepackages.event.ServicePackageSelectedEvent
 * 
 * Used to notify components that ... 
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-servicepackages.event.ServicePackageSelectedEvent', 
/**
 * @method create called automatically on construction
 * @static
 * @param {String} param some information you wish to communicate with the event
 */
function(themes, servicePackageId) {
    this._themes = themes;
	this._servicePackageId = servicePackageId;
}, {
    /** @static @property __name event name */
    __name : "liiteri-servicepackages.ServicePackageSelectedEvent",
    /**
     * @method getName
     * Returns event name
     * @return {String}
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getParameter 
     * Returns parameter that components reacting to event should know about
     * @return {String}
     */
    getThemes : function() {
        return this._themes;
    },

	getServicePackageId : function() {
        return this._servicePackageId;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});