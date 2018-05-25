
//geometryFilter

Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.domain.AreaFilter',
    function () {
        this.reset();
    }, {
        reset: function() {
            this._data = [];
            this._text = [];
        },
        setFromObj: function(obj) {
            this._data = obj.data != null ? obj.data : [];
            this._text = obj.text != null ? obj.text : [];
        },
        getData: function() {
            return this._data;
        },
        getText: function () {
            return this._text;
        },
        hasFilterDirection: function() {
            return typeof this._data[0] !== 'undefined' && typeof this._data[0].type !== 'undefined';
        },
        getFilterDirection: function() {
            return this._data[0].type;
        },
        isEmpty: function() {
            return this._data.length == 0;
        },
        getSize: function() {
            return this._data.length;
        },        
        getKey: function () {
            var result = null;
            if (this.getSize() == 0)
                return null;

            return this._data;
        }
    });
