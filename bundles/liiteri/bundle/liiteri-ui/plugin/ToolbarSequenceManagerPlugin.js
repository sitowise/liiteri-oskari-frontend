
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-ui.plugin.ToolbarSequenceManagerPlugin',
    function(instance, config, locale) {
        this.config = {
            'groups' : [ 'myplaces', 'sharing']
        };
        $.extend(this.config, config);
        this.instance = instance;
        this.sandbox = instance.sandbox;
        this.locale = locale;
        this.templates = {
            "tile": '<div class="oskari-tile oskari-tile-closed">' + '<div class="oskari-tile-title"></div>' + '<div class="oskari-tile-status"></div>' + '</div>'
        };
    }, {
        __name: "LiiteriUIToolbarSequenceManagerPlugin",
        __qname: "Oskari.liiteri.bundle.liiteri-ui.plugin.ToolbarSequenceManagerPlugin",
        getQName: function() {
            return this.__qname;
        },

        getName: function() {
            return this.__name;
        },
        start: function() {
            var me = this;
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    this.sandbox.registerForEventByName(me, p);
                }
            }

            for (var i = 0; i < this.config.groups.length; i++) {
                var buttonGroup = this.config.groups[i];
                var reqBuilder = this.sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
                this.sandbox.request(this.instance, reqBuilder("fake-" + i, buttonGroup, { 'callback': function () { } }));
            }                       
        },
        eventHandlers: {
        
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