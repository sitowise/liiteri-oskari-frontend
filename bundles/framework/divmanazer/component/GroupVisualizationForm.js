/**
 * Class which creates the ui to define geometry visualizations for eg. my places.
 * By default it creates buttons for point/dot, line and area selections, but this is configurable.
 *
 * @class Oskari.userinterface.component.GroupVisualizationForm
 */
Oskari.clazz.define('Oskari.userinterface.component.GroupVisualizationForm',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} options
     */

    function (options) {
        this._clazzPrefix = 'Oskari.userinterface.component.visualization-form.';
        this._clazzSuffix = 'Form';
        this._iconClsPrefix = 'icon-';
        this._defaultLocKey = 'VisualizationForm';
        this._loc = this._getLocalization('DivManazer');
        this.lineCapMap = ["butt", "round"];
        this.lineCornerMap = ["mitre", "round", "bevel"];
        this.lineStyleMap = ["", "5 2", ""];
        this.dialog = null;
        this.DEFAULT_GROUP = '__default';
        this.styleForEachValue = true;
        this.style = null;

        var defaultOptions = {
            // include all forms by default
            forms: ['dot', 'line', 'area'],
            formValues: {
                dot: {
                    shape: 1,
                    color: "000000",
                    size: 3
                },
                line: {
                    style: 0,
                    cap: 0,
                    corner: 0,
                    width: 1,
                    color: "3233ff"
                },
                area: {
                    line: {
                        width: 1,
                        corner: 0,
                        style: 0,
                        color: "000000"
                    },
                    fill: {
                        style: -1,
                        color: "ffde00"
                    }
                }
            },
            groupMode: false,            
            groups: [{ id: this.DEFAULT_GROUP, display: '' }]
        };
        options = options || {};
        this._options = jQuery.extend({}, defaultOptions, options);

        this._groupFormClazzes = this._createGroupFormClazzes(this._options.forms, this._options.formValues, this._options.groups);

        this.template = jQuery(
            '<div id="visualization-form"></div>'
        );
        this.templateRenderButton = jQuery(
            '<div class="renderButton"></div>'
        );
        this.templateGroup = jQuery('<div class="groupVisualizationRow"></div>');
    }, {
        /**
         * Creates dom elements for each forms and binds click events to them
         * for showing the actual forms to change visualization. Returns the created form.
         *
         * @method getForm
         * @return {jQuery}
         */
        getForm: function () {
            return this.getGroupForm();

            var me = this,
                form = this.template.clone(),
                formClazzes = this._getFormClazz(),
                btnContainer,
                formName,
                formClazz;

            for (formName in formClazzes) {
                if (formClazzes.hasOwnProperty(formName)) {
                    btnContainer = this.templateRenderButton.clone();
                    btnContainer.attr('title', this._loc.tooltips[formName]);
                    btnContainer.addClass(this._iconClsPrefix + (formName === 'dot' ? 'point' : formName));
                    btnContainer.click(me._bindRenderButton(formClazzes[formName]));
                    form.append(btnContainer);
                }
            }

            return form;
        },
        getGroupForm: function () {
            var me = this,
                form = this.template.clone(),
                groupFormClazzes = this._getGroupFormClazzes(),
                btnContainer,
                grpContainer,
                formName,
                groupId,
                formClazz;

            form.append('<div class="info">' + me._loc.defaultGroupName + '</div>');

            var styleForEachValue = this.styleForEachValue;

            var selectorContainer = jQuery('<div></div>');
            var changeCheckbox = jQuery('<input type="checkbox"></input>');
            if (!this.styleForEachValue)
                changeCheckbox.attr('checked', true);

            changeCheckbox.change(function() {
                var changeToStyleForEachValue = !this.checked;                
                var rows = form.find(".groupVisualizationRow");
                for (var i = 0; i < rows.length; i++) {
                    var cont = $(rows[i]);
                    var id = cont.attr('id');
                    if (id == me.DEFAULT_GROUP) {
                        if (changeToStyleForEachValue) {
                            cont.hide();                                                        
                        } else {
                            cont.show();
                        }
                    } else {
                        if (changeToStyleForEachValue) {
                            cont.show();
                        } else {
                            cont.hide();                                                                                    
                        }
                    }
                }
                me.styleForEachValue = changeToStyleForEachValue;
            });
            selectorContainer.append(changeCheckbox);
            selectorContainer.append(this._loc.setStyleForAllValues);
            form.append(selectorContainer);

            for (groupId in groupFormClazzes) {
                
                if (groupFormClazzes.hasOwnProperty(groupId)) {
                    grpContainer = this.templateGroup.clone();
                    grpContainer.attr('id', groupId);
                    var titleElement = jQuery('<div>' + groupFormClazzes[groupId]['group']['display'] + '</div>');
                    grpContainer.append(titleElement);
                    
                    var formClazzes = groupFormClazzes[groupId]['forms'];
                    for (formName in formClazzes) {
                        btnContainer = this.templateRenderButton.clone();
                        btnContainer.attr('title', this._loc.tooltips[formName]);
                        btnContainer.addClass(this._iconClsPrefix + (formName === 'dot' ? 'point' : formName));
                        btnContainer.click(me._bindRenderButton(formClazzes[formName]));
                        grpContainer.append(btnContainer);
                    }

                    if (styleForEachValue && groupId == this.DEFAULT_GROUP) {
                        grpContainer.hide();
                    }
                    else if (!styleForEachValue && groupId != this.DEFAULT_GROUP) {
                        grpContainer.hide();
                    }

                    form.append(grpContainer);
                }                
            }

            return form;
        },
        /**
         * Returns the values of each form clazz.
         *
         * @method getValues
         * @return {Object}
         */
        getValues: function () {
            if (this._options.groupMode) {
                return this.getGroupValues();
            } else {
                return this.getGroupValues(this.DEFAULT_GROUP);
            }            

            var values = {},
                formClazzes = this._getFormClazz(),
                fClazzName,
                fClazz;
            for (fClazzName in formClazzes) {
                if (formClazzes.hasOwnProperty(fClazzName)) {
                    fClazz = formClazzes[fClazzName];
                    values[fClazzName] = fClazz.getValues();
                }
            }

            return values;
        },
        getGroupValues: function (groupId) {
            var values = [],
                groupFormClazzes = this._getGroupFormClazzes(groupId),
                fClazzName,
                fClazz;

            for (groupId in groupFormClazzes) {
                if (!groupFormClazzes.hasOwnProperty(groupId))
                    continue;

                var item = {
                    'group': groupId,
                    'symbol' : {}
                };
                var formClazzes = groupFormClazzes[groupId]['forms'];
                for (fClazzName in formClazzes) {
                    fClazz = formClazzes[fClazzName];
                    item.symbol[fClazzName] = fClazz.getValues();
                }
                values.push(item);
            }

            return values;
        },       
        /**
         * Sets the values of the form clazzes.
         *
         * @method setValues
         * @param {Object} values
         */
        setValues: function (values) {
            this.setGroupValues(values);

            return;

            if (values === null || values === undefined || typeof values !== 'object') {
                return;
            }

            var formClazzes = this._getFormClazz(),
                fClazzName,
                fClazz;

            for (fClazzName in formClazzes) {
                if (formClazzes.hasOwnProperty(fClazzName)) {
                    fClazz = formClazzes[fClazzName];
                    fClazz.setValues(values[fClazzName]);
                }
            }
        },
        setGroupValues: function (values) {
            if (values === null || values === undefined || typeof values !== 'object') {
                return;
            }

            var groupFormClazzes = this._getGroupFormClazzes(),
                fClazzName,
                fClazz;

            for (groupId in groupFormClazzes) {                
                if (!groupFormClazzes.hasOwnProperty(groupId))
                    continue;

                    var value = null;
                    for (var idx in values) {
                        if (values[idx].group === groupId) {
                            value = values[idx].symbol;
                            break;
                        }
                    }

                    if (value == null)
                        continue;

                    var formClazzes = groupFormClazzes[groupId]['forms'];
                    for (fClazzName in formClazzes) {
                        fClazz = formClazzes[fClazzName];
                        fClazz.setValues(value[fClazzName]);
                    }
            }
        },
        setStyleGroups: function (groups) {
            if (groups == null || groups.length == 0) {
                this._options.groups = [{ id: this.DEFAULT_GROUP, display: '' }];
                this._groupFormClazzes = this._createGroupFormClazzes(this._options.forms, this._options.formValues, this._options.groups);
            }
            else {
                var newGroups = [{ id: this.DEFAULT_GROUP, display: '' }];
                $.merge(newGroups, groups);

                var differentValues = this._options.groups.length != newGroups.length &&
                    !($(this._options.groups).not(newGroups).length == 0 && $(newGroups).not(this._options.groups).length == 0);
                if (differentValues) {
                    this._options.groups = newGroups;
                    this._groupFormClazzes = this._createGroupFormClazzes(this._options.forms, this._options.formValues, this._options.groups);
                }
            }
        },
        setFromStyle: function (style) {
            var i, groups;

            if (style == null || style.type == null) {
                this._options.groupMode = false;
                this.styleForEachValue = false;
                this.setStyleGroups([]);
            } else if (style.type == 'simple') {
                this._options.groupMode = false;
                this.styleForEachValue = false;
                this.setStyleGroups([]);
                this.setValues(style.values);
            } else if (style.type == 'uniqueValue') {
                this._options.groupMode = true;
                this.styleForEachValue = !style.isDefaultValue;
                groups = [];
                for (i = 0; i < style.values.length; i++) {
                    groups.push({
                        id: style.values[i].group,
                        display: typeof style.values[i].label === 'undefined' ? style.values[i].group : style.values[i].label
                    });
                }
                this.setStyleGroups(groups);
                var newValues = style.defaultValue || [];
                $.merge(newValues, style.values);
                this.setValues(newValues);
            } else if (style.type == 'group') {
                this._options.groupMode = true;
                this.styleForEachValue = !style.isDefaultValue;
                groups = [];
                for (i = 0; i < style.values.length; i++) {
                    groups.push({
                        id: style.values[i].group,
                        display: typeof style.values[i].label === 'undefined' ? style.values[i].group : style.values[i].label
                    });
                }
                this.setStyleGroups(groups);
                var newValues = style.defaultValue || [];
                $.merge(newValues, style.values);
                this.setValues(newValues);
            }

            this.style = style;
        },
        getStyle: function () {
            var style = {};
            var values = this.getValues();
            if (this._options.groupMode) {
                style.type = this.style.type;
                style.field = this.style.field;
                style.values = [];
                for (var i = 0; i < values.length; i++) {
                    if (values[i].group == this.DEFAULT_GROUP)
                        style.defaultValue = values[i];
                    else
                        style.values.push(values[i]);
                }
                style.isDefaultValue = !this.styleForEachValue;
            } else {
                style.type = 'simple';
                style.values = values;
            }

            return style;
        },
        /**
         * Convert hexadecimal color values to decimal values (255,255,255)
         * Green: hexToRgb("#0033ff").g
         * http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
         *
         * @method hexToRgb
         * @param {String} hex hexadecimal color value e.g. '#00ff99'
         */
        hexToRgb: function (hex) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        /**
         * Convert rgb values to hexadecimal color values
         *
         * @method rgbToHex
         * @param {String} rgb decimal color values e.g. 'rgb(255,0,0)'
         */
        rgbToHex: function (rgb) {
            if (rgb.charAt(0) === '#') {
                return rgb.substring(1);
            }
            var parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/),
                j;
            delete (parts[0]);
            for (j = 1; j <= 3; ++j) {
                parts[j] = parseInt(parts[j], 10).toString(16);
                if (parts[j].length === 1) {
                    parts[j] = '0' + parts[j];
                }
            }
            return parts.join('');
        },

        /**
         * Binds a function to show the form of a given form clazz.
         *
         * @method _bindRenderButton
         * @param  {Oskari.clazz} formClazz
         * @return {Function}
         */
        _bindRenderButton: function (formClazz) {
            var me = this;

            return function (e) {
                if (formClazz && formClazz.showForm && typeof formClazz.showForm === 'function') {
                    if (me.dialog) {
                        me.dialog.close(true);
                    }
                    me.dialog = formClazz.showForm(e.target);
                }
            };
        },

        /**
         * Returns the form clazz for given parameter name
         * or an object of form clazzes given in the options
         * (defaults to all, that is, 'dot', 'line' and 'area')
         * or undefined if given a key which is not found.
         *
         * @method _getFormClazz
         * @param  {String} formName 'dot', 'line' or 'area'
         * @return {Oskari.clazz/Object[Oskari.clazz]/undefined}
         */
        _getFormClazz: function (formName) {
            var ret;
            if (formName !== null && formName !== undefined) {
                ret = this._formClazzes[formName];
            } else {
                ret = this._formClazzes;
            }
            return ret;
        },

        _getGroupFormClazzes: function(groupId) {
            var ret;
            if (groupId !== null && groupId !== undefined) {
                ret = {};
                ret[groupId] = this._groupFormClazzes[groupId];
            } else {
                ret = this._groupFormClazzes;
            }
            return ret;
        },

        /**
         * Returns the localization object for the given key.
         *
         * @method _getLocalization
         * @param  {String} locKey
         * @return {Object/null}
         */
        _getLocalization: function (locKey) {
            var locale = Oskari.getLocalization(locKey),
                ret = null;
            if (locale) {
                ret = locale[this._defaultLocKey];
            }
            return ret;
        },
        _createGroupFormClazzes: function (formNames, formValues, groups) {
            var i,
                fLen = (groups ? groups.length : 0),
                fClazzes,
                group,
                result = {};

            for (i = 0; i < fLen; ++i) {
                group = groups[i];
                fClazzes = this._createFormClazzes(formNames, formValues);
                result[group.id] = {
                    'group': group,
                    'forms' : fClazzes,
                }
            }

            return result;
        },
        /**
         * Creates form clazzes for given form names and values.
         *
         * @method _createFormClazzes
         * @param  {Array[String]} formNames
         * @param  {Object} formValues
         * @return {Object}
         */
        _createFormClazzes: function (formNames, formValues) {
            var i,
                fLen = (formNames ? formNames.length : 0),
                fClazzes = {},
                fName,
                fValues,
                fClazz;

            for (i = 0; i < fLen; ++i) {
                fName = formNames[i];
                fValues = formValues[fName];
                fClazz = this._createFormClazz(fName, fValues);
                fClazzes[fName] = fClazz;
            }

            return fClazzes;
        },

        /**
         * Creates a form clazz for a given form name and values.
         * Uses this clazz as the 'creator' and localization for
         * key like 'dot' which should be present in the loc object.
         *
         * @method _createFormClazz
         * @param  {String} formName 'dot', 'line' or 'area'
         * @return {Oskari.clazz/undefined}
         */
        _createFormClazz: function (formName, formValues) {
            var clazz = this._capitalize(formName),
                clazzName = this._clazzPrefix + clazz + this._clazzSuffix,
                loc = this._loc[formName];

            return Oskari.clazz.create(clazzName, this, loc, formValues);
        },

        /**
         * Returns capitalized string.
         *
         * @method _capitalize
         * @param  {String} str
         * @return {String}
         */
        _capitalize: function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    });