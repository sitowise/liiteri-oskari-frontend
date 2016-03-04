Oskari.clazz.define("Oskari.liiteri.bundle.user-layers.UserLayersInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {

        this.sandbox = null;
        this.plugins = {};
        this._localization = null;
		this.conf = {
            "name": "user-layers",
            "sandbox": "sandbox",
            "stateful": false,
            "tileClazz": null,
            //"tileClazz": "Oskari.liiteri.bundle.liiteri-urbanplanning.Tile",
            "flyoutClazz": null,
            "viewClazz": "Oskari.liiteri.bundle.liiteri-urbanplanning.UserLayersView",
            "isFullScreenExtension": true
        };

        /**
         * @property mediator
         * Loader sets this
         */
        this.mediator = null;

    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'user-layers',

        /**
         * @method getName
         * Module protocol method
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getTitle
         * Extension protocol method
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            return this.getLocalization('title');
        },
        /**
         * @method getDescription
         * Extension protocol method
         * @return {String} localized text for the description of the component
         */
        getDescription: function () {
            return this.getLocalization('desc');
        },

        /**
         * @method getSandbox
         * Convenience method to call from Tile and Flyout
         * @return {Oskari.mapframework.sandbox.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },

        /**
         * @method update
         * BundleInstance protocol method
         */
        update: function () {},
        /**
         * @method getLocalization
         * Convenience method to call from Tile and Flyout
         * Returns JSON presentation of bundles localization data for current language.
         * If key-parameter is not given, returns the whole localization data.
         *
         * @param {String} key (optional) if given, returns the value for key
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function (key) {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },

        /**
         * @method startExtension
         * Extension protocol method
         */
        startExtension: function () {
            var me = this;
            //me.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.liiteri.bundle.user-layers.Flyout', me);
            //me.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.liiteri.bundle.user-layers.Tile', me);
			me.plugins['Oskari.userinterface.View'] = Oskari.clazz.create('Oskari.liiteri.bundle.user-layers.UserLayersView', me);
        },

        /**
         * @method stopExtension
         * Extension protocol method
         */
        stopExtension: function () {
            var me = this;
            for (var pluginType in me.plugins) {
                if (pluginType) {
                    me.plugins[pluginType] = null;
                }
            }
        },

        /**
         * @method getPlugins
         * Extension protocol method
         */
        getPlugins: function () {
            return this.plugins;
        },


        /**
         * @method start
         * BundleInstance protocol method
         */
        start: function () {
            var me = this;
            // Should this not come as a param?
            var conf = me.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);
            this.sandbox = sandbox;

            this.localization = Oskari.getLocalization(this.getName());

            // register to sandbox as a module
            sandbox.register(me);
            // register to listening events
            for (var p in me.eventHandlers) {
                if (p) {
                    sandbox.registerForEventByName(me, p);
                }
            }
            //Let's extend UI with Flyout and Tile
            var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
            sandbox.request(this, request);
			
            // draw ui
            me._createUI();
			
            //Add tab to the personaldata bundle
            var title = "Rajapinta-aineistot"; //TODO localization
            var content = me.plugins['Oskari.userinterface.View'].prepareView();
            var first = false;
            var id = "USERWMS";
            var request = sandbox.getRequestBuilder('PersonalData.AddTabRequest')(title, content, first, id);
            sandbox.request(this, request);
        },
		
		_sendRequest: function(url, successCb, errorCb) {			
			jQuery.ajax({
				type: "GET",
				dataType: 'json',
				beforeSend: function (x) {
					if (x && x.overrideMimeType) {
						x.overrideMimeType("application/j-son;charset=UTF-8");
					}
				},
				url: url,
				success: function (pResp) {
					if (successCb) {
						successCb(pResp);
					}
				},
				error: function (jqXHR, textStatus) {
					if (errorCb && jqXHR.status !== 0) {
						errorCb(jqXHR, textStatus);
					}
				}
			});			
		},

        /**
         * @method init
         * Module protocol method
         */
        init: function () {
            // headless module so nothing to return
            return null;
        },

        /**
         * @method onEvent
         * Module protocol method/Event dispatch
         */
        onEvent: function (event) {
            var me = this,
                handler = me.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        },

        /**
         * @static
         * @property eventHandlers
         * Best practices: defining which
         * events bundle is listening and how bundle reacts to them
         */
        eventHandlers: {
			'userinterface.ExtensionUpdatedEvent': function (event) {
                var me = this,
                    view = me.plugins['Oskari.userinterface.View'];
                
                if (event.getExtension().getName() !== me.getName()) {
                    // not me -> do nothing
                    return;
                }

                var isShown = event.getViewState() !== "close";
                view.showMode(isShown, true);
            }
        },

        /**
         * @method stop
         * BundleInstance protocol method
         */
        stop: function () {
            var me = this,
                sandbox = me.sandbox();
            // unregister from listening events
            for (var p in me.eventHandlers) {
                if (p) {
                    sandbox.unregisterFromEventByName(me, p);
                }
            }
            var request =
                sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(me);
            sandbox.request(me, request);
            // unregister module from sandbox
            me.sandbox.unregister(me);
        },

        /**
         * @method _createUI
         * @private
         *
         * Custom method, do what ever you like
         * Best practices: start internal/private methods with an underscore
         */
        _createUI: function () {
            var me = this;
            for (var pluginType in me.plugins) {
                if (pluginType) {
                    me.plugins[pluginType].createUI();
                }
            }
        }
    }, {
        protocol: ['Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module',
            'Oskari.userinterface.Extension'
        ]
    });