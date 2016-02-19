/**
 * @class Oskari.mapframework.bundle.parcel.service.ParcelService
 *
 * Service object that handles transaction related function calls and delegates the
 * WFST actions to {Oskari.mapframework.bundle.parcel.service.ParcelWfst}.
 * Plot actions to {Oskari.mapframework.bundle.parcel.service.ParcelPlot}.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.service.ParcelService',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.parcel.DrawingToolInstance} instance The application instance.
 */
function(instance) {
    this._instance = instance;
    this._preParcelsList = [];
    this._preParcelDataList = [];
    this._wfst = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.service.ParcelWfst', instance);
    this._wfst2 = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.service.PreParcelWFSTStore', instance);
    this._plot = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.service.ParcelPlot', instance);
    this.kvp_uid = '12345'; // TODO: get that from url params or via sandbox.user
}, {
    /**
     * @return {String} Serive class name.
     */
    getQName : function() {
        return "Oskari.mapframework.bundle.parcel.service.ParcelService";
    },

    /**
     * @return {String} Serive name.
     */
    getName : function() {
        return "ParcelService";
    },

    /**
     * @method init
     * Initializes the service and loads
     */
    init : function() {
        this._wfst2.connect();
    },

    /**
     * @method loadParcel
     * Loads feature from the server asynchronously and gives the feature via callback.
     * @param {String} fid FID for the feature that should be loaded from the server.
     * @param {Function} cb Callback function. Requires the downloaded feature as a parameter or undefined if error occurred.
     */
    loadParcel : function(fid, cb) {
        this._wfst.loadParcel(fid, cb);
    },
    /**
     * @method loadRegisterUnit
     * Loads feature from the server asynchronously and gives the feature via callback.
     * @param {String} fid FID for the feature that should be loaded from the server.
     * @param {Function} cb Callback function. Requires the downloaded feature as a parameter or undefined if error occurred.
     */
    loadRegisterUnit : function(fid, cb) {
        this._wfst.loadRegisterUnit(fid, cb);
    },

    /**
     * @method printPlace
     * Plot preparcel features via plot server asynchronously and gives the success information via callback.
     * @param {OpenLayers.Feature.Vector} feature The feature whose data will be saved to the server by using WFST.
     * @param {String} featureType Featuretype that is used for WFST.
     * @param {String} placeName Name of the place.
     * @param {String} placeDescription Description of the place.
     * @param {Fuction} cb Requires information about the success as boolean parameter.
     */
    printPlace : function(feature, featureType, values, cb) {
        if (feature && featureType) {
            if (featureType === this._instance.conf.parcelFeatureType) {
                this._plotParcel(feature, values, cb);

            } else if (featureType === this._instance.conf.registerUnitFeatureType) {
                this._plotParcel(feature, values, cb);

            } else {
                cb();
            }

        } else {
            cb();
        }
    },
        /**
         * @method _plotParcel
         * Plot preparcel features via plot server asynchronously and gives the success information via callback.
         * @param {OpenLayers.Feature.Vector} feature The feature whose data will be saved to the server by using WFST.
         * @param {String} placeName Name of the place.
         * @param {String} placeDescription Description of the place.
         * @param {Fuction} cb Requires information about the success as boolean parameter.
         */
        _plotParcel: function (feature, values, cb) {
            if (feature) {
                this._plot.plotParcel(feature, values, cb);
            }
        },
        /**
         * @method plotParcelWithoutPrint
         * Plot preparcel features via plot server asynchronously and gives the success information via callback.
         * @param {OpenLayers.Feature.Vector} preparcel feature .
         * @param {String} placeName Name of the place.
         * @param {String} placeDescription Description of the place.
         * @param {Fuction} cb Requires information about the success as boolean parameter.
         */
        plotParcelWithoutPrint: function (feature, values, cb) {
            if (feature) {
                this._plot.plotParcelWithoutPrint(feature, values, cb);
            }
        },
    /**
     * @method savePlace
     * Saves preparcel features to the server asynchronously and gives the success information via callback.
     * @param {obj} drawplugin instance for wfst features
     * @param {obj/json} values feature attributes
     * @param {Fuction} cb Requires information about the success as boolean parameter.
     */
    savePlace : function(drawplugin, values, cb) {

            var me = this;
            var isNew = !(values.id);
            var feature = drawplugin.getDrawing();
            var callBackWrapper = function (success, list) {
                if (isNew && success) {
                    me.savePlaceData(drawplugin, values, list, cb);
                } else {
                    if (list.length < 1) {
                        // couldn't parse preparcel featurecollection
                        success = false;
                    }
                    else {
                        // update models updateDate in store
                        me.updatePlaceData(drawplugin, values, list, cb);
                       // cb(success, list[0], isNew);
                    }
                }

             //   cb(success, list[0], isNew);
            };

        if (feature) {
            this._wfst2.commitPreParcel(this.getPreParcelFromFormValues(values), callBackWrapper);
        }


    },
        /**
         * @method updatePlaceData
         * deletes first old geometriy features and saves new preparcel data
         * features to the server asynchronously and gives the success information via callback.
         * @param {obj} drawplugin instance for wfst features
         * @param {obj/json} values feature attributes
         * @param {Function} cb Requires information about the success as boolean parameter.
         */
        updatePlaceData: function (drawplugin, values, list, cb) {
            var me = this;
            var cbWrap = function (success) {
                if (success) {
                    me.savePlaceData(drawplugin, values, list, cb);
                } else {
                    cb(success, list[0], isNew);
                }
            };
            if(values && values.id)
            this._wfst2.deletePreParcelDataById(values.id, list, cbWrap);
        },
        /**
     * @method savePlaceData
     * Saves preparcel data features to the server asynchronously and gives the success information via callback.
     * @param {obj} drawplugin instance for wfst features
     * @param {obj/json} values feature attributes
     * @param {Function} cb Requires information about the success as boolean parameter.
     */
    savePlaceData : function(drawplugin, values, list, cb) {
        var me = this;
        var isNew = !(values.id);
        var feature = drawplugin.getDrawing();
        if (feature) {
            this._wfst2.commitPreParcelData(this.getPreParcelData(list, drawplugin), cb);
        }


    },
        getPreParcelFromFormValues : function(values) {
            var mylist = [];
            var preparcel = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.model.PreParcel');
            preparcel.setId(values.id); // insert automatic when undefined - update in other case
            preparcel.setKvp_uid(this.kvp_uid);
            preparcel.setPreparcel_id(values.name);
            preparcel.setTitle(values.title);
            preparcel.setSubtitle(values.subtitle);
            preparcel.setDescription(values.desc);
            preparcel.setParent_property_id(values.parent_property_id);
            preparcel.setParent_property_quality(values.parent_property_quality);
            preparcel.setReporter(values.reporter);
            preparcel.setArea(values.area); // values.area
            preparcel.setArea_unit('m2'); //values.area_unit
            mylist.push(preparcel);
            return mylist;
        },

        getPreParcelData : function(list, drawplugin) {
            var mylist = [];
            var features = drawplugin.getDrawingLayer().features;
            for (var i = 0; i < features.length; i++) {
                var ppoldata = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.model.PreParcelData');
                //ppdata.setId(id); insert automatic when undefined
                var gtype = 'partparcel';
                if (drawplugin.getIndexOfSelectedFeature() === i) gtype = 'selectedpartparcel';
                if(list)ppoldata.setPreparcel_id(list[0].id);
                ppoldata.setGeom_type(gtype);
                ppoldata.setUuid(this.kvp_uid);
                ppoldata.setGeometry(features[i].geometry);
                mylist.push(ppoldata);
            }

            var pnewboundary = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.model.PreParcelData');
            //pboundary.setId(id); insert automatic when undefined
            if(list)pnewboundary.setPreparcel_id(list[0].id);
            pnewboundary.setGeom_type('newboundary');
            pnewboundary.setUuid(this.kvp_uid);
            pnewboundary.setGeometry(drawplugin. getBoundaryGeometry());
            mylist.push(pnewboundary);

            return mylist;
        },
        loadPreParcelById: function (preparcelRef, cb) {
            var me = this;
            var preparcel = {};
            var callBackWrapper = function (list) {
                var me2 = me;
                if (list && list.length > 0) {
                    preparcel.preparcel = list[0];
                    // get geom features
                    var cbWrapper2 = function (list2) {
                        preparcel.data = list2;
                        cb(preparcel);
                    };
                    me2._wfst2.getPreParcelData(preparcel.preparcel.id, cbWrapper2);
                }
            };

            this._wfst2.getPreParcelById(this.kvp_uid, preparcelRef, callBackWrapper);
        },

     loadPreParcel : function(parcel_id,drawplugin, cb) {
        var me = this;
        var loadedPreParcels = false;

        var allLoaded = function () {
            // when preparcels have been loaded, notify that the data has changed
            if (loadedPreParcels) {
                // me._notifyDataChanged();
            }
        };

        var initialLoadCallBackPreParcels = function (preParcels) {
            if (preParcels) {
                me._preParcelsList = preParcels;
            }
            loadedPreParcels = true;
            allLoaded();
        };
        this._wfst2.getPreParcels(parcel_id, initialLoadCallBackPreParcels);
     },

     loadPreParcelData : function(parcel_id,drawplugin, cb) {
        var me = this;
        var loadedPreParcelData = false;

        var allLoaded = function () {
            // when preparcels have been loaded, notify that the data has changed
            if (loadedPreParcelData) {
                drawplugin.createEditor(me._preParcelDataList);
            }
        };

        var initialLoadCallBackPreParcelData = function (preParcelData) {
            if (preParcelData) {
                me._preParcelDataList = preParcelData;
            }
            loadedPreParcelData = true;
            allLoaded();
        };

        this._wfst2.getPreParcelData(parcel_id, initialLoadCallBackPreParcelData);
     },
        /**
         * @method clearParcelMap
         * Remove openlayers graphics of parcel Map
         */
        clearParcelMap: function () {
            this._plot.clearParcelMap();

        },
        /**
         * @method plotOldParcelPoints
         * Remove openlayers graphics of parcel Map
         */
        plotOldParcelPoints: function (features) {
            this._plot.plotOldParcelPoints(features);

        },
        cancelPlotParcel: function () {
            this._plot.cancelPlotParcel();

        },
    /**
     * @method saveRegisterUnit
     * Saves feature to the server asynchronously and gives the success information via callback.
     * @param {OpenLayers.Feature.Vector} feature The feature whose data will be saved to the server by using WFST.
     * @param {String} placeName Name of the place.
     * @param {String} placeDescription Description of the place.
     * @param {Fuction} cb Requires information about the success as boolean parameter.
     */
    saveRegisterUnit : function(feature, placeName, placeDescription, cb) {
        if (feature) {
           // later maybe this._wfst.saveRegisterUnit(feature, placeName, placeDescription, cb);
        }
    }
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});
