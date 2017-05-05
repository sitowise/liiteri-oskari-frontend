Oskari.clazz.define("Oskari.liiteri.bundle.liiteri-workspaces.LiiteriWorkspacesInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {

        this.sandbox = null;
        this.plugins = {};
        this._localization = null;
		this._selectedStats = null;
		this._selectedServicePackage = null;
		this.pendingStatState = null;
		this.conf = {
            "name": "liiteri-workspaces",
            "sandbox": "sandbox",
            "stateful": false,
            "tileClazz": null,
            //"tileClazz": "Oskari.liiteri.bundle.liiteri-urbanplanning.Tile",
            "flyoutClazz": null,
            "viewClazz": "Oskari.liiteri.bundle.liiteri-urbanplanning.WorkspacesView",
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
        __name: 'liiteri-workspaces',

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
            //me.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-workspaces.Flyout', me);
            //me.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-workspaces.Tile', me);
			me.plugins['Oskari.userinterface.View'] = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-workspaces.WorkspacesView', me);
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
		
		getSelectedStats: function () {
			return this._selectedStats;
		},
		
		setSelectedStats: function (selectedStats) {
			this._selectedStats = selectedStats;
		},
		
		getSelectedServicePackage: function () {
			return this._selectedServicePackage;
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
			
			//Add workspaces' tab to the personaldata bundle
			var title = "Työtilat"; //TODO localization
			//var content = jQuery("<div>Lorem ipsum</div>");
			var content = me.plugins['Oskari.userinterface.View'].prepareView();
			var first = false;
            var id = "WORKSPACE";
			var request = sandbox.getRequestBuilder('PersonalData.AddTabRequest')(title, content, first, id);
			sandbox.request(this, request);

            var buttonGroup = 'sharing';
            var buttons = {
                'share-facebook': {
                    iconCls: 'tool-share-facebook',
                    tooltip: 'Facebook',
                    sticky: false,
                    callback: function() {
                        me._SaveHiddenWorkspace(me.plugins['Oskari.userinterface.View'].SharingType.FACEBOOK);
                    }
                },
                'share-twitter': {
                    iconCls: 'tool-share-twitter',
                    tooltip: 'Twitter',
                    sticky: false,
                    callback: function() {
                        me._SaveHiddenWorkspace(me.plugins['Oskari.userinterface.View'].SharingType.TWITTER);
                    }
                },
                'share-link': {
                    iconCls: 'tool-share-link',
                    tooltip: 'Jaa linkki',
                    sticky: false,
                    callback: function() {
                        me._SaveHiddenWorkspace(me.plugins['Oskari.userinterface.View'].SharingType.LINK);
                    }
                },
            };

            if(sandbox.getUser().isLoggedIn()) {
                var reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
                for (var tool in buttons) {
                    sandbox.request(this, reqBuilder(tool, buttonGroup, buttons[tool]));
                }
            }
			
			this._handleSharingWorkspaceLink();
			this._handleRestoreWorkspaceLink();
        },
		
		/**
         * @method _handleSharingWorkspaceLink
         * Handling the link for sharing the workspace with the user
         */
		_handleSharingWorkspaceLink: function() {
			var me = this;
			var user = this.sandbox.getUser();
			if (user.isLoggedIn()) {
				
				//Get the parameters from URL
				var permissionId = me._getParameterValueFromUrl('workspace_sharing_id');
				var email = me._getParameterValueFromUrl('email');
				var token = me._getParameterValueFromUrl('token');
				
				if (permissionId == null || email == null || token == null) {
					//If parameters are not available in URL, try reading them from Cookies
					permissionId = me._getParameterValueFromCookie('sharingWorkspacePermissionId');
					email = me._getParameterValueFromCookie('sharingWorkspaceEmail');
					token = me._getParameterValueFromCookie('sharingWorkspaceToken');
					
					//Remove the params from cookies
					document.cookie = "sharingWorkspacePermissionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC"; 
					document.cookie = "sharingWorkspaceEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
					document.cookie = "sharingWorkspaceToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
				}
				
				if (permissionId && email && token) {
				    var link = me.sandbox.getAjaxUrl() + "action_route=ShareResource&permissionId=" + permissionId + "&token=" + token;
					this._sendRequest(link, function(resp) {
						//refreshing workspaces view
						var view = me.plugins['Oskari.userinterface.View'];
						view.refreshList();
						
						var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
						dialog.show(me.getLocalization('newWorkspace'), me.getLocalization('sharedWorkspace'));
						dialog.fadeout();
					}, function (jqXHR, textStatus) {
					    var key = textStatus;
					    try {
					         var jsonObject = jQuery.parseJSON(jqXHR.responseText);
					         if (jsonObject.hasOwnProperty('error'))
					            key = jsonObject['error'];
					    }
					    catch (e) { }
					        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
					        dialog.show(me.getLocalization('error'), key);
					        dialog.fadeout();
					    }
                    );
				}

			} else {
				//Get the parameters from URL
				var permissionId = me._getParameterValueFromUrl('workspace_sharing_id');
				var email = me._getParameterValueFromUrl('email');
				var token = me._getParameterValueFromUrl('token');
				if (permissionId && email && token) {
					//Save the parameters to cookies to remember them after log in
					me._setParameterValueInCookie('sharingWorkspacePermissionId', permissionId, 1);
					me._setParameterValueInCookie('sharingWorkspaceEmail', email, 1);
					me._setParameterValueInCookie('sharingWorkspaceToken', token, 1);
				}
			}
		},
		/**
         * @method _handleRestoreWorkspaceLink
         * Handling the link for restoring the workspace
         */
		_handleRestoreWorkspaceLink: function() {
			var me = this;
			var action = me._getParameterValueFromUrl("action");
			var workspaceId = me._getParameterValueFromUrl("workspaceId");
			var type = me._getParameterValueFromUrl("type");
			if (type !== 'own') {
			    type = 'hidden;'
			}
			if (action == "restoreWorkspace" && workspaceId != null)
			{
				var user = this.sandbox.getUser();
				if (user.isLoggedIn()) {
					$.ajax({
						url: me.getSandbox().getAjaxUrl() + 'action_route=GetWorkspaces&type='+type+'&workspaceId='+workspaceId,
						success: function(data)
						{
							$.each(data.workspaces, function(key, value){
								if (value.id == workspaceId)
								{
									me.plugins['Oskari.userinterface.View']._restoreWorkspace(value.workspace);
									return false;
								}
							});
						}
					});
				}
			}
		},
		_getParameterValueFromUrl: function (paramName) {
			paramName = paramName.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
			var regexS = "[\\?&]" + paramName + "=([^&#]*)";
			var regex = new RegExp(regexS);
			var results = regex.exec(window.location.href);
			
			if (results != null) {
				return results[1];
			}
			return null;
		},
		
		_getParameterValueFromCookie: function (paramName) {		
			var name = paramName + "=";
			var ca = document.cookie.split(';');
			for(var i=0; i<ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') {
					c = c.substring(1);
				}
				
				if (c.indexOf(name) != -1) {
					return c.substring(name.length,c.length);
				}
			}
			return null;
		},
		
		_setParameterValueInCookie: function (paramName, paramValue, days) {
			var d = new Date();
			d.setTime(d.getTime() + (days*24*60*60*1000));
			var expires = "expires="+d.toUTCString();
			document.cookie = paramName + "=" + paramValue + "; " + expires;
		},
		
		_sendRequest: function(url, successCb, errorCb) {			
			jQuery.ajax({
				type: "GET",
				//dataType: 'json',
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
			'StatsGrid.CurrentStateEvent': function (event) {
				var me = this;
				me._selectedStats = new Object();
				me._selectedStats.state = event.getState();

				if (event.getRequestFrom() == "SaveHiddenWorkspace")
				{
					me.plugins['Oskari.userinterface.View']._SaveHiddenWorkspace(event.getSharingType());
				}
			},
			'liiteri-servicepackages.ServicePackageSelectedEvent': function (event) {
				this._selectedServicePackage = event.getServicePackageId();
			},
			'userinterface.ExtensionUpdatedEvent': function (event) {
                var me = this,
                    view = me.plugins['Oskari.userinterface.View'];
                
                if (event.getExtension().getName() !== me.getName()) {
                    // not me -> do nothing
                    return;
                }

                var isShown = event.getViewState() !== "close";
                view.showMode(isShown, true);
            },
            /**
             * @method MapLayerEvent
             * @param {Oskari.mapframework.event.common.MapLayerEvent} event
             */
            MapLayerEvent: function (event) {
            	var me = this;
				if ((['stop', 'add'].indexOf(event.getOperation()) >= 0)&&(me.pendingStatState != null)) {
                    var layer = me.sandbox.findMapLayerFromAllAvailable(me.pendingStatState.layerId);
                    if (layer != null) {
                    	me._sendOskariRequest('StatsGrid.SetStateRequest', [me.pendingStatState]);
    				    me._sendOskariRequest('StatsGrid.StatsGridRequest', [true, layer]);
    				    me.pendingStatState = null;
                    }
				}
            }
        },
        _sendOskariRequest: function(name, params) {
            var reqBuilder = this.sandbox.getRequestBuilder(name);
            if (reqBuilder) {
                var request = reqBuilder.apply(this.sandbox, params);
                this.sandbox.request(this, request);
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
        },
        _SaveHiddenWorkspace: function(sharingType) {
        	var me = this;

    		me.setSelectedStats();
    		me.sandbox.postRequestByName('StatsGrid.CurrentStateRequest', ["SaveHiddenWorkspace", sharingType]);
        }
    }, {
        protocol: ['Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module',
            'Oskari.userinterface.Extension'
        ]
    });