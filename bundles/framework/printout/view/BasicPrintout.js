/**
 * @class Oskari.mapframework.bundle.printout.view.BasicPrintout
 * Renders the printouts "publish mode" sidebar view where the user can make
 * selections regarading the map to publish.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.printout.view.BasicPrintout',

    /**
     * @static @method create called automatically on construction
     *
     * @param {Oskari.mapframework.bundle.printout.PrintoutBundleInstance} instance
     * Reference to component that created this view
     * @param {Object} localization
     * Localization data in JSON format
     * @param {Object} backendConfiguration
     * Backend URL configuration for ajax and image requests
     * @param {Object} formState
     * FormState for ui state reload
     *
     */
    function (instance, localization, backendConfiguration) {
        var me = this,
            p,
            s,
            f;

        me.isEnabled = false;
        me.instance = instance;
        me.loc = localization;
        me.backendConfiguration = backendConfiguration;
        me.legendInProcess = false;
        me.isParcelMode = false;

        /* templates */
        me.template = {};

        for (p in me.__templates) {
            if (me.__templates.hasOwnProperty(p)) {
                me.template[p] = jQuery(me.__templates[p]);
            }
        }

        // Layout params, pdf template
        me.layoutParams = {};

        /* page sizes listed in localisations */
        me.sizeOptions = me.loc.size.options;

        me.sizeOptionsMap = {};
        for (s = 0; s < me.sizeOptions.length; s += 1) {
            me.sizeOptionsMap[me.sizeOptions[s].id] = me.sizeOptions[s];
        }

        /* format options listed in localisations */
        me.formatOptions = me.loc.format.options;
        me.formatOptionsMap = {};
        for (f = 0; f < me.formatOptions.length; f += 1) {
            me.formatOptionsMap[me.formatOptions[f].id] = me.formatOptions[f];
        }

        /* content options listed in localisations */
        me.contentOptions = me.loc.content.options;
        me.contentOptionsMap = {};
        for (f = 0; f < me.contentOptions.length; f += 1) {
            me.contentOptionsMap[me.contentOptions[f].id] = me.contentOptions[f];
        }

        /* legend options listed in localisations */
        me.legendOptions = me.loc.legend.options;
        me.legendOptionsMap = {};
        for (f = 0; f < me.legendOptions.length; f += 1) {
            me.legendOptionsMap[me.legendOptions[f].id] = me.legendOptions[f];
        }

        me.accordion = null;
        me.mainPanel = null;
        me.sizePanel = null;
        me.backBtn = null;

        me.progressSpinner = Oskari.clazz.create(
            'Oskari.userinterface.component.ProgressSpinner'
        );
        me.alert = Oskari.clazz.create(
            'Oskari.userinterface.component.Alert'
        );

        me.previewContent = null;
        me.previewImgDiv = null;

        me.contentOptionDivs = {};

    }, {
        __templates: {
            preview: '<div class="preview"><img /><span></span></div>',
            previewNotes: '<div class="previewNotes"><span></span></div>',
            location: '<div class="location"></div>',
            tool: '<div class="tool ">' + '<input type="checkbox"/>' + '<label></label></div>',
            buttons: '<div class="buttons"></div>',
            help: '<div class="help icon-info"></div>',
            main: '<div class="basic_printout">' + '<div class="header">' + '<div class="icon-close">' + '</div>' + '<div class="header_title"><p></p></div>' + '</div>' + '<div class="content">' + '</div>' + '<form method="post" target="map_popup_111" id="oskari_print_formID" style="display:none" action="" ><input name="geojson" type="hidden" value="" id="oskari_geojson"/><input name="tiles" type="hidden" value="" id="oskari_tiles"/><input name="tabledata" type="hidden" value="" id="oskari_print_tabledata"/></form>' + '</div>',
            format: '<div class="printout_format_cont printout_settings_cont"><div class="printout_format_label"></div></div>',
            formatOptionTool: '<div class="tool ">' + '<input type="radio" name="format" />' + '<label></label></div>',
            legend: '<div class="printout_legend_cont printout_settings_cont"><div class="printout_legend_label"></div></div>',
            legendOptionTool: '<div class="tool ">' + '<input type="radio" name="legend" />' + '<label></label></div>',
            title: '<div class="printout_title_cont printout_settings_cont"><div class="printout_title_label"></div><input class="printout_title_field" type="text"></div>',
            option: '<div class="printout_option_cont printout_settings_cont">' + '<input type="checkbox" />' + '<label></label></div>',
            sizeOptionTool: '<div class="tool ">' + '<input type="radio" name="size" />' + '<label></label></div>'
        },
        /**
         * @public @method render
         * Renders view to given DOM element
         *
         * @param {jQuery} container reference to DOM element this component will be
         * rendered to
         *
         */
        render: function (container) {
            var me = this,
                content = me.template.main.clone();

            me.mainPanel = content;
            content.find('div.header > div.header_title > p').append(me.loc.title);

            container.append(content);
            var contentDiv = content.find('div.content');

            me.alert.insertTo(contentDiv);

            var accordion = Oskari.clazz.create(
                'Oskari.userinterface.component.Accordion'
            );
            me.accordion = accordion;

            me.sizePanel = me._createSizePanel();
            me.sizePanel.open();

            accordion.addPanel(me.sizePanel);

            var settingsPanel = me._createSettingsPanel();
            accordion.addPanel(settingsPanel);

            var previewPanel = me._createPreviewPanel();
            previewPanel.open();

            accordion.addPanel(previewPanel);

            /*var scalePanel = me._createLocationAndScalePanel();
         scalePanel.open();
         accordion.addPanel(scalePanel);*/

            accordion.insertTo(contentDiv);

            // Legend setup visible only if statslayer is visible
            me._setLegendVisibility();

            this._setAdditionalOptionsVisibility();

            // buttons
            // close
            container.find('div.header div.icon-close').bind(
                'click',
                function () {
                me.instance.setPublishMode(false);
                }
            );
            contentDiv.append(me._getButtons());

            var inputs = me.mainPanel.find('input[type=text]');
            inputs.focus(function () {
                me.instance.sandbox.postRequestByName(
                    'DisableMapKeyboardMovementRequest'
                );
            });
            inputs.blur(function () {
                me.instance.sandbox.postRequestByName(
                    'EnableMapKeyboardMovementRequest'
                );
            });
            // bind help tags
            var helper = Oskari.clazz.create(
                'Oskari.userinterface.component.UIHelper',
                me.instance.sandbox
            );
            helper.processHelpLinks(
                me.loc.help,
                content,
                me.loc.error.title,
                me.loc.error.nohelp
            );
        },

        /**
         * @private @method _createSizePanel
         * Creates the size selection panel for printout
         *
         *
         * @return {jQuery} Returns the created panel
         */
        _createSizePanel: function () {
            var me = this,
                panel = Oskari.clazz.create(
                    'Oskari.userinterface.component.AccordionPanel'
                ),
                contentPanel = panel.getContainer(),
                tooltipCont = me.template.help.clone(),
                i;

            panel.setTitle(me.loc.size.label);
            tooltipCont.attr('title', me.loc.size.tooltip);
            contentPanel.append(tooltipCont);
            // content
            var closureMagic = function (tool) {
                return function () {
                    var size = contentPanel.find('input[name=size]:checked').val(),
                        i;
                    // reset previous setting
                    for (i = 0; i < me.sizeOptions.length; i += 1) {
                        me.sizeOptions[i].selected = false;
                    }
                    tool.selected = true;
                    me._cleanMapPreview();
                    me._updateMapPreview();
                    // Update legend
                    me._createLegend();
                };
            };
            for (i = 0; i < me.sizeOptions.length; i += 1) {
                var option = me.sizeOptions[i],
                    toolContainer = me.template.sizeOptionTool.clone(),
                    label = option.label;

                if (option.width && option.height) {
                    label = label + ' (' + option.width + ' x ' + option.height + 'px)';
                }
                toolContainer.find('label').append(label).attr({
                    'for': option.id,
                    'class': 'printout_radiolabel'
                });
                if (option.selected) {
                    toolContainer.find('input').attr('checked', 'checked');
                }
                contentPanel.append(toolContainer);
                toolContainer.find('input').attr({
                    'value': option.id,
                    'name': 'size',
                    'id': option.id
                });
                toolContainer.find('input').change(closureMagic(option));
            }

            return panel;
        },

        /**
         * @private @method _createSettingsPanel
         * Creates a settings panel for printout
         *
         *
         * @return {jQuery} Returns the created panel
         */
        _createSettingsPanel: function () {
            var me = this,
                panel = Oskari.clazz.create(
                    'Oskari.userinterface.component.AccordionPanel'
                );

            panel.setTitle(me.loc.settings.label);
            var contentPanel = panel.getContainer();
            // tooltip
            var tooltipCont = me.template.help.clone();
            tooltipCont.attr('title', me.loc.settings.tooltip);
            contentPanel.append(tooltipCont);

            var closureMagic = function (tool) {
                return function () {
                    var format = contentPanel.find('input[name=format]:checked').val(),
                        i;
                    // reset previous setting
                    for (i = 0; i < me.formatOptions.length; i += 1) {
                        me.formatOptions[i].selected = false;
                    }
                    tool.selected = true;
                    me._setAdditionalOptionsVisibility(format);
                };
            };
            /* format options from localisations files */
            var format = me.template.format.clone(),
                i,
                f,
                option,
                toolContainer,
                label;

            format.find('.printout_format_label').html(me.loc.format.label);
            for (i = 0; i < me.formatOptions.length; i += 1) {
                option = me.formatOptions[i];
                toolContainer = me.template.formatOptionTool.clone();
                label = option.label;

                toolContainer.find('label').append(label).attr({
                    'for': option.id,
                    'class': 'printout_radiolabel'
                });
                if (option.selected) {
                    toolContainer.find('input').attr('checked', 'checked');
                }
                format.append(toolContainer);
                toolContainer.find('input').attr({
                    'value': option.format,
                    'name': 'format',
                    'id': option.id
                });
                toolContainer.find('input').change(closureMagic(option));
            }
            contentPanel.append(format);

            var mapTitle = me.template.title.clone();
            mapTitle.find('.printout_title_label').html(me.loc.mapTitle.label);
            mapTitle.find('.printout_title_field').attr({
                'value': '',
                'placeholder': me.loc.mapTitle.label
            });

            contentPanel.append(mapTitle);

            /* CONTENT options from localisations files */
            for (f = 0; f < me.contentOptions.length; f += 1) {
                var dat = me.contentOptions[f],
                    opt = me.template.option.clone();

                opt.find('input').attr({
                    'id': dat.id,
                    'checked': dat.checked
                });
                opt.find('label').html(dat.label).attr({
                    'for': dat.id,
                    'class': 'printout_checklabel'
                });

                if(typeof dat.cssClass !== 'undefined') {
                    opt.addClass(dat.cssClass);
                }
                me.contentOptionDivs[dat.id] = opt;
                contentPanel.append(opt);

            }

            // Lengend options
            var closureMagic2 = function (tool) {
                return function () {
                    var legend = contentPanel.find('input[name=legend]:checked').val(),
                        i;
                    // reset previous setting
                    for (i = 0; i < me.legendOptions.length; i += 1) {
                        me.legendOptions[i].selected = false;
                    }
                    tool.selected = true;

                };
            };

            var legend = me.template.legend.clone();
            legend.find('.printout_legend_label').html(me.loc.legend.label);
            for (i = 0; i < me.legendOptions.length; i += 1) {
                option = me.legendOptions[i];
                toolContainer = me.template.legendOptionTool.clone();
                label = option.label;

                toolContainer.find('label').append(label).attr({
                    'for': option.id,
                    'class': 'printout_radiolabel'

                });
                if (option.selected) {
                    toolContainer.find('input').attr('checked', 'checked');
                }
                legend.append(toolContainer);
                toolContainer.find('input').attr({
                    'value': option.loca,
                    'name': 'location',
                    'id': option.id
                });
                toolContainer.find('input').change(closureMagic2(option));
                toolContainer.find('input[name="location"]').click(function () {
                    // Legend stuff
                    me._createLegend();
                });
            }
            contentPanel.append(legend);

            /*if ( me.instance.sandbox.findRegisteredModuleInstance('MainMapModule').getProjectionUnits() !== 'm' ) {
                me.contentOptionDivs.pageScale.css('display', 'none');
            }*/
            return panel;
        },

        /**
         * @private @method _createSizePanel
         * Creates the size selection panel for printout
         *
         *
         * @return {jQuery} Returns the created panel
         */
        _createPreviewPanel: function () {
            var me = this,
                panel = Oskari.clazz.create(
                    'Oskari.userinterface.component.AccordionPanel'
                );

            panel.setTitle(me.loc.preview.label);
            var contentPanel = panel.getContainer(),
                tooltipCont = me.template.help.clone();

            tooltipCont.attr('title', me.loc.preview.tooltip);
            contentPanel.append(tooltipCont);

            var previewContent = me.template.preview.clone();

            contentPanel.append(previewContent);

            /* progress */
            me.progressSpinner.insertTo(previewContent);

            var previewImgDiv = previewContent.find('img');
            previewImgDiv.click(function () {
                me.showFullScaleMapPreview();
            });
            var previewSpan = previewContent.find('span');

            me.previewContent = previewContent;
            me.previewImgDiv = previewImgDiv;
            me.previewSpan = previewSpan;
            var p;
            for (p in me.loc.preview.notes) {
                if (me.loc.preview.notes.hasOwnProperty(p)) {
                    var previewNotes = me.template.previewNotes.clone();
                    previewNotes.find('span').text(me.loc.preview.notes[p]);
                    contentPanel.append(previewNotes);
                }
            }

            return panel;
        },

        /**
         * @private @method _createSizePanel
         * Creates the size selection panel for printout
         *
         *
         * @return {jQuery} Returns the created panel
         */
        _createLocationAndScalePanel: function () {
            var me = this,
                panel = Oskari.clazz.create(
                    'Oskari.userinterface.component.AccordionPanel'
                );

            panel.setTitle(me.loc.location.label);
            var contentPanel = panel.getContainer(),
                tooltipCont = me.template.help.clone();

            tooltipCont.attr('title', me.loc.location.tooltip);
            contentPanel.append(tooltipCont);

            var locationContent = me.template.location.clone();

            contentPanel.append(locationContent);

            return panel;
        },

        /**
         * @private @method _cleanMapPreview
         *
         *
         */
        _cleanMapPreview: function () {
            var me = this,
                loc = me.loc,
                previewImgDiv = me.previewImgDiv,
                previewSpan = me.previewSpan;

            previewImgDiv.hide();
            previewSpan.text(loc.preview.pending);
        },

        /**
         * @private @method _updateMapPreview
         *
         *
         */
        _updateMapPreview: function () {
            var me = this,
                selections = me._gatherSelections('image/png'),
                urlBase = me.backendConfiguration.formatProducers[selections.format],
                maplinkArgs = selections.maplinkArgs,
                pageSizeArgs = '&pageSize=' + selections.pageSize,
                previewScaleArgs = '&scaledWidth=200',
                url = urlBase + maplinkArgs + pageSizeArgs + previewScaleArgs;

            me.previewContent.removeClass('preview-portrait');
            me.previewContent.removeClass('preview-landscape');
            me.previewContent.addClass(me.sizeOptionsMap[selections.pageSize].classForPreview);

            var previewImgDiv = me.previewImgDiv,
                previewSpan = me.previewSpan;

            me.progressSpinner.start();
            window.setTimeout(function () {
                previewImgDiv.imagesLoaded(function () {
                    previewSpan.text('');
                    previewImgDiv.fadeIn('slow', function () {
                        me.progressSpinner.stop();

                    });
                });
                previewImgDiv.attr('src', url);

            }, 100);
        },

        /**
         * @public @method showFullScaleMapPreview
         *
         *
         */
        showFullScaleMapPreview: function () {
            var me = this,
                selections = me._gatherSelections('image/png'),
                urlBase = me.backendConfiguration.formatProducers[selections.format],
                maplinkArgs = selections.maplinkArgs,
                pageSizeArgs = '&pageSize=' + selections.pageSize,
                url = urlBase + maplinkArgs + pageSizeArgs;

            me.openURLinWindow(url, selections);
        },

        /**
         * @private @method _getButtons
         * Renders printout buttons to DOM snippet and returns it.
         *
         *
         * @return {jQuery} container with buttons
         */
        _getButtons: function () {
            var me = this,
                buttonCont = me.template.buttons.clone(),
                cancelBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.buttons.CancelButton'
                );

            cancelBtn.setHandler(function () {
                me.instance.setPublishMode(false);
                // Send print canceled event
                me.instance.sendCanceledEvent('cancel');
            });

            me.backBtn = Oskari.clazz.create(
                'Oskari.userinterface.component.Button'
            );
            me.backBtn.setTitle(me.loc.buttons.back);
            me.backBtn.setHandler(function () {
                me.instance.setPublishMode(false);
                // Send print canceled event previous
                me.instance.sendCanceledEvent('previous');
            });
            me.backBtn.insertTo(buttonCont);
            me.backBtn.hide();

            var saveBtn = Oskari.clazz.create(
                'Oskari.userinterface.component.buttons.SaveButton'
            );

            saveBtn.setTitle(me.loc.buttons.save);

            saveBtn.setHandler(function () {
                var map = me.instance.sandbox.getMap(),
                    features = (map.geojs === undefined || map.geojs === null) ? null : map.geojs,
                    selections = me._gatherSelections();

                if (selections) {
                    me._printMap(selections, features);
                }
            });
            saveBtn.insertTo(buttonCont);
            cancelBtn.insertTo(buttonCont);

            return buttonCont;
        },

        /**
         * @private @method _gatherSelections
         * Gathers printout selections and returns them as JSON object
         *
         *
         * @return {Object}
         */
        _gatherSelections: function (format) {
            var me = this;
            var container = me.mainPanel;
            var sandbox = me.instance.getSandbox();
            var size = container.find('input[name=size]:checked').val();
            var selectedFormat = (format !== null && format !== undefined) ? format : container.find('input[name=format]:checked').val();
            var title = container.find('.printout_title_field').val();
            var maplinkArgs = sandbox.generateMapLinkParameters({
                'srs': sandbox.getMap().getSrsName(),
                'resolution': sandbox.getMap().getResolution()
            });
            var selections = {
                pageTitle: title,
                pageSize: size,
                maplinkArgs: maplinkArgs,
                format: selectedFormat || 'application/pdf'
            };

            if (!size) {
                var firstSizeOption = container.find('input[name=size]').first();
                firstSizeOption.attr('checked', 'checked');
                selections.pageSize = firstSizeOption.val();
            }

            for (var p in me.contentOptionsMap) {
                if (me.contentOptionsMap.hasOwnProperty(p)) {
                    selections[p] = me.contentOptionDivs[p].find('input').prop('checked');
                }
            }

            return selections;
        },

        /**
         * @public @method openURLinWindow
         *
         * @param {String} infoUrl
         * @param {Object} selections
         *
         */
        openURLinWindow: function (infoUrl, selections) {
            var wopParm = 'location=1,' + 'status=1,' + 'scrollbars=1,' + 'width=850,' + 'height=1200';
            if (this._isLandscape(selections)) {
                wopParm = 'location=1,' + 'status=1,' + 'scrollbars=1,' + 'width=1200,' + 'height=850';
            }
            var link = infoUrl;
            window.open(link, 'BasicPrintout', wopParm);
        },

        /**
         * @private @method openPostURLinWindow
         * Sends the gathered map data to the server to save them/publish the map.
         *
         * @param {String} geoJson Stringified GeoJSON
         * @param {String} tileData Stringified tile data
         * @param {Object} printUrl Url to print service action route GetPrint
         * @param {Object} selections map data as returned by _gatherSelections()
         *
         */
        openPostURLinWindow: function (geoJson, tileData, tableData, printUrl, selections) {
            var me = this;
            var wopParm = 'location=1,' + 'status=1,' + 'scrollbars=1,' + 'width=850,' + 'height=1200';
            if (me._isLandscape(selections)) {
                wopParm = 'location=1,' + 'status=1,' + 'scrollbars=1,' + 'width=1200,' + 'height=850';
            }
            var link = printUrl;
            me.mainPanel.find('#oskari_print_formID').attr('action', link);
            me.mainPanel.find('#oskari_print_formID').attr('target', 'map_popup_111');

            if (geoJson) {
                // UTF-8 Base64 encoding
                var textu8 = unescape(encodeURIComponent(geoJson));
                me.mainPanel.find('input[name=geojson]').val(jQuery.base64.encode(textu8));
            }
            if (tileData) {
                me.mainPanel.find('input[name=tiles]').val(tileData);
            }
            if (tableData) {
                me.mainPanel.find('input[name=tabledata]').val(tableData);
            }

            if (!me.isParcelMode) {
                if (selections.format != 'image/png') {
                    window.open('about:blank', 'map_popup_111', wopParm);
                } else {
                    me.mainPanel.find('#oskari_print_formID').attr('target', '_self');
                }
            }
            me.mainPanel.find('#oskari_print_formID').submit();
        },

        /**
         * @public @method printMap
         * Sends the gathered map data to the server to save them/publish the map.
         *
         * @param {Object} printParams, parameters for printing pdf via print service
         *
         */
        printMap: function (printParams) {
            var me = this;
            me._printMap(printParams, null);
        },

        /**
         * @private @method _printMap
         * Sends the gathered map data to the server to save them/publish the map.
         *
         * @param {Object} selections map data as returned by _gatherSelections()
         * @param {Object} features map data as returned by _gatherFeatures()
         *
         */
        _printMap: function (selections, features) {
            var me = this,
                sandbox = me.instance.getSandbox(),
                url = sandbox.getAjaxUrl(),
                urlBase = me.backendConfiguration.formatProducers[selections.format],
                layoutArgs,
                maplinkArgs = selections.maplinkArgs,
                pageSizeArgs = '&pageSize=' + selections.pageSize,
                pageTitleArgs = '&pageTitle=' + encodeURIComponent(selections.pageTitle),
                saveFileArgs = '',
                contentOptions = [],
                p;

            if (selections.saveFile) {
                saveFileArgs = '&saveFile=' + selections.saveFile;
            }
            layoutArgs = me._getLayoutParams(selections.pageSize);
            for (p in me.contentOptionsMap) {
                if (me.contentOptionsMap.hasOwnProperty(p)) {
                    if (selections[p]) {
                        contentOptions.push('&' + p + '=true');
                    }
                }
            }
            var contentOptionArgs = contentOptions.join(''),
                formatArgs = '&format=' + selections.format,
                parameters = maplinkArgs + '&action_route=GetPrint' + pageSizeArgs + pageTitleArgs + contentOptionArgs + formatArgs + saveFileArgs + layoutArgs;

            url = url + parameters;

            // We need to use the POST method if there's GeoJSON or tile data.
            if (me.instance.geoJson || !jQuery.isEmptyObject(me.instance.tileData) || me.instance.tableJson) {
                var stringifiedJson = me._stringifyGeoJson(me.instance.geoJson),
                    stringifiedTileData = me._stringifyTileData(me.instance.tileData),
                    stringifiedTableData = me._stringifyTableData(me.instance.tableJson);

                me.instance.getSandbox().printDebug('PRINT POST URL ' + url);
                me.openPostURLinWindow(stringifiedJson, stringifiedTileData, stringifiedTableData, url, selections);
            } else {
                // Otherwise GET is satisfiable.
                me.instance.getSandbox().printDebug('PRINT URL ' + url);
                me.openURLinWindow(url, selections);
            }
        },

        /**
         * @public @method  modifyUIConfig4Parcel
         * Modify default UI config.
         *
         * @param {Object} printParams, parameters for printing pdf via print service
         *
         */
        modifyUIConfig4Parcel: function (printParams) {
            var me = this,
                container = me.mainPanel;

            me.isParcelMode = true;
            container.find('div.header > div.header_title > p').empty();
            container.find('div.header > div.header_title > p').append(me.loc.title + " (3/3)");

            // Print title
            container.find('.printout_title_field').attr('value', printParams.pageTitle);

            if (me.sizePanel) {
                me.sizePanel.close();
            }
            container.find('div.accordion_panel').first().next().hide();

            //Add back step button
            me.backBtn.show();

        },

        /**
         * @public @method setLayoutParams
         * Set params for backend print layout.
         *
         * @param {Object} printParams, parameters for printing pdf via print service
         *
         */
        setLayoutParams: function (printParams) {
            var me = this;
            me.layoutParams = printParams;

        },

        /**
         * @public @method getLayoutParams
         * Get params for backend print layout.
         * pdf template based on page Size
         *
         * @param {String} pageSize
         *
         */
        _getLayoutParams: function (pageSize) {
            var me = this,
                params = '',
                ind = me._getPageMapRectInd(pageSize);

            if (me.layoutParams.pageTemplate) {
                params = '&pageTemplate=' + me.layoutParams.pageTemplate + '_' + pageSize + '.pdf';
            }
            if (me.layoutParams.pageMapRect) {
                if (ind < me.layoutParams.pageMapRect.length) {
                    params = params + '&pageMapRect=' + me.layoutParams.pageMapRect[ind];
                }
            }
            if (me.layoutParams.tableTemplate) {
                params = params + '&tableTemplate=' + me.layoutParams.tableTemplate + '_' + pageSize;
            }

            return params;
        },

        /**
         * @private @method _isLandscape
         *
     * @param {Object} JSONobject (_gatherSelections)
         *
         * @return true/false
     * return true, if Landscape print orientation
     */
        _isLandscape: function (selections) {
            var ret = false;
            if (this.sizeOptionsMap[selections.pageSize].id.indexOf('Land') > -1) {
                ret = true;
            }
            return ret;
        },

        /**
         * @private @method _stringifyGeoJson
         * Get auxiliary graphics in geojson format + styles
         *
         * @param {JSON} geoJson
         *
         * @return {String/null} Stringified JSON or null if param is empty.
         */
        _stringifyGeoJson: function (geoJson) {
            var ret = null;
            if (geoJson) {
                var geoJsonArray = [];
                //Legend layers go at the end
                var legendLayers = ['LegendHeader', 'LegendBoxes'];
                $.each(geoJson, function (id, value) {
                    if (value != null && legendLayers.indexOf(value.id) == -1)
                        geoJsonArray.push(value);
                });
                $.each(geoJson, function (id, value) {
                    if (value != null && legendLayers.indexOf(value.id) > -1)
                        geoJsonArray.push(value);
                });

                ret = JSON.stringify(geoJsonArray).replace('\"', '"');
            }
            return ret;
        },

        /**
         * @private @method _stringifyTileData
         * Flattens and stringifies tile data for each layer.
         *
         * @param {Object[Array[Object]]} tileData
         *      Object of arrays each containing objects with keys 'bbox' and 'url', eg.
         *      {
         *         'layer1': [ {bbox: '...', url: '...'}, ... ],
         *         'layer2': [ {bbox: '...', url: '...'}, ... ],
         *      }
         *
         * @return {String/null} Stringified data object or null if tileData object is empty.
         */
        _stringifyTileData: function (tileData) {
            if (!jQuery.isEmptyObject(tileData)) {
                var dataArr = [],
                    returnArr,
                    key;

                for (key in tileData) {
                    if (tileData.hasOwnProperty(key)) {
                        dataArr.push(tileData[key]);
                    }
                }
                // dataArr is now an array like this:
                // [ [{}, ...], [{}, ...], ... ]
                returnArr = [].concat.apply([], dataArr);
                return JSON.stringify(returnArr);
            }
            return null;
        },

        /**
         * @private @method _stringifyTableData
         * Stringifies table data.
         *
         * @param {} tableData
         *
         */
        _stringifyTableData: function (tableData) {
            if (!jQuery.isEmptyObject(tableData)) {
                return JSON.stringify(tableData);
            }
            return null;
        },

        /**
         * @private @method _setLegendVisibility
         * Legend parameters UI visible on/off
         *
         *
         */
        _setLegendVisibility: function () {
            var container = this.mainPanel;

            if (this._hasStatsLayers()) {
                container.find('.printout_legend_cont').show();
            } else {
                container.find('.printout_legend_cont').hide();
            }
        },
        _setAdditionalOptionsVisibility: function(format) {
            var container = this.mainPanel;
            if (format == null)
                format = container.find('input[name=format]:checked').val();
            var pdfValue = this.formatOptionsMap['pdf'].format;
            var isPdf = (format == pdfValue);
            container.find('.printout_option_cont').show();
            if (isPdf) {
                container.find('.printout_option_cont.printout_pdfOnly').show();
                container.find('.printout_title_cont').show();
            } else {
                container.find('.printout_title_cont').hide();
                container.find('.printout_option_cont.printout_pdfOnly').hide();
            }
        },

        /**
         * @private @method _hasStatsLayers
         * Check if stats layers are selected
         *
         *
         * @return{boolean} true; statslayers exists
         */
        _hasStatsLayers: function () {
            var layers = this.instance.getSandbox().findAllSelectedMapLayers(),
                i;
            // request updates for map tiles
            for (i = 0; i < layers.length; i += 1) {
                if (layers[i].isLayerOfType('STATS')) {
                    if (layers[i].isVisible()) {
                        return true;
                    }

                }
            }
            return false;
        },

        /**
         * @private @method _createLegend
         * Creates geojson legend for print service
         * Only for statslayer and statsgrid legend
         *
         *
         */
        _createLegend: function () {
            var me = this,
                legendLayers = ['LegendHeader', 'LegendBoxes'];
            // only if any statslayer visible
            me._setLegendVisibility();
            if (!me._hasStatsLayers()) {
                return;
            }

            // Is geostat legend available
            // get div where the map is rendered from openlayers
            var map = me.instance.sandbox.getMap(),
                container = me.mainPanel,
                parentContainer = jQuery('#contentMap');
            // Get legend position
            var legend_pos = container.find('input[name=location]:checked').val();
            if (legend_pos === 'NO') {
                // remove old, if any
                if (me.instance.getSandbox().getMap().GeoJSON) {
                    me.instance.getSandbox().getMap().GeoJSON = null;
                }
                me.instance.legendPlugin.clearLegendLayers();

                //clean legend layers in geojson parameter
                $.each(me.instance.geoJson, function (id, value) {
                    if (value != null && legendLayers.indexOf(value.id) > -1)
                        me.instance.geoJson[id] = null;
                });
            } else {
                var legend = parentContainer.find('div.geostats-legend');
                if (legend.length > 0) {
                    if (me.legendInProcess) {
                        return;
                    }
                    me.legendInProcess = true;
                    me.mainPanel.find('input[type=submit]').prop('disabled', true);

                    me._printMapInfo(legend, function (data) {
                        var title = legend.find('.geostats-legend-title').html();
                        // ranges
                        var ranges = [];
                        // loop divs
                        legend.find('div').each(function () {
                            var myclass = jQuery(this).attr('class');
                            if (myclass === undefined || myclass === null) {
                                var legend_row = {
                                    boxcolor: jQuery(this).find('.geostats-legend-block').attr('style'),
                                    range: jQuery(this).text(),
                                    "color" : "#FFFFFF"
                                };
                                var style;
                                if (jQuery(this).find('.geostats-legend-block').length > 0) {
                                    style = jQuery(this).find('.geostats-legend-block').attr('style');
                                    legend_row.type = 'rectangle';
                                } else {
                                    style = jQuery(this).find('.geostats-legend-block-circle').attr('style');
                                    legend_row.type = 'circle';
                                }
                                var pairs = style.split(';');
                                for (var ix = 0; ix < pairs.length; ix++) {
                                    var pair = pairs[ix];
                                    var keyValuePair = pair.split(":");
                                    if (keyValuePair[0] == 'background-color') {
                                        legend_row.color = keyValuePair[1];
                                    } else if (keyValuePair[0] == 'width') {
                                        legend_row.width = parseFloat(keyValuePair[1].replace("px", ""));
                                    } else if (keyValuePair[0] == 'height') {
                                        legend_row.height = parseFloat(keyValuePair[1].replace("px", ""));
                                    }
                                }
                                ranges.push(legend_row);
                            }
                        });

                        var legendgjs = me.instance.legendPlugin.plotLegend(title, ranges, data, legend_pos);

                        $.each(legendgjs, function(id, value) {
                            me.instance.geoJson[id] = value;
                        });
                        me.legendInProcess = false;
                        me.mainPanel.find('input[type=submit]').prop('disabled', false);

                    }, function () {
                        //clean legend layers in geojson parameter
                        $.each(me.instance.geoJson, function (id, value) {
                            if (value != null && legendLayers.indexOf(value.id) > -1)
                                me.instance.geoJson[id] = null;
                        });

                        me.legendInProcess = false;
                        me.mainPanel.find('input[type=submit]').prop('disabled', false);
                    });
                }
            }

        },
        /**
         * @private @method _getPageMapRectInd
         * get index of pagesize for mapRectangle bbox
         *
         * @param {String} pageSize
         *
         * @return {Number} Page size index
         */
        _getPageMapRectInd: function (pageSize) {
            var ind = 0;

            if (pageSize === 'A4_Landscape') {
                ind = 1;
            } else if (pageSize === 'A3') {
                ind = 2;
            } else if (pageSize === 'A3_Landscape') {
                ind = 3;
            }
            return ind;
        },

        /**
         * @private @method _printMapInfo
         *  Get print info data
         *
         * @param {String} url  print url string
         *
         */
        _printMapInfo: function (legend, callback, errorCallback) {
            var me = this,
                selections = me._gatherSelections(),
                sandbox = me.instance.getSandbox(),
                url = sandbox.getAjaxUrl(),
                urlBase = me.backendConfiguration.formatProducers[selections.format],
                maplinkArgs = selections.maplinkArgs,
                pageSizeArgs = '&pageSize=' + selections.pageSize,
                pageTitleArgs = '&pageTitle=' + encodeURIComponent(selections.pageTitle),
                contentOptions = [],
                p;

            for (p in me.contentOptionsMap) {
                if (me.contentOptionsMap.hasOwnProperty(p)) {
                    if (selections[p]) {
                        contentOptions.push('&' + p + '=true');
                    }
                }
            }
            var contentOptionArgs = contentOptions.join(''),
                formatArgs = '&format=' + selections.format,
                parameters = maplinkArgs + '&action_route=GetProxyRequest&serviceId=print' + pageSizeArgs + pageTitleArgs + contentOptionArgs + formatArgs;

            url = url + parameters;

            // ajax call
            me.instance.printService.fetchPrintMapData(
                // url
                url,
                // success callback

                function (data) {
                    if (data) {

                        callback(data);
                    } else {
                        alert('Error to fetch print info: ');
                    }
                },
                // error callback

                function (jqXHR, textStatus) {
                    alert('Error to fetch print info: ');

                    if (errorCallback) {
                        errorCallback();
                    }

                }
            );
        },

        /**
         * @public @method destroy
         * Destroys/removes this view from the screen.
         */
        destroy: function () {
            this.mainPanel.remove();
        },

        /**
         * @public @method hide
         *
         *
         */
        hide: function () {
            this.mainPanel.hide();
        },

        /**
         * @public @method show
         *
         *
         */
        show: function () {
            this.mainPanel.show();
        },

        /**
         * @public @method setEnabled
         *
         * @param {Boolean} e
         *
         */
        setEnabled: function (e) {
            this.isEnabled = e;
        },

        /**
         * @public @method getEnabled
         *
         *
         * @return {Boolean} enabled
         */
        getEnabled: function () {
            return this.isEnabled;
        },

        /**
         * @public @method refresh
         *
         * @param {Boolean} isUpdate
         *
         */
        refresh: function (isUpdate) {
            if (isUpdate) {
                this._updateMapPreview();
            } else {
                this._cleanMapPreview();
            }
            // Update legend
            this._createLegend();
        },

        /**
         * @public @method getState
         *
         *
         * @return {Object} state
         */
        getState: function () {
            return this._gatherSelections();
        },

        /**
         * @public @method setState
         *
         * @param {Object} formState
         *
         */
        setState: function (formState) {

        }
    }
);
