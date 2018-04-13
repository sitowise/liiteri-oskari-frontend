Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-ui.component.FilterCloud',

    function (loc, options) {
        this.defaultLoc = {
            "selectValue": "Select value",
            "selectSomeOptions": "Select some options",
            "close": "Close",
            "clear": "Clear",
            "and": "and",
            "or" : "or"
        },
        this.loc = $.extend(this.defaultLoc, loc);
        this.templates = { 'main' : jQuery('<div class="filter-cloud-container">' +
            '<div class="filter-header">' +
            '<div class="filter-headerText">' +
            '</div>' +
            '<div class="filterText">' +
            '</div>' +
            '</div>' +
            '<div class="filter-cloud-content chosen-container chosen-container-multi">' +
            '<ul class="chosen-choices"></ul>' +
            '</div>' +
            '</div>'),
            'filterItem': jQuery('<li class="search-choice"><span></span><a href="javascript:void(0)" class="search-choice-close"></a></li>'),
            'filterContentOption': jQuery('<div class="filter-option">' + '<div class="selectWrapper"><select data-placeholder="' + this.loc.selectValue + '" class="category-select"></select></div>' + '<div class="selectWrapper"><select data-placeholder="' + this.loc.selectSomeOptions + '" class="value-select" multiple ></select></div>' + '</div>'),
            'manageFilterOption': jQuery('<div class="manage-filter-option">' + '<div class="add-filter-option">+</div>' + '<div class="remove-filter-option">-</div>' + '</div>'),
            'filterBooleanOption': jQuery('<div class="boolean-filter-option"><select class="boolean"></select></div>'),
            'option': jQuery('<option></option>'),
        }
        this.defaultOptions = {
            'showBooleanOperators': true,
            'isFilterEditable': true,
            'showClearButton': true,
            'boolOptions' : [
                {
                    'id': 'AND',
                    'name': this.loc.and
                }               
             ]
        };
        
        this.title = null;
        this.content = null;
        this.html = this.templates.main.clone();
        this.categoriesDict = {};
        this.categories = [];
        this.dialogMode = false;
        this.dialog = null;
        this.options = $.extend(this.defaultOptions, options);
        this.itemsById = {};
        this.uiById = {};
        this.onRemoveItemCallback = null;

        var me = this;
        var header = me.html.find('div.header');
    }, {
        /**
         * @method setVisible
         * Shows/hides the panel
         * @param {Boolean} bln - true to show, false to hide
         */
        setVisible: function (bln) {
            // checking since we dont assume param is boolean
            if (bln === true) {
                this.html.show();
            } else {
                this.html.hide();
            }
        },
        /**
         * @method isVisible
         * Returns true if panel is currently visible
         * @return {Boolean}
         */
        isVisible: function () {
            // checking since we dont assume param is boolean
            return this.html.is(":visible");
        },
        /**
         * @method setTitle
         * Sets the panel title
         * @param {String} pTitle title for the panel
         */
        setTitle: function (pTitle) {
            this.title = pTitle;
            var header = this.html.find('div.filter-header div.filter-headerText');
            header.html(this.title);
        },
        /**
         * @method getTitle
         * Gets the panel title
         * @return {String}
         */
        getTitle: function () {
            return this.title;
        },

        setOnRemoveItemCallback: function(callback) {
            this.onRemoveItemCallback = callback;
        },

        addItem: function (item, options) {
            var me = this;
            if (!this._validateItem(item))
                throw "Invalid item. It should have {id, text, data} properties";
            if (this.itemsById.hasOwnProperty(item.id)) {
                if ($.isPlainObject(options)) {
                    if (options.duplicateAction == 'ignore') {
                        return false;
                    } else if (options.duplicateAction == 'callback') {
                        options.duplicateCallback(item);
                        return false;
                    } else if (options.duplicateAction == 'replace') {
                        this._updateItem(item);
                        return true;
                    } else {
                        //DEFAULT_ACTION: throw error
                        throw "Element with id [" + item.id + "] already exists";
                    }
                } else {
                    //Backward compability - expected boolean in old version
                    console.log("DEPRECATED WARNING FilterCloud: Use options.duplicateAction == 'ignore'|'replace'|'callback'");
                    if (options == true) {                    
                        return false;
                    } else {
                        //DEFAULT_ACTION: throw error
                        throw "Element with id [" + item.id + "] already exists";
                    }
                }
            }                

            this.itemsById[item.id] = item;
            var container = this.getContainer();
            var itemui = this.templates.filterItem.clone();
            itemui.find('span').text(item.text);
            itemui.find('a').click(function(e) {
                delete me.itemsById[item.id];
                itemui.remove();
                delete me.uiById[item.id];
                if (me.onRemoveItemCallback != null) {
                    me.onRemoveItemCallback(item);
                }
            });

            this.uiById[item.id] = itemui;
            container.find("ul").append(itemui);
            return true;
        },
        getItems: function() {
            return this.itemsById;
        },
        removeItem: function (item) {
            if (this.itemsById[item.id] == null || this.uiById[item.id] == null)
                throw "Element is not present [" + item.id + "]";
            this.uiById[item.id].find('a').click();
        },
        _updateItem: function(item) {
            if (this.itemsById[item.id] == null || this.uiById[item.id] == null)
                throw "Element is not present [" + item.id + "]";

            var itemui = this.uiById[item.id];
            itemui.find('span').text(item.text);

            this.itemsById[item.id] = item;
        },
        _validateItem : function(item) {
            return item.hasOwnProperty('id') && item.hasOwnProperty('text') && item.hasOwnProperty('data');
        },
        clear : function() {
            var container = this.getContainer();
            for (var id in this.itemsById) {
                delete this.itemsById[id];
            }            
            container.find("ul.chosen-choices").empty();
            for (var id in this.uiById) {
                delete this.uiById[id];
            }
        },
        setFilterParams: function(params) {
            var me = this;
            var container = me.getContainer();
            _.each(params, function (param) {
                me.categories.push(param.name);
                if (typeof param.name === 'string') {
                    me.categoriesDict[param.name] = param.values;
                } else {                    
                    me.categoriesDict[param.name.id] = param.values;
                }                                
            });

            var filter = me._addCategoriesFilter();
            container.append(filter);
        },
        _addCategoriesFilter: function () {
            var me = this;
            var option = me.templates.filterContentOption.clone();
            
            var categorySelect = option.find('select.category-select');
            var placeHolderText = me.loc.selectValue;
            me._appendOptionValues(categorySelect, placeHolderText, me.categories);
            var valueSelect = option.find('select.value-select');
//            var emptyPlaceHolderText = 'Empty';
//            me._appendOptionValues(valueSelect, emptyPlaceHolderText, []);
            categorySelect.change(function (e) {
                me._fillValuesSelect(valueSelect, e.target.value);
            });

            if (this.options.isFilterEditable) {
                var manageFilterOption = this._addManageFilterOption();
                option.append(manageFilterOption);
            }
            

            option.append('<div style="clear: both"></div>');
            
            return option;
        },
        _appendOptionValues: function (select, placeHolder, values) {
            var i, option;

            if (placeHolder) {
                option = this.templates.option.clone();
                option.attr('value', '');
                option.html(placeHolder);
                select.append(option);
                select.attr("data-placeholder", placeHolder);
            } else {
                if (values == null || values.length <= 1) {
                    select.attr('disabled', 'disabled');
                }
            }      

            for (i = 0; values && i < values.length; ++i) {
                option = this.templates.option.clone();               
                if (typeof values[i] === 'string') {
                    option.attr('value', values[i]);
                    option.html(values[i]);
                } else {
                    option.attr('value', values[i].id);
                    option.html(values[i].name);
                }
                select.append(option);
            }
        },
        _fillValuesSelect: function (select, value) {
            var me = this;
            var values = me.categoriesDict[value];
            select.empty();
            me._appendOptionValues(select, null, values);

            /* send event */
            select.trigger('chosen:updated');
        },
        _handleAddNewCategoriesFilter: function (element) {
            var me = this;
            var filter = me._addCategoriesFilter();
            var container = element.parents('div.filter-panel-content');
            container.append(filter);
            filter.find('select.value-select').chosen();

            var parent = element.parents('div.filter-option');
            var boolSelect = me._createBooleanSelect();
            parent.find('div.manage-filter-option').replaceWith(boolSelect);            
        },
        _handleRemoveCategoriesFilter: function (element) {
            var me = this;
            var parent = element.parents('div.filter-option');
            var prevSibling = parent.prev('div.filter-option');
            var manageFilterOption = me._addManageFilterOption();
            prevSibling.find('div.boolean-filter-option').replaceWith(manageFilterOption);
            if (prevSibling && prevSibling.length) {
                parent.remove();
            }
        },
        _createBooleanSelect: function () {
            var boolOption = this.templates.filterBooleanOption.clone();
            this._appendOptionValues(boolOption.find('select'), null, this.options.boolOptions);
            if (!this.options.showBooleanOperators) {
                boolOption.hide();
            }
            return boolOption;
        },
        _addManageFilterOption: function () {
            var me = this;
            var manageOption = me.templates.manageFilterOption.clone();
            var addFilter = manageOption.find('div.add-filter-option');
            addFilter.click(function (e) {
                me._handleAddNewCategoriesFilter(jQuery(e.target));
            });
            var removeFilter = manageOption.find('div.remove-filter-option');
            removeFilter.click(function (e) {
                me._handleRemoveCategoriesFilter(jQuery(e.target));
            });
            return manageOption;
        },
        _onVisible: function (container) {
            container.find('select.value-select').chosen();
        },
        getFilterValues: function () {
            var result = {
                'data': [],
                'text' : [],
            }

            var filters = this.getContainer().find('div.filter-option');
            if (filters && filters.length) {
                for (var i = 0; i < filters.length; ++i) {
                    var filter = jQuery(filters[i]);
                    var item = {};
                    item.key = filter.find('select.category-select').val();
                    item.values = filter.find('select.value-select').val();

                    if (item.key == null || item.values == null) {
                        if (i == filters.length - 1) {
                            result.data.pop();
                            result.text.pop();
                        }                           
                        continue;
                    }

                    var textItem = {};
                    textItem.key = filter.find('select.category-select option:selected').text();
                    textItem.values = [];
                    _.each(filter.find('select.value-select option:selected'), function (e) {
                        textItem.values.push(e.text);
                    });
                    
                    result.data.push(item);
                    result.text.push(textItem);

                    var boolOperator = filter.find('select.boolean').val();
                    var boolOperatorText = filter.find('select.boolean option:selected').text();
                    if (boolOperator) {
                        result.data.push({ 'boolean': boolOperator });
                        result.text.push({ 'boolean': boolOperatorText });
                    }
                }
            }            
            return result;
        },
        setFilterValues: function (data) {
            var container = this.getContainer();
            var isEmpty = true;
            var filter = null;
            container.find('div.filter-option').remove();
            for (var i = 0; i < data.length; ++i) {
                var item = data[i];

                if (item.boolean) {
                    var boolSelect = this._createBooleanSelect();
                    filter.find('div.manage-filter-option').replaceWith(boolSelect);
                    filter.find('select.boolean').val(item.boolean);
                } else {
                    filter = this._addCategoriesFilter();
                    container.append(filter);

                    filter.find('select.category-select').val(item.key);
                    filter.find('select.category-select').change();
                    filter.find('select.value-select').val(item.values);
                    isEmpty = false;
                }
            }

            /* If filter is empty add empty row */
            if (isEmpty) {
                filter = this._addCategoriesFilter();
                container.append(filter);
            }

            this._onVisible(container);
        },
        clearFilter : function() {
            var container = this.getContainer();
            container.find('div.filter-option').remove();
            var filter = this._addCategoriesFilter();
            container.append(filter);

            this._onVisible(container);
        },
        destroy: function () {
            this.html.remove();
        },
        getContainer: function () {
            return this.html.find('div.filter-cloud-content');
        },
        insertTo: function (container) {
            container.append(this.html);
        }
    });