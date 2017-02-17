Oskari.clazz.define('Oskari.mapframework.bundle.liiteri-servicepackages.model.ServicePackageGroupModel',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (title) {
        //"use strict";
        this.name = title;
        this.servicePackages = [];
        this.searchIndex = {};
    }, {
        /**
         * @method setTitle
         * @param {String} value
         */
        setTitle: function (value) {
            this.name = value;
        },
        /**
         * @method getTitle
         * @return {String}
         */
        getTitle: function () {
            return this.name;
        },
        /**
         * @method addServicePackage
         * @param {ServicePackageModel} servicePackage
         */
        addServicePackage: function (servicePackage) {
            this.servicePackages.push(servicePackage);
            this.searchIndex[servicePackage.getId()] = this._getSearchIndex(servicePackage);
        },
        /**
         * @method getServicePackages
         * @return {ServicePackage[]}
         */
        getServicePackages: function () {
            return this.servicePackages;
        },
        _getSearchIndex: function (servicePackage) {
            var val = servicePackage.getName();;
            return val.toLowerCase();
        },
        matchesKeyword: function (servicePackageId, keyword) {
            var searchableIndex = this.searchIndex[servicePackageId];
            return searchableIndex.indexOf(keyword.toLowerCase()) !== -1;
        }
    });
