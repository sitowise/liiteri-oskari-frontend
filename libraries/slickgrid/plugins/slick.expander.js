(function ($) {
    // register namespace
    $.extend(true, window, {
        "Slick": {
            "Plugins": {
                "Expander": Expander
            }
        }
    });

    function Expander(options) {
        var _grid;
        var _self = this;
        var _handler = new Slick.EventHandler();
        var _defaults = {
            titleColumnId: "title",
            collapseFormatter: defaultCollapseFormatter,
            ajaxLoad: false,
            ajaxLoadDataUrl: "http://jsfiddle.net/clickthelink/Uwcuz/1/",
            ajaxLoadDataResultConverter: defaultLoadDataResultConverter,
            loadDataCallback: defaultLoadDataCallback,
            hasSubElementsCallback: function(item) { return true; },
            sorterFilter: defaultSorterFilter,
            baseCss: "slick-expander-toggle",
            expandCss: "slick-expander-expand",
            collapseCss: "slick-expander-collapse",
            loadingCss: "slick-expander-loading",
            zeroLoadedCss: "slick-expander-loaded0"
        };
        var _isExpanding = false;

        function init(grid) {
            options = $.extend(true, {}, _defaults, options);
            _grid = grid;
            _handler
              .subscribe(_grid.onClick, handleOnClick)
              .subscribe(_grid.onSort, handleOnSort);

            _grid.getData().setFilter(collapsedFilter);
            _grid.getData().setFilterArgs(_grid);

            var i = 0;
            var columns = _grid.getColumns();
            for (; i < columns.length; i++) {
                if (columns[i].id == options.titleColumnId) {
                    columns[i].formatter = options.collapseFormatter;
                }
            }

            _grid.setColumns(columns);

            // Hide the menu on outside click.
            //$(document.body).bind("mousedown", handleBodyMouseDown);
        }

        function defaultCollapseFormatter(row, cell, value, columnDef, dataContext) {
            if (value != null)
                value = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            var idx = _grid.getData().getIdxById(dataContext.id);
            var item = _grid.getData().getItemByIdx(idx);
            var nextItem = _grid.getData().getItemByIdx(idx + 1);

            var indent = dataContext["_indent"] != null ? dataContext["_indent"] : 0;

            var spacer = "<span style='display:inline-block;height:1px;width:" + (15 * indent) + "px'></span>";

            if (nextItem && nextItem["_indent"] > indent) {
                if (dataContext["_collapsed"]) {
                    return spacer + " <span class='" + options.baseCss + " " + options.expandCss + "'></span>&nbsp;" + value;
                } else {
                    return spacer + " <span class='" + options.baseCss + " " + options.collapseCss + "'></span>&nbsp;" + value;
                }
            } else {
                if (item["_status"] == "loading") {
                    return spacer + " <span class='" + options.baseCss + " " + options.loadingCss + "'></span>&nbsp;" + value;
                }
                else if (item["_status"] == "loaded0") {
                    return spacer + " <span class='" + options.baseCss + " " + options.zeroLoadedCss + "'></span>&nbsp;" + value;
                }
                else {
                    if (options.hasSubElementsCallback(item)) {
                        return spacer + " <span class='" + options.baseCss + "'></span>&nbsp;" + value;
                    } else {
                        //if doesn't have elements
                        return spacer + " <span class='" + options.baseCss + " " + options.zeroLoadedCss + "'></span>&nbsp;" + value;
                    }
                }
            }
        }

        function destroy() {
            _handler.unsubscribeAll();
            //$(document.body).unbind("mousedown", handleBodyMouseDown);
        }

        function expandAll() {
            if (_isExpanding)
                return;
            _isExpanding = true;

            _grid.getData().beginUpdate();
            var items = _.clone(_grid.getData().getItems(), true);
            _.each(items, function (item) {
                if (item["_parent"] == null && item["_collapsed"] === undefined)
                    loadItemData(item, true);
            });
            _grid.invalidate();
            _grid.render();
            _grid.getData().endUpdate();

            _isExpanding = false;
        }

        function handleOnSort(e, args) {
            if (options.sorterFilter(e))
                return false;

            var col = args.sortCol;
            var items = _.clone(_grid.getData().getItems(), true);
            var dict = [];
            _.each(items, function (i) {
                dict[i.id] = i;
            });

            _grid.getData().beginUpdate();
            _grid.getData().sort(function (dataRow1, dataRow2) {
                var field = col.field;
                var sign = args.sortAsc ? 1 : -1;
                var result = 0;
                if (dataRow1["_parent"] == dataRow2["_parent"]) {
                    //same level and parent can sort now
                    result = compareValuesOnTheSameLevelWithTheSameParent(dataRow1, dataRow2, field, sign);
                } else if (getIndent(dataRow1) == getIndent(dataRow2)) {
                    //same level but different parent
                    result = compareValuesOnTheSameLevelWithDifferentParent(dict, dataRow1, dataRow2, field, sign);
                } else {
                    //different level and different parent
                    result = compareValuesWithDifferentLevelWithDifferentParent(dict, dataRow1, dataRow2, field, sign);
                }

                return result;
            });
            _grid.getData().endUpdate();
            _grid.invalidate();
            _grid.render();
        }

        function getIndent(dataRow) {
            return dataRow["_indent"] == null ? 0 : dataRow["_indent"];
        }

        function compareValuesWithDifferentLevelWithDifferentParent(dict, dataRow1, dataRow2, field, sign) {
            var leafRow = getIndent(dataRow1) > getIndent(dataRow2) ? dataRow1 : dataRow2;
            var leveledRow = getIndent(dataRow1) > getIndent(dataRow2) ? dataRow2 : dataRow1;
            var parentId;
            var parentChildRelationshipSign = leafRow == dataRow1 ? 1 : -1;

            if (leafRow != dataRow1)
                sign = -1 * sign;

            while (getIndent(leafRow) > getIndent(leveledRow)) {
                if (leafRow["_parent"] == leveledRow.id)
                    //always show child after parent
                    return parentChildRelationshipSign;

                parentId = leafRow["_parent"];
                leafRow = dict[parentId];
            }

            if (leafRow["_parent"] == leveledRow["_parent"]) {
                //same level and same parents
                return compareValuesOnTheSameLevelWithTheSameParent(leafRow, leveledRow, field, sign);
            }
            else {
                //same level but different parents
                return compareValuesOnTheSameLevelWithDifferentParent(dict, leafRow, leveledRow, field, sign);
            }
        }

        function compareValuesOnTheSameLevelWithDifferentParent(dict, dataRow1, dataRow2, field, sign) {
            var parentDataRow1 = dict[dataRow1["_parent"]];
            var parentDataRow2 = dict[dataRow2["_parent"]];

            while (parentDataRow1["_parent"] != parentDataRow2["_parent"]) {
                parentDataRow1 = dict[parentDataRow1["_parent"]];
                parentDataRow2 = dict[parentDataRow2["_parent"]];
            }

            //same level and parent can sort now
            return compareValuesOnTheSameLevelWithTheSameParent(parentDataRow1, parentDataRow2, field, sign);
        }

        function compareValuesOnTheSameLevelWithTheSameParent(dataRow1, dataRow2, field, sign) {
            var value1 = dataRow1[field], value2 = dataRow2[field];
            var result;

            var no1 = numerizeValue(value1);
            var no2 = numerizeValue(value2);            

            if (no1 != null && no2 != null) {
                result = (no1 == no2 ? 0 : (no1 > no2 ? 1 : -1)) * sign;
            } else if (no1 == null && no2 == null) {
                result = 0;
            } else {
                result = (no1 != null ? 1 : -1) * sign;
            }            
            
            if (result != 0) {
                return result;
            } else {
                return dataRow1.id > dataRow2.id ? sign : -sign;
            }
            return 0;
        }

        function handleOnClick(e, args) {
            if ($(e.target).hasClass(options.baseCss)) {
                var item = _grid.getData().getItem(args.row);
                if (item) {
                    loadItemData(item);
                }
                e.stopImmediatePropagation();
            }
        }
        function loadItemData(item, batch) {
            if (item["_collapsed"] === undefined) {
                item["_collapsed"] = false;
                item["_status"] = "loading";
                loadData(item, batch);
            } else if (!item["_collapsed"]) {
                item["_collapsed"] = true;
            } else {
                item["_collapsed"] = false;
            }
            if (!batch)
                _grid.getData().updateItem(item.id, item);
        }

        function loadData(item, batch) {
            var items;
            if (options.ajaxLoad) {
                $.ajax({
                    url: options.ajaxLoadDataUrl,
                    success: function (result) {
                        items = options.ajaxLoadDataResultConverter(item, result);
                        processLoadedData(item, items);
                    },
                    error: function (jqXHR, textStatus) {
                        _self.onChildrenDataLoadingFailed.notify({
                            "grid": _grid,
                            "parent": item,
                            "children": items
                        }, _self);
                    }
                });
            }
            else {
                items = options.loadDataCallback(item);
                processLoadedData(item, items, batch);
            }
        }

        function processLoadedData(parentItem, items, batch) {
            var wrappedItems = wrapItems(parentItem, items);
            addLoadedData(parentItem, wrappedItems, batch);
            _self.onChildrenDataLoaded.notify({
                "grid": _grid,
                "parent": parentItem,
                "children": items
            }, _self);
        }

        function wrapItems(parent, items) {
            var i = 0;
            for (; i < items.length; i++) {
                items[i]["_status"] = "loaded";
                items[i]["_parent"] = parent.id;
                items[i]["_indent"] = (parent["_indent"] != null ? parent["_indent"] : 0) + 1;
            }
            return items;
        }

        function defaultLoadDataCallback(item) {
            var items = [];
            var idx = 0;
            while (Math.random() > 0.4) {
                var newItem = {
                    "id": "new_" + (Math.round(Math.random() * 10000)),
                    "title": "son of " + item.title,
                    "duration": "1 day",
                    "percentComplete": 0,
                    "start": "01/01/2009",
                    "finish": "01/01/2009",
                    "effortDriven": false,
                    "sel": item.sel,
                    "municipality": "subregion of " + item.municipality,
                };
                items.push(newItem);
                idx++;
            }

            return items;
        }

        function defaultLoadDataResultConverter(item, result) {
            return defaultLoadDataCallback(item);
        }

        function defaultSorterFilter(e) {
            var target = jQuery(e.target);
            if (!target.hasClass('sorter'))
                return true;

            return false;
        }

        function numerizeValue(val) {
            var ret = val;
            if (val !== null && val !== undefined) {
                if (val.replace) {
                    ret = val.replace(',', '.');
                }
                ret = Number(ret);
            }
            if (isNaN(ret)) {
                ret = null;
            }
            return ret;
        }

        function addLoadedData(parentItem, items, batch) {
            var index = _grid.getData().getIdxById(parentItem.id);

            if (!batch)
                _grid.getData().beginUpdate();  

            var i = 0;
            for (; i < items.length; i++) {
                _grid.getData().insertItem(index + 1 + i, items[i]);
            }

            parentItem["_status"] = "loaded" + items.length;
            _grid.getData().updateItem(parentItem.id, parentItem);

            if (!batch)
                _grid.getData().endUpdate();
        }

        function collapsedFilter(item, grid) {
            if (item["_parent"] != null) {
                var parentId = item["_parent"];
                var parent = grid.getData().getItemById(parentId);

                while (parent) {
                    if (parent["_collapsed"]) {
                        return false;
                    }
                    if (parent["_parent"] != null) {
                        parentId = parent["_parent"];
                        parent = grid.getData().getItemById(parentId);
                    }
                    else {
                        parent = null;
                    }
                }
            }

            return true;
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,
            "expandAll": expandAll,
            "onChildrenDataLoaded": new Slick.Event(),
            "onChildrenDataLoadingFailed": new Slick.Event()
        });
    }
})(jQuery);
