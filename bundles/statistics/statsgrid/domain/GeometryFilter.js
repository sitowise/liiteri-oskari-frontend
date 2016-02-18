
//geometryFilter

Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.domain.GeometryFilter',
    function () {
        this.reset();
    }, {
        reset: function(dontResetDirection) {
            this._geometries = [];
            if (!dontResetDirection)
                this._direction = undefined;
        },
        addGeometry: function(geom) {
            this._geometries.push(geom);
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
        }
    });
