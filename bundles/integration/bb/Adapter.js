/**
 * @class Oskari.integration.bundle.bb.AdapterBundleInstance
 *
 *
 * PoC to Bind Backbone to Blackbone's dark side
 *
 *
 *
 *
 * Add this to startupsequence to get this bundle started
 {
 title : 'bb',
 fi : 'bb',
 sv : '?',
 en : '?',
 bundlename : 'bb',
 bundleinstancename : 'bb',
 metadata : {
 "Import-Bundle" : {
 "bb" : {
 bundlePath : '/<path to>/packages/integration/bundle/'
 }
 },
 "Require-Bundle-Instance" : []
 },
 instanceProps : {}
 }
 */
Oskari.clazz.define('Oskari.integration.bundle.bb.AdapterBundleInstance',

/**
 * @method create called automatically on construction
 * @static
 */
function(name,viewClazz) {
    this.sandbox = null;
    this.plugins = {};
    this._localization = null;
    this._viewClazz = viewClazz;
    this._name = name;
    this._view = null;

}, {

    /**
     * @method getTitle
     * Extension protocol method
     * @return {String} localized text for the title of the component
     */
    getTitle : function() {
        return this.getLocalization('title');
    },
    /**
     * @method getDescription
     * Extension protocol method
     * @return {String} localized text for the description of the component
     */
    getDescription : function() {
        return this.getLocalization('desc');
    },
    /**
     * @method getSandbox
     * Convenience method to call from Tile and Flyout
     * @return {Oskari.Sandbox}
     */
    getSandbox : function() {
        return this.sandbox;
    },
    /**
     * @method update
     * BundleInstance protocol method
     */
    update : function() {
    },
    /**
     * @method getLocalization
     * Convenience method to call from Tile and Flyout
     * Returns JSON presentation of bundles localization data for current language.
     * If key-parameter is not given, returns the whole localization data.
     *
     * @param {String} key (optional) if given, returns the value for key
     * @return {String/Object} returns single localization string or
     *      JSON object for complete data depending on localization
     *      structure and if parameter key is given
     */
    getLocalization : function(key) {
        if(!this._localization) {
            this._localization = Oskari.getLocalization(this.getName());
        }
        if(key) {
            return this._localization[key];
        }
        return this._localization;
    },
    /**
     * @method start
     * BundleInstance protocol method
     */
    start : function() {
        var me = this;
        var conf = me.conf ;
        var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox' ;
        var sandbox = Oskari.getSandbox(sandboxName);

        me.sandbox = sandbox;
        sandbox.register(this);

        var showAdminLayerselectorFlyoutRequestHandler = Oskari.clazz.create('Oskari.integration.bundle.admin-layerselector.request.ShowAdminLayerselectorFlyoutRequestHandler', this);
        sandbox.addRequestHandler('ShowAdminLayerselectorFlyoutRequest', showAdminLayerselectorFlyoutRequestHandler);
        
        /* stateful */
//        sandbox.registerAsStateful(this.mediator.bundleId, this);

        var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);

        sandbox.request(this, request);


    },
    /**
     * @method stop
     * BundleInstance protocol method
     */
    stop : function() {
        var sandbox = this.sandbox,
            request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);
        sandbox.request(this, request);
        sandbox.unregister(this);
        this.sandbox = null;
        this.started = false;
    },
    /**
     * @method startExtension
     * Extension protocol method
     */
    startExtension : function() {
        var me = this,
            sandbox = me.sandbox,
            locFlyout = me.getLocalization('flyout'),
            viewCls = this._viewClazz,
            view = Oskari.clazz.create(viewCls,this.getLocalization('view'),this,this.getConfiguration()),
            p;
        this.view = view;

        for(p in view.eventHandlers) {
            if(view.eventHandlers.hasOwnProperty(p)) {
                sandbox.registerForEventByName(view, p);
            }
        }

        me.plugins['Oskari.userinterface.Flyout'] =
            Oskari.clazz.create('Oskari.integration.bundle.bb.Flyout', me, locFlyout, view);

        if(view.init !== null && view.init !== undefined) {
            this.view.init();
        }

        var locTile = me.getLocalization('tile');
    },
    /**
     * @method stopExtension
     * Extension protocol method
     */
    stopExtension : function() {
        var me = this,
            pluginType,
            sandbox = me.sandbox,
            view = me.view,
            p;
        for (p in view.eventHandlers) {
            if(view.eventHandlers.hasOwnProperty(p)) {
                sandbox.unregisterFromEventByName(view, p);
            }
        }
        for (pluginType in me.plugins) {
            if(pluginType) {
                me.plugins[pluginType] = null;
            }
        }
    },
    /**
     * @method getPlugins
     * Extension protocol method
     */
    getPlugins : function() {
        return this.plugins;
    },

    'init' : function() {
        return null;
    },
    /**
     * @method getName
     * Module protocol method
     */
    getName : function() {
        return this._name;
    },

    /**
     * @method getConfiguration
     */
    getConfiguration : function() {
        return this.conf;
    },

    /**
     * @method setState
     * @param {Object} state bundle state as JSON
     */
    setState : function() {
    },

    /*
     * @method getState
     * @return {Object} bundle state as JSON
     */
    getState : function() {
    },
    showFlyout: function () {
		var me = this;
		jQuery(me.plugins['Oskari.userinterface.Flyout'].container).parent().parent().css('display', 'block');
		$(me.plugins['Oskari.userinterface.Flyout'].container).parent().prev().find(".icon-close").on('click', function(){
			me.hideFlyout();
		});
	},
	hideFlyout: function () {
		var me = this;
		$(me.plugins['Oskari.userinterface.Flyout'].container).parent().parent().css('display', '');
    }

}, {
    protocol : ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
