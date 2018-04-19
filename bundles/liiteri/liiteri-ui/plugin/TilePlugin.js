
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-ui.plugin.TilePlugin',
    function(instance, config, locale) {
        this.config = {
            'containerSelector': '#menubar',
            'tileSelector': '.oskari-tile',
            'titleTileSelector': '.oskari-tile-title'
        };
        $.extend(this.config, config);
        this.instance = instance;
        this.sandbox = instance.sandbox;
        this.locale = locale;
        this.templates = {
            "tile": '<div class="oskari-tile oskari-tile-closed">' + '<div class="oskari-tile-title"></div>' + '<div class="oskari-tile-status"></div>' + '</div>'
        };
    }, {
        __name: "LiiteriUITilePlugin",
        __qname: "Oskari.liiteri.bundle.liiteri-ui.plugin.TilePlugin",
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
        },
        _findTileContainer: function(tileName) {
            var config = this.config;
            return $(config.containerSelector)
                .find(config.titleTileSelector)
                .filter(function(i) { return $(this).text() === tileName; })
                .parents(config.tileSelector);
        },
        _createTile: function(desc) {
            var me = this;
            var config = me.config;
            var tile = $(me.templates['tile']);
            var title = tile.children(config.titleTileSelector);

            if (desc.sequenceNumber) {
                tile.attr('data-sequence', desc.sequenceNumber);
            }

            if (desc.handler) {
                var tileClick = function() {
                    desc.handler();
                };
                tile.click(tileClick);
            }

            title.append(desc.title);
//            if (desc.isSelected) {
//                me._selectTile(tile);
            //            }

            if (desc.hidden)
                tile.hide();
            if (desc.isSelected) {
                tile.removeClass('oskari-tile-closed');
                tile.addClass('oskari-tile-attached');
            }
            
            if (desc.indent) {
                title.addClass('indent');
            }

            return tile;
        },
        addTile: function(desc) {
            var me = this;
            var container = $(me.config.containerSelector);
            var tile = me._createTile(desc);
            me._putTileInContainer(tile, container);
        },
        _putTileInContainer: function (tile, container) {
            var me = this;
            var tileSeqNo = this._getSequenceNumber(tile);
            var tiles = container.find(me.config.tileSelector);
            var lastTile = null;
            for (var i = 0; i < tiles.length; i++) {
                var currentTile = tiles[i];
                var currentTileSeqNo = this._getSequenceNumber($(currentTile));
                if (currentTileSeqNo <= tileSeqNo) {
                    lastTile = currentTile;
                }
                else {
                    break;
                }
            }
            if (lastTile == null) {
                container.append(tile);
            } else {
                $(lastTile).after(tile);
            }
        },
        _getSequenceNumber: function (tile) {
            var sequenceNumber = tile.attr('data-sequence');
            if (typeof sequenceNumber === typeof undefined || sequenceNumber === false)
                sequenceNumber = 0;
            else
                sequenceNumber = Number(sequenceNumber);
            return sequenceNumber;
        },
        updateTile: function(tileName, operation) {
            var me = this;
            var container = me._findTileContainer(tileName);
            if (!container)
                return;

            if (operation == 'select') {
                container.removeClass('oskari-tile-closed');
                container.addClass('oskari-tile-attached');
            } else if (operation == 'unselect') {
                container.removeClass('oskari-tile-attached');
                container.addClass('oskari-tile-closed');
            } else if (operation == 'show') {
                container.show();
            } else if (operation == 'hide') {
                container.hide();
            }
        },
        _afterLayersLoadingEvent: function (event) {
            console.log('LayersLoadingEvent:' + event.getOperation());

            //FIXME: selector based on id
            var selector = ".oskari-tile[data-sequence='10'] > .oskari-tile-status";
            if (event.getOperation() == 'start') {
                $(selector).addClass('ajax-loader');
            }  else if (event.getOperation() == 'stop') {
                $(selector).removeClass('ajax-loader');
            }
        },
        eventHandlers: {
            // 'LayersLoadingEvent' : function (event) {
            //     this._afterLayersLoadingEvent(event);
            // },
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