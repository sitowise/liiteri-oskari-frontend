
(function() {
    define(['_bundle/models/roleModel', '_bundle/collections/userRoleCollection'],
        function(roleModel) {
        return Backbone.Collection.extend({

            // Reference to this collection's model.
            model : roleModel,

            getRoles: function () {
                this.models.forEach((item, index) => {
                    if (item.name === 'liiteri_admin_light') {
                        item.name = 'liiteri_admin';
                    }
                });
                return this.models;
            }
        });

    });
}).call(this);
