
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-ui.plugin.MapTilePlugin',
    function(instance, config, locale) {
        this.config = {
            'containerId': 'menubar',
            'tileClass': 'oskari-tile',
            'titleTileClass': 'oskari-tile-title',
            'extensions': ['maplegend', 'LayerSelector', 'liiteri-servicepackages']
        };
        $.extend(this.config, config);
        this.instance = instance;
        this.sandbox = instance.sandbox;
        this.locale = locale != null ? locale : instance.getLocalization();
        this.templates = {
            "tile": '<div class="oskari-tile oskari-tile-closed">' + '<div class="oskari-tile-title"></div>' + '<div class="oskari-tile-status"></div>' + '</div>'
        };
    }, {
        __name: "LiiteriUIMapTilePlugin",
        __qname: "Oskari.liiteri.bundle.liiteri-ui.plugin.MapTilePlugin",
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

            var tileDescription = {
                'title': me.locale.tile.title,
                'isSelected': true,
                'handler': function() {
                    var extension = me.sandbox.findRegisteredModuleInstance('StatsGrid');
                    if (extension != null && extension != undefined) {
                        //FIXME check if StatsGrid is open
                        me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [extension, 'close']);
                    }
                }
            };
            var tileRequest = this.sandbox.getRequestBuilder('liiteri-ui.UIAddTileRequest')(tileDescription);
            this.sandbox.request(this.instance, tileRequest);
        },
        eventHandlers: {
            'userinterface.ExtensionUpdatedEvent': function(event) {
                var me = this;
                var j, extension;
                var isShown = event.getViewState() !== "close";
                var tileRequests = [];
                if (event.getExtension().getName() === 'StatsGrid') {
                    if (isShown) {
                        tileRequests.push(me.sandbox.getRequestBuilder('liiteri-ui.UIUpdateTileRequest')(me.locale.tile.title, 'unselect'));
                        for (j = 0; j < me.config.extensions.length; j++) {
                            extension = me.sandbox.findRegisteredModuleInstance(me.config.extensions[j]);
                            if (extension != null)
                                tileRequests.push(me.sandbox.getRequestBuilder('liiteri-ui.UIUpdateTileRequest')(extension.getLocalization('title'), 'hide'));
                        }
                    } else {
                        tileRequests.push(me.sandbox.getRequestBuilder('liiteri-ui.UIUpdateTileRequest')(me.locale.tile.title, 'select'));
                        for (j = 0; j < me.config.extensions.length; j++) {
                            extension = me.sandbox.findRegisteredModuleInstance(me.config.extensions[j]);
                            if (extension != null)
                                tileRequests.push(me.sandbox.getRequestBuilder('liiteri-ui.UIUpdateTileRequest')(extension.getLocalization('title'), 'show'));
                        }
                    }
                }

                for (var i = 0; i < tileRequests.length; i++) {
                    me.sandbox.request(this.instance, tileRequests[i]);
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