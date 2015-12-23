Oskari.clazz.define(
        'Oskari.mapframework.bundle.mapmodule.plugin.BackgroundDrawPlugin.event.SelectedDrawingEvent',
        function(pPlace, dblClick, creatorId) {
            this._creator = null;
            this._place = pPlace;
            this._dblClick = dblClick;
            this._creatorId = creatorId;
        }, {
            __name: "BackgroundDrawPlugin.SelectedDrawingEvent",
            getName : function() {
                return this.__name;
            },
            getPlace : function() {
                return this._place;
            },
            isDblClick : function() {
                return this._dblClick;
            },
            getCreatorId: function() {
                return this._creatorId;
            }
        },
        {
            'protocol' : ['Oskari.mapframework.event.Event']
        });

/* Inheritance */
