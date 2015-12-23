Oskari.clazz.define("Oskari.liiteri.bundle.liiteri-ui.LiiteriUIBundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.defaults = {
            "name": "liiteri-ui",
            "sandbox": "sandbox",
            "stateful": false,
            "tileClazz": null,//"Oskari.liiteri.bundle.liiteri-ui.Tile",
            "flyoutClazz": null,//"Oskari.liiteri.bundle.liiteri-ui.Flyout",
            "viewClazz": null,//"Oskari.liiteri.bundle.liiteri-ui.View",
            "isFullScreenExtension": false
    };
        this.state = {};
        this.service = null;
    }, {
        __name: 'liiteri-ui',
        getName: function () {
            return this.__name;
        },
        eventHandlers: {
            'userinterface.ExtensionUpdatedEvent': function (event) {
                var me = this;

//				//TODO make the selecting of the tile better way
//				var isShown = event.getViewState() !== "close";
//				if (event.getExtension().getName() === 'StatsGrid') {
//					if (isShown) {
//						this.plugins['Oskari.userinterface.Tile'].container[0].className = 	"oskari-tile oskari-tile-closed";
//					} else {
//						this.plugins['Oskari.userinterface.Tile'].container[0].className = 	"oskari-tile oskari-tile-attached";
//					}
//				} else if (event.getExtension().getName() === me.getName()) {
//					var sandbox = Oskari.getSandbox();
//                    var statsModule = sandbox.findRegisteredModuleInstance('StatsGrid');
//					
//					var statsClassName = statsModule.plugins['Oskari.userinterface.Tile'].container[0].className;
//					if (statsClassName === 'oskari-tile oskari-tile-closed') {
//						this.plugins['Oskari.userinterface.Tile'].container[0].className = 	"oskari-tile oskari-tile-attached";
//					}
//                }
            }
        },
        start: function() {
            var conf = $.extend({}, this.defaults, this.conf),
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                request;
            this.conf = conf;
            this.sandbox = sandbox;
            sandbox.register(this);

            if (conf && conf.stateful === true) {
                sandbox.registerAsStateful(this.mediator.bundleId, this);
            }

            if (conf.urbanPlansView) {
                conf.tileClazz = null;
            }

            var service = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-ui.service.UIConfigurationService');
            sandbox.registerService(service);
            this.service = service;

            this.expandPlugin = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-ui.plugin.ExpandPlugin', this);
            this.expandPlugin.start();
            this.tilePlugin = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-ui.plugin.TilePlugin', this);
            this.tilePlugin.start();
            this.toolbarSequenceManagerPlugin = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-ui.plugin.ToolbarSequenceManagerPlugin', this);
            this.toolbarSequenceManagerPlugin.start();
            this.analyticsPlugin = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-ui.plugin.AnalyticsPlugin', this, this.conf);
            this.analyticsPlugin.start();

            sandbox.addRequestHandler('liiteri-ui.UIUpdateTileRequest', Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-ui.request.UIUpdateTileRequestHandler', this.tilePlugin));
            sandbox.addRequestHandler('liiteri-ui.UIAddTileRequest', Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-ui.request.UIAddTileRequestHandler', this.tilePlugin));

            if (!conf.urbanPlansView) {
                this.mapTilePlugin = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-ui.plugin.MapTilePlugin', this);
                this.mapTilePlugin.start();
            }

            request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest');
            sandbox.request(this, request(this));			
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
