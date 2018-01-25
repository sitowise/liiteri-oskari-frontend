/**
 * @class Oskari.framework.bundle.hierarchical-layerlist.view.LayerGroupTab
 *
 *
 */
Oskari.clazz.define(
    "Oskari.framework.bundle.hierarchical-layerlist.view.LayerGroupTab",
    /**
     * @method create called automatically on construction
     * @static
     */
    function(instance, title, id) {
        this.instance = instance;
        this.service = this.instance.layerlistExtenderService;
        this.title = title;
        this.id = id;
        this.layerGroups = [];
        this.showSearchSuggestions = (instance.conf && instance.conf.showSearchSuggestions === true);
        this.layerContainers = {};
        this.sb = this.instance.getSandbox();
        this.localization = this.instance.getLocalization();
        this._notifierService = this.sb.getService('Oskari.framework.bundle.hierarchical-layerlist.OskariEventNotifierService');
        this._mapLayerService = this.sb.getService('Oskari.mapframework.service.MapLayerService');
        // FIXME: these templates must be a jQuery objects
        this.templates = {
            spinner: '<span class="spinner-text"></span>',
            descriptionAndMainTools: jQuery('<div class="description-and-tools"><div class="field-description"></div><div class="main-tools"></div><div class="clear"></div></div>'),
            mainTool: jQuery('<div class="main-tool"></div>'),
            description: '<div>' +
                '  <h4 class="indicator-msg-popup"></h4>' +
                '  <p></p>' +
                '</div>',
            relatedKeywords: '<div class="related-keywords"></div>',
            keywordsTitle: '<div class="keywords-title"></div>',
            keywordContainer: '<a href="#"class="keyword-cont">' +
                '  <span class="keyword"></span>' +
                '</a>',
            keywordType: '<div class="type"></div>',
            layerFilter: '<div class="layer-filter hierarchical-layerlist-layer-filter">' +
                '</div><div style="clear:both;"></div>',
            layerTree: '<div class="hierarchical-layerlist-tree"></div>',
            layerContainer: '<span class="layer">' +
                    '<span class="layer-tools">'+
                    '   <span class="layer-backendstatus-icon backendstatus-unknown" title=""></span>' +
                    '   <span class="layer-icon"></span>'+
                    '   <span class="layer-info"></span>'+
                    '</span>' +
                    '<span class="layer-title"></span>' +
                '</span>'
        };
        this._createUI(id);
        this._bindExtenderServiceListeners();
        this._bindOskariEvents();
    }, {
        _bindExtenderServiceListeners: function() {
            var me = this;
            me.service.on('maintool.added', function(data) {
                var tool = me.templates.mainTool.clone();
                tool.attr('data-id', data.id);
                tool.attr('title', data.options.tooltip);
                tool.addClass(data.options.cls);

                tool.bind('click', function(evt) {
                    evt.stopPropagation();
                    tool.addClass('active');
                    data.handler(tool);
                });
                me.getFilterField().getField().find('.main-tools').append(tool);
                console.log('Main tool added, data:', data);
            });

            me.service.on('jstree-contionalselect', function(data) {
                me.selectNodeFromTree(data.node, data.event);
            });
        },
        getTitle: function() {
            //"use strict";
            return this.title;
        },

        getTabPanel: function() {
            //"use strict";
            return this.tabPanel;
        },

        getState: function() {
            //"use strict";
            var state = {
                tab: this.getTitle(),
                filter: this.filterField.getValue(),
                groups: []
            };
            return state;
        },

        setState: function(state) {
            //"use strict";
            if (!state) {
                return;
            }

            if (!state.filter) {
                this.filterField.setValue(state.filter);
                this.filterLayers(state.filter);
            }
        },

        /**
         * @public @method focus
         * Focuses the panel's search field (if available)
         *
         *
         */
        focus: function() {
            this.getFilterField().getField().find('input').focus();
        },

        /**
         * @method _createInfoIcon
         * @private
         * @param {Object} input
         *      container for the icon
         * Creates info icon for given oskarifield
         */
        _createInfoIcon: function(oskarifield) {
            //"use strict";
            var me = this,
                infoIcon = jQuery('<div class="icon-info"></div>'),
                indicatorCont = oskarifield.find('.field-description');
            // clear previous indicator
            indicatorCont.find('.icon-info').remove();
            // append this indicator
            indicatorCont.append(infoIcon);
            // show metadata
            infoIcon.click(function(e) {
                var desc = jQuery(me.templates.description),
                    dialog = Oskari.clazz.create(
                        'Oskari.userinterface.component.Popup'
                    ),
                    okBtn = Oskari.clazz.create(
                        'Oskari.userinterface.component.buttons.OkButton'
                    );

                desc.find('p').text(me._locale.filter.description);
                okBtn.addClass('primary');
                okBtn.setHandler(function() {
                    dialog.close(true);
                });
                dialog.show(me._locale.filter.text, desc, [okBtn]);

            });
        },
        /**
         * Create UI
         * @method  @private _createUI
         *
         * @param  {String} oskarifieldId oskari field id
         */
        _createUI: function(oskarifieldId) {
            //"use strict";
            var me = this,
                oskarifield,
                layerFilter;

            me._locale = me.instance._localization;
            me.tabPanel = Oskari.clazz.create(
                'Oskari.userinterface.component.TabPanel');
            me.tabPanel.setTitle(me.title, me.id);

            oskarifield = me.getFilterField().getField();

            if (me.showSearchSuggestions) {
                oskarifield.append(
                    jQuery(me.templates.spinner)
                    .text(me._locale.loading)
                );

                oskarifield.append(
                    jQuery(me.templates.relatedKeywords)
                );
            }
            var descriptionAndMainTools = me.templates.descriptionAndMainTools.clone();
            descriptionAndMainTools.find('.field-description').text(me._locale.filter.shortDescription);
            oskarifield.append(descriptionAndMainTools);

            me._createInfoIcon(oskarifield);

            if (!(this.instance.conf && this.instance.conf.hideLayerFilters && this.instance.conf.hideLayerFilters === true)) {
                layerFilter = jQuery(me.templates.layerFilter);
                me.tabPanel.getContainer().append(layerFilter);
            }

            me.tabPanel.getContainer().append(oskarifield);
            oskarifield.find('.spinner-text').hide();

            // add id to search input
            oskarifield.find('input').attr(
                'id',
                'oskari_hierarchical-layerlist_search_input_tab_' + oskarifieldId
            );

            me.accordion = Oskari.clazz.create(
                'Oskari.userinterface.component.Accordion'
            );
            me.accordion.insertTo(me.tabPanel.getContainer());
        },
        /**
         * Get filter field
         * @method  @public getFilterField
         *
         * @return {Oskari.userinterface.component.FormInput} field
         */
        getFilterField: function() {
            //"use strict";
            var me = this,
                field,
                timer = 0;
            if (me.filterField) {
                return me.filterField;
            }
            field = Oskari.clazz.create(
                'Oskari.userinterface.component.FormInput');
            field.setPlaceholder(me.instance.getLocalization('filter').text);
            field.addClearButton();
            field.bindChange(function(event) {
                event.stopPropagation(); // JUST BECAUSE TEST ENVIRONMENT FAILS
                var evt = event;
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function() {
                    me._fireFiltering(field.getValue(), evt, me);
                    timer = null;
                }, 300);

            }, true);

            me.filterField = field;
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
        _fireFiltering: function(keyword, event, me) {
            //"use strict";
            // Filter by name
            me.filterLayers(keyword);

            if (me.showSearchSuggestions) {
                // User input has changed, clear suggestions
                me.clearRelatedKeywordsPopup(
                    keyword,
                    jQuery(event.currentTarget).parents('.oskarifield')
                );
                // get new suggestions if user input is long enough
                me._relatedKeywordsPopup(keyword, event, me);
            }
        },
        _showLayerMetaData: function(layer) {
            //FIXME: COMMENTS
            var me = this,
                rn = 'catalogue.ShowMetadataRequest',
                uuid = layer.getMetadataIdentifier(),
                additionalUuids = [],
                additionalUuidsCheck = {},
                subLayers = layer.getSubLayers();
            additionalUuidsCheck[uuid] = true;
            if (subLayers && subLayers.length > 0) {
                for (s = 0; s < subLayers.length; s += 1) {
                    subUuid = subLayers[s].getMetadataIdentifier();
                    if (subUuid && subUuid !== "" && !additionalUuidsCheck[subUuid]) {
                        additionalUuidsCheck[subUuid] = true;
                        additionalUuids.push({
                            uuid: subUuid
                        });
                    }
                }
            }
            me.sb.postRequestByName(rn, [{
                    uuid: uuid
                },
                additionalUuids
            ]);
        },
        _showMapLayerInfo: function(layer) {
            //FIXME: COMMENTS
            var me = this,
                mapLayerId = layer.getId();
            me.sb.postRequestByName('ShowMapLayerInfoRequest', [
                mapLayerId
            ]);
        },
        _getNodeRealId: function(node) {
            //FIXME: COMMENTS
            return node.id.split('-')[1];
        },
        selectNodeFromTree: function(node, event) {
            //FIXME: COMMENTS
            var me = this;
            var tree = jQuery(event.delegateTarget);
            var isChecked = tree.jstree().is_checked(node);
            var isOpen = tree.jstree().is_open(node);
            var target = jQuery(event.target);
            var nodeChildren = node.children;
            var nodeChildrenLength = nodeChildren.length;
            if (!target.hasClass('jstree-checkbox')
                && !target.hasClass('layer-backendstatus-icon')
                && !target.hasClass('layer-info')) {
                if (isOpen) {
                    tree.jstree().close_node(node);
                } else {
                    tree.jstree().open_node(node);
                }
            } else if(target.hasClass('layer-backendstatus-icon') && node.type === 'layer') {
                me._showMapLayerInfo(me.sb.findMapLayerFromAllAvailable(me._getNodeRealId(node)));
            } else if(target.hasClass('layer-info') && node.type === 'layer') {
                me._showLayerMetaData(me.sb.findMapLayerFromAllAvailable(me._getNodeRealId(node)));
            } else {
                if (isChecked) {
                    tree.jstree().uncheck_node(node);
                    if (node.type === 'group' && nodeChildrenLength > 0) {
                        for (var i = 0; i < nodeChildrenLength; ++i) {
                            var child = tree.jstree().get_node(nodeChildren[i]);
                            var layerId = me._getNodeRealId(child);
                            if(me.sb.isLayerAlreadySelected(layerId)) {
                                me.sb.postRequestByName('RemoveMapLayerRequest', [layerId]);
                            }
                        }
                    } else if (node.type === 'layer') {
                        var layerId = me._getNodeRealId(node);
                        if(me.sb.isLayerAlreadySelected(layerId)) {
                            me.sb.postRequestByName('RemoveMapLayerRequest', [layerId]);
                        }
                    }
                } else {
                    var allSelectedLayers = me.sb.findAllSelectedMapLayers();
                    var allSelectedLayersLength = allSelectedLayers.length;
                    var desc = jQuery(me.templates.description),
                        dialog = Oskari.clazz.create(
                            'Oskari.userinterface.component.Popup'
                        ),
                        okBtn = Oskari.clazz.create(
                            'Oskari.userinterface.component.buttons.OkButton'
                        ),
                        cancelBtn = Oskari.clazz.create(
                            'Oskari.userinterface.component.buttons.CancelButton'
                        );
                    if (node.type === 'group' && nodeChildrenLength > 0) {
                        //If there are already 10 or more layers on the map show a warning to the user when adding more layers.
                        if ((nodeChildrenLength > 10 || allSelectedLayersLength > 10)) {

                            desc.find('p').text(me.localization.manyLayersWarning.text);
                            okBtn.addClass('primary');
                            okBtn.setHandler(function() {
                                dialog.close(true);
                                tree.jstree().open_node(node);
                                tree.jstree().check_node(node);
                                nodeChildren.forEach(function(nodechild) {
                                    var child = tree.jstree().get_node(nodechild);
                                    var layerId = me._getNodeRealId(child);
                                    if(!me.sb.isLayerAlreadySelected(layerId)) {
                                        me.sb.postRequestByName('AddMapLayerRequest', [layerId]);
                                    }
                                });
                            });
                            cancelBtn.addClass('secondary');
                            cancelBtn.setHandler(function() {
                                dialog.close(true);
                            });
                            dialog.show(me.localization.manyLayersWarning.title, desc, [okBtn, cancelBtn]);
                        } else {
                            tree.jstree().open_node(node);
                            tree.jstree().check_node(node);
                            nodeChildren.forEach(function(nodechild) {
                                var child = tree.jstree().get_node(nodechild);
                                var layerId = me._getNodeRealId(child);
                                if(!me.sb.isLayerAlreadySelected(layerId)) {
                                    me.sb.postRequestByName('AddMapLayerRequest', [layerId]);
                                }
                            });
                        }
                    } else if (node.type === 'layer') {
                        if (allSelectedLayersLength > 10) {
                            desc.find('p').text(me.localization.manyLayersWarning.text);
                            okBtn.addClass('primary');
                            okBtn.setHandler(function() {
                                dialog.close(true);
                                tree.jstree().check_node(node);
                                var layerId = me._getNodeRealId(node);
                                if(!me.sb.isLayerAlreadySelected(layerId)) {
                                    me.sb.postRequestByName('AddMapLayerRequest', [layerId]);
                                }
                            });
                            cancelBtn.addClass('secondary');
                            cancelBtn.setHandler(function() {
                                dialog.close(true);
                            });
                            dialog.show(me.localization.manyLayersWarning.title, desc, [okBtn, cancelBtn]);
                        } else {
                            tree.jstree().check_node(node);
                            var layerId = me._getNodeRealId(node);
                            if(!me.sb.isLayerAlreadySelected(layerId)) {
                                me.sb.postRequestByName('AddMapLayerRequest', [layerId]);
                            }
                        }
                    }
                }
            }
        },
        getJsTreeElement: function() {
            //FIXME: COMMENTS
            return this.tabPanel.getContainer().find('.hierarchical-layerlist-tree');
        },
        /**
         * @method _createLayerContainer
         * @private
         * Creates the layer containers
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer to render
         */
        _createLayerContainer: function (layer) {
            //"use strict";
            var me = this,
                sandbox = me.sb,
                // create from layer template
                // (was clone-from-template but template was only used once so there was some overhead)
                layerDiv = jQuery(this.templates.layerContainer),
                tooltips = this.localization.tooltip,
                tools = jQuery(layerDiv).find('span.layer-tools'),
                icon = tools.find('span.layer-icon'),
                rn,
                uuid,
                additionalUuids,
                additionalUuidsCheck,
                subLayers,
                s,
                subUuid,
                elBackendStatus,
                mapLayerId,
                layerInfo;

            icon.addClass(layer.getIconClassname());

            if (layer.isBaseLayer()) {
                icon.attr('title', tooltips['type-base']);
            } else if (layer.isLayerOfType('WMS')) {
                icon.attr('title', tooltips['type-wms']);
            } else if (layer.isLayerOfType('WMTS')) {
                // FIXME: WMTS is an addition done by an outside bundle so this shouldn't be here
                // but since it would require some refactoring to make this general
                // I'll just leave this like it was on old implementation
                icon.attr('title', tooltips['type-wms']);
            } else if (layer.isLayerOfType('WFS')) {
                if(layer.isManualRefresh()) {
                    icon.attr('title', tooltips['type-wfs-manual']);
                }
                else {
                    icon.attr('title', tooltips['type-wfs']);
                }
            } else if (layer.isLayerOfType('VECTOR')) {
                icon.attr('title', tooltips['type-wms']);
            }


            if (!layer.getMetadataIdentifier()) {
                subLayers = layer.getSubLayers();
                subLmeta = false;
                if (subLayers && subLayers.length > 0) {
                    subLmeta = true;
                    for (s = 0; s < subLayers.length; s += 1) {
                        subUuid = subLayers[s].getMetadataIdentifier();
                        if (!subUuid || subUuid === "") {
                            subLmeta = false;
                            break;
                        }
                    }
                }
            }
            if (layer.getMetadataIdentifier() || subLmeta) {
                layerInfo = tools.find('span.layer-info');
                layerInfo.addClass('icon-info');
            }

            // setup id
            layerDiv.attr('layer_id', layer.getId());
            layerDiv.find('.layer-title').append(layer.getName());

            /*
             * backend status
             */
            elBackendStatus = tools.find('.layer-backendstatus-icon');

            var backendStatus = layer.getBackendStatus();
            if (backendStatus) {
                var iconClass = me.localization.backendStatus[backendStatus] ? me.localization.backendStatus[backendStatus].iconClass : null;
                var tooltip = me.localization.backendStatus[backendStatus] ? me.localization.backendStatus[backendStatus].tooltip : null;
                if (iconClass) {
                    elBackendStatus.removeClass('backendstatus-unknown');
                    elBackendStatus.addClass(iconClass);
                    elBackendStatus.attr('title', tooltip);
                }
            }

            return layerDiv;
        },
        /**
         * Show layer groups
         * @method  @public showLayerGroups
         *
         * @param  {Array} groups
         */
        showLayerGroups: function(groups) {
            //"use strict";
            var me = this,
                i,
                groupsLength = groups.length,
                group,
                layers,
                localization,
                groupPanel,
                groupContainer,
                layersLength,
                n,
                layer,
                layerWrapper,
                layerContainer,
                selectedLayers,
                jsTreeData = [];

            if (me.getJsTreeElement().length > 0) {
                me.getJsTreeElement().remove();
            }
            var layerTree = jQuery(me.templates.layerTree);
            me.tabPanel.getContainer().append(layerTree);
            me.accordion.removeAllPanels();
            me.layerContainers = {};
            me.layerGroups = groups;
            localization = me.instance.getLocalization();
            for (i = 0; i < groupsLength; i += 1) {
                group = groups[i];
                layers = group.getLayers();
                layersLength = layers.length;
                //Create root group
                var jsTreeGroup = {};
                jsTreeGroup.id = "group-" + group.id;
                jsTreeGroup.parent = "#";
                jsTreeGroup.text = group.name;
                jsTreeGroup.type = "group";
                jsTreeData.push(jsTreeGroup);
                //Loop through group layers
                //TODO: Loop through subgroups aswell similarly
                for (n = 0; n < layersLength; n += 1) {
                    layer = layers[n];
                    me._createLayerContainer(layer);
                    var jsTreeLayer = {};
                    jsTreeLayer.id = "layer-" + layer.getId();
                    jsTreeLayer.parent = "group-" + group.id;
                    jsTreeLayer.text = jQuery("<span/>").append(me._createLayerContainer(layer).clone()).html();
                    jsTreeLayer.type = "layer";
                    jsTreeData.push(jsTreeLayer);
                }
            }

            var to = false;
            $('#oskari_hierarchical-layerlist_search_input_tab_oskari_hierarchical-layerlist_tabpanel_layergrouptab').keyup(function() {
                if (to) {
                    clearTimeout(to);
                }
                to = setTimeout(function() {
                    var v = $('#oskari_hierarchical-layerlist_search_input_tab_oskari_hierarchical-layerlist_tabpanel_layergrouptab').val();
                    jsTreeDiv.jstree(true).search(v);
                }, 250);
            });

            var jsTreeDiv = me.getJsTreeElement();
            //selectedLayers = me.instance.sandbox.findAllSelectedMapLayers();

            me.service.getEventHandler().forEach(function(event) {
                jsTreeDiv.on(event.name, event.handler);
            });

            jsTreeDiv.jstree(me.service.getLayerlistOption());
            jsTreeDiv.jstree(true).settings.core.data = jsTreeData;
            jsTreeDiv.jstree(true).refresh();

            /*selectedLayers = me.instance.sandbox.findAllSelectedMapLayers();
            layersLength = selectedLayers.length;
            for (i = 0; i < layersLength; i += 1) {
                me.setLayerSelected(selectedLayers[i].getId(), true);
            }

            me.filterLayers(me.filterField.getValue());*/
            me._updateContainerHeight(jQuery('#mapdiv').height());

            // check selected layers
            me.sb.findAllSelectedMapLayers().forEach(function(layer) {
                me.getJsTreeElement().jstree().check_node('layer-' + layer.getId());
            });
        },

        /**
         * @method filterLayers
         * @private
         * @param {String} keyword
         *      keyword to filter layers by
         * @param {Array} ids optional list of layer IDs to be shown
         * Shows and hides layers by comparing the given keyword to the text in layer containers layer-keywords div.
         * Also checks if all layers in a group is hidden and hides the group as well.
         */
        filterLayers: function(keyword, ids) {
            //"use strict";
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
            me.accordion.showPanels();
            if (!keyword || keyword.length === 0) {
                me._showAllLayers();
                return;
            }
            // filter
            for (i = 0; i < me.layerGroups.length; i += 1) {
                group = me.layerGroups[i];
                layers = group.getLayers();
                visibleLayerCount = 0;
                for (n = 0; n < layers.length; n += 1) {
                    layer = layers[n];
                    layerId = layer.getId();
                    layerCont = me.layerContainers[layerId];
                    bln = group.matchesKeyword(layerId, keyword) || (me.showSearchSuggestions && ids && me._arrayContains(ids, layerId));
                    layerCont.setVisible(bln);
                    if (bln) {
                        visibleLayerCount += 1;
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
                loc = me.instance.getLocalization('errors');
                me.accordion.showMessage(loc.noResults);
                jQuery(me.accordion.ui).find('.accordionmsg').attr(
                    'id',
                    'oskari_hierarchical-layerlist_inspiretab_search_no-result'
                );
            } else {
                me.accordion.removeMessage();
            }
        },

        /**
         * @method clearRelatedKeywordsPopup
         * @private
         * @param {String} keyword
         *      keyword to filter layers by
         * @param {Object} oskarifield
         *      dom object to be cleared
         * Clears related keywords popup
         */
        clearRelatedKeywordsPopup: function(keyword, oskarifield) {
            //"use strict";
            // clear only if sent keyword has changed or it is not null
            if (this.sentKeyword && this.sentKeyword !== keyword) {
                oskarifield.find('.related-keywords').html('').hide();
            }
        },

        /**
         * @method _relatedKeywordsPopup
         * @private
         * @param {String} keyword
         *      keyword to filter layers by
         * @param {Object} event
         *      event hat caused the function to fire
         * @param {Object} me
         *      reference to the bundle instance
         * Shows and hides layers by comparing the given keyword to the text in layer containers layer-keywords div.
         * Also checks if all layers in a group is hidden and hides the group as well.
         */
        _relatedKeywordsPopup: function(keyword, event, me) {
            //"use strict";
            //event.preventDefault();
            var oskarifield = jQuery(event.currentTarget).parents(
                    '.oskarifield'
                ),
                loc,
                relatedKeywordsCont,
                ajaxUrl;

            if (!keyword || keyword.length === 0) {
                this._showAllLayers();
                return;
            }
            if (keyword.length < 4) {
                // empty result
                oskarifield.find('.related-keywords').hide();
                return;
            }

            relatedKeywordsCont = oskarifield.find('.spinner-text').show();

            me.sentKeyword = keyword;

            ajaxUrl = this.instance.sandbox.getAjaxUrl();
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                beforeSend: function(x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType(
                            'application/j-son;charset=UTF-8');
                    }
                },
                url: ajaxUrl + 'action_route=SearchKeywords&keyword=' +
                    encodeURIComponent(keyword) + '&lang=' + Oskari.getLang(),
                success: function(pResp) {
                    me.relatedKeywords = pResp;
                    me._showRelatedKeywords(keyword, pResp, oskarifield);
                    relatedKeywordsCont.hide();
                },
                error: function(jqXHR, textStatus) {
                    var lctn = me.instance.getLocalization('errors');
                    me.accordion.showMessage(lctn.generic);
                    relatedKeywordsCont.hide();
                }
            });
        },

        /**
         * @method _arrayContaines
         * @private
         * @param {Array} arr
         *     Array to be checked
         * @param {String} val
         *     Value to be searched
         * FIXME IE8 isn't supported anymore, just use forEach or some
         * IE8 doesn't have Array.indexOf so we use this...
         */
        _arrayContains: function(arr, val) {
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

        /**
         * @method _concatNew
         * @private
         * @param {Array} arr1
         *     Array of previously concatenated values
         * @param {Array} arr2
         *     Array of values to be concatenated
         * Concatenates (in place) those values from arr2 to arr1 that are not present in arr1
         */
        _concatNew: function(arr1, arr2) {
            //"use strict";
            var me = this,
                i;

            for (i = arr2.length - 1; i >= 0; i -= 1) {
                if (!me._arrayContains(arr1, arr2[i])) {
                    arr1.push(arr2[i]);
                }
            }
        },

        /**
         * @method _isDefined
         * @private
         * @param value
         * Determines if the given value... has a value.
         */
        _isDefined: function(value) {
            //"use strict";
            return typeof value !== 'undefined' && value !== null && value !== '';
        },

        /**
         * @method _containsIgnoreCase
         * @private
         * @param {String} keyword
         * @param {String} match
         * Returns true if keyword contains match (ignoring case)
         */
        _containsIgnoreCase: function(keyword, match) {
            //"use strict";
            var me = this;
            return me._isDefined(keyword) && me._isDefined(match) && keyword.toLowerCase().indexOf(match.toLowerCase()) > -1;
        },

        /**
         * @method _matchesIgnoreCase
         * @private
         * @param {String} type1
         * @param {String} type2
         * Returns true if the given types match in lower case.
         * Also returns false if one or both types are not defined
         */
        _matchesIgnoreCase: function(type1, type2) {
            //"use strict";
            var me = this;
            return me._isDefined(type1) && me._isDefined(type2) && type1.toLowerCase() === type2.toLowerCase();
        },

        /**
         * @method _showRelatedKeywords
         * @private
         * @param {String} userInput User input
         * @param {Object} keywords
         *      related keywords to filter layers by
         * Also checks if all layers in a group is hidden and hides the group as well.
         */
        _showRelatedKeywords: function(userInput, keywords, oskarifield) {
            //"use strict";
            var me = this,
                relatedKeywordsCont = me.getFilterField().getField().find(
                    '.related-keywords'
                ),
                i,
                keyword,
                keywordTmpl,
                ontologySuggestions = [],
                ontologyLayers = [];

            me.clearRelatedKeywordsPopup(null, oskarifield);

            // Go through related keywords, get top 3, show only them
            if (keywords && keywords.length > 0) {
                for (i = 0; i < keywords.length; i += 1) {
                    keyword = keywords[i];
                    if (keyword.layers.length > 0) {
                        // check if we want to show matching layers instead of a suggestion
                        if (me._matchesIgnoreCase(keyword.type, 'syn') || (!me._isDefined(
                                keyword.type) && me._containsIgnoreCase(
                                keyword.keyword, userInput))) {
                            // copy keyword layerids to ontologyLayers, avoid duplicates just because
                            if (ontologyLayers.size === 0) {
                                ontologyLayers.concat(keyword.layers);
                            } else {
                                me._concatNew(ontologyLayers, keyword.layers);
                            }
                        } else {
                            ontologySuggestions.push({
                                idx: i,
                                count: keyword.layers.length
                            });
                        }
                    }
                }
            }


            if (ontologySuggestions.length > 0) {
                relatedKeywordsCont.prepend(
                    jQuery(me.templates.keywordsTitle).text(
                        me._locale.filter.didYouMean
                    )
                );
            } else {
                // Why show an error if we can't find suggestions?
                //relatedKeywordsCont.prepend(jQuery(me.templates.keywordsTitle).text(me._locale.errors.noResultsForKeyword));
            }

            // sort ontology suggestions by layer count
            ontologySuggestions.sort(function(x, y) {
                return x.count < y.count;
            });

            // show three top suggestions
            for (i = 0; i < ontologySuggestions.length && i < 3; i += 1) {
                keyword = keywords[ontologySuggestions[i].idx];
                keywordTmpl = jQuery(me.templates.keywordContainer);
                keywordTmpl
                    .attr('data-id', keyword.id)
                    .attr('data-keyword', keyword.keyword)
                    .find('.keyword').text(
                        keyword.keyword.toLowerCase() + ' (' +
                        keyword.layers.length + ')'
                    );

                relatedKeywordsCont.append(keywordTmpl);
            }
            if (ontologySuggestions.length) {
                relatedKeywordsCont.show();
            }

            me.ontologyLayers = ontologyLayers;
            // Show ontologyLayers in accordion
            me.filterLayers(userInput, ontologyLayers);

            // when clicked -> filter layers
            relatedKeywordsCont.find('.keyword-cont').on(
                'click',
                function(event) {
                    var val = jQuery(event.currentTarget).attr('data-keyword');

                    me.getFilterField().setValue(val);
                    me._fireFiltering(val, event, me);
                }
            );
        },

        _showAllLayers: function() {
            //"use strict";
            var i,
                group,
                layers,
                n,
                layer,
                layerId,
                layerCont;

            for (i = 0; i < this.layerGroups.length; i += 1) {
                group = this.layerGroups[i];
                layers = group.getLayers();

                for (n = 0; n < layers.length; n += 1) {
                    layer = layers[n];
                    //if(layer) {
                    layerId = layer.getId();
                    layerCont = this.layerContainers[layerId];
                    layerCont.setVisible(true);
                    //}
                }
                group.layerListPanel.setVisible(true);
                group.layerListPanel.close();
                group.layerListPanel.setTitle(
                    group.getTitle() + ' (' + layers.length + ')'
                );
            }

            this.accordion.removeMessage();
        },

        setLayerSelected: function(layerId, isSelected) {
            //"use strict";
            var layerCont = this.layerContainers[layerId];
            if (layerCont) {
                layerCont.setSelected(isSelected);
            }
        },

        updateLayerContent: function(layerId, layer) {
            //"use strict";
            var layerCont = this.layerContainers[layerId];
            if (layerCont) {
                layerCont.updateLayerContent(layer);
            }
        },
        _updateContainerHeight: function(height) {
            var me = this;
            me.getJsTreeElement().css('max-height', (height * 0.5) + 'px');
        },
        _bindOskariEvents: function() {
            var me = this;
            me._notifierService.on('AfterMapLayerAddEvent', function(evt) {
                var layer = evt.getMapLayer();
                me.getJsTreeElement().jstree().check_node('layer-' + layer.getId());
            });

            me._notifierService.on('AfterMapLayerRemoveEvent', function(evt) {
                var layer = evt.getMapLayer();
                me.getJsTreeElement().jstree().uncheck_node('layer-' + layer.getId());
            });


            me._notifierService.on('MapSizeChangedEvent', function(evt) {
                me._updateContainerHeight(evt.getHeight());
            });


        }
    }
);