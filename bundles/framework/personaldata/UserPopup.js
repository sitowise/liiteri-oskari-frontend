Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.UserPopup',
    function (instance, sandbox) {
        this.instance = instance;
        this.dialog = null;
        this.sandbox = sandbox;
        this.template = '<div class="oskari-popover personalDataContainer"><div class="oskari-arrow"></div><div class="oskari-popover-inner"><h3 class="oskari-popover-title"></h3><div class="oskari-popover-content"><p></p></div></div></div>';
    }, {
        toogle: function () {
            var me = this;

            if (!me.dialog) {
                me.dialog = me.createUi();
                me.dialog.attachTo($('.user-mapicon'), { template: me.template });
            }

            var ui = me.dialog;
            if (ui.shown) {
                ui.hide();
            } else {
                //ui.attachTo($('.user-mapicon'), { template: me.template });
                ui.show();
                this.attachEvents();
            }

        },
        attachEvents: function () {
            var me = this;
            var content = me.dialog.getContent();
            content.find("#logInAction").click(function () {
                jQuery.cookie('guest_login', 0);
                me.sandbox.postRequestByName('liiteri-loging.ShowLoginWindowRequest', me.instance);
            });
            content.find("#showUserDataTabAction").click(function () {
                me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'attach']);
                me.sandbox.postRequestByName('PersonalData.SelectTabRequest', ['USER_DATA']);
            });
            content.find("#showWorkspacesTabAction").click(function () {
                me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'attach']);
                me.sandbox.postRequestByName('PersonalData.SelectTabRequest', ['WORKSPACE']);
            });
            content.find("#showUserLayersTabAction").click(function () {
                me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'attach']);
                me.sandbox.postRequestByName('PersonalData.SelectTabRequest', ['USERWMS']);
            });
            content.find("#showGroupingsTabAction").click(function () {
                //me.sandbox.postRequestByName('liiteri-groupings.ShowGroupingsFlyoutRequest');
                me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me._createExtension('liiteri-groupings'), 'toggle']);
            });
            content.find("#showAnnouncementsTabAction").click(function () {
                me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me._createExtension('liiteri-announcements'), 'toggle']);
            	//me.sandbox.postRequestByName('liiteri-announcements.ShowAnnouncementsFlyoutRequest');
            });
            content.find("#showLayerrightsTabAction").click(function () {
                me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me._createExtension('admin-layerrights'), 'toggle']);
            	//me.sandbox.postRequestByName('ShowLayerrightsFlyoutRequest');
            });
            content.find("#showCreateMapTabAction").click(function () {
                me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me._createExtension('StatsGrid'), 'close']);
                me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me._createExtension('Publisher2'), 'toggle']);             
            	//me.sandbox.postRequestByName('ShowPublisherFlyoutRequest');
            });
            content.find("#logoutInAction").click(function () {
                window.location.replace(me.sandbox.getAjaxUrl() + "action=logout");
            });
        },
        createUi: function () {
            var me = this;
            var user = me.sandbox.getUser();
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popover');

            var content = jQuery('<div></div>');

            var userData = jQuery('<div style="float: left"></div>');
            var userIcon = jQuery('<span class="glyphicon mapicon user-mapicon"></span>');
            var description = jQuery('<div style="float: right">' + user.getNickName() + '</div>');
            var clearDiv = jQuery('<div style="clear: both"></div>');
            this.locale = this.instance.getLocalization()["menuItems"];
            userData.append(userIcon);
            userData.append(description);
            content.append(userData);
            content.append(clearDiv);

            if (user.isLoggedIn()) {
                var userDataTabLink = jQuery('<div class="linkRow"><a class="addButton" id="showUserDataTabAction">' + this.locale.myAccount + ' &#8250;</a></div>');
                content.append(userDataTabLink);

                var workspacesTabLink = jQuery('<div class="linkRow"><a class="addButton" id="showWorkspacesTabAction">' + this.locale.workspaces + ' &#8250;</a></div>');
                content.append(workspacesTabLink);

                var userLayersTabLink = jQuery('<div class="linkRow"><a class="addButton" id="showUserLayersTabAction">' + this.locale.userLayers + ' &#8250;</a></div>');
                content.append(userLayersTabLink);

                var isAdmin = false;
                var isSykeAdmin = false;
                var roles = user.getRoles();
                $.each(roles, function (index, role){
                    if ($.inArray(role.name, ["liiteri_admin", "liiteri_groupings_admin"]) > -1) {
                        isAdmin = true;
                    } else if (role.name === "liiteri_admin_light") {
                        isSykeAdmin = true;
                    }
                });

                if (isAdmin || isSykeAdmin)
                {
                	$("<div>").addClass("menuLineDivider").appendTo(content);

                    if (isAdmin) {
                        var groupingLink = $('<div class="linkRow"><a class="addButton" id="showGroupingsTabAction">' + this.locale.groupings + ' &#8250;</a></div>');
                        content.append(groupingLink);
                    }

	                var announcementsLink = $('<div class="linkRow"><a class="addButton" id="showAnnouncementsTabAction">' +  this.locale.announcements + ' &#8250;</a></div>');
	                content.append(announcementsLink);

                    if (isAdmin) {
                        var layerrightsLink = $('<div class="linkRow"><a class="addButton" id="showLayerrightsTabAction">' + this.locale.layerRights + ' &#8250;</a></div>');
                        content.append(layerrightsLink);
                    }

                    $("<div>").addClass("menuLineDivider").appendTo(content);
                }
                var createMapLink = $('<div class="linkRow"><a class="addButton" id="showCreateMapTabAction">' +  this.locale.createMap + ' &#8250;</a></div>');
                content.append(createMapLink);

                var logoutLink = jQuery('<div class="linkRow"><a class="addButton" id="logoutInAction">' +  this.locale.logout + ' &#8250;</a></div>');
                content.append(logoutLink);
            } else {
                var loginLink = jQuery('<div class="linkRow"><a class="addButton" id="logInAction">' + this.locale.login + ' &#8250;</a></div>');
                content.append(loginLink);
            }


            dialog.setContent(content);



            //dialog.show('Save the workspace', content);//, [saveBtn, cancelBtn]);
            //dialog.makeModal();
            //dialog.addClass('personalInfoPopUp');

            //var mapplugin = document.getElementsByClassName('mapplugin mapiconsplugin')[0];
            //dialog.moveTo(mapplugin, 'bottom');

            return dialog;
        },
        _createExtension : function(name) {
            return {
                'getName' : function() {
                    return name;
                }
            }
        }
    });