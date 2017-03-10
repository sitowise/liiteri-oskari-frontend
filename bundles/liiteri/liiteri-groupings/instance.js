/** * This bundle logs the map click coordinates to the console. This is a demonstration of using DefaultExtension. * * @class Oskari.liiteri.bundle.liiteri-groupings.LiiteriGroupingsInstance */Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-groupings.LiiteriGroupingsBundleInstance',/** * @method create called automatically on construction * @static */function () {    // Best practice is to initialize instance variables here.    //this.myVar = undefined;	this.plugins = {};}, {    /**     * @static     * @property __name     */    __name : 'liiteri-groupings',    /**     * Module protocol method     *     * @method getName     */    getName : function () {        return this.__name;    },    eventHandlers: {		'userinterface.ExtensionUpdatedEvent': function (event) {			/*var me = this,				view = me.plugins['Oskari.userinterface.View'];			if (event.getExtension().getName() !== me.getName()) {				// not me -> do nothing				return;			}			var isShown = event.getViewState() !== "close";			view.showMode(isShown, null);*/		},		/**		 * @method AfterMapLayerRemoveEvent		 * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event		 *		 * Calls flyouts handleLayerSelectionChanged() method		 */		'AfterMapLayerRemoveEvent': function (event) {					    this.plugins['Oskari.userinterface.View'].handleLayerRemoved(event.getMapLayer());		},		/**		 * @method AfterMapLayerAddEvent		 * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event		 *		 * Calls flyouts handleLayerSelectionChanged() method		 */		'AfterMapLayerAddEvent': function (event) {					    this.plugins['Oskari.userinterface.View'].handleLayerAdded(event.getMapLayer());		},		'liiteri-groupings.GroupingUpdatedEvent': function (event) {			this.plugins['Oskari.userinterface.Flyout'].refreshGroupingsList();		}    },		/**	 * @method getLocalization	 * Convenience method to call from Tile and Flyout	 * Returns JSON presentation of bundles localization data for current language.	 * If key-parameter is not given, returns the whole localization data.	 *	 * @param {String} key (optional) if given, returns the value for key	 * @return {String/Object} returns single localization string or	 *      JSON object for complete data depending on localization	 *      structure and if parameter key is given	 */	getLocalization: function (key) {		if (!this._localization) {			this._localization = Oskari.getLocalization(this.getName());		}		if (key) {			return this._localization[key];		}		return this._localization;	},		/**	 * @method startExtension	 * Extension protocol method	 */	startExtension: function () {		var me = this;		me.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-groupings.Flyout', me);		me.plugins['Oskari.userinterface.View'] = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-groupings.EditView', me);	},		/**	 * @method stopExtension	 * implements Oskari.userinterface.Extension protocol stopExtension method	 * Clears references to flyout and tile	 */	stopExtension: function () {		this.plugins['Oskari.userinterface.Flyout'] = null;		this.plugins['Oskari.userinterface.Tile'] = null;		this.plugins['Oskari.userinterface.View'] = null;	},		    /**     * DefaultExtension method for doing stuff after the bundle has started.     *      * @method start     */    start: function () {		var conf = this.conf,			sandboxName = (conf ? conf.sandbox : null) || 'sandbox',			sandbox = Oskari.getSandbox(sandboxName),			request;		this.sandbox = sandbox;		/* Register to sandbox in order to be able to listen to events */		sandbox.register(this);				for (p in this.eventHandlers) {			if (this.eventHandlers.hasOwnProperty(p)) {				sandbox.registerForEventByName(this, p);			}		}		/* Register as stateful if configured so */		if (conf && conf.stateful === true) {			sandbox.registerAsStateful(this.mediator.bundleId, this);		}				var service = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-groupings.service.GroupingsService', this);		sandbox.registerService(service);		this.service = service;		var showGroupingsFlyoutRequestHandler = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-groupings.request.ShowGroupingsFlyoutRequestHandler', this);        sandbox.addRequestHandler('liiteri-groupings.ShowGroupingsFlyoutRequest', showGroupingsFlyoutRequestHandler);				/* Add extensions (Tile, Flyout, View). */		/* Localization should have keys 'tile', 'flyout' and 'view' to start these, respectively. */		/* Missing key means no extension for you. */		request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest');		sandbox.request(this, request(this));		/* Necessities done, let's get to business */		//console.log('Bundle', this.getName(), 'started');		//this.myVar = 'foobar';				this._createUI();			},			/**	 * @method _createUI	 * @private	 *	 * Custom method, do what ever you like	 * Best practices: start internal/private methods with an underscore	 */	_createUI: function () {		var me = this;		for (var pluginType in me.plugins) {			if (pluginType) {				me.plugins[pluginType].createUI();			}		}	},		showCustomView: function(enabled, deniedLayers, data, isTheme) {		//TODO: deniedLayers?		var me = this;				if (enabled) {		    // close/hide flyout - TODO: how about other flyouts, popups/gfi?		    me.plugins['Oskari.userinterface.Flyout'].hide();		} else {		    me.plugins['Oskari.userinterface.Flyout'].show();		}		this.plugins['Oskari.userinterface.View'].showMode(enabled, true, me.getLocalization('BasicView'), data, isTheme);	},		//TODO: Change the way of getting layers:		/**	 * @method hasPublishRight	 * Checks if the layer can be published.	 * @param	 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}	 * layer	 *      layer to check	 * @return {Boolean} true if the layer can be published	 */	hasPublishRight: function (layer) {		// permission might be "no_publication_permission"		// or nothing at all		return (layer.getPermission('publish') === 'publication_permission_ok');	},	/**	 * @method getLayersWithoutPublishRights	 * Checks currently selected layers and returns a subset of the list	 * that has the layers that can't be published. If all selected	 * layers can be published, returns an empty list.	 * @return	 * {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}	 * list of layers that can't be published.	 */	getLayersWithoutPublishRights: function () {		var deniedLayers = [],			selectedLayers = this.sandbox.findAllSelectedMapLayers(),			i,			layer;		for (i = 0; i < selectedLayers.length; i += 1) {			layer = selectedLayers[i];			if (!this.hasPublishRight(layer) &&				layer.getId().toString().indexOf('myplaces_') < 0) {				deniedLayers.push(layer);			}		}		return deniedLayers;	},	showFlyout: function () {		var me = this;		jQuery(me.plugins['Oskari.userinterface.Flyout'].container).parent().parent().css('display', 'block');		$(me.plugins['Oskari.userinterface.Flyout'].container).parent().prev().find(".icon-close").on('click', function(){			me.hideFlyout();		});	},	hideFlyout: function () {		var me = this;		$(me.plugins['Oskari.userinterface.Flyout'].container).parent().parent().css('display', '');	}}, {    "extend" : ["Oskari.userinterface.extension.DefaultExtension"]});