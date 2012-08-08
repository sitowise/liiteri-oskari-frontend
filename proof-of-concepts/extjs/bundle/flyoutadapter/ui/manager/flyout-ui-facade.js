Oskari.clazz.define('Oskari.poc.extjs.ui.OskariDIVManagerFacade',

/**
 * @constructor
 * 
 * creates a facade
 */
function(sandbox, manager, parts) {

	this.sandbox = sandbox;
	this.manager = manager;
	this.parts = parts;
	this.additionalComponents = [];
}, {
	/**
	 * @method registerPart
	 */
	registerPart : function(part, mod) {
		this.parts[part] = mod;
	},

	/**
	 * @method getSandbox
	 */
	getSandbox : function() {
		return this.sandbox;
	},

	/**
	 * @method getManager
	 */
	getManager : function() {
		return this.manager;
	},

	/**
	 * @method getParts
	 */
	getParts : function() {
		return this.parts;
	},

	showUIComponent : function(identifier, component, region) {

		var foundAtIndex = this.findUIComponentIndex(identifier);
		if (foundAtIndex != -1) {
			var compConf = this.additionalComponents[foundAtIndex];
			this.expandPart(compConf.region);
			if ('S' === compConf.region) {
				this.parts[compConf.region].setActiveTab(compConf.comp);
			} else if (compConf.comp.expand) {
				compConf.comp.expand(false);
			}
		}

	},

	/**
	 * @method removeUIComponent
	 * 
	 * removes an added ui component that matches given identifier TODO:
	 * experimental and lacking error handling
	 * 
	 */
	removeUIComponent : function(identifier) {
		var foundAtIndex = this.findUIComponentIndex(identifier);
		if (foundAtIndex != -1) {
			var compConf = this.additionalComponents[foundAtIndex];
			this.parts[compConf.region].remove(compConf.comp);
			this.additionalComponents.splice(foundAtIndex, 1);
		}
	},
	findUIComponentIndex : function(identifier) {
		var foundAtIndex = -1;
		for ( var i = 0; i < this.additionalComponents.length; ++i) {
			var compConf = this.additionalComponents[i];
			if (compConf.ident == identifier) {
				return i;
			}
		}
		return -1;
	},

	/**
	 * @method addUIComponent
	 * 
	 * adds ui component to requested region
	 * 
	 */
	addUIComponent : function(identifier, component, region) {

		// TODO: should we call actual manager instead of manipulating panels
		// here?
		this.parts[region].add(component);

		var compConf = {
			ident : identifier,
			region : region,
			comp : component
		};
		this.additionalComponents[identifier] = compConf;
	},
	/**
	 * @method appendExtensionModule
	 * 
	 * append and register bundle with optional UI component If UI component is
	 * not provided. Module init method should return UI component.
	 * 
	 * Wraps portlet kinds of panels with bundle close operations.
	 * 
	 * Registers events for extension bundle if requested
	 * 
	 */
	appendExtensionModule : function(module, identifier, eventHandlers,
			bundleInstance, regionDef, loc, comp) {

	
		var def = this.manager.addExtensionModule(module, identifier, eventHandlers,
				bundleInstance, regionDef, loc, comp);

		

		return def;
	},

	/**
	 * @method removeExtensionModule
	 * 
	 * remove and unregister module unregisters any events
	 */
	removeExtensionModule : function(module, identifier, eventHandlers,
			bundleInstance, def) {
		/*
		 * unregister events
		 */
		for (p in eventHandlers) {
			this.sandbox.unregisterFromEventByName(module, p);
		}

		this.sandbox.unregister(module);

	},

	/**
	 * @property collapseDirections
	 */
	collapseDirections : {
		'N' : Ext.Component.DIRECTION_TOP,
		'E' : Ext.Component.DIRECTION_RIGHT,
		'S' : Ext.Component.DIRECTION_BOTTOM,
		'W' : Ext.Component.DIRECTION_LEFT
	},

	/**
	 * @method collapsePart
	 */
	collapsePart : function(part) {
		if (this.parts['Drawer'][part]) {
			this.parts['Drawer'][part].collapse(this.collapseDirections[part],
					false);
		} else {
			this.parts[part].collapse(true);
		}
	},

	/**
	 * @method expandPart
	 */
	expandPart : function(part) {
		if (this.parts['Drawer'][part]) {
			this.parts['Drawer'][part].expand(false);
		} else {
			this.parts[part].expand(true);
		}
	}

}, {
	'protocol' : [ 'Oskari.mapframework.ui.manager.Facade' ]
});
