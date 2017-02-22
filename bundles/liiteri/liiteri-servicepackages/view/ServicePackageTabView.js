/**
 * @class Oskari.liiteri.bundle.liiteri-servicepackages.view.ServicePackageTabView
 */
Oskari.clazz.define(
    'Oskari.liiteri.bundle.liiteri-servicepackages.view.ServicePackageTabView',

    /**
     * @method create called automatically on construction
     * @static
     */
    function (instance, title, id) {
        this.instance = instance;
        this.title = title;
        this.id = id;
        this.showSearchSuggestions = (instance.conf && instance.conf.showSearchSuggestions === true);
        this.servicePackageGroups = [];
        this.servicePackageContainers = {};

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
            servicePackageFilter: '<div class="servicepackage-filter liiteri-servicepackages-servicepackage-filter">'+
                '</div><div style="clear:both;"></div>'
        };
        this._createUI(id);
    }, {

        getName: function () {
            return 'Oskari.liiteri.bundle.liiteri-servicepackages.view.ServicePackageView';
        },

        getTitle: function () {
            //"use strict";
            return this.title;
        },

        getTabPanel: function () {
            //"use strict";
            return this.tabPanel;
        },

        getState: function () {
            //"use strict";
            var state = {
                tab: this.getTitle(),
                filter: this.filterField.getValue(),
                groups: []
            };
            return state;
        },

        setState: function (state) {
            //"use strict";
            if (!state) {
                return;
            }

            if (!state.filter) {
                this.filterField.setValue(state.filter);
                this.filterServicePackages(state.filter);
            }
        },

        /**
         * @public @method focus
         * Focuses the panel's search field (if available)
         *
         *
         */
        focus: function () {
            this.getFilterField().getField().find('input').focus();
        },

        startPlugin: function () {
        },
        stopPlugin: function () {
        },

        /**
         * Create UI
         * @method  @private _createUI
         *
         * @param  {String} oskarifieldId oskari field id
         */
        _createUI: function (oskarifieldId) {
            //"use strict";
            var me = this,
                oskarifield,
                servicePackageFilter;

            me._locale = me.instance._localization;
            me.tabPanel = Oskari.clazz.create(
                'Oskari.userinterface.component.TabPanel');
            me.tabPanel.setTitle(me.title, me.id);

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

            if(!(this.instance.conf && this.instance.conf.hideServicePackageFilters && this.instance.conf.hideServicePackageFilters === true)) {
                servicePackageFilter = jQuery(me.templates.servicePackageFilter);
                me.tabPanel.getContainer().append(servicePackageFilter);
            }

            me.tabPanel.getContainer().append(oskarifield);
            oskarifield.find('.spinner-text').hide();

            // add id to search input
            oskarifield.find('input').attr(
                'id',
                'oskari_servicepackageselector_search_input_tab_' + oskarifieldId
            );

            var buttonsContainer = jQuery('<div class="actionsContainer"></div>');
            var expandButton = jQuery('<span><i class="expand-icon"></i>' + me._locale.filter.expandAll + '</span>');
            var collapseButton = jQuery('<span><i class="collapse-icon"></i>' + me._locale.filter.collapseAll + '</span>');
            buttonsContainer.append(expandButton);
            buttonsContainer.append(collapseButton);

            me.tabPanel.getContainer().append(buttonsContainer);

            me.accordion = Oskari.clazz.create(
                'Oskari.userinterface.component.Accordion'
            );
            me.accordion.addClass('servicePackage-accordion');
            me.accordion.insertTo(me.tabPanel.getContainer());

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
         * Calls all needed functions to do the servicePackage filtering.
         */
        _fireFiltering: function (keyword, event, me) {
            //"use strict";
            // Filter by name
            me.filterServicePackages(keyword);

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
         * Show servicePackage groups
         * @method  @public showServicePackageGroups
         *
         * @param  {Array} groups
         */
        showServicePackageGroupsInGrid: function (groups) {
            var me = this;
            var group, i, data, servicePackages, n, servicePackage;

            me.dataView.beginUpdate();
            
            for (i = 0; i < groups.length; i += 1) {
                group = groups[i];
                servicePackages = group.getServicePackages();
                for (n = 0; n < servicePackages.length; n += 1) {
                    servicePackage = servicePackages[n];
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
        showServicePackageGroups: function (groups) {
            var me = this,
                i,
                groupsLength = groups.length,
                group,
                servicePackages, sortedServicePackages,
                localization,
                groupPanel,
                groupContainer,
                servicePackagesLength,
                n,
                servicePackage,
                servicePackageWrapper,
                servicePackageContainer;
            var comparer = function(a, b) {
                var av = a.getName().toLocaleLowerCase();
                var bv = b.getName().toLocaleLowerCase();
                return av.localeCompare(bv);
            };
            var groupComparer = function(a, b) {
                var av = a.getTitle().toLocaleLowerCase();
                var bv = b.getTitle().toLocaleLowerCase();
                return av.localeCompare(bv);
            };
            
            groups.sort(groupComparer);

            me.accordion.removeAllPanels();
            me.servicePackageContainers = {};
            me.servicePackageGroups = groups;
            localization = me.instance.getLocalization();
            for (i = 0; i < groupsLength; i += 1) {
                group = groups[i];
                servicePackages = group.getServicePackages();

                //no do show group if it has no servicePackage
                if (servicePackages == null || servicePackages.length == 0)
                    continue;

                servicePackagesLength = servicePackages.length;
                groupPanel = Oskari.clazz.create(
                    'Oskari.userinterface.component.AccordionPanel'
                );
                groupPanel.setTitle(group.getTitle() + ' (' + servicePackagesLength +
                    ')');
                groupPanel.setId(
                    'oskari_servicePackageselector2_accordionPanel_' +
                    group.getTitle().replace(/[^a-z0-9\-_:\.]/gi, '-')
                );
                group.servicePackageListPanel = groupPanel;

                groupContainer = groupPanel.getContainer();

                sortedServicePackages = servicePackages.sort(comparer);
                for (n = 0; n < sortedServicePackages.length; n += 1) {
                    servicePackage = sortedServicePackages[n];
                    servicePackageWrapper =
                        Oskari.clazz.create(
                            'Oskari.liiteri.bundle.liiteri-servicepackages.view.ServicePackageView',
                            servicePackage, me.instance, me.instance.getLocalization(), group.getTitle()
                    );
                    servicePackageContainer = servicePackageWrapper.getContainer();
                    groupContainer.append(servicePackageContainer);

                    me.servicePackageContainers[servicePackage.getId()] = servicePackageWrapper;
                }
                me.accordion.addPanel(groupPanel);
            }

            me.filterServicePackages(me.filterField.getValue());
        },

        /**
         * @method filterServicePackages
         * @private
         * @param {String} keyword
         *      keyword to filter servicePackages by
         * @param {Array} ids optional list of servicePackage IDs to be shown
         * Shows and hides servicePackages by comparing the given keyword to the text in servicePackage containers servicePackage-keywords div.
         * Also checks if all servicePackages in a group is hidden and hides the group as well.
         */
        filterServicePackages: function (keyword, ids) {
            //"use strict";
            var me = this,
                visibleGroupCount = 0,
                visibleServicePackageCount,
                i,
                n,
                group,
                servicePackage,
                servicePackages,
                servicePackageId,
                servicePackageCont,
                bln,
                loc;

            if (!ids && me.sentKeyword === keyword) {
                ids = me.ontologyServicePackages;
            }
            // show all groups
            me.accordion.showPanels();
            if (!keyword || keyword.length === 0) {
                me._showAllServicePackages();
                return;
            }
            // filter
            for (i = 0; i < me.servicePackageGroups.length; i += 1) {
                group = me.servicePackageGroups[i];
                servicePackages = group.getServicePackages();
                visibleServicePackageCount = 0;
                for (n = 0; n < servicePackages.length; n += 1) {
                    servicePackage = servicePackages[n];
                    servicePackageId = servicePackage.getId();
                    servicePackageCont = me.servicePackageContainers[servicePackageId];
                    bln = group.matchesKeyword(servicePackageId, keyword) || (me.showSearchSuggestions && ids && me._arrayContains(ids, servicePackageId));
                    servicePackageCont.setVisible(bln);
                    if (bln) {
                        visibleServicePackageCount += 1;
                        // open the panel if matching servicePackages
                        group.servicePackageListPanel.open();
                    }
                }
                
                //check if group is empty
                if(typeof group.servicePackageListPanel !== 'undefined' && group.servicePackageListPanel !== null) {
                    group.servicePackageListPanel.setVisible(visibleServicePackageCount > 0);
                    if (group.servicePackageListPanel.isVisible()) {
                        visibleGroupCount += 1;
                    }
                    group.servicePackageListPanel.setTitle(group.getTitle() + ' (' +
                        visibleServicePackageCount + '/' + servicePackages.length + ')');
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
                    'oskari_servicePackageselector2_inspiretab_search_no-result'
                );
            } else {
                me.accordion.removeMessage();
            }
        },

        /**
         * @method clearRelatedKeywordsPopup
         * @private
         * @param {String} keyword
         *      keyword to filter servicePackages by
         * @param {Object} oskarifield
         *      dom object to be cleared
         * Clears related keywords popup
         */
        clearRelatedKeywordsPopup: function (keyword, oskarifield) {
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
         *      keyword to filter servicePackages by
         * @param {Object} event
         *      event hat caused the function to fire
         * @param {Object} me
         *      reference to the bundle instance
         * Shows and hides servicePackages by comparing the given keyword to the text in servicePackage containers servicePackage-keywords div.
         * Also checks if all servicePackages in a group is hidden and hides the group as well.
         */
        _relatedKeywordsPopup: function (keyword, event, me) {
            //"use strict";
            //event.preventDefault();
            var oskarifield = jQuery(event.currentTarget).parents(
                    '.oskarifield'
                ),
                loc,
                relatedKeywordsCont,
                ajaxUrl;

            if (!keyword || keyword.length === 0) {
                this._showAllServicePackages();
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
        _isDefined: function (value) {
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
        _containsIgnoreCase: function (keyword, match) {
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
        _matchesIgnoreCase: function (type1, type2) {
            //"use strict";
            var me = this;
            return me._isDefined(type1) && me._isDefined(type2) && type1.toLowerCase() === type2.toLowerCase();
        },

        /**
         * @method _showRelatedKeywords
         * @private
         * @param {String} userInput User input
         * @param {Object} keywords
         *      related keywords to filter servicePackages by
         * Also checks if all servicePackages in a group is hidden and hides the group as well.
         */
        _showRelatedKeywords: function (userInput, keywords, oskarifield) {
            //"use strict";
            var me = this,
                relatedKeywordsCont = me.getFilterField().getField().find(
                    '.related-keywords'
                ),
                i,
                keyword,
                keywordTmpl,
                ontologySuggestions = [],
                ontologyServicePackages = [];

            me.clearRelatedKeywordsPopup(null, oskarifield);

            // Go through related keywords, get top 3, show only them
            if (keywords && keywords.length > 0) {
                for (i = 0; i < keywords.length; i += 1) {
                    keyword = keywords[i];
                    if (keyword.servicePackages.length > 0) {
                        // check if we want to show matching servicePackages instead of a suggestion
                        if (me._matchesIgnoreCase(keyword.type, 'syn') || (!me._isDefined(
                                keyword.type) && me._containsIgnoreCase(
                                keyword.keyword, userInput))) {
                            // copy keyword servicePackageids to ontologyServicePackages, avoid duplicates just because
                            if (ontologyServicePackages.size === 0) {
                                ontologyServicePackages.concat(keyword.servicePackages);
                            } else {
                                me._concatNew(ontologyServicePackages, keyword.servicePackages);
                            }
                        } else {
                            ontologySuggestions.push({
                                idx: i,
                                count: keyword.servicePackages.length
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

            // sort ontology suggestions by servicePackage count
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
                        keyword.servicePackages.length + ')'
                    );

                relatedKeywordsCont.append(keywordTmpl);
            }
            if (ontologySuggestions.length) {
                relatedKeywordsCont.show();
            }

            me.ontologyServicePackages = ontologyServicePackages;
            // Show ontologyServicePackages in accordion
            me.filterServicePackages(userInput, ontologyServicePackages);

            // when clicked -> filter servicePackages
            relatedKeywordsCont.find('.keyword-cont').on(
                'click',
                function (event) {
                    var val = jQuery(event.currentTarget).attr('data-keyword');

                    me.getFilterField().setValue(val);
                    me._fireFiltering(val, event, me);
                }
            );
        },

        _showAllServicePackages: function () {
            //"use strict";
            var i,
                group,
                servicePackages,
                n,
                servicePackage,
                servicePackageId,
                servicePackageCont;
				
			this.accordion.removeMessage();

            for (i = 0; i < this.servicePackageGroups.length; i += 1) {
                group = this.servicePackageGroups[i];
                servicePackages = group.getServicePackages();

                for (n = 0; n < servicePackages.length; n += 1) {
                    servicePackage = servicePackages[n];
                    servicePackageId = servicePackage.getId();
                    servicePackageCont = this.servicePackageContainers[servicePackageId];
                    servicePackageCont.setVisible(true);
                }

                if (group.servicePackageListPanel != null) {
                    group.servicePackageListPanel.setVisible(true);
                    group.servicePackageListPanel.close();
                    group.servicePackageListPanel.setTitle(group.getTitle() + ' (' + servicePackages.length + ')');
                }                
            }

            this.accordion.removeMessage();
        },

        selectAllServicePackages : function(isSelected, sendEvent) {
            for (var servicePackageId in this.servicePackageContainers) {
                var servicePackageCont = this.servicePackageContainers[servicePackageId];
                if (servicePackageCont) {
                    servicePackageCont.setSelected(isSelected, sendEvent);
                }
            }
        },

        setServicePackageSelected: function (servicePackageId, isSelected) {
            //"use strict";
            var servicePackageCont = this.servicePackageContainers[servicePackageId];
            if (servicePackageCont) {
                servicePackageCont.setSelected(isSelected);
            }
        },

        updateServicePackageContent: function (servicePackageId, servicePackage) {
            //"use strict";
            var servicePackageCont = this.servicePackageContainers[servicePackageId];
            if (servicePackageCont) {
                servicePackageCont.updateServicePackageContent(servicePackage);
            }
        }

    }, {
    "extend": ["Oskari.userinterface.extension.DefaultView"]
});
