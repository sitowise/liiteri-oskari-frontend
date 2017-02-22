Oskari.clazz.define("Oskari.liiteri.bundle.liiteri-servicepackages.LiiteriServicePackagesInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.defaults = {
            "name": "liiteri-servicepackages",
            "sandbox": "sandbox",
            "stateful": false,
            "tileClazz": "Oskari.liiteri.bundle.liiteri-servicepackages.Tile", 
            "flyoutClazz": "Oskari.liiteri.bundle.liiteri-servicepackages.Flyout",
            "isFullScreenExtension": false,
			"autoLoad": null
        };
        this.state = {};
        this.service = null;
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'liiteri-servicepackages',

        /**
         * @method getName
         * Module protocol method
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method start
         * BundleInstance protocol method
         */
        start: function () {
            var me = this;
            // Should this not come as a param?
            var conf = $.extend(this.conf, this.defaults),
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);
			this.defaults.autoLoad = this._getParameterValueFromUrl('service_package');
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
            
            this.service = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-servicepackages.service.ServicePackageService', this);

			var setServicePackageRequestHandler = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-servicepackages.request.SetServicePackageRequestHandler', this);
            sandbox.addRequestHandler('liiteri-servicepackages.SetServicePackageRequest', setServicePackageRequestHandler);
			
            //Let's extend UI with Flyout and Tile
            var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
            sandbox.request(this, request);

			this._handleSharingGroupingLink();
        },
		
		/**
         * @method _handleSharingGroupingLink
         * Handling the link for sharing the grouping with the user
         */
		_handleSharingGroupingLink: function() {
			var me = this;
			var user = this.sandbox.getUser();
			if (user.isLoggedIn()) {
				
				//Get the parameters from URL
				var permissionId = me._getParameterValueFromUrl('permission_id');
				var email = me._getParameterValueFromUrl('email');
				var token = me._getParameterValueFromUrl('token');
				
				if (permissionId == null || email == null || token == null) {
					//If parameters are not available in URL, try reading them from Cookies
					permissionId = me._getParameterValueFromCookie('sharingGroupingsPermissionId');
					email = me._getParameterValueFromCookie('sharingGroupingsEmail');
					token = me._getParameterValueFromCookie('sharingGroupingsToken');
					
					//Remove the params from cookies
					document.cookie = "sharingGroupingsPermissionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC"; 
					document.cookie = "sharingGroupingsEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
					document.cookie = "sharingGroupingsToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
				}
				
				if (permissionId && email && token) {
				    var link = me.sandbox.getAjaxUrl() + "action_route=ShareResource&permissionId=" + permissionId + "&token=" + token;
					this._sendRequest(link, function(resp) {
						var eventBuilder = me.sandbox.getEventBuilder('liiteri-groupings.GroupingUpdatedEvent');
						var event = eventBuilder('package');
						me.sandbox.notifyAll(event);
						
						eventBuilder = me.sandbox.getEventBuilder('liiteri-groupings.GroupingUpdatedEvent');
						event = eventBuilder('theme');
						me.sandbox.notifyAll(event);
						
						var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
						//dialog.show('Uusi ryhmittely', 'Sinulla on oikeus uusia ryhmittelyä!'); //TODO localization
						dialog.show('Uusi ryhmittely', resp); //TODO localization
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
					});
				}

			} else {
				//Get the parameters from URL
				var permissionId = me._getParameterValueFromUrl('permission_id');
				var email = me._getParameterValueFromUrl('email');
				var token = me._getParameterValueFromUrl('token');
				if (permissionId && email && token) {
					//Save the parameters to cookies to remember them after log in
					me._setParameterValueInCookie('sharingGroupingsPermissionId', permissionId, 1);
					me._setParameterValueInCookie('sharingGroupingsEmail', email, 1);
					me._setParameterValueInCookie('sharingGroupingsToken', token, 1);
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
         * @static
         * @property eventHandlers
         * Best practices: defining which
         * events bundle is listening and how bundle reacts to them
         */
        eventHandlers: {
            'liiteri-groupings.GroupingUpdatedEvent': function (event) {
                var me = this;
                me.getFlyout().refreshServicePackagesList();
            },
            'userinterface.ExtensionUpdatedEvent': function(event) {
                var me = this;
                if (event.getExtension().getName() !== me.getName()) {
                    return;
                }
                me.getFlyout().createUI();
            }
        },
		setServicePackage: function (id, restoreState) {
		    var me = this;
		    me.getFlyout().setServicePackage(id, restoreState);
		},
        closeView: function() {
            var request = this.sandbox.getRequestBuilder('userinterface.UpdateExtensionRequest')(this, 'close');
            this.sandbox.request(this, request);
        }
    }, {
        "extend": ["Oskari.userinterface.extension.DefaultExtension"]
    });