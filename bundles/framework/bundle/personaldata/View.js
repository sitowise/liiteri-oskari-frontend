Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.View',/** * @static constructor function */function(instance) {	this.instance = instance;    this.container = null;	this.tabsData = [];}, {    /**     * called by host to start view operations     *     * @method startPlugin     */    startPlugin: function() {		var me = this,			sandbox = this.instance.getSandbox(),			tabsLocalization = me.instance.getLocalization('tabs');        //this.toolbar = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-groupings.GroupingsToolbar', 		//	this.instance.getLocalization(), this.instance);        // The extension bundle instance routes request         // to enter / exit mode by listening to and responding to userinterface.ExtensionUpdatedEvent         //this.requestHandler = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-groupings.request.MyRequestHandler', this);        //sandbox.addRequestHandler('liiteri-groupings.MyRequest', this.requestHandler);		this.tabsData = {			//"myViews": Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.MyViewsTab', me.instance, tabsLocalization.myviews),			//"publishedMaps": Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.PublishedMapsTab', me.instance, tabsLocalization.publishedmaps),			// TODO should we pass conf to accounttab here?			"account": Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.AccountTab', me.instance, tabsLocalization.account)		};    },    /**     * called by host to stop view operations     *     * @method stopPlugin     */    stopPlugin: function() {        //this.toolbar.destroy();        //this.instance.getSandbox().removeRequestHandler('liiteri-groupings.MyRequest', this.requestHandler);    },    /**     * called by host to change mode     *     * @method showMode     */    showMode: function(isShown, madeUpdateExtensionRequest) {        var sandbox = this.instance.getSandbox(),            mapModule = sandbox.findRegisteredModuleInstance('MainMapModule'),            map = mapModule.getMap(),            elCenter = this.getCenterColumn(),            elLeft = this.getLeftColumn();		        //this.toolbar.show(isShown);        if (isShown) {            /** ENTER The Mode */            /** show our mode view */            elCenter.                removeClass('span12').                addClass('span8');            elLeft.                removeClass('oskari-closed').                addClass('span4');							//var element = this.prepareView();			var element = this.container;            elLeft.empty();            elLeft.append(element);			        } else {            /** EXIT The Mode */            /** remove our mode view */            elCenter.                removeClass('span8').                addClass('span12');            elLeft.                addClass('oskari-closed').                removeClass('span4');            if (!madeUpdateExtensionRequest) {                // reset tile state if not triggered by tile click                sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this.instance, 'close']);            }        }        /** notify openlayers of map size change */        map.updateSize();    },    /**     * Get left column container     */    getLeftColumn : function() {        return jQuery('.oskariui-left');    },    /**     * Get center column container     */    getCenterColumn : function() {        return jQuery('.oskariui-center');    },    /**     * Get right column container     */    getRightColumn : function() {        return jQuery('.oskariui-right');    },		createUi: function () {		var me = this,			sandbox = me.instance.getSandbox(),			view = jQuery(this.container), // clear container			tabId,			tab,			panel;		view.empty();				view.addClass("personalDataViewContainer");				//header		var header = jQuery('<div class="personalDataViewHeader"></div>');		var iconClose = jQuery('<div class="icon-close"></div>');		var headerText = jQuery('<h4>' + 'Käyttäjän omat tiedot' + '</h4>');//TODO localization		header.append(iconClose);		header.append(headerText);		view.append(header);				view.find('div.header div.icon-close').bind('click', function () {			me.instance.showCustomView(false);		});				this.tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer',		this.instance.getLocalization('notLoggedIn'));		this.tabsContainer.insertTo(view);		//if (!sandbox.getUser().isLoggedIn()) {		//    return;		//}		// now we can presume user is logged in		for (tabId in this.tabsData) {			if (this.tabsData.hasOwnProperty(tabId)) {				tab = this.tabsData[tabId];				panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');				panel.setTitle(tab.getTitle());				tab.addTabContent(panel.getContainer());		   				// binds tab to events				if (tab.bindEvents) {					tab.bindEvents();				}				this.tabsContainer.addPanel(panel);			}		}	},		/**	 * CUSTOM FUNCTIONS	 */		/*prepareView: function() {		var me = this;		var container = jQuery("<div id='myContainer'>WIDOK</div>");		container.empty();								return container;	},*/		addTab: function (item) {		var sandbox = this.instance.getSandbox(),			panel;		//if (!sandbox.getUser().isLoggedIn()) {		//    return;		//}		panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');		panel.setTitle(item.title);		panel.setContent(item.content);		this.tabsContainer.addPanel(panel, item.first);	}	}, {    // the protocol / interface of this object is view    "protocol": ["Oskari.userinterface.View"],    // extends DefaulView    "extend": ["Oskari.userinterface.extension.DefaultView"]});