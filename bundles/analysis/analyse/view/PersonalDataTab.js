/**
 * @class Oskari.mapframework.bundle.analyse.view.PersonalDataTab
 * Renders the analysis tab content to be shown in "personal data" bundle.
 * Also handles the delete functionality it provides in the UI.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.analyse.view.PersonalDataTab',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.analysis.bundle.analyse.AnalyseBundleInstance}
     * instance
     *      reference to component that created the tile
     */
    function (instance, localization) {
        var me = this,
            p;

        me.instance = instance;
        me.loc = localization;
        me.grid = undefined;
        me.container = undefined;

        /* templates */
        me.template = {};
        for (p in me.__templates) {
            if (me.__templates.hasOwnProperty(p)) {
                me.template[p] = jQuery(me.__templates[p]);
            }
        }
    }, {
        __templates: {
            main: '<div class="oskari-analysis-listing-tab"></div>',
            link: '<a href="JavaScript:void(0);"></a>'
        },
        /**
         * Returns reference to a container that should be shown in personal data
         * @method getContent
         * @return {jQuery} container reference
         */
        getContent: function () {
            if (this.container) {
                return this.container;
            }
            // construct it
            var me = this,
                sandbox = me.instance.sandbox,
                addMLrequestBuilder = sandbox.getRequestBuilder(
                    'AddMapLayerRequest'
                ),
                grid = Oskari.clazz.create(
                    'Oskari.userinterface.component.Grid'
                ),
                visibleFields = ['name', 'delete'];

            me.grid = grid;
            grid.setVisibleFields(visibleFields);
            // set up the link from name field
            var nameRenderer = function (name, data) {
                var link = me.template.link.clone(),
                    layer = data.layer;

                link.append(name);
                link.bind('click', function () {
                    // add analysis layer to map on name click
                    var request = addMLrequestBuilder(
                        layer.getId(),
                        false,
                        layer.isBaseLayer()
                    );
                    sandbox.request(me.instance, request);
                    me.handleBounds(layer);
                    return false;
                });
                return link;
            };
            grid.setColumnValueRenderer('name', nameRenderer);
            // set up the link from edit field
            var deleteRenderer = function (name, data) {
                var link = me.template.link.clone(),
                    layer = data.layer;
                link.append(name);
                link.bind('click', function () {
                    // delete analysis layer
                    me._confirmDeleteAnalysis(data);
                    return false;
                });
                return link;
            };
            grid.setColumnValueRenderer('delete', deleteRenderer);

            // setup localization
            visibleFields.forEach(function (key) {
                grid.setColumnUIName(key, me.loc.grid[key]);
            });

            me.container = me.template.main.clone();
            // populate initial grid content
            me.update();
            return me.container;
        },

        /**
         * @method handleBounds
         * @private
         *
         * Make use of the layer bounding box information to set appropriate map view
         *
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
         *            layer layer for which to handle bounds
         *
         */
        handleBounds: function (layer) {
            var sandbox = this.instance.sandbox;

            var geom = layer.getGeometry();

            if ((geom === null) || (typeof geom === 'undefined') ) {
                return;
            }
            if (geom.length === 0) {
                return;
            }

            var olPolygon = geom[0],
                bounds = olPolygon.getBounds(),
                centroid = olPolygon.getCentroid(),
                epsilon = 1.0,
                rb = sandbox.getRequestBuilder('MapMoveRequest'),
                req;

            if (rb) {
                if (olPolygon.getArea() < epsilon) {
                    // zoom to level 9 if a single point
                    req = rb(centroid.x, centroid.y, 9);
                    sandbox.request(this.instance, req);
                } else {
                    req = rb(centroid.x, centroid.y, bounds);
                    sandbox.request(this.instance, req);
                }
            }
        },

        /**
         * Updates the tab content with current analysis layers listing
         * @method update
         */
        update: function () {
            if(!this.container) {
                this.getContent();
            }
            var me = this,
                service = me.instance.sandbox.getService(
                    'Oskari.mapframework.service.MapLayerService'
                ),
                layers = service.getAllLayersByMetaType('ANALYSIS'),
                gridModel = Oskari.clazz.create(
                    'Oskari.userinterface.component.GridModel'
                );

            gridModel.setIdField('id');

            layers.forEach(function (layer) {
                gridModel.addData({
                    'id': layer.getId(),
                    'name': layer.getName(),
                    'layer': layer,
                    'delete': me.loc.buttons['delete']
                });
            });

            me.grid.setDataModel(gridModel);
            me.container.empty();
            me.grid.renderTo(me.container);
        },
        /**
         * Confirms delete for given place and deletes it if confirmed. Also shows
         * notification about cancel, deleted or error on delete.
         * @method _confirmDeleteAnalysis
         * @param {Object} data grid data object for place
         * @private
         */
        _confirmDeleteAnalysis: function (data) {
            var me = this,
                dialog = Oskari.clazz.create(
                    'Oskari.userinterface.component.Popup'
                ),
                okBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.buttons.DeleteButton'
                );

            okBtn.addClass('primary');

            okBtn.setHandler(function () {
                me._deleteAnalysis(data.layer);
                dialog.close();
            });

            dialog.show(
                me.loc.title,
                me.loc.confirmDeleteMsg + '"' + data.name + '"' + '?',
                [
                    okBtn,
                    dialog.createCloseButton(me.loc.buttons.cancel)
                ]
            );

            dialog.makeModal();
        },

        /**
         * @method _deleteAnalysis
         * Request backend to delete analysis data for the layer. On success removes the layer
         * from map and layerservice. On failure displays a notification.
         * @param {Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer} layer analysis data to be destroyed
         * @param {Boolean} should success dialog be shown or not. Optional, if not set, dialog is shown.
         * @private
         */
        _deleteAnalysis: function (layer, showDialog) {
            var me = this,
                sandbox = this.instance.sandbox,
                tokenIndex = layer.getId().lastIndexOf('_') + 1, // parse actual id from layer id
                idParam = layer.getId().substring(tokenIndex);

            jQuery.ajax({
                url: sandbox.getAjaxUrl(),
                data: {
                    action_route: 'DeleteAnalysisData',
                    id: idParam
                },
                type: 'POST',
                success: function (response) {
                    if (response && response.result === 'success') {
                        me._deleteSuccess(layer, showDialog);
                    } else {
                        me._deleteFailure();
                    }
                },
                error: function () {
                    me._deleteFailure();
                }
            });

        },
        /**
         * Success callback for backend operation.
         * @method _deleteSuccess
         * @param {Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer} layer layer that was removed
         * @param {Boolean} should success dialog be shown or not. Optional, if not set, dialog is shown.
         * @private
         */
        _deleteSuccess: function (layer, showDialog) {
            var sandbox = this.instance.sandbox,
                service = sandbox.getService(
                    'Oskari.mapframework.service.MapLayerService'
                );
            // TODO: shouldn't maplayerservice send removelayer request by default on remove layer?
            // also we need to do it before service.remove() to avoid problems on other components
            var removeMLrequestBuilder = sandbox.getRequestBuilder(
                    'RemoveMapLayerRequest'
                ),
                request = removeMLrequestBuilder(layer.getId());

            sandbox.request(this.instance, request);
            service.removeLayer(layer.getId());
            // show msg to user about successful removal
            if (showDialog) {
                var dialog = Oskari.clazz.create(
                    'Oskari.userinterface.component.Popup'
                );
                dialog.show(
                    this.loc.notification.deletedTitle,
                    this.loc.notification.deletedMsg
                );
                dialog.fadeout(3000);
            }
        },
        /**
         * Failure callback for backend operation.
         * @method _deleteFailure
         * @private
         */
        _deleteFailure: function () {
            var dialog = Oskari.clazz.create(
                    'Oskari.userinterface.component.Popup'
                ),
                okBtn = dialog.createCloseButton(this.loc.buttons.ok);

            dialog.show(this.loc.error.title, this.loc.error.generic, [okBtn]);
        }
    });