/**
 * @class Oskari.mapframework.bundle.personaldata.request.AddTabRequest
 * Requests tab to be added
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.request.SelectTabRequest',
/**
 * @method create called automatically on construction
 * @static
 * @param {String} viewname for the view to be saved
 */
function(name) {
    this._name = name;
},{
    /** @static @property __name request name */
    __name: "PersonalData.SelectTabRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getTitle
     * @return {String} tab name
     */
   getTabName : function() {
       return this._name;
   }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});