/**
 * @class Oskari.liiteri.bundle.liiteri-layers-tabs.view.LayersTab
 *
 *
 */
Oskari.clazz.define(
    'Oskari.liiteri.bundle.liiteri-layers-tabs.view.LayersTab',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (instance, title, id) {
        this.instance = instance;
        this.title = title;
        this.id = id;
        //TODO: Probably not needed - get rid of it
        this.showSearchSuggestions = (instance.conf && instance.conf.showSearchSuggestions === true);
        this.layerGroups = [];
        this.layerContainers = {};

        this.templates = {
            spinner: '<span class="spinner-text"></span>',
            shortDescription: '<div class="field-description"></div>',
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
            liiteriLayersTab: '<div id="liiteriLayersTab"></div>'
        };
        this._createUI(id);
    }, {

        getTitle: function () {

            return this.title;
        },

        getTabPanel: function () {

            return this.tabPanel;
        },

        getState: function () {

            var state = {
                tab: this.getTitle(),
                filter: this.filterField.getValue(),
                groups: []
            };
            return state;
        },

        setState: function (state) {

            if (!state) {
                return;
            }

            if (!state.filter) {
                this.filterField.setValue(state.filter);
                this.filterLayers(state.filter);
            }
        },

        /**
         * Create UI
         * @method  @private _createUI
         *
         * @param  {String} oskarifieldId oskari field id
         */
        _createUI: function (oskarifieldId) {

            var me = this,
                oskarifield,
                liiteriLayersTab;

            me._locale = me.instance._localization;
            me.tabPanel = Oskari.clazz.create(
                'Oskari.userinterface.component.TabPanel');

            me.tabPanel.setTitle(me.title, me.id);
            me.tabPanel.setPriority(1);

            liiteriLayersTab = jQuery(me.templates.liiteriLayersTab);

            oskarifield = me.getFilterField().getField();
            oskarifield.addClass('stretched');

            if (me.showSearchSuggestions) {
                oskarifield.append(
                    jQuery(me.templates.spinner)
                        .text(me._locale.loading)
                );

                oskarifield.append(
                    jQuery(me.templates.relatedKeywords)
                );
            }

            liiteriLayersTab.append(oskarifield);
            oskarifield.find('.spinner-text').hide();

            // add id to search input
            oskarifield.find('input').attr(
                'id',
                'liiteri_layers_tabs_search_input_tab_' + oskarifieldId
            );

            var buttonsContainer = jQuery('<div class="actionsContainer"></div>');
            var expandButton = jQuery('<span><i class="expand-icon"></i>' + me._locale.filter.expandAll + '</span>');
            var collapseButton = jQuery('<span><i class="collapse-icon"></i>' + me._locale.filter.collapseAll + '</span>');
            buttonsContainer.append(expandButton);
            buttonsContainer.append(collapseButton);

            liiteriLayersTab.append(buttonsContainer);

            me.accordion = Oskari.clazz.create(
                'Oskari.userinterface.component.Accordion'
            );
            me.accordion.insertTo(liiteriLayersTab);

            me.tabPanel.getContainer().append(liiteriLayersTab);

            expandButton.click(function () {
                me.accordion.panels.forEach(function (p) {
                    p.open();
                });
            });
            collapseButton.click(function () {
                me.accordion.panels.forEach(function (p) {
                    p.close();
                });
            });
        },
        /**
         * Get filter field
         * @method  @public getFilterField
         *
         * @return {Oskari.userinterface.component.FormInput} field
         */
        getFilterField: function () {

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
            field.bindChange(function (event) {
                event.stopPropagation(); // JUST BECAUSE TEST ENVIRONMENT FAILS
                var evt = event;
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function () {
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
        _fireFiltering: function (keyword, event, me) {

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
        /**
         * Show layer groups
         * @method  @public showLayerGroups
         *
         * @param  {Array} groups
         */
        showLayerGroupsInGrid: function (groups) {
            var me = this;
            var group, i, data, layers, n, layer;

            me.dataView.beginUpdate();

            for (i = 0; i < groups.length; i += 1) {
                group = groups[i];
                layers = group.getLayers();
                for (n = 0; n < layers.length; n += 1) {
                    layer = layers[n];
                    data = {
                        name: group.name,
                        action: 'empty',
                        id: group.name
                    };

                    me.dataView.addItem(data);
                }
            }

            me.dataView.endUpdate();
            me.dataView.refresh();
            me.grid.invalidateAllRows();
            me.grid.render();
        },
        showLayerGroups: function (groups) {

            var me = this,
                i,
                groupsLength = groups.length,
                group,
                layers, sortedLayers,
                localization,
                groupPanel,
                groupContainer,
                layersLength,
                n,
                layer,
                layerWrapper,
                layerContainer,
                selectedLayers;
            var comparer = function (a, b) {
                var av = a.getName();
                var bv = b.getName();
                return (av == bv) ? 0 : ((av > bv) ? 1 : -1);
            }
            var groupComparer = function (a, b) {
                var av = a.getTitle();
                var bv = b.getTitle();
                return (av == bv) ? 0 : ((av > bv) ? 1 : -1);
            }

            groups.sort(groupComparer);

            me.accordion.removeAllPanels();
            me.layerContainers = {};
            me.layerGroups = groups;
            localization = me.instance.getLocalization();
            for (i = 0; i < groupsLength; i += 1) {
                group = groups[i];
                layers = group.getLayers();

                //no do show group if it has no layer
                if (layers == null || layers.length == 0)
                    continue;

                layersLength = layers.length;
                groupPanel = Oskari.clazz.create(
                    'Oskari.userinterface.component.AccordionPanel'
                );
                groupPanel.setTitle(group.getTitle());
                groupPanel.setId(
                    'liiteri_layers_tabs_accordionPanel_' +
                    group.getTitle().replace(/[^a-z0-9\-_:\.]/gi, '-')
                );
                group.layerListPanel = groupPanel;

                var badge = Oskari.clazz.create('Oskari.userinterface.component.Badge');
                badge.insertTo(groupPanel.getHeader());
                badge.setContent(layersLength, "inverse");
                group.badge = badge;

                groupContainer = groupPanel.getContainer();
                groupContainer.addClass('oskari-hidden');
                sortedLayers = layers.sort(comparer);
                for (n = 0; n < sortedLayers.length; n += 1) {
                    layer = sortedLayers[n];
                    layerWrapper =
                        Oskari.clazz.create(
                            'Oskari.liiteri.bundle.liiteri-layers-tabs.view.Layer',
                            layer, me.instance.sandbox, me.instance.getLocalization(), group.getTitle()
                        );
                    layerContainer = layerWrapper.getContainer();
                    groupContainer.append(layerContainer);
                    me.layerContainers[layer.getId()] = layerWrapper;
                }
                groupContainer.removeClass('oskari-hidden');
                me.accordion.addPanel(groupPanel);
            }

            selectedLayers = me.instance.sandbox.findAllSelectedMapLayers();
            layersLength = selectedLayers.length;
            for (i = 0; i < layersLength; i += 1) {
                me.setLayerSelected(selectedLayers[i].getId(), true);
            }

            me.filterLayers(me.filterField.getValue());
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
        filterLayers: function (keyword, ids) {

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

                //check if group is empty
                if (typeof group.layerListPanel !== 'undefined' && group.layerListPanel !== null) {
                    group.layerListPanel.setVisible(visibleLayerCount > 0);
                    if (group.layerListPanel.isVisible()) {
                        visibleGroupCount += 1;
                    }
                    if (group.badge) {
                        group.badge.updateContent(visibleLayerCount + '/' + layers.length);
                    }
                }

            }

            // check if there are no groups visible -> show 'no matches' notification
            // else clear any previous message
            if (visibleGroupCount === 0) {
                // empty result
                loc = me.instance.getLocalization('errors');
                me.accordion.showMessage(loc.noResults);
                jQuery(me.accordion.ui).find('.accordionmsg').attr(
                    'id',
                    'liiteri_layers_tabs_inspiretab_search_no-result'
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
        clearRelatedKeywordsPopup: function (keyword, oskarifield) {

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
        _relatedKeywordsPopup: function (keyword, event, me) {

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
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType(
                            'application/j-son;charset=UTF-8');
                    }
                },
                url: ajaxUrl + 'action_route=SearchKeywords&keyword=' +
                    encodeURIComponent(keyword) + '&lang=' + Oskari.getLang(),
                success: function (pResp) {
                    me.relatedKeywords = pResp;
                    me._showRelatedKeywords(keyword, pResp, oskarifield);
                    relatedKeywordsCont.hide();
                },
                error: function (jqXHR, textStatus) {
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

        /**
         * @method _concatNew
         * @private
         * @param {Array} arr1
         *     Array of previously concatenated values
         * @param {Array} arr2
         *     Array of values to be concatenated
         * Concatenates (in place) those values from arr2 to arr1 that are not present in arr1
         */
        _concatNew: function (arr1, arr2) {

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
        _isDefined: function (value) {

            return typeof value !== 'undefined' && value !== null && value !== '';
        },

        /**
         * @method _containsIgnoreCase
         * @private
         * @param {String} keyword
         * @param {String} match
         * Returns true if keyword contains match (ignoring case)
         */
        _containsIgnoreCase: function (keyword, match) {

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
        _matchesIgnoreCase: function (type1, type2) {

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
        _showRelatedKeywords: function (userInput, keywords, oskarifield) {

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
            ontologySuggestions.sort(function (x, y) {
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
                function (event) {
                    var val = jQuery(event.currentTarget).attr('data-keyword');

                    me.getFilterField().setValue(val);
                    me._fireFiltering(val, event, me);
                }
            );
        },

        _showAllLayers: function () {

            var i,
                group,
                layers,
                n,
                layer,
                layerId,
                layerCont;

            this.accordion.removeMessage();

            for (i = 0; i < this.layerGroups.length; i += 1) {
                group = this.layerGroups[i];
                layers = group.getLayers();

                for (n = 0; n < layers.length; n += 1) {
                    layer = layers[n];
                    layerId = layer.getId();
                    layerCont = this.layerContainers[layerId];
                    layerCont.setVisible(true);
                }

                if (group.layerListPanel != null) {
                    group.layerListPanel.setVisible(true);
                    group.layerListPanel.close();
                }
                if (group.badge) {
                    group.badge.updateContent(layers.length);
                }
            }

            this.accordion.removeMessage();
        },
        selectAllLayers: function (isSelected, sendEvent) {
            for (var layerId in this.layerContainers) {
                var layerCont = this.layerContainers[layerId];
                if (layerCont) {
                    layerCont.setSelected(isSelected, sendEvent);
                }
            }
        },
        setLayerSelected: function (layerId, isSelected) {

            var layerCont = this.layerContainers[layerId];
            if (layerCont) {
                layerCont.setSelected(isSelected);
            }
        },

        updateLayerContent: function (layerId, layer) {

            var layerCont = this.layerContainers[layerId];
            if (layerCont) {
                layerCont.updateLayerContent(layer);
            }
        }
    }
);
