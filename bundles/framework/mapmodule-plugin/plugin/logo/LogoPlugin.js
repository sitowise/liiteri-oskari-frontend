/**
 * @class Oskari.mapframework.bundle.mappublished.LogoPlugin
 * Displays the NLS logo and provides a link to terms of use on top of the map.
 * Gets base urls from localization files.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin',
    /**
     * @static @method create called automatically on construction
     *
     */
    function (config) {
        this._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin';
        this._defaultLocation = 'bottom left';
        this._index = 1;
        this._name = 'LogoPlugin';
    }, {

        templates: {
            main: jQuery(
                "<div class='mapplugin logoplugin' data-clazz='Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin'>" +
                    //"<div class='icon'><img src='/Oskari/resources/framework/bundle/mapmodule-plugin/plugin/logo/images/2014_Liiteri_1col_DigitalScreens_b.png'/ height=20 /></div>" +
                    "<div class='terms'><a href='JavaScript:void(0);'></a></div>" +
                    "<div class='data-sources'></div>" +
                    "</div>"
            ),
            dataSourcesDialog: jQuery(
                '<div class="data-sources-dialog">' +
                '  <div class="layers">' +
                '    <h4></h4>' +
                '  </div>' +
                '  <div class="indicators">' +
                '    <h4></h4>' +
                '  </div>' +
                '</div>'
            )
        },

        /**
         * @method _createEventHandlers
         * Create eventhandlers.
         *
         *
         * @return {Object.<string, Function>} EventHandlers
         */
        _createEventHandlers: function () {
            return {
                'StatsGrid.IndicatorsEvent': function (event) {
                    this._addIndicatorsToDataSourcesDialog(
                        event.getIndicators()
                    );
                },

                MapSizeChangedEvent: function (event) {
                    if (this.dataSourcesDialog) {
                        var target = this.getElement().find('.data-sources');
                        if (target) {
                            this.dataSourcesDialog.moveTo(target, 'top');
                        }
                    }
                }

            };
        },

        /**
         * @method _setLayerToolsEditModeImpl
         * Called after layerToolsEditMode is set.
         *
         *
         */
        _setLayerToolsEditModeImpl: function () {
            var me = this;
            // TODO document why this is done...
            if (!me.inLayerToolsEditMode()) {
                me.setLocation(
                    me.getElement().parents('.mapplugins').attr(
                        'data-location'
                    )
                );
            } else {
                if (me.dataSourcesDialog) {
                    me.dataSourcesDialog.close(true);
                    me.dataSourcesDialog = null;
                }
            }
        },

        /**
         * @private @method _createControlElement
         * Draws the panbuttons on the screen.
         *
         *
         * @return {jQuery}
         * Plugin jQuery element
         */
        _createControlElement: function () {
            return jQuery(
                '<div class="mapplugin logoplugin">' +
                '  <div class="icon"></div>' +
                '  <div class="terms">' +
                '    <a href="#" target="_blank"></a>' +
                '  </div>' +
                '  <div class="data-sources">' +
                '    <a href="#"></a>' +
                '  </div>' +
                '</div>'
            );
        },

        /**
         * @public  @method _refresh
         * Called after a configuration change.
         *
         *
         */
        refresh: function () {
            var me = this,
                conf = me.getConfig(),
                mapUrl,
                termsUrl;

            if (conf) {
                mapUrl = me.getSandbox().getLocalizedProperty(
                    conf.mapUrlPrefix
                );
                termsUrl = me.getSandbox().getLocalizedProperty(conf.termsUrl);

                if (conf.font) {
                    me.changeFont(conf.font);
                }
            }

            me._createServiceLink(mapUrl);
            me._createTermsLink(termsUrl);
            me._createDataSourcesLink();
        },

        _createServiceLink: function (mapUrl) {
            var me = this,
                link,
                linkParams;

            link = me.getElement().find('.icon');
            link.unbind('click');

            if (mapUrl) {
                link.click(function (event) {
                    if (!me.inLayerToolsEditMode()) {
                        linkParams = me.getSandbox().generateMapLinkParameters({});
                        window.open(mapUrl + linkParams, '_blank');
                    }
                });
            }
        },

        _createTermsLink: function (termsUrl) {
            var me = this,
                link = me.getElement().find('.terms a');

            if (termsUrl) {
                link.html(me._loc.terms);
                link.attr('href', termsUrl);
                link.click(function (evt) {
                    evt.preventDefault();
                    if (!me.inLayerToolsEditMode()) {
                        window.open(termsUrl, '_blank');
                    }
                });
                link.show();
            } else {
                link.hide();
            }
        },

        _createDataSourcesLink: function () {
            var me = this,
                conf = me.getConfig(),
                dataSources = me.getElement().find('.data-sources');

            if (conf && conf.hideDataSourceLink) {
                dataSources.hide();
            } else {
                dataSources.show();
                dataSources.find('a').html(me._loc.dataSources);
                dataSources.unbind('click');
                dataSources.click(function (e) {
                    if (!me.inLayerToolsEditMode() && !me.dataSourcesDialog) {
                        me._openDataSourcesDialog(e.target);
                        me._requestDataSources();
                    } else if (me.dataSourcesDialog) {
                        me.dataSourcesDialog.close(true);
                        me.dataSourcesDialog = null;
                    }
                });
            }
        },

        /**
         * @public @method changeFont
         * Changes the font plugin's font by adding a class to its DOM elements.
         *
         * @param {String} fontId
         * @param {jQuery} div
         *
         */
        changeFont: function (fontId, div) {
            var classToAdd,
                testRegex;

            div = div || this.element;

            if (!div || !fontId) {
                return;
            }

            classToAdd = 'oskari-publisher-font-' + fontId;
            testRegex = /oskari-publisher-font-/;

            this.getMapModule().changeCssClasses(classToAdd, testRegex, [div]);
        },

        /**
         * @private @method _requestDataSources
         * Sends a request for indicators. If the statsgrid bundle is not
         * available (and consequently there aren't any indicators) it opens the
         * data sources dialog and just shows the data sources of the layers.
         *
         *
         * @return {undefined}
         */
        _requestDataSources: function () {
            var me = this,
                reqBuilder = me.getSandbox().getRequestBuilder(
                    'StatsGrid.IndicatorsRequest'
                ),
                request;

            if (reqBuilder) {
                request = reqBuilder();
                me.getSandbox().request(me, request);
            }
        },

        /**
         * @method _openDataSourcesDialog
         * Opens a dialog to show data sources of the selected layers
         * and statistics indicators.
         *
         * @param  {jQuery} target arget element where the popup is attached to
         * @param  {Array[Object]} indicators the open indicators
         *
         * @return {undefined}
         */
        _openDataSourcesDialog: function (target) {
            var me = this,
                popupTitle = me._loc.dataSources,
                dialog = Oskari.clazz.create(
                    'Oskari.userinterface.component.Popup'
                ),
                closeButton = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button'
                ),
                content = me.templates.dataSourcesDialog.clone(),
                layersCont = content.find('div.layers'),
                layersHeaderLoc = me._loc.layersHeader,
                layers = me.getSandbox().findAllSelectedMapLayers(),
                layersLen = layers.length,
                layer, info,
                i;

            closeButton.setTitle(pluginLoc['close']);
            closeButton.setHandler(function () {
                me.dataSourcesDialog = null;
                dialog.close(true);
            });

            // List the layers if any
            if (layersLen === 0) {
                layersCont.remove();
            } else {
                layersCont.find('h4').html(layersHeaderLoc);

                for (i = 0; i < layersLen; i += 1) {
                    layer = layers[i];
                    info = layer.getName() + " - " + ((layer.getCopyrightInfo() == null) ? pluginLoc['emptyDataSource'] : layer.getCopyrightInfo());

                    layersCont.append('<div>' + info + '</div>');
                }
            }

            me.dataSourcesDialog = dialog;

            dialog.show(popupTitle, content, [closeButton]);

            target = target || me.getElement().find('div.data-sources');
            dialog.moveTo(target, 'top');
        },

        /**
         * @method _addIndicatorsToDataSourcesDialog
         * Adds indicators to the data sources dialog.
         *
         * @param {Object} indicators
         *
         */
        _addIndicatorsToDataSourcesDialog: function (indicators) {
            if (!this.dataSourcesDialog) {
                return;
            }
            var me = this,
                dialog = me.dataSourcesDialog,
                content = dialog.getJqueryContent(),
                indicatorsCont = content.find('div.indicators'),
                indicatorsHeaderLoc = me._loc.indicatorsHeader,
                indicator,
                i,
                target;

            indicators = indicators || {};

            // List the indicators if any
            if (jQuery.isEmptyObject(indicators)) {
                indicatorsCont.remove();
            } else {
                indicatorsCont.find('h4').html(indicatorsHeaderLoc);

                for (i in indicators) {
                    if (indicators.hasOwnProperty(i)) {
                        indicator = indicators[i];
                        indicatorsCont.append(
                            '<div>' +
                            indicator.title + ' - ' +
                            indicator.organization +
                            '</div>'
                        );
                    }
                }
            }

            target = target || me.getElement().find('div.data-sources');
            dialog.moveTo(target, 'top');
        }
    }, {
        extend: ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
