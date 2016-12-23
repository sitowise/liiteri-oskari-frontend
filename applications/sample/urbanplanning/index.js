jQuery(document).ready(function () {

    //default language: Finnish
    var language = 'fi';
    
    
    //Get the language parameter from URL
    var langParamName = 'lang'; 
    
    langParamName = langParamName.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + langParamName + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    
    if (results != null) {    
      language = results[1];
    }

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
            appConfig.mapfull.conf.user = userData;
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
