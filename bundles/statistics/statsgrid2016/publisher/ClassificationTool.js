Oskari.clazz.define('Oskari.mapframework.publisher.tool.ClassificationTool',
function() {
}, {
    index : 1,
    group: 'data',
    allowedLocations : ['top left', 'top right'],
    lefthanded: 'top right',
    righthanded: 'top left',

    allowedSiblings : [
        'Oskari.mapframework.bundle.mapmodule.plugin.MyLocationPlugin',
        'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons',
        'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar'
    ],

    /**
     * Initialize tool
     * @params {} state data
     * @method init
     * @public
     */
    init: function (pdata) {
        var me = this;

        var stats = Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');
        if(stats && this.isDisplayed(pdata)) {
            stats.showLegendOnMap(true);
        }
        if (pdata && Oskari.util.keyExists(pdata, 'configuration.statsgrid.conf') && pdata.configuration.statsgrid.conf.allowClassification !== false) {
            me.setEnabled(true);
        } else {
            me.setEnabled(false);
        }
    },
    // required for dragndrop in publisher - also plugin needs to
    getPlugin : function() {
        var stats = Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');
        return stats.plugin;
    },
    /**
    * Get tool object.
     * @params {}  pdta.configuration.publishedgrid.state
    * @method getTool
    * @private
    *
    * @returns {Object} tool
    */
    getTool: function(pdata){
        var me = this;
        if(!me.__tool) {
            me.__tool = {
                id: 'Oskari.statistics.statsgrid.plugin.ClassificationToolPlugin',
                title: 'allowClassification',
                config: {
                    allowClassification: false
                }
            };
         }
        return me.__tool;
    },
    /**
    * Get stats layer.
    * @method @private _getStatsLayer
    *
    * @return founded stats layer, if not found then null
    */
    _getStatsLayer: function(){
        var me = this,
            selectedLayers = me.__sandbox.findAllSelectedMapLayers(),
            statsLayer = null,
            layer;
        for (i = 0; i < selectedLayers.length; i += 1) {
            layer = selectedLayers[i];
            if (layer.getId() === 'STATS_LAYER') {
                statsLayer = layer;
                break;
            }
        }
        return statsLayer;
    },
    /**
    * Set enabled.
    * @method setEnabled
    * @public
    *
    * @param {Boolean} enabled is tool enabled or not
    */

    setEnabled : function(enabled) {
        var me = this;

        if(typeof enabled !== 'boolean') {
            enabled = false;
        }

        me.state.enabled = enabled;

        var stats = Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');
        if(stats) {
            stats.enableClassification(enabled);
        }
    },
    /**
    * Is displayed.
    * @method isDisplayed
    * @public
    *
    * @returns {Boolean} is tool displayed
    */
    isDisplayed: function(data) {
        var hasStatsLayerOnMap = this._getStatsLayer() !== null;
        if(hasStatsLayerOnMap) {
            // If there's a statslayer on the map show the tool for statistics functionality
            // relevant when creating a new published map
            return true;
        }
        // If there isn't one, the user hasn't visited the functionality on this session
        // Check if the user is editing a map with statslayer
        var configExists = Oskari.util.keyExists(data, 'configuration.statsgrid.conf');
        if(!configExists) {
            return false;
        }
        if(!Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid')) {
            Oskari.log('Oskari.mapframework.publisher.tool.ClassificationTool')
                .warn("Published map had config, but current appsetup doesn't include StatsGrid! " +
                  "The thematic map functionality will be removed if user saves the map!!");
            return false;
        }
        return true;
    },
    getValues: function() {
        var me = this,
            config  = me.__sandbox.getStatefulComponents().statsgrid.getConfiguration(),
            statsGridState = me.__sandbox.getStatefulComponents().statsgrid.getState();
        // just to make sure if user removes the statslayer while in publisher
        // if there is no statslayer on map -> don't setup publishedgrid
        // otherwise always return the state even if grid is not selected so
        //  publishedgrid gets the information it needs to render map correctly
        var statslayerOnMap = this._getStatsLayer();
        if(statslayerOnMap && statsGridState) {
            // without view = true -> the sidepanel is not shown when the statsgrid bundle starts
            statsGridState.view = me.state.enabled;
            return {
                configuration: {
                    statsgrid: {
                        conf : {
                            allowClassification: me.state.enabled,
                            legendLocation : this.getPlugin().getLocation(),
                            vectorViewer: config.vectorViewer
                        }
                    }
                }
            };
        } else {
            return {};
        }
    },
    /**
    * Stop tool.
    * @method stop
    * @public
    */
    stop: function() {
        var stats = Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');
        if(stats) {
            stats.enableClassification(true);
            stats.showLegendOnMap(false);
        }
    }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});