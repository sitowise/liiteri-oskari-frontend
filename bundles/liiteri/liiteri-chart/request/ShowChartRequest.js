Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-chart.request.ShowChartRequest',
function (data) {
    this._data = data;
},{
    __name: "liiteri-chart.ShowChartRequest",
    getName : function() {
        return this.__name;
    },
    getData: function () {
        return this._data;
    }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});