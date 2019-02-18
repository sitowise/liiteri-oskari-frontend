
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-ui.plugin.AnalyticsPlugin',
    function(instance, config, locale) {
        this.config = {
        };
        $.extend(this.config, config);
        this.instance = instance;
        this.locale = locale;
        this.sandbox = instance.sandbox;

        this.selectedTile = null;
    }, {
        __name: "LiiteriUIAnalyticsPlugin",
        __qname: "Oskari.liiteri.bundle.liiteri-ui.plugin.AnalyticsPlugin",
        getQName: function() {
            return this.__qname;
        },

        getName: function() {
            return this.__name;
        },
        start: function() {

            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

            ga('create', this.config.analytics.trackingId, 'auto');
            ga('send', 'pageview');
            
            var me = this;
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    this.sandbox.registerForEventByName(me, p);
                }
            }
        },
        eventHandlers: {
            'liiteri-loging.LoginEvent': function(event) {
                if(typeof ga !== 'undefined')
                    ga('send', 'event', 'login', event.getType());
            },
            'AfterMapLayerAddEvent': function (event) {
                if(typeof ga !== 'undefined') {
                    var name = event.getMapLayer().getName();
                    //change name of users own layers, so that they are not confused with "real" layers
                    if(event.getMapLayer().getLayerType() === "myplaces" ||
                            event.getMapLayer().getLayerType() === "analysis" ||
                            event.getMapLayer().getLayerType() === "userlayer") {
                        name = event.getMapLayer().getLayerType();
                    } else if(event.getMapLayer().dataType === "USERWMS") {
                        name = event.getMapLayer().dataType;
                    }
                    ga('send', 'event', 'maplayer', name);
                }
            },
            'StatsGrid.IndicatorAdded': function (event) {
                if(typeof ga !== 'undefined') {
                      ga('send', 'event', 'indicator', ""+event.getIndicator(), ""+event.getYear());
                }
            }
        },
        onEvent: function(event) {
            var me = this,
                handler = me.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        },
    }, {
        'protocol': [
            "Oskari.mapframework.module.Module", 'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });