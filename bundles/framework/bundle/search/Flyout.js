/**
 * @class Oskari.mapframework.bundle.search.Flyout
 *
 * Renders the "search" flyout.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.search.Flyout',

    /**
     * @static @method create called automatically on construction
     *
     * @param {Oskari.mapframework.bundle.search.SearchBundleInstance}
     * Instance reference to component that created the tile
     *
     */
    function (instance) {
        this.instance = instance;
        this.container = null;

        this.state = null;

        this.template = null;
        this.templateResultTable = null;
        this.templateResultTableHeader = null;
        this.templateResultTableRow = null;

        this.resultHeaders = [];
        // last search result is saved so we can sort it in client
        this.lastResult = null;
        // last sort parameters are saved so we can change sort direction
        // if the same column is sorted again
        this.lastSort = null;
        // Actions that get added to the search result popup
        this.resultActions = {};

        this._searchContainer = null;
        this.tabsContainer = Oskari.clazz.create(
            'Oskari.userinterface.component.TabContainer'
        );
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.search.Flyout';
        },

        /**
         * @method setEl
         * @param {Object} el
         *      reference to the container in browser
         * @param {Number} width
         *      container size(?) - not used
         * @param {Number} height
         *      container size(?) - not used
         *
         * Interface method implementation
         */
        setEl: function (el, width, height) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('globalsearch')) {
                jQuery(this.container).addClass('globalsearch');
            }
        },

        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         */
        startPlugin: function () {
            this.template = jQuery(
                '<div class="searchContainer">' +
                '  <div class="searchDescription"></div>' +
                '  <div class="controls">' +
                '  </div>' +
                '  <div><br></div>' +
                '  <div class="info"></div>' +
                '  <div><br></div>' +
                '  <div class="resultList"></div>' +
                '</div>'
            );

            this.templateResultTable = jQuery(
                '<table class="search_result oskari-grid">' +
                '  <thead><tr></tr></thead>' +
                '  <tbody></tbody>' +
                '</table>'
            );

            this.templateResultTableHeader = jQuery(
                '<th><a href="JavaScript:void(0);"></a></th>'
            );

            this.templateResultTableRow = jQuery(
                '<tr>' +
                '  <td><a href="JavaScript:void(0);"></a></td>' +
                '  <td></td>' +
                '  <td></td>' +
                '</tr>'
            );

            this.resultHeaders = [
                {
                    title: this.instance.getLocalization('grid').name,
                    prop: 'name'
                }, {
                    title: this.instance.getLocalization('grid').village,
                    prop: 'village'
                }, {
                    title: this.instance.getLocalization('grid').type,
                    prop: 'type'
                }
            ];
        },

        /**
         * @method stopPlugin
         *
         * Interface method implementation, does nothing atm
         */
        stopPlugin: function () {

        },

        /**
         * @method getTitle
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            return this.instance.getLocalization('title');
        },

        /**
         * @method getTabTitle
         * @return {String} localized text for the tab title
         */
        getTabTitle: function () {
            return this.instance.getLocalization('tabTitle');
        },

        /**
         * @method getDescription
         * @return {String} localized text for the description of the
         * flyout
         */
        getDescription: function () {
            return this.instance.getLocalization('desc');
        },

        /**
         * @method getOptions
         * Interface method implementation, does nothing atm
         */
        getOptions: function () {

        },

        /**
         * @method setState
         * @param {Object} state
         */
        setState: function (state) {
            this.state = state;
        },

        /**
         * @method getState
         * @return {Object} state
         */
        getState: function () {
            if (!this.state) {
                return {};
            }
            return this.state;
        },

        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function () {
            // Do not create the default UI if configured so
            if (this.instance.disableDefault) {
                return;
            }

            var me = this,
                sandbox = me.instance.getSandbox(),
                flyout = jQuery(me.container);

            flyout.empty();

            var searchContainer = me.template.clone();
            me._searchContainer = searchContainer;

            var searchDescription = searchContainer.find('div.searchDescription');
            searchDescription.html(me.instance.getLocalization('searchDescription'));

            var field = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
            field.setPlaceholder(me.instance.getLocalization('searchAssistance'));
            field.setIds('oskari_search_forminput', 'oskari_search_forminput_searchassistance');

            if (me.instance.safeChars) {
                var regex = /[\s\w\d\.\,\?\!\-äöåÄÖÅ]*\*?$/;
                field.setContentCheck(true, me.instance.getLocalization('invalid_characters'), regex);
            }

            field.bindChange(function (event) {
                if (me.state === null) {
                    me.state = {};
                }
                var value = field.getValue();
                me.state.searchtext = value;
                if (!value) {
                    // remove results when field is emptied
                    var info = searchContainer.find('div.info');
                    info.empty();
                    var resultList = searchContainer.find('div.resultList');
                    resultList.empty();

                    // try to remove markers if request is available when field is emptied
                    var reqBuilder = sandbox.getRequestBuilder(
                        'MapModulePlugin.RemoveMarkersRequest'
                    );
                    if (reqBuilder) {
                        sandbox.request(me.instance.getName(), reqBuilder());
                    }
                }
            });
            field.addClearButton('oskari_search_forminput_clearbutton');

            var button = Oskari.clazz.create(
                'Oskari.userinterface.component.buttons.SearchButton'
            );
            button.setId('oskari_search_button_search');

            var doSearch = function () {
                field.setEnabled(false);
                button.setEnabled(false);

                var resultList = searchContainer.find('div.resultList');
                resultList.empty();
                var info = searchContainer.find('div.info');
                info.empty();

                // TODO: make some gif go round and round so user knows
                // something is happening
                var searchKey = field.getValue(me.instance.safeChars);

                if (!me._validateSearchKey(field.getValue(false))) {
                    field.setEnabled(true);
                    button.setEnabled(true);
                    return;
                }

                me.instance.service.doSearch(
                    searchKey,
                    function (data) {
                        field.setEnabled(true);
                        button.setEnabled(true);
                        me._renderResults(data, searchKey);
                    },
                    function (data) {
                        field.setEnabled(true);
                        button.setEnabled(true);

                        var errorKey = data ? data.responseText : null,
                            msg = me.instance.getLocalization(
                                'searchservice_search_not_found_anything_text');

                        if (errorKey) {
                            if (typeof me.instance.getLocalization(errorKey) === 'string') {
                                msg = me.instance.getLocalization(errorKey);
                            }
                        }

                        me._showError(msg);
                    });
            };

            button.setHandler(doSearch);
            field.bindEnterKey(doSearch);

            var controls = searchContainer.find('div.controls');
            controls.append(field.getField());
            controls.append(button.getElement());

            flyout.append(searchContainer);
            me.tabsContainer.addTabChangeListener(
                function (previousTab, newTab) {
                    // Make sure this fires only when the flyout is open
                    if (!flyout.parents('.oskari-flyout.oskari-closed').length) {
                        var searchInput = newTab.getContainer().find('input[type=text]');
                        if (searchInput) {
                            searchInput.focus();
                        }
                    }
                    var eventBuilder = sandbox.getEventBuilder('Search.TabChangedEvent'),
                        previousTabId = previousTab ? previousTab.getId() : null,
                        newTabId = newTab ? newTab.getId() : null,
                        event = eventBuilder(previousTabId, newTabId);

                    sandbox.notifyAll(event);
                }
            );
        },

        focus: function () {
            var searchInput = this._searchContainer.find('input[type=text]');
            searchInput.focus();
        },

        _validateSearchKey: function (key) {
            var me = this;
            // empty string
            if (key === null || key === undefined || key.length === 0) {
                me._showError(me.instance.getLocalization('cannot_be_empty'));
                return false;
            }
            // too many stars
            if ((key.match(/\*/g) || []).length > 1) {
                me._showError(me.instance.getLocalization('too_many_stars'));
                return false;
            }
            // not enough characters accompanying a star
            if (key.indexOf('*') > -1 && key.length < 5) {
                me._showError(me.instance.getLocalization('too_short'));
                return false;
            }

            // invalid characters (or a star in the wrong place...)
            if (me.instance.safeChars) {
                if (!/^[a-zåäöA-ZÅÄÖ \.,\?\!0-9]+\**$/.test(key)) {
                    me._showError(me.instance.getLocalization('invalid_characters'));
                    return false;
                }
            }
            return true;
        },

        _showError: function (error) {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okButton = dialog.createCloseButton('OK');

            dialog.setId('oskari_search_error_popup');

            dialog.show(
                    this.instance.getLocalization('searchservice_search_alert_title'),
                    error, [okButton]
            );
        },

        _renderResults: function (result, searchKey) {
            if (!result || typeof result.totalCount !== 'number') {
                return;
            }

            var me = this,
                resultList = me._searchContainer.find('div.resultList');

            resultList.empty();
            me.lastResult = result;

            var info = me._searchContainer.find('div.info');
            info.empty();

            var inst = me.instance;
            // error handling
            if (result.totalCount === -1) {
                resultList.append(this.instance.getLocalization('searchservice_search_alert_title') + ': ' + this.instance.getLocalization(result.errorText));
                return;
            } else if (result.totalCount === 0) {
                var alK = 'searchservice_search_alert_title',
                    al = inst.getLocalization(alK),
                    nfK = 'searchservice_search_not_found_anything_text',
                    nf = inst.getLocalization(nfK);

                resultList.append(al + ': ' + nf);
                return;
            } else {
                info.append(this.instance.getLocalization('searchResultCount') + ' ' +
                    result.totalCount + ' ' + this.instance.getLocalization('searchResultCount2'));
                info.append('<br/>');

                if (result.hasMore) {
                    // more results available
                    info.append(
                        this.instance.getLocalization('searchResultDescriptionMoreResults')
                    );
                    info.append('<br/>');
                }
                info.append(
                    this.instance.getLocalization('searchResultDescriptionOrdering')
                );
            }

            if (result.totalCount === 1) {
                // move map etc
                me._resultClicked(result.locations[0]);
                // close flyout
                inst.sandbox.postRequestByName(
                    'userinterface.UpdateExtensionRequest',
                    [me.instance, 'close']
                );
            }
            // render results
            var table = this.templateResultTable.clone(),
                tableHeaderRow = table.find('thead tr'),
                tableBody = table.find('tbody');
            // header reference needs some closure magic to work here

            var headerClosureMagic = function (scopedValue) {
                return function () {
                    // clear table for sorted results
                    tableBody.empty();
                    // default to descending sort
                    var descending = false;
                    // if last sort was made on the same column ->
                    // change direction
                    if (me.lastSort && me.lastSort.attr === scopedValue.prop) {
                        descending = !me.lastSort.descending;
                    }
                    // sort the results
                    me._sortResults(scopedValue.prop, descending);
                    // populate table content
                    me._populateResultTable(tableBody);
                    // apply visual changes
                    var headerContainer = tableHeaderRow.find('a:contains(' + scopedValue.title + ')');
                    tableHeaderRow.find('th').removeClass('asc');
                    tableHeaderRow.find('th').removeClass('desc');
                    if (descending) {
                        headerContainer.parent().addClass('desc');
                    } else {
                        headerContainer.parent().addClass('asc');
                    }
                    return false;
                };
            };
            var i,
                header,
                link;
            for (i = 0; i < this.resultHeaders.length; i += 1) {
                header = this.templateResultTableHeader.clone();
                link = header.find('a');
                link.append(this.resultHeaders[i].title);
                link.bind('click', headerClosureMagic(this.resultHeaders[i]));
                tableHeaderRow.append(header);
            }

            this._populateResultTable(tableBody);
            resultList.append('<div><h3>' +
                this.instance.getLocalization('searchResults') + ' ' + result.totalCount + ' ' + 
                this.instance.getLocalization('searchResultsDescription') + ' ' + searchKey + '</h3></div>');
            resultList.append(table);
        },

        _populateResultTable: function (resultsTableBody) {
            var me = this;
            // row reference needs some closure magic to work here
            var closureMagic = function (scopedValue) {
                return function () {
                    me._resultClicked(scopedValue);
                    return false;
                };
            };
            var locations = this.lastResult.locations,
                i,
                row,
                resultContainer,
                cells,
                titleCell,
                title;

            for (i = 0; i < locations.length; i += 1) {
                row = locations[i];
                resultContainer = this.templateResultTableRow.clone();
                cells = resultContainer.find('td');
                titleCell = jQuery(cells[0]);
                title = titleCell.find('a');
                title.append(row.name);
                title.bind('click', closureMagic(row));
                jQuery(cells[1]).append(row.village);
                jQuery(cells[2]).append(row.type);
                resultsTableBody.append(resultContainer);
            }
        },

        _resultClicked: function (result) {
            var me = this,
                popupId = 'searchResultPopup',
                inst = this.instance,
                sandbox = inst.sandbox;
            // good to go
            // Note! result.ZoomLevel is deprecated. ZoomScale should be used instead
            var moveReqBuilder = sandbox.getRequestBuilder('MapMoveRequest'),
                zoom = result.zoomLevel;
            if(result.zoomScale) {
                var zoom = {scale : result.zoomScale};
            }
            sandbox.request(
                me.instance.getName(),
                moveReqBuilder(result.lon, result.lat, zoom, false)
            );

            var loc = this.instance.getLocalization('resultBox'),
                resultActions = {},
                action;
            for (var name in this.resultActions) {
                if (this.resultActions.hasOwnProperty(name)) {
                    action = this.resultActions[name];
                    resultActions[name] = action(result);
                }
            }

            var contentItem = {
                html: '<h3>' + result.name + '</h3>' + '<p>' + result.village + '<br/>' + result.type + '</p>',
                actions: resultActions
            };
            var content = [contentItem];

            /* impl smashes action key to UI - we'll have to localize that here */
            contentItem.actions[loc.close] = function () {
                var rN = 'InfoBox.HideInfoBoxRequest',
                    rB = sandbox.getRequestBuilder(rN),
                    request = rB(popupId);
                sandbox.request(me.instance.getName(), request);
            };

            var rN = 'InfoBox.ShowInfoBoxRequest',
                rB = sandbox.getRequestBuilder(rN),
                request = rB(
                    popupId,
                    loc.title,
                    content,
                    new OpenLayers.LonLat(result.lon, result.lat),
                    true
                );

            sandbox.request(this.instance.getName(), request);
        },

        /**
         * @private @method _sortResults
         * Sorts the last search result by comparing given attribute on
         * the search objects
         *
         * @param {String} pAttribute attributename to sort by (e.g.
         * result[pAttribute])
         * @param {Boolean} pDescending true if sort direction is descending
         *
         */
        _sortResults: function (pAttribute, pDescending) {
            var me = this;
            if (!this.lastResult) {
                return;
            }
            this.lastSort = {
                attr: pAttribute,
                descending: pDescending
            };
            this.lastResult.locations.sort(function (a, b) {
                return me._searchResultComparator(a, b, pAttribute, pDescending);
            });

        },

        /**
         * @private @method _searchResultComparator
         * Compares the given attribute on given objects for sorting
         * search result objects.
         *
         * @param {Object} a search result 1
         * @param {Object} b search result 2
         * @param {String} pAttribute attributename to sort by (e.g.
         * a[pAttribute])
         * @param {Boolean} pDescending true if sort direction is descending
         *
         */
        _searchResultComparator: function (a, b, pAttribute, pDescending) {
            var nameA = a[pAttribute].toLowerCase(),
                nameB = b[pAttribute].toLowerCase(),
                value = 0;
            if (nameA === nameB || 'name' === pAttribute) {
                // Because problem with address 1 and address 10 then
                // id are ranked right
                nameA = a.id;
                nameB = b.id;
            }
            if (nameA < nameB) {
                value = -1;
            } else if (nameA > nameB) {
                value = 1;
            }
            if (pDescending) {
                value = value * -1;
            }
            return value;
        },

        /**
         *
         *
         */
        addTab: function (item) {
            var me = this,
                flyout = jQuery(me.container);
            // Change into tab mode if not already
            if (me.tabsContainer.panels.length === 0) {
                me.tabsContainer.insertTo(flyout);

                if (me.instance.disableDefault !== true) {
                    var defaultPanel = Oskari.clazz.create(
                            'Oskari.userinterface.component.TabPanel'
                        ),
                        searchContainer = jQuery('div.searchContainer');

                    defaultPanel.setTitle(
                        me.getTabTitle(),
                        'oskari_search_tabpanel_header'
                    );
                    defaultPanel.setContent(searchContainer);
                    defaultPanel.setId('oskari_search_tabpanel_header');
                    defaultPanel.setPriority(me.instance.tabPriority);
                    me.tabsContainer.addPanel(defaultPanel);
                }
            }

            var panel = Oskari.clazz.create(
                'Oskari.userinterface.component.TabPanel'
            );
            panel.setTitle(item.title, item.id);
            panel.setId(item.id);
            panel.setContent(item.content);
            panel.setPriority(item.priority);
            me.tabsContainer.addPanel(panel);
        },

        addSearchResultAction: function (action) {
            this.resultActions[action.name] = action.callback;
        },

        removeSearchResultAction: function (name) {
            delete this.resultActions[name];
        }
    }, {
        /**
         * @static @property {String[]} protocol
         */
        protocol: ['Oskari.userinterface.Flyout']
    }
);
