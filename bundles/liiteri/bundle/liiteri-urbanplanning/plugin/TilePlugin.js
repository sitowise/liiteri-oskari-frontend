Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-urbanplanning.plugin.TilePlugin',
    function (view, config, locale) {
        this.view = view;
        this.config = config;
        this.locale = locale;
        this.templates = {
            "tile": '<div class="oskari-tile oskari-tile-closed">' + '<div class="oskari-tile-title"></div>' + '<div class="oskari-tile-status"></div>' + '</div>'
        };
        this.selectedTile = null;
    }, {
        __name: "UrbanPlanningTilePlugin",
        __qname: "Oskari.liiteri.bundle.liiteri-urbanplanning.plugin.TilePlugin",        
        getQName: function() {
            return this.__qname;
        },

        getName: function() {
            return this.__name;
        },
        start: function () {
            var me = this;
            var container = $('#menubar');
            var tiles = [];
            $.each(this.config.tiles, function (id, desc) {
                var tile = me._createTile(id, desc);
                tiles.push(tile);
            });

            $.each(tiles, function(idx, tile) {
                container.append(tile);
            });
        },
        _createTile: function (id, desc) {
            var me = this;
            var tile = $(me.templates['tile']);
            var title = tile.children('.oskari-tile-title');
            var tileClick = function () {    
                me.view.showSubpage(desc.subPage);          
                me._selectTile(tile);
            };
            title.append(me.locale["tiles"][id]["title"]);
            tile.click(tileClick);
            if (desc.isSelected) {
                me._selectTile(tile);
            }

            return tile;
        },
        _selectTile: function (tile) {
            var me = this;
            if (me.selectedTile != null) {
                console.log('deselecting');
                me.selectedTile.removeClass('oskari-tile-attached');
                me.selectedTile.addClass('oskari-tile-closed');                
            }

            tile.removeClass('oskari-tile-closed');
            tile.addClass('oskari-tile-attached');
            me.selectedTile = tile;
        }
    }, {
        'protocol': [
            "Oskari.mapframework.module.Module", 'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    })