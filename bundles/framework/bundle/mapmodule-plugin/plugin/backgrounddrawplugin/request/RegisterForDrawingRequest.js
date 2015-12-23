Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.BackgroundDrawPlugin.request.RegisterForDrawingRequest',

function (register) {
    this._isRegister = register;
}, {
    __name: "BackgroundDrawPlugin.RegisterForDrawingRequest",
    getName: function () {
        return this.__name;
    },
    isRegisterAction: function() {
        return this._isRegister;
    }
}, {
    'protocol': ['Oskari.mapframework.request.Request']
});