/**
 * @class Oskari.liiteri.bundle.liiteri-servicepackages.event.GroupingUpdatedEvent
 * 
 * Used to notify components that ... 
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-servicepackages.event.GroupingUpdatedEvent', 
/**
 * @method create called automatically on construction
 * @static
 * @param {String} param some information you wish to communicate with the event
 */
function(groupingType) {
    this._groupingType = groupingType;
}, {
    /** @static @property __name event name */
    __name : "liiteri-groupings.GroupingUpdatedEvent",
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
    getGroupingType : function() {
        return this._groupingType;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});