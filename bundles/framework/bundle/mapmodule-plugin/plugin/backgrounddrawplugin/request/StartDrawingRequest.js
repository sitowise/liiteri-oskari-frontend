Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.BackgroundDrawPlugin.request.StartDrawingRequest',

function (pluginId, config) {
    this._pluginId = pluginId;
    // TODO: do we pass selected category colors here?
    if (config.geometry) {
        // editing existing
        this._geometry = config.geometry;
    } else if (config.continueCurrent) {
        // editing new
        this._continueCurrent = config.continueCurrent;
    } else {
        // start drawing new
        if (!this.drawModes[config.drawMode]) {
            throw "Unknown draw mode '" + config.drawMode + "'";
        }
        this._drawMode = config.drawMode;
    }

}, {
    __name: "BackgroundDrawPlugin.StartDrawingRequest",
    getName : function() {
        return this.__name;
    },
    getPluginId: function () {
        return this._pluginId;
    },

    isModify : function() {
        if (this._continueCurrent) {
            return true;
        }
        return false;
    },

    drawModes : {
        point : 'point',
        line : 'line',
        area : 'area',
        cut : 'cut',
        box : 'box'
    },

    getDrawMode : function() {
        return this._drawMode;
    },

    getGeometry : function() {
        return this._geometry;
    }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});