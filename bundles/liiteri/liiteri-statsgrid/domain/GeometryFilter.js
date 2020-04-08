
//geometryFilter

Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.domain.GeometryFilter',
    function () {
        this.reset();
    }, {
        reset: function(dontResetDirection) {
            this._geometries = [];
            this._geomObjects = [];
            if (!dontResetDirection)
                this._direction = undefined;
        },
        /**
         * Adds the geometry with specified id to geometry filter
         */
        addGeometry: function (geom, id, isAreaForShpExport) {
            this._geometries.push(geom);
            this._geomObjects.push({
                "id": id,
                "geom": geom,
                "isAreaForShpExport": isAreaForShpExport
            });
        },
        setDirection: function (direction) {
            this._direction = direction;
        },
        getDirection: function () {
            return this._direction;
        },
        isEmpty: function() {
            return this._geometries.length == 0;
        },
        getSize: function() {
            return this._geometries.length;
        },        
        getWktKey: function () {
            var result = null;
            if (this.getSize() == 0)
                return null;

            if (this._direction != undefined)
                result = this._direction + ":" + this._geometries.join('|');
            else
                result = this._geometries.join('|');

            return result;
        },
        getGeometries: function () {
            return this._geomObjects;
        },
        getAreasForShpExport: function () {
            return this._geomObjects.filter(function (geom) {
                return geom.isAreaForShpExport === true
            });
        },
        hasAreasForShpExport: function () {
            return this._geomObjects.find(function (geom) {
                return geom.isAreaForShpExport === true
            }) != null;
        }
    });
