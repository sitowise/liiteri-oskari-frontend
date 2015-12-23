Oskari.clazz.define("Oskari.liiteri.bundle.liiteri-chart.LiiteriChartBundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.defaults = {
            "name": "liiteri-chart",
            "sandbox": "sandbox",
            "stateful": false,
            "tileClazz": null,//"Oskari.liiteri.bundle.liiteri-chart.Tile",
            "flyoutClazz": null,//"Oskari.liiteri.bundle.liiteri-chart.Flyout",
            "viewClazz": "Oskari.liiteri.bundle.liiteri-chart.View",
            "isFullScreenExtension": false
    };
        this.state = {};
        this.service = null;
    }, {
        __name: 'liiteri-chart',
        getName: function () {
            return this.__name;
        },
        eventHandlers: {
            'userinterface.ExtensionUpdatedEvent': function (event) {
                var me = this;
                
                if (event.getExtension().getName() !== me.getName()) {
                    // not me -> do nothing
                    return;
                }

                var isShown = event.getViewState() !== "close";
                
                if (isShown) {
                    var data = {
                        series: [
                            [12.5, 13.2, 13.9],
                            [14.5, 14.3, 13.6],
                            [12.7, 12.8, 12.7]
                        ],
                        categories: [
                            "Helsinki", "Espoo", "Kuusamo"
                        ],
                        serieVariants: [
                            "Stat1/2010", "Stat1/2011", "Stat1/2012"
                        ]
                    };
                    var request = me.sandbox.getRequestBuilder('liiteri-chart.ShowChartRequest')(data);
                    me.sandbox.request(me, request);
                }
            }
        },
        start: function() {
            var conf = $.extend(this.conf, this.defaults),
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                request;

            this.sandbox = sandbox;
            sandbox.register(this);

            if (conf && conf.stateful === true) {
                sandbox.registerAsStateful(this.mediator.bundleId, this);
            }

//            var service = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-urbanplanning.service.UrbanPlanningService', this);
//            sandbox.registerService(service);
            //            this.service = service;
            //

            request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest');
            sandbox.request(this, request(this));

            //this._getFlyout().createUI();

            var showChartRequestHandler = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-chart.request.ShowChartRequestHandler', sandbox, this._getView());
            sandbox.addRequestHandler('liiteri-chart.ShowChartRequest', showChartRequestHandler);

            //this.plugins['Oskari.userinterface.View'].showMode(true, true)
        },
        _getFlyout: function () {
            return this.plugins['Oskari.userinterface.Flyout'];
        },
        _getView: function () {
            return this.plugins['Oskari.userinterface.View'];
        },
    }, {
        "extend": ["Oskari.userinterface.extension.DefaultExtension"]
    });