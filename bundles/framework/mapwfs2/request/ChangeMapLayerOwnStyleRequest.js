/**
 * @class Oskari.mapframework.bundle.mapwfs2.request.ChangeMapLayerOwnStyleRequest
 * Requests a WFS own style to be shown
 *
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz
    .define('Oskari.mapframework.bundle.mapwfs2.request.ChangeMapLayerOwnStyleRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String}
     *            id layer identifier so we can select correct tab
     */
        function(id, style) {
            this._id = id;
			this._style = style;
    }, {
        /** @static @property __name request name */
        __name : "ChangeMapLayerOwnStyleRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName : function() {
            return this.__name;
        },
        /**
         * @method getId
         * @return {String} identifier so we can manage select correct tab
         */
        getId : function() {
            return this._id;
        },
        /**
         * @method getStyle
         * @return {String} identifier so we can manage select correct tab
         */
        getStyle : function() {
            return this._style;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol' : ['Oskari.mapframework.request.Request']
    });
