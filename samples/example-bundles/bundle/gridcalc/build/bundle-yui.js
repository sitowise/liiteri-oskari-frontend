Oskari.clazz.define("Oskari.mapframework.bundle.GridCalcBundle",function(){},{create:function(){return Oskari.clazz.create("Oskari.mapframework.bundle.GridCalcBundleInstance")},update:function(c,a,b,d){c.alert("RECEIVED update notification "+d)}},{protocol:["Oskari.bundle.Bundle","Oskari.mapframework.bundle.extension.ExtensionBundle"],source:{scripts:[{type:"text/javascript",src:"ui.js"},{type:"text/javascript",src:"instance.js"}],resources:[]},bundle:{manifest:{"Bundle-Identifier":"gridcalc","Bundle-Name":"gridcalc","Bundle-Icon":{href:"icon.png"},"Bundle-Author":[{Name:"jjk",Organisation:"nls.fi",Temporal:{Start:"2009",End:"2011"},Copyleft:{License:{"License-Name":"EUPL","License-Online-Resource":"http://www.paikkatietoikkuna.fi/license"}}}],"Bundle-Name-Locale":{fi:{Name:" gridcalc",Title:" gridcalc"},en:{}},"Bundle-Version":"1.0.0","Import-Namespace":["Oskari","Ext","OpenLayers"],"Import-Bundle":{mapoverlaypopup:{},layerhandler:{}}}}});Oskari.bundle_manager.installBundleClass("gridcalc","Oskari.mapframework.bundle.GridCalcBundle");