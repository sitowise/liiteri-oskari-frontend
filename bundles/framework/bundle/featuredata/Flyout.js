/**
 * @class Oskari.mapframework.bundle.featuredata.Flyout
 *
 * Renders the "featuredata" flyout.
 */

Oskari.clazz.define(
    'Oskari.mapframework.bundle.featuredata.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.featuredata.FeatureDataGridBundleInstance} instance
     *      reference to component that created the tile
     */

    function (instance) {
        this.instance = instance;
        this.container = null;
        this.state = null;
        this.layers = {};

        this.tabsContainer = null;
        this.modelMngr = null;
        this.selectedTab = null;
        this.active = false;
        this.templateLink = jQuery('<a href="JavaScript:void(0);"></a>');
        // Resizability of the flyout
        this.resizable = true;
        // Is layout currently resizing?
        this.resizing = false;
        // The size of the layout has been changed (needed when changing tabs)
        this.resized = false;
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.featuredata.Flyout';
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
            if (!jQuery(this.container).hasClass('featuredata')) {
                jQuery(this.container).addClass('featuredata');
            }
        },
        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         */
        startPlugin: function () {
            this.tabsContainer = Oskari.clazz.create(
                'Oskari.userinterface.component.TabContainer',
                this.instance.getLocalization('nodata')
            );

            this.modelMngr = Oskari.clazz.create(
                'Oskari.mapframework.bundle.featuredata.service.GridModelManager'
            );
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
         *      state that this component should use
         * Interface method implementation, does nothing atm
         */
        setState: function (state) {
            this.state = state;
        },
        /**
         * @method setResizable
         * @param {Boolean} resizable
         *      state of the flyout resizability
         * Defines if the flyout is resizable
         */
        setResizable: function (resizable) {
            this.resizable = resizable;
        },
        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function () {
            var me = this,
                flyout = jQuery(this.container);
            flyout.empty();

            var sandbox = this.instance.sandbox,
                dimReqBuilder = sandbox.getRequestBuilder(
                    'DimMapLayerRequest'
                ),
                hlReqBuilder = sandbox.getRequestBuilder(
                    'HighlightMapLayerRequest'
                ),
                request;
            // if previous panel is undefined -> just added first tab
            // if selectedPanel is undefined -> just removed last tab
            this.tabsContainer.addTabChangeListener(function (previousPanel, selectedPanel) {
                // cancel grid update on panel change
                if (previousPanel) {
                    me.instance.getService().cancelWFSGridUpdateForLayer(previousPanel.layer.getId());
                    // sendout dim request for unselected tab
                    request = dimReqBuilder(previousPanel.layer.getId());
                    sandbox.request(me.instance.getName(), request);
                }
                me.selectedTab = selectedPanel;
                if (selectedPanel) {
                    me._updateData(selectedPanel.layer);
                    // sendout highlight request for selected tab
                    if (me.active) {
                        request = hlReqBuilder(selectedPanel.layer.getId());
                        sandbox.request(me.instance.getName(), request);
                    }
                }
            });
            this.tabsContainer.insertTo(flyout);
        },

        /**
         * @method layerAdded
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         *           WFS layer that was added
         * Adds a tab for the layer
         */
        layerAdded: function (layer) {
            var panel = Oskari.clazz.create(
                'Oskari.userinterface.component.TabPanel'
            );
            panel.setTitle(layer.getName());
            panel.getContainer().append(this.instance.getLocalization('loading'));
            panel.layer = layer;
            this.layers['' + layer.getId()] = panel;
            this.tabsContainer.addPanel(panel);
        },

        /**
         * @method layerRemoved
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         *           WFS layer that was removed
         * Removes the tab for the layer
         */
        layerRemoved: function (layer) {
            var layerId = '' + layer.getId();
            this.instance.getService().cancelWFSGridUpdateForLayer(layerId);
            var panel = this.layers[layerId];
            this.tabsContainer.removePanel(panel);
            // clean up
            panel.grid = null;
            delete panel.grid;
            panel.layer = null;
            delete panel.layer;
            this.layers[layerId] = null;
            delete this.layers[layerId];
        },
        /**
         * @method updateData
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         *           WFS layer that was added
         * Updates data for layer
         */
        _updateData: function (layer, selectionGeometry) {

            if (!this.active) {
                // disabled
                return;
            }
            // cancel possible previous update
            this.instance.getService().cancelWFSGridUpdateForLayer(layer.getId());
            var map = this.instance.sandbox.getMap(),
                panel = this.layers['' + layer.getId()],
                selection = null;
            if (panel.grid) {
                selection = panel.grid.getSelection();
            }
            panel.getContainer().empty();
            if (!layer.isInScale(map.getScale())) {
                panel.getContainer().append(this.instance.getLocalization('errorscale'));
                return;
            }
            panel.getContainer().append(this.instance.getLocalization('loading'));
            // in scale, proceed
            var me = this;
            //var bbox = map.getBbox();
            var mapWidth = map.getWidth(),
                mapHeight = map.getHeight(),
                cb = function (response) {
                    me._prepareData(layer, response);
                    if (selection) {
                        for (var i = 0; i < selection.length; i += 1) {
                            //me._handleGridSelect(selection[i].featureId, true);
                            // ^ highlight on map, not fully working
                            panel.grid.select(selection[i].featureId, true);
                        }
                    }
                };
            this.instance.getService().scheduleWFSGridUpdate(layer, selectionGeometry, mapWidth, mapHeight, cb);
        },
        /**
         * @method updateGrid
         * @param {Object} user's selection on map
         * Updates grid for drawn places
         */
        updateGrid: function (selection) {
            if (!this.selectedTab) {
                return;
            }
            selection = JSON.stringify(selection);
            this._updateData(this.selectedTab.layer, selection);
        },
        /**
         * @method _enableResize
         * Enables the flyout resizing
         */
        _enableResize: function () {
            var me = this,
                content = jQuery('div.oskari-flyoutcontent.featuredata'),
                flyout = content.parent().parent(),
                container = content.parent(),
                tabsContent = content.find('div.tabsContent'),
                mouseOffsetX = 0,
                mouseOffsetY = 0;

            // Resizer image for lower right corner
            flyout.find('div.tab-content').css({
                'padding-top': '1px',
                'padding-right': '1px'
            });
            var resizer = jQuery('<div/>');
            resizer.addClass('flyout-resizer');
            var resizerHeight = 16;
            resizer.removeClass('allowHover');
            resizer.addClass('icon-drag');
            resizer.bind('dragstart', function (event) {
                event.preventDefault();
            });

            // Start resizing
            resizer.mousedown(function (e) {
                if (me.resizing) {
                    return;
                }
                me.resizing = true;
                mouseOffsetX = e.pageX - flyout[0].offsetWidth - flyout[0].offsetLeft;
                mouseOffsetY = e.pageY - flyout[0].offsetHeight - flyout[0].offsetTop;
                // Disable mouse selecting
                jQuery(document).attr('unselectable', 'on')
                    .css('user-select', 'none')
                    .on('selectstart', false);
            });

            // End resizing
            jQuery(document).mouseup(function (e) {
                me.resizing = false;
                me.resized = true;
            });

            // Resize the featuredata flyout
            jQuery(document).mousemove(function (e) {
                if (!me.resizing) {
                    return;
                }

                var flyOutMinHeight = 100,
                    bottomPadding = 60,
                    flyoutPosition = flyout.offset(),
                    containerPosition = container.offset();

                if (e.pageX > flyoutPosition.left) {
                    var newWidth = e.pageX - flyoutPosition.left - mouseOffsetX;
                    flyout.css('max-width', newWidth.toString() + 'px');
                    flyout.css('width', newWidth.toString() + 'px');
                }
                if (e.pageY - flyoutPosition.top > flyOutMinHeight) {
                    var newHeight = e.pageY - flyoutPosition.top - mouseOffsetY;
                    flyout.css('max-height', newHeight.toString() + 'px');
                    flyout.css('height', newHeight.toString() + 'px');

                    var newContainerHeight = e.pageY - containerPosition.top - mouseOffsetY;
                    container.css('max-height', (newContainerHeight - resizerHeight).toString() + 'px');
                    container.css('height', (newContainerHeight - resizerHeight).toString() + 'px');

                    var tabsContent = jQuery('div.oskari-flyoutcontent.featuredata').find('div.tabsContent');
                    var newMaxHeight = e.pageY - tabsContent[0].offsetTop - resizerHeight - bottomPadding;
                    flyout.find('div.tab-content').css('max-height', newMaxHeight.toString() + 'px');
                }
            });

            // Modify layout for the resizer image
            flyout.find('div.oskari-flyoutcontent').css('padding-bottom', '5px');
            if (jQuery('div.flyout-resizer').length === 0) {
                flyout.append(resizer);
            }
        },

        /**
         * @method _prepareData
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         *           WFS layer that was added
         * @param {Object} data
         *           WFS data JSON
         * Updates data for layer
         */
        _prepareData: function (layer, data) {
            var me = this,
                panel = this.layers['' + layer.getId()],
                isOk = this.tabsContainer.isSelected(panel);
            if (isOk) {
                var models = this.modelMngr.getData(data);
                panel.getContainer().empty();
                if (!models) {
                    // invalid data
                    panel.getContainer().append(this.instance.getLocalization('errordata'));
                    return;
                }
                // only rendering "all" compilation for now
                var model = models.all;
                model.setIdField('featureId');
                var fields = model.getFields();
                if (!panel.grid) {
                    var grid = Oskari.clazz.create('Oskari.userinterface.component.Grid', this.instance.getLocalization('columnSelectorTooltip'));
                    // if multiple featuredatas, we will have a "__featureName" field in "all" model -> rename it for ui
                    grid.setColumnUIName('__featureName', this.instance.getLocalization('featureNameAll'));
                    // set selection handler
                    grid.addSelectionListener(function (pGrid, dataId) {
                        me._handleGridSelect(layer, dataId);
                    });

                    // set popup handler for inner data
                    var showMore = this.instance.getLocalization('showmore');
                    grid.setAdditionalDataHandler(showMore,
                        function (link, content) {
                            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                            dialog.show(showMore, content);
                            dialog.moveTo(link, 'bottom');
                        });

                    var visibleFields = [],
                        i;
                    // filter out certain fields
                    for (i = 0; i < fields.length; i += 1) {
                        if (fields[i] !== 'featureId' &&
                            fields[i] !== 'qName') {
                            visibleFields.push(fields[i]);
                        }
                    }
                    grid.setVisibleFields(visibleFields);
                    grid.setColumnSelector(true);
                    grid.setResizableColumns(true);

                    /*              AL-512 -> AL-793
                grid.setColumnValueRenderer(visibleFields[0], function (value, rowData){
                    var link = me.templateLink.clone();
                    link.append(value);
                    link.bind('click', function () {
                        var sandbox = me.instance.getSandbox();
                        var lon = sandbox.getMap().getX();
                        var lat = sandbox.getMap().getY();
                        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
                        var px = mapModule.getMap().getViewPortPxFromLonLat({
                            lon : lon,
                            lat : lat
                        });
                        sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoRequest', [lon, lat]);
                    });
                    return link;
                });
*/
                    panel.grid = grid;
                }
                panel.grid.setDataModel(model);
                panel.grid.renderTo(panel.getContainer());
                // define flyout size to adjust correctly to arbitrary tables
                var mapdiv = this.instance.sandbox.findRegisteredModuleInstance('MainMapModule').getMapEl(),
                    content = jQuery('div.oskari-flyoutcontent.featuredata'),
                    flyout = content.parent().parent();
                if (!me.resized) {
                    // Define default size for the object data list
                    flyout.find('div.tab-content').css('max-height', (mapdiv.height() / 4).toString() + 'px');
                    flyout.css('max-width', mapdiv.width().toString() + 'px');
                }
                if (me.resizable) {
                    this._enableResize();
                }
            } else {
                // Wrong tab selected -> ignore (shouldn't happen)
            }
        },
        /**
         * @method _handleGridSelect
         * @private
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         *           WFS layer that was added
         * @param {String} dataId
         *           id for the data that was selected
         * @param {Boolean} keepCollection
         *           true to keep previous selection, false to clear before selecting
         * Notifies components that a selection was made
         */
        _handleGridSelect: function (layer, dataId, keepCollection) {
            var sandbox = this.instance.sandbox,
                featureIds = [dataId],
                builder = sandbox.getEventBuilder('WFSFeaturesSelectedEvent');
            if (keepCollection === undefined) {
                keepCollection = sandbox.isCtrlKeyDown();
            }
            var event = builder(featureIds, layer, keepCollection);
            sandbox.notifyAll(event);
        },
        /**
         * @method featureSelected
         * @param {Oskari.mapframework.bundle.mapwfs.event.WFSFeaturesSelectedEvent} event
         * Handles changes on the UI when a feature has been selected (highlights grid row)
         */
        featureSelected: function (event) {
            if (!this.active) {
                return;
            }
            var layer = event.getMapLayer(),
                panel = this.layers['' + layer.getId()],
                featureId = event.getWfsFeatureIds()[0];
            if (panel.grid) {
                // panel might not be available if we got broken data from server on last call
                panel.grid.select(featureId, event.isKeepSelection());
            }
        },
        /**
         * @method isEnabled
         * @return {Boolean}
         * True if grid functionality is enabled
         */
        isEnabled: function () {
            return this.active === true;
        },
        /**
         * @method setEnabled
         * @param {Boolean} isEnabled
         * True to enable grid functionality
         * False to disable and stop reacting to any map movements etc
         */
        setEnabled: function (isEnabled, geometry) {
            if (this.active == isEnabled) {
                // we need to check this since dragging flyout will call this all the time
                if (geometry) {
                    // update geometry if given
                    this.updateGrid(geometry);
                }
                return;
            }
            this.active = (isEnabled === true);
            var sandbox = this.instance.sandbox;

            // feature info activation disabled if object data grid flyout active and vice versa
            var gfiReqBuilder = sandbox.getRequestBuilder('MapModulePlugin.GetFeatureInfoActivationRequest'),
                request;
            if (gfiReqBuilder) {
                sandbox.request(this.instance.getName(), gfiReqBuilder(!this.active));
            }

            // disabled
            if (!this.active) {
                if (this.selectedTab) {
                    // cancel possible previous update
                    this.instance.getService().cancelWFSGridUpdateForLayer(this.selectedTab.layer.getId());
                    // dim possible highlighted layer
                    var dimReqBuilder = sandbox.getRequestBuilder('DimMapLayerRequest');
                    request = dimReqBuilder(this.selectedTab.layer.getId());
                    sandbox.request(this.instance.getName(), request);
                }
                // clear panels
                for (var panel in this.layers) {
                    if (panel.getContainer) {
                        panel.getContainer().empty();
                    }
                }
            }
            // enabled
            else {
                if (this.selectedTab) {
                    // highlight layer if any
                    var hlReqBuilder = sandbox.getRequestBuilder('HighlightMapLayerRequest');
                    request = hlReqBuilder(this.selectedTab.layer.getId());
                    sandbox.request(this.instance.getName(), request);

                    // update data
                    this.updateGrid(geometry);
                }
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.userinterface.Flyout']
    }
);
