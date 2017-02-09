/**
 * @class Oskari.liiteri.bundle.liiteri-servicepackages.Tile
 * Renders the "liiteri-servicepackages" tile.
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-servicepackages.View',

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
        this.template = null;        
		
		this.servicePackageForm = null;
		this.selectedServicePackageId = 0;
		this.servicePackagesJson = null;
		this.servicePackagesDropDown = null;

		this.isShown = false;
		this.packages = [];
        this.packagesById = {};        
    }, {
        getName: function () {
            return 'Oskari.liiteri.bundle.liiteri-servicepackages.View';
        },
        startPlugin: function () {
            var me = this;
            me._cachePackages();
        },
        stopPlugin: function () {
            me.packages = [];
            me.packagesById = {};
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
                if (me.instance.defaults != null) {
                    var autoLoadId = me.instance.defaults.autoLoad;
                    if (autoLoadId != null) {
                        var autoLoadPackage = me.packagesById[autoLoadId];
                        if (autoLoadPackage != null) {
            			    me.service.raiseServicePackageSelectedEvent(autoLoadPackage, true);
                        }
                    }
                }
            });
        },
        createUI: function () {
            var me = this;
            var container = me.getEl();
            container.empty();
            var overlay = Oskari.clazz.create('Oskari.userinterface.component.Overlay');
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var innerContainer = me._createInnerContainer();
            container.append(innerContainer);

            var buttons = [];
            var closeButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            closeButton.setTitle(me.getLocalization().buttons.cancel);
            closeButton.setHandler(function () {
                me.instance.closeView();
                overlay.close();
            });
            var selectButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            selectButton.setTitle(me.getLocalization().buttons.select);
            selectButton.setHandler(function () {
                var selectedId = innerContainer.find('select[name=servicePackages]').val();
                me.service.raiseServicePackageSelectedEvent(me.packagesById[selectedId], true);
                me.instance.closeView();
                overlay.close();
            });

            buttons.push(selectButton);
            buttons.push(closeButton);

            overlay.overlay('body');
            dialog.show(me.getTitle(), container, buttons);
            return dialog;
        },
        showMode: function(show) {
            var me = this;

            if (me.isShown == show)
                return;            

            if (show) {
                this.isShown = true;
                this.dialog = this.createUI();
            } else {
                this.isShown = false;
                this.dialog.close(true);
            }
        },
        _createInnerContainer: function () {
            var me = this;
            var content = jQuery('<div class="servicePackageInnerContainer"></div>');
            me._fillServicePackages(content, me.packages);
            return content;
        },
        _fillServicePackages : function(container, packages) {
            var dropDownContainer = jQuery('<div id="servicePackagesDropDownContainer"></div>');
            var servicePackagesDiv = jQuery('<div id="servicePackagesDropdown"><select id="servicePackagesSelect" name="servicePackages"></select></div>');
            var servicePackagesDropDown = servicePackagesDiv.find('select[name=servicePackages]');
            dropDownContainer.append(servicePackagesDiv);
            container.append(dropDownContainer);

            for (var i = 0; i < packages.length; ++i) {
                var option = jQuery('<option></option>');
                option.attr('value', packages[i].id);
                option.append(packages[i].name);
                servicePackagesDropDown.append(option);
            }
        },
        refreshServicePackagesList: function () {
            var me = this;
		    me._cachePackages();
		},
		setServicePackage: function (id, restoreState) {
		    var me = this;
		    me.service.raiseServicePackageSelectedEvent(me.packagesById[id], restoreState);
		},
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        "extend": ["Oskari.userinterface.extension.DefaultView"]
    });
