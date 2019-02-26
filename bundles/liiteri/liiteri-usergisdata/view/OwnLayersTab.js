/**
 * @class Oskari.liiteri.bundle.liiteri-usergisdata.view.LayersTab
 *
 *
 */
Oskari.clazz.define("Oskari.liiteri.bundle.liiteri-usergisdata.view.OwnLayersTab",

    /**
     * @method create called automatically on construction
     * @static
     */

    function (instance, title, subTabPanels, id) {
		this.loc = null;
		this.instance = instance;
        this.title = title;
        this.id = id,
		this.subTabPanels = subTabPanels;
        this.templates = {
            'spinner': '<span class="spinner-text"></span>',
            'shortDescription': '<div class="field-description"></div>',
            'description': '<div><h4 class="indicator-msg-popup"></h4><p></p></div>',
            'relatedKeywords': '<div class="related-keywords"></div>',
            'keywordsTitle': '<div class="keywords-title"></div>',
            'keywordContainer': '<a href="#"class="keyword-cont"><span class="keyword"></span></a>',
            'keywordType': '<div class="type"></div>',
			'ownGisDataTab': '<div id="ownGisDataTab"></div>'
        };
        this._createUI();
    }, {
        getTitle: function () {
            return this.title;
        },
		
        getTabPanel: function () {
            return this.tabPanel;
        },
		
        getState: function () {
			//TODO: add all needed properties to state
            var state = {
                tab: this.getTitle(),
                groups: []
            };
            return state;
        },
		
        setState: function (state) {
			//TODO: set up the state
            if (!state) {
                return;
            }
        },
		
        _createUI: function () {
            var me = this,
                oskarifield,
				i,
				subTabPanel,
				ownGisDataTab;

            me.loc = me.instance.getLocalization("view");
            me.tabPanel = Oskari.clazz.create(
                'Oskari.userinterface.component.TabPanel');
            me.tabPanel.setTitle(me.title);
            me.tabPanel.setId(me.id);

            me.tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer', me.loc.noDataInfo);
            me.tabsContainer.addTabChangeListener(function (previousTab, newTab) {
                me.currentTab = newTab;
            });

			for (i = 0; i < me.subTabPanels.length; i++) {
			
				subTabPanel = me.subTabPanels[i];
				oskarifield = me.getFilterField(subTabPanel).getField();
				oskarifield.addClass('stretched');

				subTabPanel.getContainer().append(oskarifield);
				oskarifield.find('.spinner-text').hide();

				var buttonsContainer = jQuery('<div class="actionsContainer"></div>');
				var expandButton = jQuery('<span><i class="expand-icon"></i>' + me.loc.filter.expandAll + '</span>');
				expandButton.attr('data-id', i);
				var collapseButton = jQuery('<span><i class="collapse-icon"></i>' + me.loc.filter.collapseAll + '</span>');
				collapseButton.attr('data-id', i);
				buttonsContainer.append(expandButton);
				buttonsContainer.append(collapseButton);

				subTabPanel.getContainer().append(buttonsContainer);
				subTabPanel.accordion = Oskari.clazz.create(
					'Oskari.userinterface.component.Accordion');
				subTabPanel.accordion.insertTo(subTabPanel.getContainer());

				expandButton.click(function () {
					var dataId = $(this).attr('data-id');
					me.subTabPanels[dataId].accordion.panels.forEach(function (p) {
						p.open();
					});
				});
				collapseButton.click(function () {
					var dataId = $(this).attr('data-id');
					me.subTabPanels[dataId].accordion.panels.forEach(function (p) {
						p.close();
					});
				});
				
                me.tabsContainer.addPanel(subTabPanel);
			}
			
			ownGisDataTab = jQuery(me.templates.ownGisDataTab);
            me.tabsContainer.insertTo(ownGisDataTab);
			me.tabPanel.getContainer().append(ownGisDataTab);
			
        },

        getFilterField: function (container) {
            var me = this,
                field,
                timer = 0;
            if (container.filterField) {
                return container.filterField;
            }
            field = Oskari.clazz.create(
                'Oskari.userinterface.component.FormInput');
            field.setPlaceholder(me.loc.filter.text);
            field.addClearButton();
            field.bindChange(function (event) {
                event.stopPropagation(); // JUST BECAUSE TEST ENVIRONMENT FAILS
                var evt = event;
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function () {
                    me._fireFiltering(field.getValue(), evt, me, container);
                    timer = null;
                }, 300);

            }, true);

            container.filterField = field;
            return field;
        },

        /**
         * @method _fireFiltering
         * @private
         * @param {String} keyword
         *      User input
         * @param {Object} event
         *      Event that caused the action to fire
         * @param {Object} me
         *      Reference to the bundle instance
         * Calls all needed functions to do the layer filtering.
         */
        _fireFiltering: function (keyword, event, me, container) {
            // Filter by name
            me.filterLayers(keyword, container);
        },

        showLayerGroups: function (groups, tabPanelId) {
            var me = this,
                i,
                group,
                layers,
                groupPanel,
                groupContainer,
                n,
                layer,
                layerWrapper,
                layerContainer,
                selectedLayers,
				subTabPanel;
				
			for (var i = 0; i < me.subTabPanels.length; i++) {
				if (me.subTabPanels[i].getId() == tabPanelId) {
					subTabPanel = me.subTabPanels[i];
					break;
				}
			}
			
			if (subTabPanel) {

				subTabPanel.accordion.removeAllPanels();
				subTabPanel.layerContainers = undefined;
				subTabPanel.layerContainers = {};
				subTabPanel.layerGroups = groups;
				
				for (i = 0; i < groups.length; i += 1) {
					group = groups[i];
					layers = group.getLayers();
					groupPanel = Oskari.clazz.create(
						'Oskari.userinterface.component.AccordionPanel');
					groupPanel.setTitle(group.getTitle() + ' (' + layers.length +
						')');
					group.layerListPanel = groupPanel;

					groupContainer = groupPanel.getContainer();
					for (n = 0; n < layers.length; n += 1) {
						layer = layers[n];
						var editOperation,
							dataId,
							dataType,
							id;
						
						if (group.getTitle() === me.loc.myPlaces) {
							var mapLayerId = layer.getId() + "";
						
							var pos = mapLayerId.indexOf('_');
							
							if (pos != -1) {
								var categoryId = mapLayerId.substr(pos + 1);
							} else {
								var categoryId = mapLayerId;
							}
							
							dataId = categoryId;
							dataType = "MY_PLACES";
						} else if (group.getTitle() === me.loc.analysis) {
							dataId = layer.getId();
							dataType = "ANALYSIS";
						} else if (group.getTitle() === me.loc.importedData) {
							dataId = layer.getId();
							dataType = "IMPORTED_PLACES";
						} else if (group.getTitle() === me.loc.userLayers) {
                            dataId = layer.getId();
                            dataType = "USERWMS";
                        }
						id = layer.userDataId;
						expirationDate = layer.expirationDate;
						users = layer.users;
						
						if (tabPanelId == 'MY_LAYERS') {
							editOperation = true;
						} else {
							editOperation = false;
						}
						
						layerWrapper =
							Oskari.clazz.create(
								'Oskari.liiteri.bundle.liiteri-usergisdata.view.OwnDataLayer',
								layer, me.instance.sandbox, me.loc, editOperation, dataId, dataType, id, expirationDate, users
						);
						layerContainer = layerWrapper.getContainer();
						groupContainer.append(layerContainer);

						subTabPanel.layerContainers[layer.getId()] = layerWrapper;
					}
					subTabPanel.accordion.addPanel(groupPanel);
				}

				selectedLayers = me.instance.sandbox.findAllSelectedMapLayers();
				for (i = 0; i < selectedLayers.length; i += 1) {
					me.setLayerSelected(selectedLayers[i].getId(), true);
				}

				me.filterLayers(subTabPanel.filterField.getValue(), subTabPanel);
			}
        },

        /**
         * @method _filterLayers
         * @private
         * @param {String} keyword
         *      keyword to filter layers by
         * @param {Array} ids optional list of layer IDs to be shown
         * Shows and hides layers by comparing the given keyword to the text in layer containers layer-keywords div.
         * Also checks if all layers in a group is hidden and hides the group as well.
         */
        filterLayers: function (keyword, subTabPanel, ids) {
            var me = this,
                visibleGroupCount = 0,
                visibleLayerCount,
                i,
                n,
                group,
                layer,
                layers,
                layerId,
                layerCont,
                bln,
                loc;
			
			if (!ids && me.sentKeyword === keyword) {
				ids = me.ontologyLayers;
			}
			// show all groups
			
			subTabPanel.accordion.showPanels();
			if (!keyword || keyword.length === 0) {
				me._showAllLayers(subTabPanel);
				return;
			}
			// filter
			for (i = 0; i < subTabPanel.layerGroups.length; i += 1) {
				group = subTabPanel.layerGroups[i];
				layers = group.getLayers();
				visibleLayerCount = 0;
				for (n = 0; n < layers.length; n += 1) {
					layer = layers[n];
					layerId = layer.getId();
					layerCont = subTabPanel.layerContainers[layerId];
					bln = group.matchesKeyword(layerId, keyword);
					layerCont.setVisible(bln);
					if (bln) {
						visibleLayerCount += 1;
						if (visibleLayerCount % 2 === 1) {
							layerCont.getContainer().addClass('odd');
						} else {
							layerCont.getContainer().removeClass('odd');
						}
						// open the panel if matching layers
						group.layerListPanel.open();
					}
				}
				group.layerListPanel.setVisible(visibleLayerCount > 0);
				if (group.layerListPanel.isVisible()) {
					visibleGroupCount += 1;
				}
				group.layerListPanel.setTitle(group.getTitle() + ' (' +
					visibleLayerCount + '/' + layers.length + ')');
			}
			
			// check if there are no groups visible -> show 'no matches' notification
			// else clear any previous message
			if (visibleGroupCount === 0) {
				// empty result
				loc = me.loc.errors;
				subTabPanel.accordion.showMessage(loc.noResults);
			} else {
				subTabPanel.accordion.removeMessage();
			}
        },      

        /**
         * @method _arrayContaines
         * @private
         * @param {Array} arr
         *     Array to be checked
         * @param {String} val
         *     Value to be searched
         * IE8 doesn't have Array.indexOf so we use this...
         */
        _arrayContains: function (arr, val) {
            var i;
            if (arr.indexOf) {
                return arr.indexOf(val) > -1;
            }
            for (i = 0; i < arr.length; i += 1) {
                if (arr[i] === val) {
                    return true;
                }
            }
            return false;
        },

        _showAllLayers: function (subTabPanel) {
            var i,
                group,
                layers,
                n,
                layer,
                layerId,
                layerCont;
				
			subTabPanel.accordion.removeMessage();

			if (subTabPanel.layerGroups) {
				for (i = 0; i < subTabPanel.layerGroups.length; i += 1) {
					group = subTabPanel.layerGroups[i];
					layers = group.getLayers();

					for (n = 0; n < layers.length; n += 1) {
						layer = layers[n];
						layerId = layer.getId();
						layerCont = subTabPanel.layerContainers[layerId];
						if (layerCont) {
							layerCont.setVisible(true);
							if (n % 2 === 1) {
								layerCont.getContainer().addClass('odd');
							} else {
								layerCont.getContainer().removeClass('odd');
							}
						}
					}
					group.layerListPanel.setVisible(true);
					group.layerListPanel.close();
					group.layerListPanel.setTitle(group.getTitle() + ' (' + layers.length +
						')');
				}
			}
        },
        selectAllLayers : function(isSelected, sendEvent) {
			for (var subTabPanel in this.subTabPanels) {
				var layerContainers = subTabPanel.layerContainers;
				if (layerContainers) {
					for (var layerId in layerContainers) {
						var layerCont = layerContainers[layerId];
						if (layerCont) {
							layerCont.setSelected(isSelected, sendEvent);
						}
					}
				}
			}
        },
        setLayerSelected: function (layerId, isSelected) {
			for (var subTabPanel in this.subTabPanels) {
				var layerContainers = subTabPanel.layerContainers;
				if (layerContainers) {
					var layerCont = layerContainers[layerId];
					if (layerCont) {
						layerCont.setSelected(isSelected);
					}
				}
			}
        },
        updateLayerContent: function (layerId, layer) {
			for (var subTabPanel in this.subTabPanels) {
				var layerContainers = subTabPanel.layerContainers;
				if (layerContainers) {
					var layerCont = layerContainers[layerId];
					if (layerCont) {
						layerCont.updateLayerContent(layer);
					}
				}
			}
        }
    });