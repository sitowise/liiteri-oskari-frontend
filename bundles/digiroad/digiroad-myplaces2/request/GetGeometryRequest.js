Oskari.clazz
        .define(
                'Oskari.digiroad.bundle.myplaces2.request.GetGeometryRequest',
                function(callbackMethod) {
                    this._creator = null;
                    this._callbackMethod = callbackMethod;
                }, {
                    __name : "DigiroadMyPlaces.GetGeometryRequest",
                    getName : function() {
                        return this.__name;
                    },
                    getCallBack : function() {
                        return this._callbackMethod;
                    }
                },

                {
                    'protocol' : ['Oskari.mapframework.request.Request']
                });

/* Inheritance */
