
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-ui.service.UIConfigurationService',

    /**
     * @method create called automatically on construction
     * @static
     *
     */

    function () {
    }, {
        __name: "Liiteri.UIConfigurationService",
        __qname: "Oskari.liiteri.bundle.liiteri-ui.service.UIConfigurationService",

        getQName: function () {
            return this.__qname;
        },

        getName: function () {
            return this.__name;
        },

        /**
         * @method init
         * Initializes the service
         */
        init: function () { },
        getDataTablesLocaleLocation : function() {
            return "/Oskari/libraries/jquery/plugins/DataTables-1.10.7/locale/";
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });

