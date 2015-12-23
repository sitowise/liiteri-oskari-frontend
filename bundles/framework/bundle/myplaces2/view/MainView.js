/**
 * @class Oskari.mapframework.bundle.myplaces2.MyPlacesBundleInstance
 *
 * Registers and starts the
 * Oskari.mapframework.bundle.myplaces2.plugin.CoordinatesPlugin plugin for main map.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.myplaces2.view.MainView",

    /**
     * @method create called automatically on construction
     * @static
     */

    function (instance, options) {
        this.instance = instance;
        this.options = options;
        this.popupId = 'myplacesForm';
        this.form = undefined;
        this.drawPluginId = this.instance.getName();
    }, {
        __name: 'MyPlacesMainView',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getSandbox
         * @return {Oskari.mapframework.sandbox.Sandbox}
         */
        getSandbox: function () {
            return this.instance.sandbox;
        },
        /**
         * @method init
         * implements Module protocol init method
         */
        init: function () {},
        /**
         * @method start
         * implements Module protocol start methdod
         */
        start: function () {
            var me = this;

            var sandbox = this.instance.sandbox,
                p;
            sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }

            var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');

            // register plugin for map (drawing for my places)
            var pluginConfig = {
                id: this.drawPluginId,
                multipart: true
            };
            var drawPlugin = Oskari.clazz.create('Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin', pluginConfig);
            mapModule.registerPlugin(drawPlugin);
            mapModule.startPlugin(drawPlugin);
            this.drawPlugin = drawPlugin;

            // register plugin for map (hover tooltip for my places)
            // TODO: start when a myplaces layer is added and stop when last is removed?
            /*var hoverPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.plugin.HoverPlugin');
        mapModule.registerPlugin(hoverPlugin);
        mapModule.startPlugin(hoverPlugin);
        this.hoverPlugin = hoverPlugin;
        */
        },
        /**
         * @method update
         * implements Module protocol update method
         */
        stop: function () {
            var sandbox = this.instance.sandbox,
                p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }
            sandbox.unregister(this);
        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {

            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);

        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method Toolbar.ToolSelectedEvent
             * User changed tool -> cancel myplaces actions
             * @param {Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent} event
             */
            'Toolbar.ToolSelectedEvent': function (event) {
                // changed tool
                this.cleanupPopup();
            },
            /**
             * @method DrawPlugin.FinishedDrawingEvent
             * @param {Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.event.FinishedDrawingEvent} event
             */
            'DrawPlugin.FinishedDrawingEvent': function (event) {
                if (this.drawPluginId !== event.getCreatorId()) return;

                this._handleFinishedDrawingEvent(event);
            },
            'DrawPlugin.ActiveDrawingEvent': function(event) {
                if (this.drawPluginId !== event.getCreatorId()) return;
                
                if (this.form) {
                    this.form.setMeasurementResult(event.getDrawing(), event.getDrawMode());
                }
            }
        },
        /**
         * @method _handleFinishedDrawingEvent
         * Handles custom event when drawing is finished
         * @private
         * @param {Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.event.FinishedDrawingEvent} event
         */
        _handleFinishedDrawingEvent: function (event) {
            var center = event.getDrawing().getCentroid();
            var lonlat = {
                lon: center.x,
                lat: center.y
            };
            this.showPlaceForm(lonlat);
        },
        /**
         * @method showPlaceForm
         * Displays a form popup on given location. Prepopulates the form if place is given
         * @param {OpenLayers.LonLat} location location to point with the popup
         * @param {Oskari.mapframework.bundle.myplaces2.model.MyPlace} place prepoluate form with place data (optional)
         */
        showPlaceForm: function (location, place) {
            var me = this;
            var sandbox = this.instance.sandbox;
            sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
            var loc = this.instance.getLocalization();
            this.form = Oskari.clazz.create(
                'Oskari.mapframework.bundle.myplaces2.view.PlaceForm', this.instance, this.options);
            var categories = this.instance.getService().getAllCategories();
            if (place) {
                var param = {
                    place: {
                        id: place.getId(),
                        name: place.getName(),
                        link: place.getLink(),
                        imageLink: place.getImageLink(),
                        desc: place.getDescription(),
                        attention_text: place.getAttention_text(),
                        category: place.getCategoryID(),
						onlyLabel: place.isOnlyLabel()
                    }
                };
                this.form.setValues(param);
            }

            var drawing = this.drawPlugin.getDrawing();
            if (drawing) {
                if (drawing.CLASS_NAME === 'OpenLayers.Geometry.MultiLineString') {
                    this.form.setMeasurementResult(drawing, 'line');
                } else if (drawing.CLASS_NAME === 'OpenLayers.Geometry.MultiPolygon') {
                    this.form.setMeasurementResult(drawing, 'area');
                } else if (drawing.CLASS_NAME === 'OpenLayers.Geometry.MultiPoint') {
					this.form.showOnlyLabelCheckbox = true;
				}
            }

            var content = [{
                html: me.form.getForm(categories),
                useButtons: true,
                primaryButton: loc.buttons.save,
                actions: {}
            }];
            // save button
            content[0].actions[loc.buttons.save] = function () {
                me._saveForm();
            };
            // cancel button
            content[0].actions[loc.buttons.cancel] = function () {
                me.cleanupPopup();
                // ask toolbar to select default tool
                var toolbarRequest = me.instance.sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')();
                me.instance.sandbox.request(me, toolbarRequest);
            };

            var request = sandbox.getRequestBuilder('InfoBox.ShowInfoBoxRequest')(this.popupId, loc.placeform.title, content, location, true);
            sandbox.request(me.getName(), request);
        },
        /**
         * Destroys the opened form popup(s) from the screen.
         * 
         * @method deletePlaceForm
         */
        deletePlaceForm: function() {
            var sandbox = this.instance.sandbox,
                requestB = sandbox.getRequestBuilder('InfoBox.HideInfoBoxRequest'),
                request;

            if (requestB) {
                request = requestB(this.popupId);
                sandbox.request(this.getName(), request);
            }
        },
        /**
         * @method _validateForm
         * Validates form data, returns an object array if any errors.
         * Error objects have field and error properties ({field : 'name', error: 'Name missing'}).
         * @private
         * @param {Object} values form values as returned by Oskari.mapframework.bundle.myplaces2.view.PlaceForm.getValues()
         * @return {Object[]}
         */
        _validateForm: function (values) {
            var errors = [];
            var categoryHandler = this.instance.getCategoryHandler();
            if(categoryHandler && categoryHandler.validateCategoryFormValues) {
                errors = categoryHandler.validateCategoryFormValues(values.category);
            }

            var loc = this.instance.getLocalization('validation');
            if (!values.place.name) {
                errors.push({
                    name: 'name',
                    error: loc.placeName
                });
            } else if (categoryHandler.hasIllegalChars(values.place.name)) {
                errors.push({
                    name: 'name',
                    error: loc.placeNameIllegal
                });
            }
            if (categoryHandler.hasIllegalChars(values.place.desc)) {
                errors.push({
                    name: 'desc',
                    error: loc.descIllegal
                });
            }
            return errors;
        },
        _showValidationErrorMessage: function (errors) {
            var loc = this.instance.getLocalization();
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var okBtn = dialog.createCloseButton(loc.buttons.ok);
            var content = jQuery('<ul></ul>'),
                i,
                row;
            for (i = 0; i < errors.length; ++i) {
                row = jQuery('<li></li>');
                row.append(errors[i].error);
                content.append(row);
            }
            dialog.show(loc.validation.title, content, [okBtn]);
        },
        /**
         * @method _saveForm
         * @private
         * Handles save button on my places form.
         * If a new category has been defined -> saves it and calls _savePlace()
         * for saving the actual place data after making the new category available.
         */
        _saveForm: function () {
            // form not open, nothing to do
            if (!this.form) {
                return;
            }
            var me = this;
            var formValues = this.form.getValues();
            // validation
            var errors = this._validateForm(formValues);
            if (errors.length !== 0) {
                this._showValidationErrorMessage(errors);
                return;
            }
            // validation passed -> go save stuff
            // new category given -> save it first 
            if (formValues.category) {

                var category = this.instance.getCategoryHandler().getCategoryFromFormValues(formValues.category);

                var serviceCallback = function (blnSuccess, model, blnNew, responseText) {
                    if (blnSuccess) {
                        // add category as a maplayer to oskari maplayer service
                        // NOTE! added as a map layer to maplayer service through categoryhandler getting an event
                        //me.instance.addLayerToService(model);
                        // save the actual place
                        formValues.place.category = model.getId();
                        me.__savePlace(formValues.place);
                    } else {
                        // blnNew should always be true since we are adding a category
                        var loc = me.instance.getLocalization('notification').error;
                        if (blnNew) {
							if (responseText && loc[responseText]) {
								me.instance.showMessage(loc.title, loc[responseText]);
							} else {
								me.instance.showMessage(loc.title, loc.addCategory);
							}
                        } else {
                            me.instance.showMessage(loc.title, loc.editCategory);
                        }
                    }
                };
                this.instance.getService().saveCategory(category, serviceCallback);
            } else {
                // category selected from list -> save place
                this.__savePlace(formValues.place);
            }
        },
        /**
         * @method __savePlace
         * Handles save place after possible category save
         * @private
         * @param {Object} values place properties
         */
        __savePlace: function (values) {
            var me = this,
                loc;
            // form not open, nothing to do
            if (!values) {
                // should not happen
                loc = me.instance.getLocalization('notification').error;
                me.instance.showMessage(loc.title, loc.savePlace);
                return;
            }
            var place = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.model.MyPlace');
            var oldCategory = -1;
            if (values.id) {
                place = this.instance.getService().findMyPlace(values.id);
                oldCategory = place.getCategoryID();
            }
            place.setId(values.id);
            place.setName(values.name);
            place.setLink(values.link);
            place.setImageLink(values.imageLink);
            place.setDescription(values.desc);
            place.setAttention_text(values.attention_text);
            place.setCategoryID(values.category);
			place.setOnlyLabel(values.onlyLabel);
            // fetch the latest geometry if edited after FinishedDrawingEvent
            place.setGeometry(this.drawPlugin.getDrawing());

            var sandbox = this.instance.sandbox;
            var serviceCallback = function (blnSuccess, model, blnNew) {
                if (blnSuccess) {
                    // add map layer to map (we could check if its already there but core will handle that)
                    var layerId = me.instance.getCategoryHandler()._getMapLayerId(place.getCategoryID());
                    var requestBuilder = sandbox.getRequestBuilder('AddMapLayerRequest');
                    var updateRequestBuilder = sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest'),
                        updateRequest;

                    var request = requestBuilder(layerId, true);
                    sandbox.request(me, request);

                    if (!blnNew) {
                        // refresh map layer on map -> send update request
                        updateRequest = updateRequestBuilder(layerId, true);
                        sandbox.request(me, updateRequest);
                        // refresh old layer as well if category changed
                        if (oldCategory !== place.getCategoryID()) {
                            layerId = me.instance.getCategoryHandler()._getMapLayerId(oldCategory);
                            request = requestBuilder(layerId, true);
                            sandbox.request(me, request);
                        }
                    } else {
                        updateRequest = updateRequestBuilder(layerId, true);
                        sandbox.request(me, updateRequest);
                    }
                    // Update myplaces extra layers
                    var eventBuilder = sandbox.getEventBuilder('MapMyPlaces.MyPlacesVisualizationChangeEvent');
                    if (eventBuilder) {
                        var event = eventBuilder(layerId, true);
                        sandbox.notifyAll(event);
                    }

                    me.cleanupPopup();

                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                    loc = me.instance.getLocalization('notification').placeAdded;
                    dialog.show(loc.title, loc.message);
                    dialog.fadeout();
                    // remove drawing
                    me.drawPlugin.stopDrawing();
                } else {
                    loc = me.instance.getLocalization('notification').error;
                    me.instance.showMessage(loc.title, loc.savePlace);
                }
            };
            this.instance.getService().saveMyPlace(place, serviceCallback);
        },
        /**
         * @method cleanupPopup
         * Cancels operations:
         * - close popup
         * - destroy form
         * @private
         */
        cleanupPopup: function () {
            var sandbox = this.instance.sandbox,
                hideRequestB = sandbox.getRequestBuilder('InfoBox.HideInfoBoxRequest'),
                keyBoardRB = sandbox.getRequestBuilder('EnableMapKeyboardMovementRequest'),
                hideRequest,
                keyBoardRequest;

            this.instance.enableGfi(true);

            if (hideRequestB) {
                hideRequest = hideRequestB(this.popupId);
                sandbox.request(this, hideRequest);
            }

            if (keyBoardRB) {
                keyBoardRequest = keyBoardRB();
                sandbox.request(this, keyBoardRequest);
            }

            if (this.form) {
                this.form.destroy();
                this.form = undefined;
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.mapframework.module.Module']
    });