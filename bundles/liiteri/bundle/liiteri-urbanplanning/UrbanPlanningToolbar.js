/**
 * @class Oskari.statistics.bundle.statsgrid.StatsToolbar
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-urbanplanning.UrbanPlanningToolbar',
    /**
     * @static constructor function
     * @param {Object} localization
     * @param {Oskari.statistics.bundle.statsgrid.StatsGridBundleInstance} instance
     */

    function (localization, instance) {
        this.toolbarId = 'urban-planning';
        this.instance = instance;
        this.localization = localization;
        this._createUI();
    }, {
        show: function (isShown) {
            var showHide = isShown ? 'show' : 'hide';
            var sandbox = this.instance.getSandbox();
            sandbox.requestByName(this.instance, 'Toolbar.ToolbarRequest', [this.toolbarId, showHide]);
        },
        destroy: function () {
            var sandbox = this.instance.getSandbox();
            sandbox.requestByName(this.instance, 'Toolbar.ToolbarRequest', [this.toolbarId, 'remove']);
        },
        changeName: function (title) {
            var sandbox = this.instance.getSandbox();
            sandbox.requestByName(this.instance, 'Toolbar.ToolbarRequest', [this.toolbarId, 'changeName', title]);
        },
        /**
         * @method _createUI
         * sample toolbar for statistics functionality
         */
        _createUI: function () {

            var view = this.instance.plugins['Oskari.userinterface.View'];
            var me = this;
            var sandbox = this.instance.getSandbox();
            sandbox.requestByName(this.instance, 'Toolbar.ToolbarRequest', [this.toolbarId, 'add', {
                title: me.localization.title,
                show: false,
                closeBoxCallback: function () {
                    view.showMode(false);
                }
            }]);

            var buttonGroup = 'urbanplanning-tools';
            var buttons = {
                'showUrbanPlans': {
                    toolbarid: me.toolbarId,
                    iconCls: 'glyphicon glyphicon-th-list',
                    tooltip: "Asemakaavat", //TODO: to local file
                    text: "Asemakaavat", //TODO: to locale file
                    sticky: false,
                    initiallySelected: false,
                    selected: false,
                    callback: function() {
                        view.showSubpage('plans');
                    }
                },
                'showMarkings': {
                    toolbarid: me.toolbarId,
                    iconCls: 'glyphicon glyphicon-send',
//                    tooltip: this.instance._localization.showSelected,
//                    text: this.instance._localization.toogleTable,
                    tooltip: "Kaavamerkinnät", //TODO: to local file
                    text: "Kaavamerkinnät", //TODO: to locale file
                    sticky: false, 
                    initiallySelected: false,
                    callback: function () {
                        view.showSubpage('markings');
                    }
                }
            };

            if (this.instance.service.hasRightToSeeContactPeople()) {
                buttons['showPeople'] = {
                    toolbarid: me.toolbarId,
                    iconCls: 'glyphicon glyphicon-envelope',
                    tooltip: "Yhteyshenkilöt", //TODO: to local file
                    text: "Yhteyshenkilöt", //TODO: to locale file
                    sticky: false,
                    initiallySelected: false,
                    selected: false,
                    callback: function() {
                        view.showSubpage('people');
                    }
                };
            }
//
            var requester = this.instance;
            var reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest'),
                tool;

            for (tool in buttons) {
                if (buttons.hasOwnProperty(tool)) {
                    sandbox.request(requester, reqBuilder(tool, buttonGroup, buttons[tool]));
                }
            }
            
            $(".oskariui-menutoolbar-closebox div").hide();


        }
    });