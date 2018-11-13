/**
 *
 * @class Oskari.liiteri.bundle.liiteri-usergisdata.LiiteriUserGisDataBundleInstance
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-usergisdata.LiiteriUserGisDataBundleInstance',
/**
 * @method create called automatically on construction
 * @static
 */
function () {
	this.sandbox = null;
	this.userGisDataTab = null;
    this.myLayersTabId = 'MY_LAYERS';
	this.sharedLayersTabId = 'SHARED_LAYERS';
	this.populateUserGisDataTimeout = null;
}, {
    /**
     * @static
     * @property __name
     */
    __name : 'liiteri-usergisdata',
    /**
     * Module protocol method
     *
     * @method getName
     */
    getName : function () {
        return this.__name;
    },
	/**
	 * @method getLocalization
	 * Returns JSON presentation of bundles localization data for current language.
	 * If key-parameter is not given, returns the whole localization data.
	 *
	 * @param {String} key (optional) if given, returns the value for key
	 * @return {String/Object} returns single localization string or
	 *     JSON object for complete data depending on localization
	 *     structure and if parameter key is given
	 */
	getLocalization: function (key) {
		//"use strict";
		if (!this._localization) {
			this._localization = Oskari.getLocalization(this.getName());
		}
		if (key) {
			return this._localization[key];
		}
		return this._localization;
	},

	/**
	 * @method getSandbox
	 * @return {Oskari.mapframework.sandbox.Sandbox}
	 */
	getSandbox: function () {
		//"use strict";
		return this.sandbox;
	},

    eventHandlers: {
		//TODO Add checking if GIS layers or my places comes. Do not refresh after every change in the map!
		'MapLayerEvent': function (event) {
			//Analysis and Imported my places
			this.populateUserGisData();
		},
		//TODO Add checking if GIS layers or my places comes. Do not refresh after every change in the map!
		'MyPlaces.MyPlacesChangedEvent': function (event) {
			//My places
			this.populateUserGisData();
		},
		'UserLayers.LayersModified': function (event) {
		    this.populateUserGisData();
		}
    },
    /**
     * DefaultExtension method for doing stuff after the bundle has started.
     *
     * @method start
     */
    start: function () {
		var me = this,
			conf = me.conf,
			sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
			sandbox = Oskari.getSandbox(sandboxName),
			loc = me.getLocalization(),
			request,
			dropdownTabs = [],
			myLayersTabPanel,
			sharedLayersTabPanel;

		me.sandbox = sandbox;
		/* Register to sandbox in order to be able to listen to events */
		sandbox.register(me);

		//register event handlers
		for (p in me.eventHandlers) {
			if (me.eventHandlers.hasOwnProperty(p)) {
				sandbox.registerForEventByName(me, p);
			}
		}

		//Adding User GIS data tab to Layer Selector
		myLayersTabPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
		myLayersTabPanel.setId(me.myLayersTabId);
		myLayersTabPanel.setTitle(loc.tabs.myLayers);
		dropdownTabs.push(myLayersTabPanel);

		sharedLayersTabPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
		sharedLayersTabPanel.setId(me.sharedLayersTabId);
		sharedLayersTabPanel.setTitle(loc.tabs.sharedLayers);
		dropdownTabs.push(sharedLayersTabPanel);

		me.userGisDataTab = Oskari.clazz.create("Oskari.liiteri.bundle.liiteri-usergisdata.view.OwnLayersTab", me, loc.myLayersTab, dropdownTabs);

		//Is this used?
		//me.populateUserGisData();

        request = me.sandbox.getRequestBuilder('hierarchical-layerlist.AddTabRequest')(me.userGisDataTab, false);
        sandbox.request(me, request);

		this._handleSharingUserGisDataLink();
	},
	populateUserGisData: function () {
	    //delay this a bit, otherwise it will be called many times during startup
	    //TODO: for real solution fix event handlers
	    if(this.populateUserGisDataTimeout) {
	        window.clearTimeout(this.populateUserGisDataTimeout);
	    }
	    this.populateUserGisDataTimeout = window.setTimeout(this._populateUserGisData, 200, this);
	},
	_populateUserGisData: function (me) {
		var loc = me.getLocalization('view'),
			myGroupList = [],
			sharedGroupList = [],
			myPlacesService = me.sandbox.getService('Oskari.mapframework.bundle.myplaces2.service.MyPlacesService'),
			mapLayerService = me.sandbox.getService('Oskari.mapframework.service.MapLayerService');

		if (me.userGisDataTab) {
			me._getUnexpiredUserGisData('own', function(resp) {
				if (resp) {
					//My places
					var groupMyPlaces = Oskari.clazz.create("Oskari.liiteri.bundle.liiteri-usergisdata.model.LayerGroup", loc.myPlaces);

					if (myPlacesService) {
						for (var i = 0; i < resp.length; i++) {
							if (resp[i].dataType == "MY_PLACES") {
								var category = myPlacesService.findCategory(resp[i].dataId);
								if (category) {
									var layerId = 'myplaces_' + category.id;
									var layer = me.sandbox.findMapLayerFromAllAvailable(layerId);
									if (layer) {
										layer.userDataId = resp[i].id;
										layer.expirationDate = resp[i].expirationDate;
										layer.users = resp[i].users;

										groupMyPlaces.addLayer(layer);
									}
								}
							}
						}
					}
					myGroupList.push(groupMyPlaces);

					//Analysis
					var groupAnalysis = Oskari.clazz.create("Oskari.liiteri.bundle.liiteri-usergisdata.model.LayerGroup", loc.analysis);

					if (mapLayerService) {
						for (var i = 0; i < resp.length; i++) {
							if (resp[i].dataType == "ANALYSIS") {
								var analysisLayer = mapLayerService.findMapLayer(resp[i].dataId);
								if (analysisLayer && (analysisLayer.shared == null || analysisLayer.shared == undefined)) {
									analysisLayer.userDataId = resp[i].id;
									analysisLayer.expirationDate = resp[i].expirationDate;
									analysisLayer.users = resp[i].users;

									groupAnalysis.addLayer(analysisLayer);
								}
							}
						}
					}
					myGroupList.push(groupAnalysis);

					//Imported my places
					var groupImported = Oskari.clazz.create("Oskari.liiteri.bundle.liiteri-usergisdata.model.LayerGroup", loc.importedData);
					if (mapLayerService) {
						for (var i = 0; i < resp.length; i++) {
							if (resp[i].dataType == "IMPORTED_PLACES") {
								var importedLayer = mapLayerService.findMapLayer(resp[i].dataId);
								if (importedLayer && (importedLayer.shared == null || importedLayer.shared == undefined)) {
									importedLayer.userDataId = resp[i].id;
									importedLayer.expirationDate = resp[i].expirationDate;
									importedLayer.users = resp[i].users;

									groupImported.addLayer(importedLayer);
								}
							}
                        }

                        //var layerId = "userlayer_512";
                       // groupImported.addLayer(mapLayerService.findMapLayer(layerId)); 

					}
					myGroupList.push(groupImported);

	                //Own WMS layers
                    var groupUserLayers = Oskari.clazz.create("Oskari.liiteri.bundle.liiteri-usergisdata.model.LayerGroup", loc.userLayers);
                    if (mapLayerService) {
                        for (var i = 0; i < resp.length; i++) {
                            if (resp[i].dataType == "USERWMS") {
                                var layer = mapLayerService.findMapLayer(resp[i].dataId);
                                if (layer && (layer.shared == null || layer.shared == undefined)) {
                                    layer.userDataId = resp[i].id;
                                    layer.dataType = "USERWMS";
                                    groupUserLayers.addLayer(layer);
                                }
                            }
                        }
                    }
                    myGroupList.push(groupUserLayers);

					me.userGisDataTab.showLayerGroups(myGroupList, me.myLayersTabId);
				}
			});

			me._getUnexpiredUserGisData('shared', function(resp) {
				if (resp) {
					//Shared My places
					var sharedGroupMyPlaces = Oskari.clazz.create("Oskari.liiteri.bundle.liiteri-usergisdata.model.LayerGroup", loc.myPlaces);

					if (myPlacesService) {
						for (var i = 0; i < resp.length; i++) {
							if (resp[i].dataType == "MY_PLACES") {
								var category = myPlacesService.findCategory(resp[i].dataId);
								if (category) {
									var layerId = 'myplaces_' + category.id;
									var layer = me.sandbox.findMapLayerFromAllAvailable(layerId);
									if (layer) {
										layer.userDataId = resp[i].id;
										layer.expirationDate = resp[i].expirationDate;

										sharedGroupMyPlaces.addLayer(layer);
									}
								}
							}
						}
					}
					sharedGroupList.push(sharedGroupMyPlaces);

					//Shared Analysis
					var sharedGroupAnalysis = Oskari.clazz.create("Oskari.liiteri.bundle.liiteri-usergisdata.model.LayerGroup", loc.analysis);
					if (mapLayerService) {
						for (var i = 0; i < resp.length; i++) {
							if (resp[i].dataType == "ANALYSIS") {
								var analysisLayer = mapLayerService.findMapLayer(resp[i].dataId);
								if (analysisLayer && analysisLayer.shared) {
									analysisLayer.userDataId = resp[i].id;
									analysisLayer.expirationDate = resp[i].expirationDate;

									sharedGroupAnalysis.addLayer(analysisLayer);
								}
							}
						}
					}
					sharedGroupList.push(sharedGroupAnalysis);

					//Shared Imported my places
					var sharedGroupImported = Oskari.clazz.create("Oskari.liiteri.bundle.liiteri-usergisdata.model.LayerGroup", loc.importedData);
					if (mapLayerService) {
						for (var i = 0; i < resp.length; i++) {
							if (resp[i].dataType == "IMPORTED_PLACES") {
								var importedLayer = mapLayerService.findMapLayer(resp[i].dataId);
								if (importedLayer && importedLayer.shared) {
									importedLayer.userDataId = resp[i].id;
									importedLayer.expirationDate = resp[i].expirationDate;

									sharedGroupImported.addLayer(importedLayer);
								}
							}
						}
					}
					sharedGroupList.push(sharedGroupImported);

					me.userGisDataTab.showLayerGroups(sharedGroupList, me.sharedLayersTabId);
				}
			});
		}
	},
	_getUnexpiredUserGisData: function (contentType, successCallback, errorCallback) {
		var me = this,
			url = me.getSandbox().getAjaxUrl() + 'action_route=GetGisData&type=' + contentType + '&iefix=' + (new Date()).getTime();

		jQuery.ajax({
			type: 'POST',
			dataType: 'json',
			url: url,
			beforeSend: function (x) {
				if (x && x.overrideMimeType) {
					x.overrideMimeType("application/j-son;charset=UTF-8");
				}
			},
			success: successCallback,
			error: errorCallback,
			cache: false
		});
	},
	_handleSharingUserGisDataLink: function() {
		var me = this;
		var user = this.sandbox.getUser();
		if (user.isLoggedIn()) {

			//Get the parameters from URL
			var permissionId = me._getParameterValueFromUrl('user_gis_data_sharing_id');
			var email = me._getParameterValueFromUrl('email');
			var token = me._getParameterValueFromUrl('token');

			if (permissionId == null || email == null || token == null) {
				//If parameters are not available in URL, try reading them from Cookies
				permissionId = me._getParameterValueFromCookie('sharingUserGisDataPermissionId');
				email = me._getParameterValueFromCookie('sharingUserGisDataEmail');
				token = me._getParameterValueFromCookie('sharingUserGisDataToken');

				//Remove the params from cookies
				document.cookie = "sharingUserGisDataPermissionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
				document.cookie = "sharingUserGisDataEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
				document.cookie = "sharingUserGisDataToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
			}

			if (permissionId && email && token) {
			    var link = me.sandbox.getAjaxUrl() + "action_route=ShareResource&permissionId=" + permissionId + "&token=" + token;
				this._sendRequest(link, function(resp) {
					var myPlacesService = me.sandbox.getService('Oskari.mapframework.bundle.myplaces2.service.MyPlacesService'),
					analysisService = me.sandbox.getService('Oskari.analysis.bundle.analyse.service.AnalyseService'),
					myPlacesImportService = me.sandbox.getService('Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService');
					//refreshing 'My Places'
					if (myPlacesService) {
						myPlacesService.init();
					}
					//refreshing Analysis
					if (analysisService) {
						analysisService.loadAnalyseLayers();
					}
					//refreshing Uploaded Objects
					if (myPlacesImportService) {
						myPlacesImportService.getUserLayers();
					}

					var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
					dialog.show(me.getLocalization('view').notification.newLayer, resp);
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
			var permissionId = me._getParameterValueFromUrl('user_gis_data_sharing_id');
			var email = me._getParameterValueFromUrl('email');
			var token = me._getParameterValueFromUrl('token');
			if (permissionId && email) {
				//Save the parameters to cookies to remember them after log in
				me._setParameterValueInCookie('sharingUserGisDataPermissionId', permissionId, 1);
				me._setParameterValueInCookie('sharingUserGisDataEmail', email, 1);
				me._setParameterValueInCookie('sharingUserGisDataToken', token, 1);
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
	}
}, {
    "extend" : ["Oskari.userinterface.extension.DefaultExtension"]
});