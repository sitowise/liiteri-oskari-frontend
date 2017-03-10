Oskari.clazz.define('Oskari.mapframework.bundle.liiteri-servicepackages.model.ServicePackageModel',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (name) {
        this.name = name;
        this.id = 1;
        this.url = '';
    }, {
        /**
         * @method setName
         * @param {String} name
         */
        setName: function (name) {
            this.name = name;
        },
        /**
         * @method getName
         * @return {String}
         */
        getName: function () {
            return this.name;
        },
        /**
         * @method setId
         * @param {String} id
         */
        setId: function (id) {
            this.id = id;
        },
        /**
         * @method getId
         * @return {String}
         */
        getId: function () {
            return this.id;
        },
        /**
         * @method setUrl
         * @param {String} url
         */
        setUrl: function (url) {
            this.url = url;
        },
        /**
         * @method getUrl
         * @return {String}
         */
        getUrl: function () {
            return this.url;
        }
    });
