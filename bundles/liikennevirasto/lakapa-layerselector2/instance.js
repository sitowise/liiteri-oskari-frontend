/**
 * @class Oskari.liikennevirasto.bundle.lakapa.layerselector2.LayerSelectorBundleInstance
 *
 * Main component and starting point for the "all layers" functionality.
 * Lists all the layers available in Oskari.mapframework.service.MapLayerService and updates
 * UI if Oskari.mapframework.event.common.MapLayerEvent is received.
 *
 * See Oskari.liikennevirasto.bundle.lakapa.layerselector2.LayerSelectorBundle for bundle definition.
 */
Oskari.clazz.define("Oskari.liikennevirasto.bundle.lakapa.layerselector2.LayerSelectorBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
	this.sandbox = null;
	this.started = false;
	this.plugins = {};
	this.localization = null;
}, {
	/**
	 * @static
	 * @property __name
	 */
	__name : 'Lakapa-Layer-Selector',
	/**
	 * @method getName
	 * @return {String} the name for the component
	 */
	"getName" : function() {
		return this.__name;
	},
	/**
	 * @method setSandbox
	 * @param {Oskari.Sandbox} sandbox
	 * Sets the sandbox reference to this component
	 */
	setSandbox : function(sandbox) {
		this.sandbox = sandbox;
	},
	/**
	 * @method getSandbox
	 * @return {Oskari.Sandbox}
	 */
	getSandbox : function() {
		return this.sandbox;
	},

    /**
     * @method getLocalization
     * Returns JSON presentation of bundles localization data for current language.
     * If key-parameter is not given, returns the whole localization data.
     *
     * @param {String} key (optional) if given, returns the value for key
     * @return {String/Object} returns single localization string or
     * 		JSON object for complete data depending on localization
     * 		structure and if parameter key is given
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
	 * implements BundleInstance protocol start method
	 */
	"start" : function() {
		var me = this;

		if(me.started) {
            return;
		}

		me.started = true;

		var conf = this.conf;
		var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox' ;
		me.sandbox = Oskari.getSandbox(sandboxName);

		me.sandbox.register(me);
		for(p in me.eventHandlers) {
			me.sandbox.registerForEventByName(me, p);
		}

		//Let's extend UI
		var request = me.sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
		me.sandbox.request(this, request);

		// draw ui
		me.createUi();

    	var mapLayerService = me.sandbox.getService('Oskari.mapframework.service.MapLayerService');

        me.sandbox.registerAsStateful(this.mediator.bundleId, this);

		var successCB = function() {
			// massive update so just recreate the whole ui
			//me.plugins['Oskari.userinterface.Flyout'].populateLayers();
			// added through maplayerevent
		};
		var failureCB = function() {
		};

		// We do not need to load the layers from backend, they're all defined in the config file.
		//mapLayerService.loadAllLayersAjax(successCB, failureCB);
	},
	/**
	 * @method init
	 * implements Module protocol init method - does nothing atm
	 */
	"init" : function() {
		return null;
	},
	/**
	 * @method update
	 * implements BundleInstance protocol update method - does nothing atm
	 */
	"update" : function() {

	},
	/**
	 * @method onEvent
	 * @param {Oskari.mapframework.event.Event} event a Oskari event object
	 * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
	 */
	onEvent : function(event) {

		var handler = this.eventHandlers[event.getName()];
		if(!handler)
			return;

		return handler.apply(this, [event]);

	},
    /**
     * @property {Object} eventHandlers
     * @static
     */
	eventHandlers : {
		/**
		 * @method AfterMapLayerRemoveEvent
		 * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
		 *
		 * Calls flyouts handleLayerSelectionChanged() method
		 */
		'AfterMapLayerRemoveEvent' : function(event) {
			this.plugins['Oskari.userinterface.Flyout'].handleLayerSelectionChanged(event.getMapLayer(), false);
		},
		/**
		 * @method AfterMapLayerAddEvent
		 * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
		 *
		 * Calls flyouts handleLayerSelectionChanged() method
		 */
		'AfterMapLayerAddEvent' : function(event) {
			this.plugins['Oskari.userinterface.Flyout'].handleLayerSelectionChanged(event.getMapLayer(), true);
		},
		/**
		 * @method MapLayerEvent
		 * @param {Oskari.mapframework.event.common.MapLayerEvent} event
		 */
		'MapLayerEvent' : function(event) {

        	var mapLayerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        	var layerId = event.getLayerId();

        	if(event.getOperation() === 'update') {
        		var layer = mapLayerService.findMapLayer(layerId);
				this.plugins['Oskari.userinterface.Flyout'].handleLayerModified(layer);
			}
			else if(event.getOperation() === 'add') {
        		var layer = mapLayerService.findMapLayer(layerId);
				this.plugins['Oskari.userinterface.Flyout'].handleLayerAdded(layer);
				// refresh layer count
				this.plugins['Oskari.userinterface.Tile'].refresh();
			}
			else if(event.getOperation() === 'remove') {
				this.plugins['Oskari.userinterface.Flyout'].handleLayerRemoved(layerId);
				// refresh layer count
				this.plugins['Oskari.userinterface.Tile'].refresh();
			}
		}
	},

	/**
	 * @method stop
	 * implements BundleInstance protocol stop method
	 */
	"stop" : function() {
		var sandbox = this.sandbox();
		for(p in this.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}

		var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

		sandbox.request(this, request);

        this.sandbox.unregisterStateful(this.mediator.bundleId);
		this.sandbox.unregister(this);
		this.started = false;
	},
	/**
	 * @method startExtension
	 * implements Oskari.userinterface.Extension protocol startExtension method
	 * Creates a flyout and a tile:
	 * Oskari.mapframework.bundle.layerselector2.Flyout
	 * Oskari.mapframework.bundle.layerselector2.Tile
	 */
	startExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.liikennevirasto.bundle.lakapa.layerselector2.Flyout', this);
		this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.liikennevirasto.bundle.lakapa.layerselector2.Tile', this);
	},
	/**
	 * @method stopExtension
	 * implements Oskari.userinterface.Extension protocol stopExtension method
	 * Clears references to flyout and tile
	 */
	stopExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = null;
		this.plugins['Oskari.userinterface.Tile'] = null;
	},
	/**
	 * @method getPlugins
	 * implements Oskari.userinterface.Extension protocol getPlugins method
	 * @return {Object} references to flyout and tile
	 */
	getPlugins : function() {
		return this.plugins;
	},
	/**
	 * @method getTitle
	 * @return {String} localized text for the title of the component
	 */
	getTitle : function() {
		return this.getLocalization('title');
	},
	/**
	 * @method getDescription
	 * @return {String} localized text for the description of the component
	 */
	getDescription : function() {
		return this.getLocalization('desc');
	},
	/**
	 * @method createUi
	 * (re)creates the UI for "all layers" functionality
	 */
	createUi : function() {
		var me = this;
		this.plugins['Oskari.userinterface.Flyout'].createUi();
		this.plugins['Oskari.userinterface.Tile'].refresh();
	},

    /**
     * @method setState
     * @param {Object} state bundle state as JSON
     */
    setState : function(state) {
        if(jQuery('.liikennevirasto__lakapa__layer__selector2').hasClass('oskari-tile-attached')){
            jQuery('.liikennevirasto__lakapa__layer__selector2').trigger('click');
        }

        if(jQuery('.liikennevirasto__lakapa__layer__selector2').next().hasClass('oskari-tile-attached')){
            jQuery('.liikennevirasto__lakapa__layer__selector2').next().trigger('click');
        }
    },

    /**
     * @method getState
     * @return {Object} bundle state as JSON
     */
    getState : function() {
        return this.plugins['Oskari.userinterface.Flyout'].getContentState();
    }
}, {
	/**
	 * @property {String[]} protocol
	 * @static
	 */
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
