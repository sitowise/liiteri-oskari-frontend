/**
 * @class Oskari.integration.bundle.admin-layerselector.models.ExtendedWFSLayer
 *
 * MapLayer of type WFS
 */
Oskari.clazz.define('Oskari.integration.bundle.admin-layerselector.models.ExtendedWFSLayer',
    function (wfsLayer) {
        this._version = '1.1.0';
        this._username = null;
        this._password = null;
        this._gmlVersion = '3.1.1';
        this._gmlGeometryProperty = 'geom';
        this._featureNamespaceURI = '';
        this._featureNamespace = '';
        this._featureElement = '';
        this._geometryNamespaceURI = '';
        if (wfsLayer) {
            for (var key in wfsLayer) {
                var prop = wfsLayer[key];
                if (typeof prop !== 'function') {
                    this[key] = prop;
                }
            }
        }
    }, {
        getVersion : function() {
            return this._version;
        },
        setVersion : function(item) {
            this._version = item;
        },
        getUsername: function () {
            return this._username;
        },
        setUsername : function(item) {
            this._username = item;
        },
        getPassword: function () {
            return this._password;
        },
        setPassword: function (item) {
            this._password = item;
        },
        getGmlVersion: function () {
            return this._gmlVersion;
        },
        setGmlVersion: function (item) {
            this._gmlVersion = item;
        },
        getGmlGeometryProperty: function () {
            return this._gmlGeometryProperty;
        },
        setGmlGeometryProperty: function (item) {
            this._gmlGeometryProperty = item;
        },
        getFeatureNamespaceURI: function () {
            return this._featureNamespaceURI;
        },
        setFeatureNamespaceURI: function (item) {
            this._featureNamespaceURI = item;
        },
        getFeatureNamespace: function () {
            return this._featureNamespace;
        },
        setFeatureNamespace: function (item) {
            this._featureNamespace = item;
        },
        getFeatureElement: function () {
            return this._featureElement;
        },
        setFeatureElement: function (item) {
            this._featureElement = item;
        },
        getGeometryNamespaceURI: function () {
            return this._geometryNamespaceURI;
        },
        setGeometryNamespaceURI: function (item) {
            this._geometryNamespaceURI = item;
        }

    }, {
        "extend": ["Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer"]
    });