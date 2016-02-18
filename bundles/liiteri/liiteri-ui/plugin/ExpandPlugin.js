
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-ui.plugin.ExpandPlugin',
    function(instance, config, locale) {
        this.config = {
            'expandId': 'maptools',
            'hideId': 'minimized_maptools',
            'hidenElementWidth': '16px',
            'expandedElementWidth': '180px',
            'elementExpandId': 'access_nav_show',
            'elementHideId': 'access_nav_hide',
        };
        $.extend(this.config, config);
        this.instance = instance;
        this.locale = locale;
        this.sandbox = instance.sandbox;
        this.templates = {
            "tile": '<div class="oskari-tile oskari-tile-closed">' + '<div class="oskari-tile-title"></div>' + '<div class="oskari-tile-status"></div>' + '</div>'
        };
        this.selectedTile = null;
    }, {
        __name: "LiiteriUIExpandPlugin",
        __qname: "Oskari.liiteri.bundle.liiteri-ui.plugin.ExpandPlugin",
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
            $('#' + me.config.elementHideId).click(function() {
                $('#' + me.config.expandId).hide();
                $('#' + me.config.hideId).show();
                var eventBuilder = me.sandbox.getEventBuilder('liiteri-ui.UISizeChangedEvent');
                if (eventBuilder) {
                    var event = eventBuilder('hide');
                    me.sandbox.notifyAll(event);
                }
            });

            $('#' + me.config.elementExpandId).click(function() {
                $('#' + me.config.hideId).hide();
                $('#' + me.config.expandId).show();
                var eventBuilder = me.sandbox.getEventBuilder('liiteri-ui.UISizeChangedEvent');
                if (eventBuilder) {
                    var event = eventBuilder('expand');
                    me.sandbox.notifyAll(event);
                }
            });
        },
        eventHandlers: {
            'liiteri-ui.UISizeChangedEvent': function(event) {
                var me = this;
                if (event.getOperation() == 'expand') {
//                    /* resize statsgrid */
//                    var leftWidth = $(".oskariui-left").width();
//                    var centerWidth = $(".oskariui-center").width();
//                    console.log(leftWidth + ' ' + centerWidth);
//                    $(".oskariui-left").width(leftWidth - 124);
//                    $(".oskariui-center").css('width', centerWidth + 'px');
                    /* change position of map */
                    $('#contentMap').css('margin-left', me.config.expandedElementWidth);
                    /* change postion of flyouts */
                    $(".oskari-flyout").css('left', me.config.expandedElementWidth);

                } else if (event.getOperation() == 'hide') {
//                    /* resize statsgrid */
//                    var leftWidth = $(".oskariui-left").width();
//                    var centerWidth = $(".oskariui-center").width();
//                    console.log(leftWidth + ' ' + centerWidth);
//                    $(".oskariui-left").width(leftWidth + 124);
//                    $(".oskariui-center").css('width', centerWidth + 'px');
                    /* change position of map */
                    $('#contentMap').css('margin-left', me.config.hidenElementWidth);
                    /* change postion of flyouts */
                    $(".oskari-flyout").css('left', me.config.hidenElementWidth);

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