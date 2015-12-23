/**
 * @class Oskari.mapframework.bundle.layerselector2.Flyout
 *
 * Renders the "all layers" flyout.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.layerselector2.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.layerselector2.LayerSelectorBundleInstance} instance
     *    reference to component that created the flyout
     */

    function (instance) {
        //"use strict";
        this.instance = instance;
        this.container = null;
        this.template = null;
        this.state = null;
        this.layerTabs = [];
		this.servicePackageTab = null;
		this.populateGroupingsTimeout = null;
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            //"use strict";
            return 'Oskari.mapframework.bundle.layerselector2.Flyout';
        },
        /**
         * @method setEl
         * @param {Object} el
         *     reference to the container in browser
         * @param {Number} width
         *     container size(?) - not used
         * @param {Number} height
         *     container size(?) - not used
         *
         * Interface method implementation
         */
        setEl: function (el, width, height) {
            //"use strict";
            this.container = el[0];
            if (!jQuery(this.container).hasClass('layerselector2')) {
                jQuery(this.container).addClass('layerselector2');
            }
        },

        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates that will be used to create the UI
         */
        startPlugin: function () {
            //"use strict";
            var me = this,                                
                inspireTab, orgTab, publishedTab;

            me.template = jQuery('<div class="allLayersTabContent"></div>');            			

			if (me.instance.conf && me.instance.conf.showUserThemes) {
			    this.userThemesTab = Oskari.clazz.create("Oskari.mapframework.bundle.layerselector2.view.LayersTab", me.instance, me.instance.getLocalization('filter').userThemes);
			    me.layerTabs.push(this.userThemesTab);
			}						            
			//me.instance.conf.showInspireTab = true;
            if (me.instance.conf && me.instance.conf.showInspireTab) {
                inspireTab = Oskari.clazz.create("Oskari.mapframework.bundle.layerselector2.view.LayersTab", me.instance, me.instance.getLocalization('filter').inspire);
                inspireTab.groupingMethod = 'getInspireName';
                me.layerTabs.push(inspireTab);
            }
           //me.instance.conf.showOrganisationTab = true;
            if (me.instance.conf && me.instance.conf.showOrganisationTab) {
                orgTab = Oskari.clazz.create("Oskari.mapframework.bundle.layerselector2.view.LayersTab", me.instance, me.instance.getLocalization('filter').organization);
                orgTab.groupingMethod = 'getOrganizationName';
                me.layerTabs.push(orgTab);
            }
            
            //me.instance.conf.showPublishedTab = true;
            // add published tab based on config
            if (me.instance.conf && me.instance.conf.showPublishedTab === true) {
                publishedTab = Oskari.clazz.create("Oskari.mapframework.bundle.layerselector2.view.PublishedLayersTab", me.instance, me.instance.getLocalization('filter').published);
                this.layerTabs.push(publishedTab);
            }

            // add service package tab based on config
            if (me.instance.conf && me.instance.conf.showServicePackage === true) {
                this.servicePackageTab = Oskari.clazz.create("Oskari.mapframework.bundle.layerselector2.view.LayersTab", me.instance, me.instance.getLocalization('filter').servicePackage);
                this.servicePackageTab.servicePackage = true;
                me.layerTabs.push(this.servicePackageTab);
            }
        },
        /**
         * @method stopPlugin
         *
         * Interface method implementation, does nothing atm
         */
        stopPlugin: function () {
            //"use strict";
        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            //"use strict";
            return this.instance.getLocalization('title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the flyout
         */
        getDescription: function () {
            //"use strict";
            return this.instance.getLocalization('desc');
        },
        /**
         * @method getOptions
         * Interface method implementation, does nothing atm
         */
        getOptions: function () {
            //"use strict";
        },
        /**
         * @method setState
         * @param {String} state
         *     close/minimize/maximize etc
         * Interface method implementation, does nothing atm
         */
        setState: function (state) {
            //"use strict";
            this.state = state;
        },
        setContentState: function (state) {
            //"use strict";
            var i,
                tab;
            // prepare for complete state reset
            if (!state) {
                state = {};
            }

            for (i = 0; i < this.layerTabs.length; i += 1) {
                tab = this.layerTabs[i];
                if (tab.getTitle() === state.tab) {
                    this.tabContainer.select(tab.getTabPanel());
                    tab.setState(state);
                }
            }
        },
        getContentState: function () {
            //"use strict";
            var state = {},
                i,
                tab;
            for (i = 0; i < this.layerTabs.length; i += 1) {
                tab = this.layerTabs[i];
                if (this.tabContainer.isSelected(tab.getTabPanel())) {
                    state = tab.getState();
                    break;
                }
            }
            return state;
        },
        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function () {
            //"use strict";
            var me = this,
                // clear container
                cel = jQuery(this.container),
                i,
                tab;
            cel.empty();

            me.tabContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer');
            me.tabContainer.insertTo(cel);
            for (i = 0; i < me.layerTabs.length; i += 1) {
                tab = me.layerTabs[i];
                me.tabContainer.addPanel(tab.getTabPanel());
            }
            me.tabContainer.addTabChangeListener(me._tabsChanged); // -> filter with same keyword when changing tabs?
            me.populateLayers();
        },
        _tabsChanged : function(oldTab, newTab) {
        },
        addTab: function (item) {
            var me = this;
            var tab = null;
            
            if (item.view.getTabPanel
                && item.view.setLayerSelected
                && item.view.updateLayerContent)
            {
                tab = item.view;
            } else {
                tab = {
                    getTabPanel: function () {
                        var tabPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
                        tabPanel.setTitle(item.view.getTitle());
                        tabPanel.setContent(item.view.container);
                        return tabPanel;
                    },
                    setLayerSelected: function (x, y) {
                        return;
                    },
                    updateLayerContent: function (x, y) {
                        return;
                    }
                }
            }
            
            me.layerTabs.push(tab);
            me.tabContainer.addPanel(tab.getTabPanel(), item.first);
        },
        populateLayers: function () {
            //"use strict";
            var sandbox = this.instance.getSandbox(),
                // populate layer list
                mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService'),
                layers = mapLayerService.getAllLayers(),
                i,
                tab,
                layersCopy,
                groups;

            for (i = 0; i < this.layerTabs.length; i += 1) {
                tab = this.layerTabs[i];
                // populate tab if it has grouping method
                if (tab.groupingMethod) {
                    layersCopy = layers.slice(0);
                    groups = this._getLayerGroups(layersCopy, tab.groupingMethod);
                    tab.showLayerGroups(groups);
                } else if (tab.servicePackage) {
					
				}
            }
            //delay this a bit, otherwise it will be called many times during startup
            //TODO: for real solution fix handleLayerRemoved and handleLayerAdded
            if(this.populateGroupingsTimeout) {
                window.clearTimeout(this.populateGroupingsTimeout);
            }
            this.populateGroupingsTimeout = window.setTimeout(this.populateGroupings, 200, this);
        },
        populateGroupings: function (me) {
            if(typeof me === 'undefined') {
                me = this;
            }
            me._getGroupings(function (groupings) {
                me.populateThemes(me.userThemesTab, groupings);
            });
        },
		
        _getGroupings: function (successCb) {
            var me = this;
            var url = me.instance.getSandbox().getAjaxUrl() + 'action_route=GetPermittedGroupings';
            jQuery.ajax({
                type: "GET",
                dataType: 'json',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                url: url,
                success: function (pResp) {
                    if (successCb) {
                        successCb(pResp.groupings);
                    }
                },
                error: function (jqXHR, textStatus) {
                    //alert('Error occurred while geting data!');
                },
                cache: false
            });
        },
        populateThemes: function (layerTab, themesDataArray) {
            if (themesDataArray) {
                var groupList = [];

                for (var j = 0; j < themesDataArray.length; j++) {

                    if (themesDataArray[j].type == 'map_layers' && themesDataArray[j].elements) {

                        var group = Oskari.clazz.create("Oskari.mapframework.bundle.layerselector2.model.LayerGroup", themesDataArray[j].name);

                        for (var k = 0; k < themesDataArray[j].elements.length; k++) {
                            var layer = this.instance.sandbox.findMapLayerFromAllAvailable(themesDataArray[j].elements[k].id);
                            if (layer) {
                                group.addLayer(layer);
                            }
                        }

                        groupList.push(group);
                    }
                }
                layerTab.showLayerGroups(groupList);
            } else {
                //TODO
            }
        },
		populateLayersFromServicePackage: function(themesDataArray, cb) {		
		    if (themesDataArray) {
		        this.servicePackageTab.selectAllLayers(false, true);

			    var groupList = [];
			    var layers = [];
					
				for (var j=0; j<themesDataArray.length; j++) {
				
					if (themesDataArray[j].type == 'map_layers' && themesDataArray[j].elements) {
						
						var group = Oskari.clazz.create("Oskari.mapframework.bundle.layerselector2.model.LayerGroup", themesDataArray[j].name);
						
						for (var k = 0; k < themesDataArray[j].elements.length; k++) {
						    var layerData = themesDataArray[j].elements[k];
						    var layer = this.instance.sandbox.findMapLayerFromAllAvailable(layerData.id);
							if (layer) {							    
							    group.addLayer(layer);
							    if (layerData.status == 'drawn')
							        layers.push({"layer": layer, "groupName": themesDataArray[j].name});
							}
						}
						
						groupList.push(group);
					}
				}			    
				this.servicePackageTab.showLayerGroups(groupList);

			    if (cb)
			        cb(layers);

			} else {
				//TODO
			}
		},

        /**
         * @method _getLayerGroups
         * @private
         */
        _getLayerGroups: function (layers, groupingMethod) {
            //"use strict";
            var me = this,
                groupList = [],
                group = null,
                n,
                layer,
                groupAttr;

            // sort layers by grouping & name
            layers.sort(function (a, b) {
                return me._layerListComparator(a, b, groupingMethod);
            });

            for (n = 0; n < layers.length; n += 1) {
                layer = layers[n];
                if (layer.getMetaType && layer.getMetaType() === 'published') {
                    // skip published layers
                    continue;
                }
                groupAttr = layer[groupingMethod]();
                if (!group || group.getTitle() !== groupAttr) {
                    group = Oskari.clazz.create("Oskari.mapframework.bundle.layerselector2.model.LayerGroup", groupAttr);
                    groupList.push(group);
                }
                group.addLayer(layer);

            }
            return groupList;
        },

        /**
         * @method _layerListComparator
         * Uses the private property #grouping to sort layer objects in the wanted order for rendering
         * The #grouping property is the method name that is called on layer objects.
         * If both layers have same group, they are ordered by layer.getName()
         * @private
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} a comparable layer 1
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} b comparable layer 2
         * @param {String} groupingMethod method name to sort by
         */
        _layerListComparator: function (a, b, groupingMethod) {
            //"use strict";
            var nameA = a[groupingMethod]().toLowerCase(),
                nameB = b[groupingMethod]().toLowerCase();
            if (nameA === nameB && (a.getName() && b.getName())) {
                nameA = a.getName().toLowerCase();
                nameB = b.getName().toLowerCase();
            }
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        },

        /**
         * @method handleLayerSelectionChanged
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer
         *           layer that was changed
         * @param {Boolean} isSelected
         *           true if layer is selected, false if removed from selection
         * let's refresh ui to match current layer selection
         */
        handleLayerSelectionChanged: function (layer, isSelected) {
            //"use strict";
            var i,
                tab;
            for (i = 0; i < this.layerTabs.length; i += 1) {
                tab = this.layerTabs[i];
                tab.setLayerSelected(layer.getId(), isSelected);
            }
        },

        /**
         * @method handleLayerModified
         * @param {Oskari.mapframework.domain.AbstractLayer} layer
         *           layer that was modified
         * let's refresh ui to match current layers
         */
        handleLayerModified: function (layer) {
            //"use strict";
            var me = this,
                i,
                tab;
            for (i = 0; i < me.layerTabs.length; i += 1) {
                tab = me.layerTabs[i];
                tab.updateLayerContent(layer.getId(), layer);
            }
        },

        /**
         * @method handleLayerSticky
         * @param {Oskari.mapframework.domain.AbstractLayer} layer
         *           layer thats switch off diasable/enable is changed
         * let's refresh ui to match current layers
         */
        handleLayerSticky: function (layer) {
            //"use strict";
            var me = this,
                i,
                tab;
            for (i = 0; i < me.layerTabs.length; i += 1) {
                tab = me.layerTabs[i];
                tab.updateLayerContent(layer.getId(), layer);
            }
        },

        /**
         * @method handleLayerAdded
         * @param {Oskari.mapframework.domain.AbstractLayer} layer
         *           layer that was added
         * let's refresh ui to match current layers
         */
        handleLayerAdded: function (layer) {
            //"use strict";
            var me = this;
            me.populateLayers();
            // we could just add the layer to correct group and update the layer count for the group
            // but saving time to do other finishing touches
            //var layerListContainer = jQuery(this.container).find('div.layerList');
            //this._populateLayerList(layerListContainer);
        },
        /**
         * @method handleLayerRemoved
         * @param {String} layerId
         *           id of layer that was removed
         * let's refresh ui to match current layers
         */
        handleLayerRemoved: function (layerId) {
            //"use strict";
            var me = this;
            me.populateLayers();
            // we could  just remove the layer and update the layer count for the group
            // but saving time to do other finishing touches
            //var layerListContainer = jQuery(this.container).find('div.layerList');
            //this._populateLayerList(layerListContainer);
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });