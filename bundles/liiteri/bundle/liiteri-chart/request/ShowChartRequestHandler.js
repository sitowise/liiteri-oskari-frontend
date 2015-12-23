
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-chart.request.ShowChartRequestHandler',

function(sandbox, view) {
    this.sandbox = sandbox;
    this.view = view;
}, {
    handleRequest: function (core, request) {
        this.view.renderChart(request.getData());
   }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
