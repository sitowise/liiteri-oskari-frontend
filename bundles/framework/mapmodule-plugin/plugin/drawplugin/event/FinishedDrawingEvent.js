/**
 * @class Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.event.FinishedDrawingEvent
 *
 * Used to notify components that the drawing has been finished.
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.event.FinishedDrawingEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {OpenLayers.Geometry} geometry the drawing that was finished
 * @param {Boolean} blnEdit true if the geometry was opened in edit mode
 */
function(geometry, blnEdit, creatorId) {
    this._drawing = geometry;
    this._modification = (blnEdit == true);
    this._creatorId = creatorId;
}, {
    /** @static @property __name event name */
    __name : "DrawPlugin.FinishedDrawingEvent",
    /**
     * @method getName
     * Returns event name
     * @return {String}
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getDrawing
     * Returns the drawings geometry
     * @return {OpenLayers.Geometry}
     */
    getDrawing : function() {
        return this._drawing;
    },
    /**
     * @method isModification
     * Returns true if drawing was initially opened for editing (not a new one)
     * @return {Boolean}
     */
    isModification : function() {
        return this._modification;
    },
    getCreatorId: function() {
        return this._creatorId;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
