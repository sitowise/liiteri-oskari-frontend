function createMergedJsScript() {
    var sources = getLoadedJsElements();
    var ix, source;
    var filename = "liiteri.js";
    var relativeUrl = "..\\..\\..\\..\\..";
    var result = "";
    for (ix = 0; ix < sources.length; ix ++) {
        source = sources[ix];
        result += 'type "' + relativeUrl + source.replace(/\//g, "\\") + '" >> ' + filename + '\r\n';
    }
	
	return result;
}

function createMergedCssScript() {
    var sources = getLoadedCssElements();
    var ix, source;
    var filename = "liiteri.css";
    var relativeUrl = "..\\..\\..\\..\\..";
    var result = "";
    for (ix = 0; ix < sources.length; ix++) {
        source = sources[ix];
        result += 'type "' + relativeUrl + source.replace(/\//g, "\\") + '" >> ' + filename + '\r\n';
    }
	
	return result;
}

function getLoadedJsElements() {
	var ignored = [ '/Oskari/applications/sample/servlet/index.js', '/Oskari/packages/openlayers/startup.js', '/Oskari/bundles/bundle.js' ];
    var ix, scriptElements, scriptElement, sources = [];
    var baseUrl = window.location.origin;
    scriptElements = $("script");
    for (ix = 0; ix < scriptElements.length; ix++) {
        scriptElement = scriptElements[ix];
        if (scriptElement.src.match("^" + baseUrl)) {
            var relativeUrl = scriptElement.src.substring(baseUrl.length);
			if (jQuery.inArray(relativeUrl, ignored) == -1)			
				sources.push(relativeUrl);
        }
    }
    return sources;
}

function getLoadedCssElements() {
    var ix, scriptElements, scriptElement, sources = [];
    var baseUrl = window.location.origin;
    scriptElements = $("link[type='text/css']");
    for (ix = 0; ix < scriptElements.length; ix++) {
        scriptElement = scriptElements[ix];
        if (scriptElement.href.match("^" + baseUrl)) {
            var relativeUrl = scriptElement.href.substring(baseUrl.length);
            sources.push(relativeUrl);
        }
    }
    return sources;
}

function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

jQuery(document).ready(function () {
	var loader = 'default';
	var preloaded = true;
	var debugMode = false;
	
	var isMergedMode = GetURLParameter('merged');
	var isStaticConfigMode = GetURLParameter('static_config');
	
	if (isMergedMode) {
		loader = 'default';
	}

    var getAppSetupParams = {};

    // populate getappsetup url with possible control parameters
    if (typeof window.controlParams === 'object') {
        for (key in window.controlParams) {
            if (window.controlParams.hasOwnProperty(key)) {
                getAppSetupParams[key] = window.controlParams[key];
            }
        }
    }
    
    /*
    if (!(typeof window.language === 'string') || !window.language) {
        // default to english
        window.language = 'en';
    }
    Oskari.setLang(window.language);
    if (!(typeof window.preloaded === 'boolean') || !window.preloaded) {
        Oskari.setPreloaded(window.preloaded);
    }
    */
    var appConfig, appSetup, userData;
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
	
	Oskari.setLoaderMode(loader);	
	Oskari.setPreloaded(preloaded);	
	Oskari.setDebugMode(debugMode);	
    

    var downloadAppSetup = function(notifyCallback) {
        jQuery.ajax({
            type : 'GET',
            dataType : 'json',
            data : getAppSetupParams,
            url : ajaxUrl + 'action_route=GetAppSetup',
			cache : false,
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success : function(config) {
                appConfig = config.configuration;
                appSetup = config;
                notifyCallback();
            }
        });
    };
	
	var downloadStaticConfig = function(notifyCallback) {
		jQuery.ajax({
			type : 'GET',
			dataType : 'json',
			url : '/Oskari/applications/sample/servlet/config.json',
			cache : false,
			beforeSend : function(x) {
				if (x && x.overrideMimeType) {
					x.overrideMimeType("application/j-son;charset=UTF-8");
				}
			},
			success : function(config) {
				appConfig = config;
				notifyCallback();
			}
		});
	};
	var downloadStaticAppSetup = function(notifyCallback) {
		jQuery.ajax({
			type : 'GET',
			dataType : 'json',
			url : '/Oskari/applications/sample/servlet/appsetup.json',
			cache : false,
			beforeSend : function(x) {
				if (x && x.overrideMimeType) {
					x.overrideMimeType("application/j-son;charset=UTF-8");
				}
			},
			success : function(setup) {
				appSetup = setup;
				notifyCallback();
			}
		});
	};
	
	var downloadStaticUserDataSetup = function(notifyCallback) {
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
	};	
    
    var startApplication = function() {
        // check that both setup and config are loaded
        // before actually starting the application     
        if (appSetup && appConfig && (isStaticConfigMode ? userData : !userData)) {
			if (isStaticConfigMode) {
				appConfig.mapfull.conf.user = userData;
			}
		
            var app = Oskari.app;
            app.setApplicationSetup(appSetup);
            app.setConfiguration(appConfig);
            app.startApplication(function(startupInfos) {
				if (isMergedMode) {
					var js = createMergedJsScript();
					var css = createMergedCssScript();
				
					$('body').css('position', 'absolute');
					$('body').html('<pre>' + css + '</pre>' + '<br/>' + '<pre>' + js + '</pre>');
				}	
            });
        }
    };
	
	if (isStaticConfigMode) 
	{
		downloadStaticAppSetup(startApplication);
		downloadStaticConfig(startApplication);
		downloadStaticUserDataSetup(startApplication);
	}
	else 
	{
		downloadAppSetup(startApplication);
	}		
});