Oskari.clazz.define("Oskari.mapframework.bundle.DefaultthirdpartymapsBundle",function(){},{create:function(){return Oskari.clazz.create("Oskari.mapframework.bundle.DefaultthirdpartymapsBundleInstance")},update:function(c,a,b,d){c.alert("RECEIVED update notification "+d)}},{protocol:["Oskari.bundle.Bundle","Oskari.mapframework.module.Module","Oskari.mapframework.bundle.extension.ExtensionBundle"],source:{scripts:[{type:"text/javascript",src:"instance.js"}],resources:[]},bundle:{manifest:{"Bundle-Identifier":"thirdpartymaps","Bundle-Name":"thirdpartymaps","Bundle-Icon":{href:"icon.png"},"Bundle-Author":[{Name:"jjk",Organisation:"nls.fi",Temporal:{Start:"2009",End:"2011"},Copyleft:{License:{"License-Name":"EUPL","License-Online-Resource":"http://www.paikkatietoikkuna.fi/license"}}}],"Bundle-Name-Locale":{fi:{Name:"Kartta",Title:"Kartta"},en:{}},"Bundle-Version":"1.0.0","Import-Namespace":["Oskari","Ext","OpenLayers"]}}});Oskari.bundle_manager.installBundleClass("thirdpartymaps","Oskari.mapframework.bundle.DefaultthirdpartymapsBundle");