/**
 * @class Oskari.liiteri.bundle.liiteri-groupings.GroupingsToolbar
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-groupings.GroupingsToolbar',
    /**
     * @static constructor function
     * @param {Object} localization
     * @param {Oskari.liiteri.bundle.liiteri-groupings.LiiteriGroupingsBundleInstance} instance
     */

    function (localization, instance) {
        this.toolbarId = 'groupings';
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
            /*var buttons = {
                'showMarkings': {
                    toolbarid: me.toolbarId,
                    iconCls: 'glyphicon glyphicon-send',
//                    tooltip: this.instance._localization.showSelected,
//                    text: this.instance._localization.toogleTable,
                    tooltip: "TT",
                    text: "Markings",
                    sticky: false,
                    initiallySelected: false,
                    callback: function () {
                        view.switchBetweenPlansAndMarkings(false);
                    },
                },
                'showUrbanPlans': {
                    toolbarid: me.toolbarId,
                    iconCls: 'glyphicon glyphicon-th-list',
                    tooltip: "TT",
                    text: "Urban Plans",
                    sticky: false,
                    initiallySelected: false,
                    selected: false,
                    callback: function() {
                        view.switchBetweenPlansAndMarkings(true);
                    },
                }
            };*/
//
            var requester = this.instance;
            var reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest'),
                tool;

            /*for (tool in buttons) {
                if (buttons.hasOwnProperty(tool)) {
                    sandbox.request(requester, reqBuilder(tool, buttonGroup, buttons[tool]));
                }
            }*/


        }
    });