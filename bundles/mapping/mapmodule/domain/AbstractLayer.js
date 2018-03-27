/**
 * @class Oskari.mapframework.domain.AbstractLayer
 *
 * Superclass for layer objects copy pasted from wmslayer. Need to check
 * if something should be moved back to wmslayer. Nothing else currently uses this.
 */
Oskari.clazz.define(
    'Oskari.mapframework.domain.AbstractLayer',

    /**
     * @static @method create called automatically on construction
     *
     * @param {Object} params
     * @param {Object} options
     *
     */
    function (params, options) {
        var me = this;
        /* Internal id for this map layer.
        Id needs to be undefined instead of null
        otherwise jquery will send it as "null" string.
         */
        me._id = undefined;

        /* Name of this layer */
        me._name = null;

        /* Description for layer */
        me._description = null;

        /* either NORMAL_LAYER, GROUP_LAYER or BASE_LAYER */
        me._type = null;

        /* either WMS, WMTS, WFS or VECTOR */
        me._layerType = '';

        /* optional params */
        me._params = params || {};

        /* optional options */
        me._options = options || {};

        /* optional attributes */
        me._attributes = {};

        /* modules can "tag" the layers with this for easier reference */
        me._metaType = null;

        /* Max scale for layer */
        me._maxScale = null;

        /* Min scale for layer */
        me._minScale = null;

        /* is layer visible */
        me._visible = null;

        /* opacity from 0 to 100 */
        me._opacity = 100;

        /* visible layer switch off enable/disable */
        me._isSticky = null;

        /* is linked layer ('sublayer') - no UI in layer selection */
        me._isLinkedLayer = null;

        me._inspireName = null;
        me._organizationName = null;
        me._dataUrl = null;
        me._orderNumber = null;

        /*
         * Array of sublayers. Notice that only type BASE_LAYER can
         * have sublayers.
         */
        me._subLayers = [];

        /* Array of styles that this layer supports */
        me._styles = [];

        /* Currently selected style */
        me._currentStyle = null;

        /* Legend image location */
        me._legendImage = null;

        /* is it possible to ask for feature info */
        me._featureInfoEnabled = null;

        /* is this layer queryable (GetFeatureInfo) boolean */
        me._queryable = null;

        me._queryFormat = null;

        // f.ex. permissions.publish
        me._permissions = {};

        // if given, tells where the layer has content
        // array of Openlayers.Geometry[] objects if already processed from _geometryWKT
        me._geometry = [];
        // wellknown text for polygon geometry
        me._geometryWKT = null;

        // Tools array for layer specific functions
        me._tools = [];

        /* link to metadata service */
        me._metadataIdentifier = null;

        me._backendStatus = null;

        /* does this layer have Feature Data boolean */
        me._featureData = false;

        // Layers service urls
        me._layerUrls = [];
        // Layers service name
        me._layerName = null;

        me._baseLayerId = -1;

        // Realtime
        me._realtime = false;
        me._refreshRate = null;

        // WMS, WMTS or WFS version
        me._version = null;
        // Spatial reference system
        me._srs_name = null;

        // Admin params, applicable only for admin users
        me._admin = null;

        this._gfiContent = null;

        me._created = null;

        me.loading = 0;
        me.loaded = 0;
        me.tilesToLoad = 0;
        me.errors = 0;
    }, {
        /**
         * Populates name, description, inspire and organization fields with a localization JSON object
         * @method setLocalization
         * @param {Object} loc
         *          object containing localization for name/desc/inspire/organization
         * (e.g. MapLayerService)
         */
        setLocalization: function (loc) {
            var name = {},
                desc = {},
                inspire = {},
                organization = {},
                lang,
                singleLang;

            for (lang in loc) {
                if (loc.hasOwnProperty(lang)) {
                    singleLang = loc[lang];
                    if (singleLang.name) {
                        name[lang] = singleLang.name;
                    }
                    if (singleLang.subtitle) {
                        desc[lang] = singleLang.subtitle;
                    }
                    if (singleLang.inspire) {
                        inspire[lang] = singleLang.inspire;
                    }
                    if (singleLang.orgName) {
                        organization[lang] = singleLang.orgName;
                    }
                }
            }
            // set objects if we had any localizations
            for (lang in name) {
                if (name.hasOwnProperty(lang)) {
                    this.setName(name);
                    break;
                }
            }
            for (lang in desc) {
                if (desc.hasOwnProperty(lang)) {
                    this.setDescription(desc);
                    break;
                }
            }
            for (lang in inspire) {
                if (inspire.hasOwnProperty(lang)) {
                    this.setInspireName(inspire);
                    break;
                }
            }
            for (lang in organization) {
                if (organization.hasOwnProperty(lang)) {
                    this.setOrganizationName(organization);
                    break;
                }
            }
        },
        /**
         * @method setId
         * @param {String} id
         * Unique identifier for map layer used to reference the layer
         * internally. Non-string values will be coecred to a string.
         * (e.g. MapLayerService)
         */
        setId: function (id) {
            this._id = id;
        },
        /**
         * @method getId
         * @return {String}
         *          unique identifier for map layer used to reference the layer internally
         * (e.g. MapLayerService)
         */
        getId: function () {
            return this._id;
        },
        /**
         * @method setParentId
         * @param {String} id
         *          unique identifier for parent map layer used to reference the layer internally
         * (e.g. MapLayerService)
         */
        setParentId: function (id) {
            this._baseLayerId = id;
        },
        /**
         * @method getParentId
         * @return {String}
         *          unique identifier for parent map layer used to reference the layer internally
         * (e.g. MapLayerService)
         */
        getParentId: function () {
            if (!this._baseLayerId) {
                return -1;
            }
            return this._baseLayerId;
        },
        /**
         * @method setQueryFormat
         * @param {String} queryFormat
         *          f.ex. 'text/html'
         */
        setQueryFormat: function (queryFormat) {
            this._queryFormat = queryFormat;
        },
        /**
         * @method getQueryFormat
         * f.ex. 'text/html'
         * @return {String}
         */
        getQueryFormat: function () {
            return this._queryFormat;
        },
        /**
         * @method setName
         * @param {String/Object} name
         *          name for the maplayer that is shown in UI
         */
        setName: function (name) {
            if (name && typeof name === 'object') {
                var values = {};
                Object.keys(name).forEach(function(key) {
                    values[key] = Oskari.util.sanitize(name[key]);
                });
                this._name = values;
            } else {
                this._name = Oskari.util.sanitize(name);
            }
        },
        /**
         * Returns a name for the layer.
         * If the name is populated with a string, always returns it.
         * With populated object assumes that the object keys are language codes.
         * If language param is not given, uses Oskari.getLang()
         * @method getName
         * @param {String} lang language id like 'en' or 'fi' (optional)
         * @return {String} maplayer UI name
         */
        getName: function (lang) {
            if (this._name && typeof this._name === 'object') {
                if (!lang) {
                    lang = Oskari.getLang();
                }
                var value = this._name[lang];
                if(!value) {
                    value = this._name[Oskari.getDefaultLanguage()];
                }
                return value;
            }
            return this._name;
        },
        /**
         * @method setType
         * @param {String} type
         *          layer type (e.g. NORMAL, BASE, GROUP)
         *
         * Not as type WMS or Vector but base or normal layer.
         * See #setAsBaseLayer(), #setAsGroupLayer() and #setAsNormalLayer()
         */
        setType: function (type) {
            this._type = type;
        },
        /**
         * @method getType
         * @return {String} maplayer type (BASE/NORMAL)
         */
        getType: function () {
            return this._type;
        },
        /**
         * @method setDataUrl
         * @param {String} param
         *          URL string used to show more info about the layer
         */
        setDataUrl: function (param) {
            this._dataUrl = param;
        },
        /**
         * @method getDataUrl
         * @return {String} URL string used to show more info about the layer
         */
        getDataUrl: function () {
            return this._dataUrl;
        },
        /**
         * @method setOrganizationName
         * @param {String/Object} param
         *          organization name under which the layer is listed in UI
         */
        setOrganizationName: function (param) {
            if (param && typeof param === 'object') {
                var values = {};
                Object.keys(param).forEach(function(key) {
                    values[key] = Oskari.util.sanitize(param[key]);
                });
                this._organizationName = values;
            } else {
                this._organizationName = Oskari.util.sanitize(param);
            }
        },
        /**
         * Returns a organization name for the layer.
         * If the name is populated with a string, always returns it.
         * With populated object assumes that the object keys are language codes.
         * If language param is not given, uses Oskari.getLang()
         * @method getOrganizationName
         * @param {String} lang language id like 'en' or 'fi' (optional)
         * @return {String} organization name under which the layer is listed in UI
         */
        getOrganizationName: function (lang) {
            if (this._organizationName && typeof this._organizationName === 'object') {
                if (!lang) {
                    lang = Oskari.getLang();
                }
                var value = this._organizationName[lang];
                if(!value) {
                    value = this._organizationName[Oskari.getDefaultLanguage()];
                }
                return value;
            }
            return this._organizationName;
        },
        /**
         * @method setInspireName
         * @param {String} param
         *          inspire theme name under which the layer is listed in UI
         */
        setInspireName: function (param) {
            if (param && typeof param === 'object') {
                var values = {};
                Object.keys(param).forEach(function(key) {
                    values[key] = Oskari.util.sanitize(param[key]);
                });
                this._inspireName = values;
            } else {
                this._inspireName = Oskari.util.sanitize(param);
            }
        },
        /**
         * Returns an inspire name for the layer.
         * If the name is populated with a string, always returns it.
         * With populated object assumes that the object keys are language codes.
         * If language param is not given, uses Oskari.getLang()
         * @method getInspireName
         * @param {String} lang language id like 'en' or 'fi' (optional)
         * @return {String} inspire theme name under which the layer is listed in UI
         */
        getInspireName: function (lang) {
            if (this._inspireName && typeof this._inspireName === 'object') {
                if (!lang) {
                    lang = Oskari.getLang();
                }
                var value = this._inspireName[lang];
                if(!value) {
                    value = this._inspireName[Oskari.getDefaultLanguage()];
                }
                return value;
            }
            return this._inspireName;
        },
        /**
         * @method setFeatureInfoEnabled
         * @return {Boolean} featureInfoEnabled true to enable feature info functionality
         */
        setFeatureInfoEnabled: function (featureInfoEnabled) {
            this._featureInfoEnabled = featureInfoEnabled;
        },
        /**
         * @method isFeatureInfoEnabled
         * @return {Boolean} true if feature info functionality should be enabled
         */
        isFeatureInfoEnabled: function () {
            if (this._featureInfoEnabled === true) {
                return true;
            }
            return false;
        },
        /**
         * @method setDescription
         * @param {String} description
         *          map layer description text
         */
        setDescription: function (description) {
            this._description = description;
        },
        /**
         * Returns a description for the layer.
         * If the description is populated with a string, always returns it.
         * With populated object assumes that the object keys are language codes.
         * If language param is not given, uses Oskari.getLang()
         * @method getDescription
         * @param {String} lang language id like 'en' or 'fi' (optional)
         * @return {String} map layer description text
         */
        getDescription: function (lang) {
            if (this._description && typeof this._description === 'object') {
                if (!lang) {
                    lang = Oskari.getLang();
                }
                var value = this._description[lang];
                if(!value) {
                    value = this._description[Oskari.getDefaultLanguage()];
                }
                return Oskari.util.sanitize(value);
            }
            return Oskari.util.sanitize(this._description);
        },
        /**
         * Called when openlayers 2/3 starts loading tiles
         * @method loadingStarted
         * @param {Number} {optional} remaining
         * @return {Number} number of currently loading items
         */
        loadingStarted: function(remaining) {

          if(typeof remaining === 'undefined'){
            this.loading +=1;
          } else {
            this.loading = remaining;
          }
          this.tilesToLoad = this.loading;

          return this.loading === 1;
        },
        /**
         * Called when openlayers 2/3 tileloadend event fires
         * @method loadingDone
         * @param {Number} {optional} remaining
         * @return {Number} number of not yet loaded
         */
        loadingDone: function(remaining) {

          if(typeof remaining === 'undefined'){
            this.loading -=1;
          } else {
            this.loading = remaining;
          }
          this.loaded += 1;
          return this.loading === 0;
        },
        /**
         * Called when openlayers 2/3 tileloaderror event fires
         * @method loadingError
         * Increments the amount of errors for the layers
         */
        loadingError: function(errors) {

          if(typeof errors === 'undefined'){
            this.errors += 1;
          } else {
            this.errors = errors;
          }
          return this.errors;
        },
        /**
         * Check if all the tiles/features have been loaded
         * @method checkIfAllLoaded
         * @return {boolean} true if this.loading === 0, else false
         */
        getLoadingState: function() {
          var state = {
            'loading': this.loading,
            'loaded': this.loaded,
            'errors': this.errors
          };
          return state;
        },
        resetLoadingState: function(){
          this.loaded = 0;
          this.errors = 0;
          this.tilesToLoad = 0;
        },
        /**
         * @method addSubLayer
         * @param {Oskari.mapframework.domain.WmsLayer} map layer
         *          actual sub map layer that is used for a given scale range (only for
         * base & group layers)
         *
         * If layer has sublayers, it is basically a "metalayer" for maplayer ui
         * purposes and actual map images to show are done with sublayers
         */
        addSubLayer: function (layer) {
            var sublayers = this.getSubLayers(),
                i,
                len;

            for (i = 0, len = sublayers.length; i < len; i += 1) {
                if (sublayers[i].getId() === layer.getId()) {
                    // already added, don't add again
                    return false;
                }
            }
            sublayers.push(layer);
            return true;
        },
        /**
         * @method getSubLayers
         * @return {Oskari.mapframework.domain.WmsLayer[]} array of sub map layers
         *
         * If layer has sublayers, it is basically a "metalayer" for maplayer ui
         * purposes and actual map images to show are done with sublayers
         */
        getSubLayers: function () {
            return this._subLayers;
        },
        /**
         * @method setMaxScale
         * @param {Number} maxScale
         *          largest scale when the layer is shown (otherwise not shown in map and
         * "greyed out"/disabled in ui)
         */
        setMaxScale: function (maxScale) {
            this._maxScale = maxScale;
        },
        /**
         * @method getMaxScale
         * @return {Number}
         *          largest scale when the layer is shown (otherwise not shown in map and
         * "greyed out"/disabled in ui)
         */
        getMaxScale: function () {
            return this._maxScale;
        },
        /**
         * @method setMinScale
         * @param {Number} minScale
         *          smallest scale when the layer is shown (otherwise not shown in map and
         * "greyed out"/disabled in ui)
         */
        setMinScale: function (minScale) {
            this._minScale = minScale;
        },
        /**
         * @method getMinScale
         * @return {Number}
         *          smallest scale when the layer is shown (otherwise not shown in map and
         * "greyed out"/disabled in ui)
         */
        getMinScale: function () {
            return this._minScale;
        },
        /**
         * @method setOrderNumber
         * @param {Number} orderNumber
         */
        setOrderNumber: function (orderNumber) {
            this._orderNumber = orderNumber;
        },
        /**
         * @method getOrderNumber
         * @return {Number} orderNumber
         */
        getOrderNumber: function () {
            return this._orderNumber;
        },
        /**
         * @method isVisible
         * @return {Boolean} true if this is should be shown
         */
        isVisible: function () {
            return this._visible === true;
        },
        /**
         * @method setVisible
         * @param {Boolean} visible true if this is should be shown
         */
        setVisible: function (visible) {
            this._visible = visible;
        },
        /**
         * @method setOpacity
         * @param {Number} opacity
         *          0-100 in percents
         */
        setOpacity: function (opacity) {
            this._opacity = opacity;
        },
        /**
         * @method getOpacity
         * @return {Number} opacity
         *          0-100 in percents
         */
        getOpacity: function () {
            if (this._opacity === null || this._opacity === undefined) {
                return 100;
            }
            return this._opacity;
        },
        /**
         * @method setGeometryWKT
         * Set geometry as wellknown text
         * @param {String} value
         *          WKT geometry
         */
        setGeometryWKT: function (value) {
            this._geometryWKT = value;
        },
        /**
         * @method getGeometryWKT
         * Get geometry as wellknown text
         * @return {String} WKT geometry
         */
        getGeometryWKT: function () {
            return this._geometryWKT;
        },
        /**
         * @method setGeometry
         * @param {OpenLayers.Geometry.Geometry[]} value
         *          array of WKT geometries or actual OpenLayer geometries
         */
        setGeometry: function (value) {
            this._geometry = value;
        },
        /**
         * @method getGeometry
         * @return {OpenLayers.Geometry.Geometry[]}
         *          array of WKT geometries or actual OpenLayer geometries
         */
        getGeometry: function () {
            return this._geometry;
        },
        /**
         * @method addPermission
         * @param {String} action
         *          action key that we want to add permission setting for
         * @param {String} permission
         *          actual permission setting for action
         */
        addPermission: function (action, permission) {
            this._permissions[action] = permission;
        },
        /**
         * @method removePermission
         * @param {String} action
         *          action key from which permission setting should be removed
         */
        removePermission: function (action) {
            this._permissions[action] = null;
            delete this._permissions[action];
        },
        /**
         * @method getPermission
         * @param {String} action
         *          action key for which permission we want
         * @return {String} permission setting for given action
         */
        getPermission: function (action) {
            return this._permissions[action];
        },
        /**
         * @method getMetadataIdentifier
         * Gets the identifier (uuid style) for getting layers metadata
         * @return {String}
         */
        getMetadataIdentifier: function () {
            return this._metadataIdentifier;
        },
        /**
         * @method setMetadataIdentifier
         * Sets the identifier (uuid style) for getting layers metadata
         * @param {String} metadataid
         */
        setMetadataIdentifier: function (metadataid) {
            this._metadataIdentifier = metadataid;
        },
        /**
         * @method getBackendStatus
         * Status text for layer operatibility (f.ex. 'DOWN')
         * @return {String}
         */
        getBackendStatus: function () {
            return this._backendStatus;
        },
        /**
         * @method setBackendStatus
         * Status text for layer operatibility (f.ex. 'DOWN')
         * @param {String} backendStatus
         */
        setBackendStatus: function (backendStatus) {
            this._backendStatus = backendStatus;
        },
        /**
         * @method setMetaType
         * @param {String} type used to group layers by f.ex. functionality.
         * Layers can be fetched based on metatype f.ex. 'myplaces'
         */
        setMetaType: function (type) {
            this._metaType = type;
        },
        /**
         * @method getMetaType
         * @return {String} type used to group layers by f.ex. functionality.
         * Layers can be fetched based on metatype f.ex. 'myplaces'
         */
        getMetaType: function () {
            return this._metaType;
        },
        /**
         * @method addStyle
         * @param {Oskari.mapframework.domain.Style} style
         * adds style to layer
         */
        addStyle: function (style) {
            if (!style || !style.getName || typeof style.getName !== 'function') {
                // invalid style
                return;
            }
            var foundExisting = false,
                i,
                curStyle;

            for (i = 0; i < this.getStyles().length; i += 1) {
                curStyle = this.getStyles()[i];
                if (curStyle.getName() === style.getName()) {
                    foundExisting = true;
                    break;
                }
            }
            if (!foundExisting) {
                // only add if one with same name isn't added yet
                this.getStyles().push(style);
            }
        },
        /**
         * @method getStyles
         * @return {Oskari.mapframework.domain.Style[]}
         * Gets layer styles
         */
        getStyles: function () {
            if (!this._styles) {
                this._styles = [];
            }
            return this._styles;
        },
        /**
         * @method selectStyle
         * @param {String} styleName
         * Selects a #Oskari.mapframework.domain.Style with given name as #getCurrentStyle.
         * If style is not found, assigns an empty #Oskari.mapframework.domain.Style to #getCurrentStyle
         */
        selectStyle: function (styleName) {
            var me = this,
                i,
                style;

            for (i = 0; i < me.getStyles().length; i += 1) {
                style = me.getStyles()[i];
                if (style.getName() === styleName) {
                    me._currentStyle = style;
                    return;
                }
            }
            // if layer has only one style - always use it
            if(me.getStyles().length === 1) {
                this._currentStyle = me.getStyles()[0];
                return;
            }

            // didn't match anything select the first one
            if (!me._currentStyle) {
                // Style not found, use an empty one!
                this._currentStyle = this._createEmptyStyle();
            }
        },
        /**
         * Creates an empty style
         * @private
         * @return {Oskari.mapframework.domain.Style} empty style
         */
        _createEmptyStyle: function () {
            var style = Oskari.clazz.create('Oskari.mapframework.domain.Style');

            style.setName('');
            style.setTitle('');
            style.setLegend('');
            return style;
        },
        /**
         * @method getCurrentStyle
         * @return {Oskari.mapframework.domain.Style} current style
         */
        getCurrentStyle: function () {
            if (!this._currentStyle) {
                // prevent "nullpointer" if selectstyle hasn't been called
                this.selectStyle('');
            }
            return this._currentStyle;
        },
        /**
         * @method getTools
         * @return {Oskari.mapframework.domain.Tool[]}
         * Get layer tools
         */
        getTools: function () {
            return this._tools;
        },
        /**
         * @method setTools
         * @params {Oskari.mapframework.domain.Tool[]}
         * Set layer tools
         */
        setTools: function (tools) {
            this._tools = tools;
        },
        /**
         * @method addTool
         * @params {Oskari.mapframework.domain.Tool}
         * adds layer tool to tools
         */
        addTool: function (tool) {
            if(!tool || this.getTool(tool.getName())) {
                // check for duplicates and invalid param
                return;
            }
            this._tools.push(tool);
        },

        /**
         * @method getTool
         * @return {Oskari.mapframework.domain.Tool}
         * adds layer tool to tools
         */
        getTool: function (toolName) {
            var tool = null,
                i;

            // Layer have tools
            if (this._tools.length > 0) {
                //
                if (toolName !== '') {
                    for (i = 0; i < this._tools.length; i += 1) {
                        tool = this._tools[i];
                        if (tool.getName() === toolName) {
                            return tool;
                        }
                    }
                }
            }
            return null;
        },
        /**
         * @method setLegendImage
         * @return {String} legendImage URL to a legend image
         */
        setLegendImage: function (legendImage) {
            this._legendImage = legendImage;
        },
        /**
         * @method getLegendImage
         * @return {String} URL to a legend image
         */
        getLegendImage: function () {
            var style = this.getCurrentStyle();
            if(style && style.getLegend()) {
                return style.getLegend();
            }
            return this._legendImage;
        },
        /**
         * @method getLegendImage
         * @return {Boolean} true if layer has a legendimage or its styles have legend images
         */
        hasLegendImage: function () {
            var i,
                ret = false;

            if (this._legendImage) {
                ret = true;
            } else {
                for (i = 0; i < this.getStyles().length; i += 1) {
                    if (this.getStyles()[i].getLegend()) {
                        ret = true;
                        break;
                    }
                }
            }
            return ret;
        },
        /**
         * @method setSticky
         * True if layer switch off is disable
         * @param {Boolean} isSticky
         */
        setSticky: function (isSticky) {
            this._isSticky = isSticky;
        },
        /**
         * @method isSticky
         * True if layer switch off is disable
         */
        isSticky: function () {
            return this._isSticky;
        },
        /**
         * @method setLinkedlayer
         * True if layer is linked to other layer as 'sublayer'
         * @param {Boolean} isLinkedLayer
         */
        setLinkedLayer: function (isLinkedLayer) {
            this._isLinkedLayer = isLinkedLayer;
        },
        /**
         * @method isLinkedlayer
         * True if layer is linked to other layer as 'sublayer'
         */
        isLinkedLayer: function () {
            return this._isLinkedLayer;
        },
        /**
         * @method setQueryable
         * True if we should call GFI on the layer
         * @param {Boolean} queryable
         */
        setQueryable: function (queryable) {
            this._queryable = queryable;
        },
        /**
         * @method getQueryable
         * True if we should call GFI on the layer
         * @param {Boolean} queryable
         */
        getQueryable: function () {
            return this._queryable;
        },
        /**
         * @method setAsBaseLayer
         * sets layer type to BASE_LAYER
         */
        setAsBaseLayer: function () {
            this._type = 'BASE_LAYER';
        },
        /**
         * @method setAsNormalLayer
         * sets layer type to NORMAL_LAYER
         */
        setAsNormalLayer: function () {
            this._type = 'NORMAL_LAYER';
        },
        /**
         * @method setAsGroupLayer
         * Sets layer type to GROUP_LAYER
         */
        setAsGroupLayer: function () {
            this._type = 'GROUP_LAYER';
        },
        /**
         * @method isGroupLayer
         * @return {Boolean} true if this is a group layer (=has sublayers)
         */
        isGroupLayer: function () {
            return this._type === 'GROUP_LAYER';
        },
        /**
         * @method isBaseLayer
         * @return {Boolean} true if this is a base layer (=has sublayers)
         */
        isBaseLayer: function () {
            // TODO check if this really works
            return this._type === 'BASE_LAYER';
        },
        /**
         * @method isInScale
         * @param {Number} scale scale to compare to
         * @return {Boolean} true if given scale is between this layer's or its sublayers' min/max scales.
         */
        isInScale: function (scale) {
            var _inScale = false,
                _subLayers = this.getSubLayers();

            scale = scale || Oskari.getSandbox().getMap().getScale();

            if (_subLayers && _subLayers.length) {
                // Check if any of the sublayers is in scale
                _inScale = _.any(_subLayers, function (subLayer) {
                    return subLayer.isInScale(scale);
                });
            } else {
                // Otherwise just check if the scale falls between min/max scales
                if ((scale > this.getMaxScale() || !this.getMaxScale()) &&
                    (scale < this.getMinScale() || !this.getMinScale())) {
                    _inScale = true;
                }
            }
            return _inScale;
        },
        /**
         * @method getLayerType
         * @return {String} layer type in lower case
         */
        getLayerType: function () {
            return this._layerType.toLowerCase();
        },
        /**
         * @method isLayerOfType
         * @param {String} flavour layer type to check against. A bit misleading since setType is base/group/normal, this is used to check if the layer is a WMS layer.
         * @return {Boolean} true if flavour is the specified layer type
         */
        isLayerOfType: function (flavour) {
            return flavour && flavour.toLowerCase() === this.getLayerType();
        },
        /**
         * @method getIconClassname
         * @return {String} layer icon classname used in the CSS style.
         */
        getIconClassname: function () {
            var ret;

            if (this.isBaseLayer()) {
                ret = 'layer-base';
            } else if (this.isGroupLayer()) {
                ret = 'layer-group';
            } else {
                ret = 'layer-' + this.getLayerType();
            }
            return ret;
        },
        /**
         * @method getParams
         * @return {Object} optional layer parameters for OpenLayers, empty object if no parameters were passed in construction
         */
        getParams: function () {
            return this._params;
        },
        /**
         * @method setParams
         * @param {Object} optional layer parameters for OpenLayers
         */
        setParams: function (param) {
            this._params = param;
        },
        /**
         * @method getOptions
         * @return {Object} optional layer options for OpenLayers, empty object if no options were passed in construction
         */
        getOptions: function () {
            return this._options;
        },
        /**
         * @method getAttributes
         * @param {String} key optional key to get value directly from attributes
         * @return {Object} optional layer attributes like heatmap-parameters
         */
        getAttributes: function (key) {
            var attr = this._attributes || {};
            if(key) {
                return attr[key];
            }
            return attr;
        },
        /**
         * @method setAttributes
         * @param {Object} optional layer attributes like heatmap-parameters
         */
        setAttributes: function (param) {
            this._attributes = param;
        },

        /**
         * @method hasFeatureData
         * @return {Boolean} true if the layer has feature data
         */
        hasFeatureData: function () {
            return this._featureData;
        },
        /**
         * @method isManualRefresh
         * @return {Boolean} true/false
         */
        isManualRefresh: function () {
            if (this.getAttributes().manualRefresh){
                return this.getAttributes().manualRefresh
            } else {
                return false;
            }
        },
        /**
         * @method isResolveDepth
         * @return {Boolean} true/false
         */
        isResolveDepth: function () {
            if (this.getAttributes().resolveDepth){
                return this.getAttributes().resolveDepth
            } else {
                return false;
            }
        },
        /**
         * @method getLayerName
         * @return {String} layer functional (not UI) name
         */
        getLayerName: function () {
            return this._layerName;
        },
        /**
         * @method setLayerName
         * @param {String} layer functional (not UI) name
         */
        setLayerName: function (name) {
            this._layerName = name;
        },
        /**
         * @method addLayerUrl
         * @param {String} layerUrl
         * Apppends the url to layer array of image urls
         */
        addLayerUrl: function (layerUrl) {
            var list = this.getLayerUrls(),
                listLen = list.length,
                foundExisting = false,
                i,
                url;

            for (i = 0; i < listLen; i += 1) {
                url = list[i];
                if (url === layerUrl) {
                    foundExisting = true;
                    break;
                }
            }
            if (!foundExisting) {
                // only add if isn't added yet
                list.push(layerUrl);
            }
        },
        /**
         * @method getLayerUrls
         * @return {String[]}
         * Returns array of layer image urls
         */
        setLayerUrls: function (urlList) {
            if (Object.prototype.toString.call(urlList) === '[object Array]') {
                this._layerUrls = urlList;
            }
            // if url is single url, wrap it as list
            else if (typeof someVar === 'string') {
                this._layerUrls = [urlList];
            }
        },
        /**
         * @method getLayerUrls
         * @return {String[]}
         * Returns array of layer image urls
         */
        getLayerUrls: function () {
            if (!this._layerUrls) {
                this._layerUrls = [];
            }
            return this._layerUrls;
        },
        /**
         * @method getLayerUrl
         * @return {String}
         * Returns first url of layer urls array
         */
        getLayerUrl: function () {
            var list = this.getLayerUrls();

            if (list && list.length > 0) {
                return list[0];
            }
        },
        /**
         * @method setRealtime
         * @param {Boolean} realtime
         */
        setRealtime: function (realtime) {
            this._realtime = (realtime === true);
        },
        /**
         * @method isRealtime
         * @return {Boolean}
         */
        isRealtime: function () {
            return this._realtime;
        },
        /**
         * @method hasTimeseries
         * @return {Boolean}
         * Has timeseries data
         */
        hasTimeseries: function () {
            return !!this.getAttributes().times;
        },
        /**
         * @method setRefreshRate
         * @param {Number} refreshRate
         */
        setRefreshRate: function (refreshRate) {
            if (refreshRate < 0) {
                this._refreshRate = 0;
            } else {
                this._refreshRate = refreshRate;
            }
        },
        /**
         * @method getRefreshRate
         * @return {Number}
         */
        getRefreshRate: function () {
            return this._refreshRate;
        },
        /**
         * @method setVersion
         * @param {String} WMS, WMTS or WFS version
         */
        setVersion: function (version) {
            this._version = version;
        },
        /**
         * @method getVersion
         * @return {String}
         */
        getVersion: function () {
            return this._version;
        },
        /**
         * @method setSrs_name
         * @param {String} Spatial reference system
         */
        setSrs_name: function (srs_name) {
            this._srs_name = srs_name;
        },
        /**
         * @method getSrs_name
         * @return {String}
         */
        getSrs_name: function () {
            return this._srs_name;
        },
        /**
         * @method setGfiContent
         * @param {String} gfiContent GetFeatureInfo content
         */
        setGfiContent: function (gfiContent) {
            this._gfiContent = gfiContent;
        },
        /**
         * @method getGfiContent
         * @return {String} gfiContent GetFeatureInfo content
         */
        getGfiContent: function () {
            return this._gfiContent;
        },

        /**
         * Sets an admin block
         * @param {Object} admin
         */
        setAdmin: function (admin) {
            this._admin = admin;
        },

        /**
         * Returns an admin block
         * @return {Object} admin
         */
        getAdmin: function () {
            return this._admin;
        },

        /**
         * Sets an created block
         * @param {Date} created
         */
        setCreated: function(created){
            this._created = created;
        },

        /**
         * Returns an created block
         * @return {Date} created
         */
        getCreated: function(){
            return this._created;
        }

    }
);
