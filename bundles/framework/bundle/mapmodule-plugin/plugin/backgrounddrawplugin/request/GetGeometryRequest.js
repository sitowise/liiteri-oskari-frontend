Oskari.clazz
        .define(
                'Oskari.mapframework.bundle.mapmodule.plugin.BackgroundDrawPlugin.request.GetGeometryRequest',
                function (pluginId, callbackMethod) {
                    this._creator = null;
                    this._pluginId = pluginId;
                    this._callbackMethod = callbackMethod;
                }, {
                    __name: "BackgroundDrawPlugin.GetGeometryRequest",
                    getName : function() {
                        return this.__name;
                    },
                    getPluginId: function () {
                        return this._pluginId;
                    },
                    getCallBack : function() {
                        return this._callbackMethod;
                    }
                },                
                {
                    'protocol' : ['Oskari.mapframework.request.Request']
                });

/* Inheritance */
