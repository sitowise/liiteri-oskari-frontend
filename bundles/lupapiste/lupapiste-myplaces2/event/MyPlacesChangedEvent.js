/**
 * @method Oskari.lupapiste.myplaces2.event.MyPlacesChangedEvent
 * Tell components to reload myplaces data.
 */
Oskari.clazz.define('Oskari.lupapiste.myplaces2.event.MyPlacesChangedEvent',

/**
 * @method create called automatically on construction
 * @static
 */
function(config) {
}, {
    /** @static @property __name event name */
    __name : "LupaPisteMyPlaces.MyPlacesChangedEvent",
    /**
     * @method getName
     * Returns event name
     * @return {String}
     */
    getName : function() {
        return this.__name;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});