jQuery(document).ready(function () {
    
    Oskari.setLang(language);
    Oskari.setLoaderMode('dev');
    var appSetup,
    appConfig,
    userData,
    dynamicAppSetup,
    downloadConfig = function (notifyCallback) {
        jQuery.ajax({
            type: 'GET',
            dataType: 'json',
            url: 'config.json',
            beforeSend: function (x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success: function (config) {
                appConfig = config;
                notifyCallback();
            }
        });
    },
    downloadAppSetup = function (notifyCallback) {
        jQuery.ajax({
            type: 'GET',
            dataType: 'json',
            url: 'appsetup.json',
            success: function (setup) {
                appSetup = setup;
                notifyCallback();
            }
        });
    },
    downloadDynamicAppSetup = function (notifyCallback) {
        jQuery.ajax({
            type: 'GET',
            dataType: 'json',
            url: ajaxUrl + 'action_route=GetAppSetup',
            success: function (setup) {
                dynamicAppSetup = setup;
                notifyCallback();
            }
        });
    },
    downloadStaticUserDataSetup = function(notifyCallback) {
        jQuery.ajax({
            type : 'GET',
            dataType : 'json',
            url : ajaxUrl + 'action_route=GetCurrentUserData',
            cache : false,
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success : function(setup) {
                userData = setup;
                notifyCallback();
            }
        });
    },

    startApplication = function () {
        // check that both setup and config are loaded 
        // before actually starting the application
        if (appSetup && appConfig && userData && dynamicAppSetup) {
            appSetup.env.user = userData;
            appConfig['liiteri-ui'].conf.analytics = dynamicAppSetup.configuration['liiteri-ui'].conf.analytics;
            var app = Oskari.app;
            app.setApplicationSetup(appSetup);
            app.setConfiguration(appConfig);
            app.startApplication(function (startupInfos) {
                // all bundles have been loaded
            });
        }
    };
    downloadStaticUserDataSetup(startApplication);
    downloadAppSetup(startApplication);
    downloadConfig(startApplication);
    downloadDynamicAppSetup(startApplication);
});
