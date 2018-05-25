/**
 * @class Oskari.mapframework.bundle.myplaces2.ButtonHandler
 *
 * Handles the buttons for myplaces functionality
 */
Oskari.clazz.define("Oskari.statistics.bundle.statsgrid.ButtonHandler",

    /**
     * @method create called automatically on construction
     * @static
     */

    function (instance) {
        this.instance = instance;
        this.drawPluginId = instance.drawPluginId;
        this.buttonGroup = 'stats';
        this.measureButtonGroup = 'basictools';
        this.ignoreEvents = false;
        this.dialog = null;
        var me = this;
        this.buttons = {};
        this.templateGuide = jQuery('<div><div class="guide"></div>' +
            '<div class="buttons">' +
            '<div class="cancel button"></div>' +
            '<div class="finish button"></div>' +
            '</div>' +
            '</div>');

        this.templateHelper = jQuery(
            '<div class="drawHelper">' +
            '<div class="infoText"></div>' +
            '<div class="measurementResult"></div>' +
            '</div>'
        );
    }, {
        __name: 'StatisticsButtonHandler',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method init
         * implements Module protocol init method
         */
        init: function () {
            var loc = this.instance.getLocalization('tools');
            // different tooltip for guests - "Please log in to use"
            var tool,
                tooltip;
            for (tool in this.buttons) {
                if (this.buttons.hasOwnProperty(tool)) {
                    tooltip = "tultip";//loc[tool].tooltip;
                    this.buttons[tool].tooltip = tooltip;
                }
            }
        },
        /**
         * @method start
         * implements Module protocol start methdod
         */
        start: function () {
            var me = this,
                sandbox = me.instance.sandbox,
                p,
                tool,
                measureTool;
            sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }

            // request toolbar to add buttons
            var reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
            for (tool in this.buttons) {
                if (this.buttons.hasOwnProperty(tool)) {
                    sandbox.request(this, reqBuilder(tool, this.buttonGroup, this.buttons[tool]));

                    // for logged-in-user: add line & area buttons
                    if (sandbox.getUser().isLoggedIn()) {
                        var loc = me.instance.getLocalization();
                        if (tool === 'line') {
                            measureTool = jQuery.extend(true, {}, this.buttons[tool]);
                            measureTool.callback = function () {
                                me.startNewDrawing({
                                    drawMode: 'measureline'
                                });
                            };
                            measureTool.iconCls = 'tool-measure-line';
                            measureTool.tooltip = loc.tools.measureline.tooltip;
                            sandbox.request(this, reqBuilder(tool, this.measureButtonGroup, measureTool));
                        }
                        if (tool === 'area') {
                            measureTool = jQuery.extend(true, {}, this.buttons[tool]);
                            measureTool.callback = function () {
                                me.startNewDrawing({
                                    drawMode: 'measurearea'
                                });
                            };
                            measureTool.iconCls = 'tool-measure-area';
                            measureTool.tooltip = "tultip";//loc.tools.measurearea.tooltip;
                            sandbox.request(this, reqBuilder(tool, this.measureButtonGroup, measureTool));
                        }
                    }
                }
            }

            var user = this.instance.sandbox.getUser();
            if (!user.isLoggedIn()) {
                // disable toolbar buttons for guests
                this.disableButtons();
            }
        },
        /**
         * @method disableButtons
         * Disables draw buttons
         */
        disableButtons: function () {
            var sandbox = this.instance.sandbox,
                stateReqBuilder = sandbox.getRequestBuilder('Toolbar.ToolButtonStateRequest');
            sandbox.request(this, stateReqBuilder(undefined, this.buttonGroup, false));
        },
        /**
         * @method startNewDrawing
         * Resets currently selected place and sends a draw request to plugin with given config
         * @param config params for StartDrawRequest
         */
        startNewDrawing: function (config) {
            // notify components to reset any saved "selected place" data
            var evt = this.instance.sandbox.getEventBuilder('BackgroundDrawPlugin.SelectedDrawingEvent')();
            this.instance.sandbox.notifyAll(evt);

            // notify plugin to start drawing new geometry
            this.sendDrawRequest(config);
            //this.instance.enableGfi(false);
        },
        /**
         * @method startNewDrawing
         * Sends a StartDrawRequest with given params. Changes the panel controls to match the application state (new/edit)
         * @param config params for StartDrawRequest
         */
        sendDrawRequest: function (config) {
            var me = this,
                conf = jQuery.extend(true, {}, config);
            if (conf.drawMode === 'measureline') {
                conf.drawMode = 'line';
            } else if (conf.drawMode === 'measurearea') {
                conf.drawMode = 'area';
            }
            var startRequest = this.instance.sandbox.getRequestBuilder('BackgroundDrawPlugin.StartDrawingRequest')(this.drawPluginId, conf);
            this.instance.sandbox.request(this, startRequest);

            if (!config.geometry) {
                // show only when drawing new place
                this._showDrawHelper(config.drawMode);

            }
        },
        /**
         * @method update
         * implements Module protocol update method
         */
        _showDrawHelper: function (drawMode) {

            if (this.dialog) {
                this.dialog.close(true);
                this.dialog = null;
            }
            var me = this,
                locTool = this.instance.getLocalization('tools')[drawMode];

            var locBtns = this.instance.getLocalization('buttons'),
                title = locTool.title,
                message = locTool.add,
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            this.dialog = dialog;
            var buttons = [],
                cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(locBtns.cancel);
            cancelBtn.setHandler(function () {
                // ask toolbar to select default tool
                var toolbarRequest = me.instance.sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')();
                me.instance.sandbox.request(me, toolbarRequest);
                me.sendStopDrawRequest(true);
                dialog.close(true);
                me.dialog = null;
            });
            //buttons.push(cancelBtn);

            var finishBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

            finishBtn.setTitle(locBtns.finish);
            finishBtn.addClass('primary');
            finishBtn.setHandler(function () {
                me.sendStopDrawRequest();
                dialog.close(true);
                me.dialog = null;
            });
            buttons.push(finishBtn);

            // for logged-in-user: add line & area buttons
//            if (me.instance.sandbox.getUser().isLoggedIn()) {
//                if (drawMode === 'line' || drawMode === 'area') {
//                    cancelBtn.setTitle(locBtns.close);
//                    finishBtn.setTitle(locBtns.saveAsMyPlace);
//                }
//            }


            var content = this.templateHelper.clone();
            content.find('div.infoText').html(message);

            var measureResult = content.find('div.measurementResult');
            if (drawMode === 'point') {
                // No need to show the measurement result for a point
                measureResult.remove();
            } else {
                measureResult.html(locTool.noResult);
            }

            dialog.show(title, content, buttons);
            dialog.addClass('myplaces2');
            dialog.moveTo('.fetch-data-area.selector-button', 'bottom');
        },
        /**
         * @method sendStopDrawRequest
         * Sends a StopDrawingRequest.
         * Changes the panel controls to match the application state (new/edit) if propagateEvent != true
         * @param {Boolean} isCancel boolean param for StopDrawingRequest, true == canceled, false = finish drawing (dblclick)
         */
        sendStopDrawRequest: function (isCancel) {
            var me = this,
                request = this.instance.sandbox.getRequestBuilder('BackgroundDrawPlugin.StopDrawingRequest')(this.drawPluginId, isCancel);
            this.instance.sandbox.request(this, request);
        },
        /**
         * @method update
         * implements Module protocol update method
         */
        stop: function () {
            // Toolbar.RemoveToolButtonRequest
            // remove live bindings
            jQuery('div.myplaces2 div.button').die();
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
             * @param {Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent} event
             */
            'Toolbar.ToolSelectedEvent': function (event) {
                if (!this.ignoreEvents) {
                    // changed tool -> cancel any drawing
                    // do not trigger when we return drawing tool to 
                    this.sendStopDrawRequest(true);
                    //this.instance.enableGfi(true);
                }
            },
            /**
             * @method DrawPlugin.MyPlaceSelectedEvent
             * Place was selected
             * @param {Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.event.SelectedDrawingEvent} event
             */
            'BackgroundDrawPlugin.SelectedDrawingEvent': function (event) {
                if (this.drawPluginId !== event.getCreatorId()) return;

                if (!event.getPlace()) {
                    // cleanup
                    // ask toolbar to select default tool
                    var toolbarRequest = this.instance.sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')();
                    this.instance.sandbox.request(this, toolbarRequest);
                }
            },
            /**
             * @method DrawPlugin.FinishedDrawingEvent
             * Requests toolbar to select default tool
             * @param {Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.event.FinishedDrawingEvent} event
             */
            'BackgroundDrawPlugin.FinishedDrawingEvent': function (event) {
                if (this.drawPluginId !== event.getCreatorId()) return;
                // set ignore so we don't cancel our drawing unintentionally
                this.ignoreEvents = true;
                // ask toolbar to select default tool
                var toolbarRequest = this.instance.sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')();
                this.instance.sandbox.request(this, toolbarRequest);
                // disable ignore to act normally after ^request
                this.ignoreEvents = false;
                // select tool selection will enable gfi -> disable it again
                //this.instance.enableGfi(false);
                if (this.dialog) {
                    this.dialog.close();
                }
            },

            /**
             * @method DrawPlugin.AddedFeatureEvent
             * Update the help dialog after a new feature was added
             * @param {Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.event.AddedFeatureEvent} event
             */
            'BackgroundDrawPlugin.AddedFeatureEvent': function (event) {
                if (this.drawPluginId !== event.getCreatorId()) return;

                var drawingMode = event.getDrawingMode();
                if (drawingMode !== undefined) {
                    if (drawingMode !== null) {
                        /*
                        if (this.instance.sandbox.getUser().isLoggedIn()) {
                            if (drawingMode === 'line') {
                                drawingMode = "measureline";
                            } else if (drawingMode === 'area') {
                                drawingMode = "measurearea";
                            }
                        }*/
                        /*
                        var loc = this.instance.getLocalization('tools'),
                            areaDialogContent = loc[drawingMode].next,
                            content = this.dialog.getJqueryContent();
                        if (content.find('div.infoText') !== areaDialogContent) {
                            content.find('div.infoText').html(areaDialogContent);
                            this.dialog.moveTo('#toolbar div.toolrow[tbgroup=default-myplaces]', 'top');
                        }
                        */
                    }
                }
            },

            'BackgroundDrawPlugin.ActiveDrawingEvent': function (event) {
                if (this.drawPluginId !== event.getCreatorId()) return;

                var geom = event.getDrawing(),
                    mode = event.getDrawMode();
                var resultText = Oskari.getSandbox().findRegisteredModuleInstance("MainMapModule").formatMeasurementResult(geom, mode);

                if (this.dialog) {
                    var content = this.dialog.getJqueryContent();
                    content.find('div.measurementResult').html(resultText);
                }
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.mapframework.module.Module']
    });
