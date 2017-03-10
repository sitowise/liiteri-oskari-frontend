/**
 * @class Oskari.mapframework.bundle.liiteri-servicepackages.view.ServicePackageItemView
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-servicepackages.view.ServicePackageItemView',

    /**
     * @method create called automatically on construction
     * @static
     */
    function (servicePackage, instance, localization, groupName) {
        this.instance = instance;
        this.localization = localization;
        this.servicePackage = servicePackage;
        this.ui = this._createServicePackageContainer(servicePackage, groupName);
    }, {
        __template: '<div class="servicepackage">' +
			'<div class="servicepackage-tools">' +
				'<div class="servicepackage-info icon-info"></div>' +
			'</div>' +
			'<div class="servicepackage-title"></div>' +
        '</div>',
        /**
         * @method getId
         * @return {String} servicePackage id
         */
        getId: function () {
            //"use strict";
            return this.servicePackage.getId();
        },
        setVisible: function (bln) {
            // checking since we don't assume param is boolean
            if (bln) {
                this.ui.show();
            } else {
                this.ui.hide();
            }
        },
        setSelected: function (isSelected, sendEvent) {
            // checking since we don't assume param is boolean
            var checkbox = this.ui.find('input');
            checkbox.attr('checked', (isSelected == true));
            if (isSelected) {
                checkbox.parent().addClass('selected');
            } else {
                checkbox.parent().removeClass('selected');
            }

            if (sendEvent) {
                checkbox.change();
            }
        },

        /**
         * @method updateServicePackageContent
         */
        updateServicePackageContent: function (servicePackage) {
            var newName = servicePackage.getName();
            this.ui.find('.servicepackage-title').html(newName);

        },
        getContainer: function () {
            return this.ui;
        },
        /**
         * @method _createServicePackageContainer
         * @private
         * Creates the servicePackage containers
         * @param {Oskari.mapframework.domain.WmsServicePackage/Oskari.mapframework.domain.WfsServicePackage/Oskari.mapframework.domain.VectorServicePackage/Object} servicePackage to render
         */
        _createServicePackageContainer: function (servicePackage, groupName) {
            var me = this,
                servicePackageDiv = jQuery(this.__template),
                tooltips = this.localization.tooltip,
                tools = jQuery(servicePackageDiv).find('div.servicepackage-tools'),
                icon = tools.find('div.servicepackage-icon');

            // setup id
            servicePackageDiv.attr('servicePackage_id', servicePackage.getId());
            servicePackageDiv.find('input').attr('id', 'oskari_servicePackageselector2_servicePackagelist_checkbox_servicePackageid_' + servicePackage.getId());
            servicePackageDiv.find('.servicepackage-title').append(servicePackage.getName());
            servicePackageDiv.find('.servicepackage-title').click(function(){
                me.instance.view.setServicePackage(me.servicePackage.getId(), true);
                me.instance.closeView();
            });

            /*
             * info link
             */
            elInfoLink = tools.find('.servicepackage-info');
            elInfoLink.click(function () {
                var url = me.servicePackage.getUrl();
                if ((url != null)&&(url.length > 0)) {
                    window.open(url, '_blank');
                }
            });

            return servicePackageDiv;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.mapframework.module.Module']
    });
