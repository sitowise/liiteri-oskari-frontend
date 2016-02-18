Oskari.clazz
    .define(
        'Oskari.mapframework.bundle.mapmodule.plugin.BackgroundDrawPlugin.request.StopDrawingRequest',
        function (pluginId, isCancel) {
            this._pluginId = pluginId;
            this._isCancel = (isCancel == true);
        }, {
            __name: "BackgroundDrawPlugin.StopDrawingRequest",
            getName: function () {
                return this.__name;
            },
            getPluginId: function () {
                return this._pluginId;
            },
            isCancel: function () {
                return (this._isCancel === true);
            }
        }, {
            'protocol': ['Oskari.mapframework.request.Request']
        });

/* Inheritance */