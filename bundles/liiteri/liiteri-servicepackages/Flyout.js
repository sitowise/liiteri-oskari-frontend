/**
 * @class Oskari.liiteri.bundle.liiteri-servicepackages.Flyout
 * Renders the "liiteri-servicepackages" flyout.
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-servicepackages.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.liiteri.bundle.liiteri-servicepackages.LiiteriServicePackagesInstance} instance
     *      reference to component that created the tile
     */
    function (instance, localization) {
        this.instance = instance;
        this.service = instance.service;
        this._localization = localization;
        this.container = null;
        this.tabContainer = null;
		this.isShown = false;
		this.packages = [];
        this.packagesById = {};
		this.groupings = [];
        this._templates = {
            base: jQuery('<div id="oskari-service-packages-list-container"></div>'),
            selectButton: jQuery('<input type="submit" class="primary" />')
        }
    }, {
        getName: function () {
            return 'Oskari.liiteri.bundle.liiteri-servicepackages.Flyout2';
        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            //"use strict";
            return this.instance.getLocalization('title');
        },
        /**
         * @method setEl
         * @param {Object} el
         *     reference to the container in browser
         * @param {Number} width
         *     container size(?) - not used
         * @param {Number} height
         *     container size(?) - not used
         *
         * Interface method implementation
         */
        setEl: function (el, width, height) {
            //"use strict";
            this.container = el[0];
            if (!jQuery(this.container).hasClass('liiteri-servicepackages')) {
                jQuery(this.container).addClass('liiteri-servicepackages');
            }
        },
        startPlugin: function () {
            var me = this;
            me._cachePackages();
            this.createUI();
        },
        stopPlugin: function () {
            var me = this;
            me.packages = [];
            me.packagesById = {};
        },
        checkAutoLoadServicePackage: function () {
            var me = this;
            var autoLoadId = me.instance.autoLoad;
            if (autoLoadId != null) {
                var autoLoadPackage = me.packagesById[autoLoadId];
                if (autoLoadPackage != null) {
                    me.service.raiseServicePackageSelectedEvent(autoLoadPackage, true);
                }
                me.instance.autoLoad = null;
            }
        },
        _cachePackages: function() {
            var me = this;
            me.packages = [];
            me.packagesById = {};
            me.service.getServicePackages(function (packages) {
                me.packages = packages;
                for (var i = 0; i < packages.length; i++) {
                    me.packagesById[packages[i].id] = packages[i];
                }
                me.checkAutoLoadServicePackage();
            });
        },
        createUI: function () {
            var me = this;
            if (!jQuery(me.container).hasClass('liiteri-servicepackages')) {
                jQuery(me.container).addClass('liiteri-servicepackages');
            }
            var content = this._templates.base.clone();
            var container = jQuery(this.container);
            container.empty();

            var servicePackageTab = Oskari.clazz.create(
                'Oskari.liiteri.bundle.liiteri-servicepackages.view.ServicePackageTabView',
                me.instance,
                me.instance.getLocalization().paneltitle,
                'oskari-service-packages-list-container'
            );

            me.tabContainer = Oskari.clazz.create(
                'Oskari.userinterface.component.TabContainer'
            );
            me.tabContainer.insertTo(container);
            me.tabContainer.addPanel(servicePackageTab.getTabPanel());
            this.groupings = me._createServicePackageGrouping();
            servicePackageTab.showServicePackageGroups(this.groupings);

            container.append(content);
        },

        _createServicePackageGrouping: function() {
            var me = this;
            var servicePackageGrouping = [];
            var labelGrouping= [];
            me.packages.forEach(function(servicePackage, packageIndex) {
                if (servicePackage.mainType !== "package") {
                    return;
                }
                var label = servicePackage.label;
                if ((label == null)||(label.length === 0)) {
                    label = me.locale.defaultlabel;
                }
                var numLabels = labelGrouping.length;
                var labelIndex = 0;
                while (labelIndex < numLabels) {
                    var comparison = label.toLocaleLowerCase().localeCompare(labelGrouping[labelIndex].label.toLocaleLowerCase());
                    if (comparison === 0) {
                        labelGrouping[labelIndex].packageIndexes.push(packageIndex);
                        return;
                    } else if (comparison < 0) {
                        break;
                    }
                    labelIndex++;
                }
                labelGrouping.splice(labelIndex, 0, {
                    'label': label,
                    'packageIndexes': [packageIndex]
                });
            });
            labelGrouping.forEach(function(labelGroup) {
                var servicePackageGroup = Oskari.clazz.create('Oskari.mapframework.bundle.liiteri-servicepackages.model.ServicePackageGroupModel', labelGroup.label);
                labelGroup.packageIndexes.forEach(function(packageIndex) {
                    var servicePackageData = me.packages[packageIndex];
                    var servicePackage = Oskari.clazz.create('Oskari.mapframework.bundle.liiteri-servicepackages.model.ServicePackageModel', servicePackageData.name);
                    servicePackage.setId(servicePackageData.id);
                    servicePackage.setUrl(servicePackageData.url);
                    servicePackage.setJson(servicePackageData);
                    servicePackageGroup.addServicePackage(servicePackage);
                });
                servicePackageGrouping.push(servicePackageGroup);
            });
            return servicePackageGrouping;
        },

        refreshServicePackagesList: function () {
            var me = this;
		    me._cachePackages();
		    me.createUI();
		}

    }, {
        "extend": ["Oskari.userinterface.extension.DefaultFlyout"]
    }
);
