Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-ui.component.FilterForm',

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
        this.templates = { 'main' : jQuery('<div class="filter-panel-container">' +
            '<div class="header">' +
            '<div class="headerText">' +
            '</div>' +
            '<div class="filterText">' +
            '</div>' +
            '</div>' +
            '<div class="filter-panel-content">' +
            '</div>' +
            '</div>'),
            'filterContentOption': jQuery('<div class="filter-option">' + '<div class="selectWrapper"><select data-placeholder="' + this.loc.selectValue + '" class="category-select"></select></div>' + '<div class="selectWrapper"><select data-placeholder="' + this.loc.selectSomeOptions + '" class="value-select" multiple ></select></div>' + '</div>'),
            'manageFilterOption': jQuery('<div class="manage-filter-option">' + '<div class="add-filter-option">+</div>' + '<div class="remove-filter-option">-</div>' + '</div>'),
            'filterBooleanOption': jQuery('<div class="boolean-filter-option"><select class="boolean"></select></div>'),
            'option': jQuery('<option></option>'),
            'filterTypeOption': jQuery('<div class="selectWrapper"><select data-placeholder="' + this.loc.selectValue + '" class="type-select"></select></div>')
        }
        this.defaultOptions = {
            'showBooleanOperators': true,
            'isFilterEditable': true,
            'isOneRowFilter' : false,
            'showClearButton': true,
            'boolOptions' : [
                {
                    'id': 'AND',
                    'name': this.loc.and
                }               
             ],
             'twoway': false,
             'maxFilterRows': 10
        };
        
        this.title = null;
        this.content = null;
        this.html = this.templates.main.clone();
        this.categoriesDict = {};
        this.categories = [];
        this.dialogMode = false;
        this.dialog = null;
        this.options = $.extend(this.defaultOptions, options);

        this.filterRows = 1;
        
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
            var header = this.html.find('div.header div.headerText');
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
        _addTwowayExtras: function(filter) {
            var me = this;
            filter.prepend(me.templates.filterTypeOption.clone());
            var typeSelect = filter.find('select.type-select');
            me._appendOptionValues(typeSelect, me.loc.selectType, [{id:'home', name: me.loc.typeHome}, {id:'work', name: me.loc.typeWork}])
            return filter;
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
                me._fillValuesSelect(valueSelect, e.target.value, true);
            });

            if (this.options.isFilterEditable && !this.options.isOneRowFilter) {
                var manageFilterOption = this._addManageFilterOption();
                option.append(manageFilterOption);
            }
            
            
            if(me.options.twoway) {
                option = me._addTwowayExtras(option);
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
        _fillValuesSelect: function (select, value, sort) {
            var me = this;
            var values = me.categoriesDict[value];
            select.empty();  

            if(sort) {
                values.sort(function(a,b) {
                    var aa,bb;
                    if (typeof a === 'string') {
                        aa = a;
                    } else {
                        aa = a.name;
                    }
                    
                    if (typeof b === 'string') {
                        bb = b;
                    } else {
                        bb = b.name;
                    }
                    
                    if (aa > bb) return 1;
                    else if (aa < bb) return -1;
                    else return 0
                });
            }
            
            me._appendOptionValues(select, null, values);

            /* send event */
            select.trigger('chosen:updated');
        },
        _handleAddNewCategoriesFilter: function (element) {
            this.filterRows++;
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
            this.filterRows--;
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
            if(this.options.maxFilterRows > this.filterRows) {
                addFilter.click(function (e) {
                    me._handleAddNewCategoriesFilter(jQuery(e.target));
                });
            } else {
                addFilter.hide();
            }
            var removeFilter = manageOption.find('div.remove-filter-option');
            removeFilter.click(function (e) {
                me._handleRemoveCategoriesFilter(jQuery(e.target));
            });
            return manageOption;
        },
        _onVisible: function (container) {
            container.find('select.value-select').chosen();
        },
        validateSelections: function() {
            var filters = this.getContainer().find('div.filter-option');
            var usedTypes = [];
            if (filters && filters.length) {
                for (var i = 0; i < filters.length; ++i) {
                    var filter = jQuery(filters[i]);
                    var item = {};
                    item.key = filter.find('select.category-select').val();

                    if(item.key == null || item.key === "") {
                        return {"validated": false, "message": this.loc.validateKeyMissing}
                    }
                    item.values = filter.find('select.value-select').val();
                    if(item.values == null) {
                        return {"validated": false, "message": this.loc.validateValuesMissing}
                    }
                    if(this.options.twoway) {
                        item.type = filter.find('select.type-select').val();
                        if(item.type == null || item.type === "") {
                            return {"validated": false, "message": this.loc.validateTypeMissing}
                        }

                        if($.inArray(item.type, usedTypes) > -1) {
                            return {"validated": false, "message": this.loc.validateTypeUsed}
                        }
                        usedTypes.push(item.type);
                    }
                }
            }
            return {"validated": true, "message": this.loc.validateOk};
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
                    
                    if(this.options.twoway) {
                        item.type = filter.find('select.type-select').val();
                    }

                    if (item.key == null || item.values == null || (this.options.twoway && item.type == null)) {
                        if (i == filters.length - 1) {
                            result.data.pop();
                            result.text.pop();
                        }                           
                        continue;
                    }

                    var textItem = {};
                    textItem.key = filter.find('select.category-select option:selected').text();
                    
                    if(this.options.twoway) {
                        textItem.key = filter.find('select.type-select option:selected').text() + ":" + textItem.key;
                    }
                    
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
                    
                    if(this.options.twoway) {
                        filter.find('select.type-select').val(item.type);
                    }
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
            if (this.dialogMode) {
                return this.dialog.getJqueryContent().find('div.filter-panel-content');
            }
            return this.html.find('div.filter-panel-content');
        },
        insertTo: function (container) {
            container.append(this.html);
            this._onVisible(this.html);
        },
        displayAsPopup: function (title, additionalButtons) {
            var me = this;
            this.dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var buttons = [];
            
            if (additionalButtons != null) {
                _.each(additionalButtons, function(b) {
                    buttons.push(b);
                });
            }

            if (this.options.showClearButton) {
                var clearButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                clearButton.setHandler(function (e) {
                    me.clearFilter();
                });
                clearButton.setTitle(me.loc.clear);
                buttons.push(clearButton);
            }
            
            var closeButton = this.dialog.createCloseButton(me.loc.close);
            buttons.push(closeButton);

            this.dialog.show(title, "", buttons);
            var content = this.getContainer();

            if(this.options.twoway) {
                content.append($('<div class="info">' + this.loc.infoText + '</div>'));
            }

            this.dialog.setContent(content);
            this._onVisible(this.dialog.getJqueryContent());

            this.dialog.makeDraggable();
            this.dialogMode = true;
            return this.dialog;
        }
    });