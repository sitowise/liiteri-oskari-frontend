Oskari.clazz.define("Oskari.poc.dojo.LayerSelectionBundle",function(){this.dojo=null},{require:function(b){var c=this;var d=Oskari.clazz.metadata("Oskari.poc.dojo.LayerSelectionBundle");var a=d.meta.dojo;require(a,function(){var f={};for(var g=0;g<a.length;g++){var e=a[g];f[e]=arguments[g]}b(f)})},create:function(){var a=this;var b=Oskari.clazz.create("Oskari.poc.dojo.bundle.LayerSelectionBundleInstance");return b},start:function(){},stop:function(){},update:function(c,a,b,d){}},{protocol:["Oskari.bundle.Bundle","Oskari.bundle.BundleInstance","Oskari.mapframework.bundle.extension.ExtensionBundle"],source:{scripts:[{type:"text/javascript",src:"instance.js"},{type:"text/javascript",src:"Flyout.js"},{type:"text/javascript",src:"Tile.js"}],resources:[]},bundle:{manifest:{"Bundle-Identifier":"layerselection","Bundle-Name":"layerselection","Bundle-Author":[{Name:"jjk",Organisation:"nls.fi",Temporal:{Start:"2009",End:"2011"},Copyleft:{License:{"License-Name":"EUPL","License-Online-Resource":"http://www.paikkatietoikkuna.fi/license"}}}],"Bundle-Name-Locale":{fi:{Name:" style-1",Title:" style-1"},en:{}},"Bundle-Version":"1.0.0","Import-Namespace":["Oskari","dojo"],"Import-Bundle":{}}},dojo:["dojo","dojo/dom","dijit/form/Slider","dijit/form/HorizontalSlider","dojo/dom-construct","dojo/parser","dojo/dnd/Source","dojo/query"]});Oskari.bundle_manager.installBundleClass("layerselection","Oskari.poc.dojo.LayerSelectionBundle");