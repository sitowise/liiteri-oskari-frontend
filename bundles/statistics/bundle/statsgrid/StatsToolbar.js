/**
 * @class Oskari.statistics.bundle.statsgrid.StatsToolbar
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.StatsToolbar',
    /**
     * @static constructor function
     * @param {Object} localization
     * @param {Oskari.statistics.bundle.statsgrid.StatsGridBundleInstance} instance
     */

    function (localization, instance) {
        this.toolbarId = 'statsgrid';
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
                    view.prepareMode(false);
                }
            }]);

            var buttonGroup = 'statsgrid-tools';
            var buttons = {
                'toogleTableView': {
                    toolbarid: me.toolbarId,
                    iconCls: 'glyphicon glyphicon-list-alt',
                    tooltip: this.instance._localization.showSelected,
                    text: this.instance._localization.toogleTable,
                    sticky: false,
                    toggleSelection: true,
                    initiallySelected: true,
                    callback: function () {                        
                        var statsgrid = view.instance.gridPlugin;
                        statsgrid.toogleTableView();
                    },
                },
                'toogleMapView': {
                    toolbarid: me.toolbarId,
                    iconCls: 'glyphicon glyphicon-screenshot',
                    tooltip: this.instance._localization.showSelected,
                    text: this.instance._localization.toogleMap,
                    sticky: false,
                    toggleSelection: true,
                    initiallySelected: true,
                    selected: true,
                    callback: function() {
                        var statsgrid = view.instance.gridPlugin;
                        statsgrid.toogleMapView();
                    },
                }
            };

            var requester = this.instance;
            var reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest'),
                tool;

			//there shouldn't be any button in Liiteri's toolbar
            for (tool in buttons) {
                if (buttons.hasOwnProperty(tool)) {
                    sandbox.request(requester, reqBuilder(tool, buttonGroup, buttons[tool]));
                }
            }


        }
    });