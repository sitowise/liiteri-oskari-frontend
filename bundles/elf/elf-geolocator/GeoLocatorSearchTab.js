/**
 * Creates the UI for ELF Geonetwork search service and
 * adds it as a tab to the search bundle.
 *
 * @class Oskari.elf.geolocator.GeoLocatorSeachTab
 */
Oskari.clazz.define('Oskari.elf.geolocator.GeoLocatorSeachTab',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.elf.geolocator.BundleInstance} instance
     *     reference to the component that created the tab
     */
    function (instance) {
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.countryUrl = this.sandbox.getAjaxUrl() + '&action_route=GetELFCountriesData&lang=' + Oskari.getLang();
        this.loc = instance.getLocalization('tab');
        this.templates = {};
        for (var t in this.__templates) {
            if(this.__templates.hasOwnProperty(t)) {
                this.templates[t] = jQuery(this.__templates[t]);
            }
        }
        this.resultsGrid = this.__initResultsGrid();
        this.progressSpinner = Oskari.clazz.create(
            'Oskari.userinterface.component.ProgressSpinner');
        this.tabContent = this.__initContent();
    }, {
        __templates: { container: '<div class="geolocator">'
                +    '<div class="geolocator-search">'
                +        '<div class="errors"></div>'
                +        '<form>'
                +            '<div class="search-fields"></div>'
                +            '<div class="search-buttons">'
                +            '<div class="commit">'
                +                '<input type="submit" />'
                +            '</div>'
                +          '</div>'
                +        '</form>'
                +    '</div>'
                +    '<div class="geolocator-results">'
                +        '<div class="header-results">'
                +           '<p>'
                +               '<span class="title"></span>'
                +               '<span class="back elf-fake-link"></span>'
                +           '</p>'
                +        '</div>'
                +        '<div class="search-results"></div>'
                +    '</div>'
                +'</div>',
            addInput:
            '<div class="additional-input">' +
            '   <div class="controls">' +
            '    <input type="radio" />' +
            '    <label></label>' +
            '  </div>' +
            '</div>',
            addInputCbx:
            '<div class="additional-input">' +
            '   <div class="controls">' +
            '    <input type="checkbox" />' +
            '    <label></label>' +
            '  </div>' +
            '</div>',
            countryAutoInput:
            '<div class="ui-country-autocomplete-widget">' +
            '<label for="countries"></label>' +
            '<input id="countries">' +
            '</div>',
            emptyDiv: '<div><br/></div>',
            result: '<div class="result"></div>'
        },
        /**
         * @method getTitle
         * @return {String}
         */
        getTitle: function () {
            return this.loc.title;
        },
        /**
         * @method getContent
         * @return {jQuery}
         */
        getContent: function () {
            return this.tabContent;
        },
        /**
         * Sends a request to the search bundle to add the UI as a tab.
         *
         * @method requestToAddTab
         */
        requestToAddTab: function () {
            var reqBuilder = this.sandbox
                    .getRequestBuilder('Search.AddTabRequest'),
                request;

            if (reqBuilder) {
                request = reqBuilder(this.getTitle(), this.getContent());
                this.sandbox.request(this.instance, request);
            }
        },
        /**
         * Initializes the tab content by creating the search fields
         * and binding functionality.
         *
         * @method __initContent
         * @private
         * @return {jQuery}
         */
        __initContent: function () {
            var me = this,
                container = this.templates.container.clone(),
                searchUi = container.find('div.geolocator-search'),
                resultsUi = container.find('div.geolocator-results'),
                searchInput = Oskari.clazz.create('Oskari.userinterface.component.FormInput','elf-geolocator-search', this.sandbox),
                regionInput = Oskari.clazz.create('Oskari.userinterface.component.FormInput','elf-geolocator-region', this.sandbox),
                searchButton = searchUi.find('div.commit input[type="submit"]'),
                countryInput = this.templates.countryAutoInput.clone(),
                backButton = resultsUi.find('div.header-results span.back');

            searchInput.setRequired(true, this.loc.errors.searchTermMissing);
            searchInput.addClearButton();
            searchInput.getField().addClass('search-field');
            searchInput.setLabel(this.loc.searchTitle);
            searchInput.setPlaceholder(this.loc.searchPlaceholder);
            regionInput.addClearButton();
            regionInput.getField().addClass('search-field');
            regionInput.setLabel(this.loc.regionTitle);
            regionInput.setPlaceholder(this.loc.regionPlaceholder);
            regionInput.setEnabled(true);

            countryInput.find('label')
                .text(this.loc.countryFilter);

            searchButton.val(this.loc.searchButton).on('click submit', function (e) {
                    e.preventDefault();
                    var values = me.__getValues();
                    me.__removeErrors(container);
                    if (values.errors) {
                        me.__addErrors(values.errors);
                    } else {
                        me.__doSearch(values);
                        searchUi.hide();
                        resultsUi.show();
                    }
                });

            backButton.text(this.loc.backButton).on('click', function () {
                    resultsUi.hide();
                    searchUi.show();
                });

            container.find('div.search-fields')
                .append(searchInput.getField())
                .append(countryInput)
                .append(this.templates.emptyDiv.clone()); // use later when data is available   .append(regionInput.getField());

            // Populate autocomplete countries
            me.__getCountries();

            resultsUi.find('div.header-results span.title')
                .append(this.__getSearchResultsTitle());

            this.progressSpinner
                .insertTo(resultsUi.find('div.search-results'));

            resultsUi.hide();

            this.searchInput = searchInput;
            this.regionInput = regionInput;

            return container;
        },
        /**
         * Returns the title for the search results.
         * Appends the result count to it if given.
         *
         * @method __getSearchResultsTitle
         * @private
         * @param  {Number} count
         * @param  {[]} method   search method
         * @return {String}
         */
        __getSearchResultsTitle: function (count, method) {
            var title = this.loc.resultsTitle;
            // Add search method to title (method might be changed in backend)
            if (method !== undefined && method !== null) {
                for(var key in method[0]) {
                    if (method[0][key] === 'fuzzy') {
                        title = this.loc.fuzzyResultsTitle;
                    }
                    else if (method[0][key] === 'filter') {
                        title = this.loc.filterResultsTitle;
                    }
                }
            }
            if (count !== undefined && count !== null) {
                title += (' (' + count + ')');
            }

            return title;
        },
        /**
         * Returns the form values.
         * If there were validations errors the return object
         * has a key `errors`
         *
         * @method __getValues
         * @private
         * @return {Object}
         */
        __getValues: function () {
            var values = {},
                container = this.getContent(),
                termErrors = this.searchInput.validate();

            if (termErrors && termErrors.length) {
                values.errors = termErrors;
            }

            values.term = this.searchInput.getValue();
            values.region = this.regionInput.getValue();
            if (container.find('#countries').val()) {
            values.country = container
                .find('#countries').attr('country');
            }

            return values;
        },
        /**
         * Performs the search through the search service.
         *
         * @method __doSearch
         * @private
         * @param  {Object} values
         */
        __doSearch: function(values) {
            var me = this;

            me.__beforeSearch();

            this.instance.getSearchService().doSearch(values,
                function (results) {
                    me.__handleSearchResult(results);
                },
                function () {
                    me.__handleSearchResult();
                });
        },
        /**
         * Performs the elf country list selection  through the search service.
         *
         * @method __getCountries
         * @private
         * @param  {Object} values
         */
        __getCountries: function() {
            var me = this;
            this.instance.getSearchService().getCountries(me.countryUrl,
                function (results) {
                    me.__handleCountryResult(results);
                },
                function () {
                    me.__handleCountryResult();
                });
        },
        /**
         * Empties the search results div and starts the progress spinner.
         *
         * @method __beforeSearch
         * @private
         */
        __beforeSearch: function () {
            var container = this.getContent().find('div.geolocator-results');

            container.find('div.search-results')
                .addClass('loading')
                .empty();
            container.find('div.header-results span.title')
                .text(this.__getSearchResultsTitle());
            this.progressSpinner.start();
        },
        /**
         * Renders the search results or a notification of an error.
         *
         * @method __handleSearchResult
         * @private
         * @param  {Object} results
         */
        __handleSearchResult: function (results) {
            var container = this.getContent().find('div.geolocator-results');

            this.progressSpinner.stop();
            container.find('div.search-results').removeClass('loading');

            if (results) {
                this.__renderSearchResults(results, container);
            } else {
                this.__handleSearchError(container);
            }
        },
        /**
         * Get celf country names for country filtering.
         *
         * @method __handleCountryResult
         * @private
         * @param  {Object} results
         */
        __handleCountryResult: function (results) {
            if(jQuery.isEmptyObject(results)) {
                return;
            }

            var container = this.getContent().find('div.geolocator-search');

            //populate autocomplete source (ELF countries)
            jQuery(function() {
                container.find('#countries').autocomplete({
                    minLength: 0,
                    source: results,
                    select: function(event, ui) {
                        container.find('#countries').attr('country',ui.item.id);

                    }

                })
                    .focus(function (event) {
                        event.preventDefault();
                        container.find('#countries').val('');
                        container.find('#countries').autocomplete('search', '');
                    });
            });
        },
        /**
         * Renders the search results to a div.
         *
         * @method __renderSearchResults
         * @private
         * @param  {Object} results
         * @param  {jQuery} container
         */
        __renderSearchResults: function (results, container) {
            var resultsTitle = container.find('div.header-results span.title'),
                resultsContainer = container.find('div.search-results'),
                resultsGrid = this.resultsGrid,
                resultsModel;

            resultsTitle
                .text(this.__getSearchResultsTitle(results.totalCount, results.methods));

            if (results.totalCount <= 0) {
                resultsContainer.append(this.loc.noResults);
            } else {
                resultsModel = this.__getGridModel(results.locations);
                resultsGrid
                    .setDataModel(resultsModel);
                resultsGrid
                    .renderTo(resultsContainer);
            }
        },
        /**
         * Renders a message to the results div notifying of an error.
         *
         * @method __handleSearchError
         * @private
         * @param  {jQuery} container
         */
        __handleSearchError: function (container) {
            container
                .find('div.search-results')
                .append(this.loc.errors.searchFailed);
        },
        /**
         * Initializes the Oskari grid for displaying the search results.
         *
         * @method __initResultsGrid
         * @private
         * @return {Oskari.userinterface.component.Grid}
         */
        __initResultsGrid: function () {
            var me = this,
                grid = Oskari.clazz.create(
                    'Oskari.userinterface.component.Grid'),
                visibleFields = ['name', 'village', 'type'];

            grid.setVisibleFields(visibleFields);

            grid.setColumnValueRenderer('name', function(name, data) {
                var nameTemplate = jQuery('<div class="nameColumn"></div>'),
                    link = jQuery('<span class="elf-fake-link"></span>');

                link.append(name).on('click', function() {
                    me.instance.resultClicked(data);
                });

                nameTemplate.append(link);

                if (data.exonymNames) {
                    _.forEach(data.exonymNames, function (name) {
                        var listElement = jQuery('<li class="exonymList"></li>');
                        listElement.html(name);
                        nameTemplate.append(listElement);
                    });
                }
                return nameTemplate;
            });

            _.each(visibleFields, function(field) {
                grid.setColumnUIName(field, me.loc.grid[field]);
            });

            return grid;
        },
        /**
         * Creates a model for the results grid containing the search results.
         *
         * @method __getGridModel
         * @private
         * @param  {Object} results
         * @return {Oskari.userinterface.component.GridModel}
         */
        __getGridModel: function (results) {
            var gridModel = Oskari.clazz.create(
                    'Oskari.userinterface.component.GridModel');

            gridModel.setIdField('id');

            _.each(results, function (result) {
                gridModel.addData({
                    'exonymNames': result.exonymNames,
                    'id': result.id,
                    'name': result.name,
                    'village': result.village,
                    'type': result.type,
                    'rank': result.rank,
                    'lon': result.lon,
                    'lat': result.lat,
                    'zoomScale': result.zoomScale
                });
            });

            return gridModel;
        },
        /**
         * Displays the error messages in a div
         * and adds a class to the error input fields.
         *
         * @method __addErrors
         * @private
         * @param  {Object[]} errors
         */
        __addErrors: function (errors) {
            var container = this.getContent(),
                errorContainer = container.find('div.errors');

            _.each(errors, function (error) {
                container
                    .find('input[name=' + error.field + ']')
                    .addClass('elf-error');
                errorContainer
                    .append('<p>' + error.error + '</p>');
            });
        },
        /**
         * Empties the error div and removes the error class
         * from the input fields.
         *
         * @method __removeErrors
         * @private
         * @param  {jQuery} container
         */
        __removeErrors: function (container) {
            container = container || this.getContent();
            container.find('div.errors').empty();
            container.find('input').removeClass('elf-error');
        }

    });