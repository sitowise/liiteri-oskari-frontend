/* This is a packed Oskari app (bundle script version Thu May 31 2012 11:29:29 GMT+0300 (Suomen kesäaika)) */ 
/* This is a packed Oskari bundle (bundle script version Thu May 31 2012 11:29:29 GMT+0300 (Suomen kesäaika)) */ 
Oskari.clazz.define("Oskari.tools.Yui",function(){this.bundle_manager=Oskari.bundle_manager;this.excludeTags={mapframework:true},this.langs={fi:true,sv:true,en:true},this.flushPackFiles()},{flushPackFiles:function(){this.packedFiles=[];this.packedLocales={};for(l in this.langs){this.packedLocales[l]=[]}},setExcludeTags:function(a){this.excludeTags=a},getBundleTags:function(a){return this.bundle_manager.stateForBundleDefinitions[a].metadata.manifest["Bundle-Tag"]||{}},shallExclude:function(a){var b=this;var c=b.excludeTags;for(p in a){if(c[p]){return true}}return false},defaultCompressorJar:'"../tools/bundle/yui/yuicompressor-2.4.6.jar"',yui_command_line:function(j,k,g){var i=this;var c=i.bundle_manager.sources[j];var m="";m+="md build\n";var f="bundle.js";m+="java -jar "+k+" --charset UTF-8 --line-break 4096 --type js "+f+" > build/bundle-yui.js\n";m+="echo /* This is a packed Oskari bundle (bundle script version "+(new Date())+") */ > build/yui.js\n";m+="echo /* This is a unpacked Oskari bundle (bundle script version "+(new Date())+") */ > build/yui-pack.js\n";for(var d=0;d<c.scripts.length;d++){var b=c.scripts[d];var a=new String(b.src);var e="text/javascript"==b.type?"js":"css";if("css"==e){continue}while(a.indexOf("/")!=-1){a=a.replace("/","\\")}m+='type "'+a+'" >> build/yui-pack.js\n'}m+="java -jar "+k+" --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js\n";this.packedFiles.push(g+"/build/yui.js");for(l in this.langs){if(!this.langs[l]){continue}m+="echo /* This is a unpacked Oskari bundle (bundle script version "+(new Date())+") */ > build/yui-pack-locale-"+l+".js\n"}if(c.locales){for(var d=0;d<c.locales.length;d++){var b=c.locales[d];var h=b.lang;var a=new String(b.src);var e="text/javascript"==b.type?"js":"css";if("css"==e){continue}while(a.indexOf("/")!=-1){a=a.replace("/","\\")}m+='type "'+a+'" >> build/yui-pack-locale-'+h+".js\n"}}for(l in this.langs){if(!this.langs[l]){continue}m+="java -jar "+k+" --charset UTF-8 --line-break 4096 --type js build/yui-pack-locale-"+l+".js >> build/yui-locale-"+l+".js\n";this.packedLocales[l].push(g+"/build/yui-locale-"+l+".js")}return m},yui_command_lines:function(a){var d=this;var c={};for(bndlName in d.bundle_manager.sources){var f=d.getBundleTags(bndlName);if(d.shallExclude(f)){continue}var b=Oskari.bundle_manager.stateForBundleDefinitions[bndlName].bundlePath;var e="";e+='pushd "'+b+'"\n';e+=d.yui_command_line(bndlName,a,b);e+="popd\n";c[bndlName]=e}return c},yui_command_line_for_app:function(h){var g=this;g.flushPackFiles();var f="SET CURRENT=%CD%\n";var d="SET YUICOMPRESSOR=%CURRENT%/"+this.defaultCompressorJar+"\n";var e=g.yui_command_lines(h);var c="";for(p in e){c+=e[p]}var i="";i+="md build\n";i+="echo /* This is a packed Oskari app (bundle script version "+(new Date())+") */ > build/yui-app.js\n";for(var b=0;b<this.packedFiles.length;b++){var a=this.packedFiles[b];while(a.indexOf("/")!=-1){a=a.replace("/","\\")}i+='type "'+a+'" >> build/yui-app.js\n'}for(l in this.langs){i+="echo /* This is a packed Oskari locale for app (bundle script version "+(new Date())+") */ > build/yui-app-locale-"+l+".js\n";for(var b=0;b<this.packedLocales[l].length;b++){var a=this.packedLocales[l][b];while(a.indexOf("/")!=-1){a=a.replace("/","\\")}i+='type "'+a+'" >> build/yui-app-locale-'+l+".js\n"}}return f+d+c+i},showYuiBuildCmd:function(){var a=this.yui_command_line_for_app("%YUICOMPRESSOR%");var b=window.open();b.document.write('<body ><pre style="font: 9pt Verdana;">'+a+"</body></pre>")}});/* This is a packed Oskari bundle (bundle script version Thu May 31 2012 11:29:29 GMT+0300 (Suomen kesäaika)) */ 
/* This is a packed Oskari bundle (bundle script version Thu May 31 2012 11:29:29 GMT+0300 (Suomen kesäaika)) */ 
Oskari.clazz.define("Oskari.poc.jqueryui.bundle.LayerSelectionBundleInstance",function(){this.map=null;this.core=null;this.sandbox=null;this.mapmodule=null;this.started=false;this.plugins={}},{__name:"Oskari.poc.jqueryui.bundle.LayerSelectionBundleInstance",getName:function(){return this.__name},getSandbox:function(){return this.sandbox},start:function(){if(this.started){return}this.started=true;var a=Oskari.$("sandbox");this.sandbox=a;a.register(this);for(p in this.eventHandlers){a.registerForEventByName(this,p)}var b=a.getRequestBuilder("userinterface.AddExtensionRequest")(this);a.request(this,b)},init:function(){return null},update:function(){},onEvent:function(b){var a=this.eventHandlers[b.getName()];if(!a){return}return a.apply(this,[b])},eventHandlers:{AfterMapLayerAddEvent:function(a){this.refresh()},AfterMapLayerRemoveEvent:function(a){this.refresh()},AfterMapMoveEvent:function(a){},AfterChangeMapLayerOpacityEvent:function(a){if(this.sandbox.getObjectCreator(a)!=this.getName()){this.plugins["Oskari.userinterface.Flyout"].updateLayer(a.getMapLayer())}}},stop:function(){var a=this.sandbox;for(p in this.eventHandlers){a.unregisterFromEventByName(this,p)}var b=a.getRequestBuilder("userinterface.RemoveExtensionRequest")(this);a.request(this,b);this.sandbox.unregister(this);this.started=false},setSandbox:function(a){this.sandbox=null},startExtension:function(){this.plugins["Oskari.userinterface.Flyout"]=Oskari.clazz.create("Oskari.poc.jqueryui.layerselection.Flyout",this);this.plugins["Oskari.userinterface.Tile"]=Oskari.clazz.create("Oskari.poc.jqueryui.layerselection.Tile",this)},stopExtension:function(){this.plugins["Oskari.userinterface.Flyout"]=null;this.plugins["Oskari.userinterface.Tile"]=null},getTitle:function(){return"Layer Selection"},getDescription:function(){return"Sample"},getPlugins:function(){return this.plugins},refresh:function(){var a=this;this.plugins["Oskari.userinterface.Flyout"].refresh();this.plugins["Oskari.userinterface.Tile"].refresh()}},{protocol:["Oskari.bundle.BundleInstance","Oskari.mapframework.module.Module","Oskari.userinterface.Extension"]});Oskari.clazz.define("Oskari.poc.jqueryui.layerselection.Flyout",function(a){this.instance=a;this.container=null;this.template=null;this.state=null;this.layercontrols={}},{getName:function(){return"Oskari.poc.jqueryui.layerselection.Flyout"},setEl:function(c,b,a){this.container=$(c)},startPlugin:function(){this.template=$('<div class="layer"><p></p><div class="slider"></div></div>');this.refresh()},stopPlugin:function(){this.container.empty()},getTitle:function(){return"Valitut karttatasot"},getDescription:function(){},getOptions:function(){},setState:function(a){this.state=a;console.log("Flyout.setState",this,a)},updateLayer:function(b){var d=this.layercontrols[b.getId()];if(!d){return}var c=d.slider;var a=b.getOpacity();c.slider("value",a)},refresh:function(){var f=this;var b=f.instance;var e=this.container;var d=this.template;var c=b.getSandbox();var a=c.getRequestBuilder("ChangeMapLayerOpacityRequest");var g=c.findAllSelectedMapLayers();e.empty();f.layercontrols={};$(g).each(function(i){var k=$(d).clone();var j=this;var h=j.getId();var m=j.getOpacity();var l=$(k).children(".slider");f.layercontrols[h]={slider:l};$(k).children("p").append(j.getName());$(k).appendTo(e);l.slider({min:0,max:100,value:m,slide:function(n,o){var q=o.value;c.request(b,a(h,q))}})})}},{protocol:["Oskari.userinterface.Flyout"]});Oskari.clazz.define("Oskari.poc.jqueryui.layerselection.Tile",function(a){this.instance=a;this.container=null;this.template=null},{getName:function(){return"Oskari.poc.jqueryui.layerselection.Tile"},setEl:function(c,b,a){this.container=$(c)},startPlugin:function(){this.refresh()},stopPlugin:function(){this.container.empty()},getTitle:function(){return"Valitut tasot"},getDescription:function(){},getOptions:function(){},setState:function(a){console.log("Tile.setState",this,a)},refresh:function(){var f=this;var a=f.instance;var e=this.container;var d=this.template;var c=a.getSandbox();var g=c.findAllSelectedMapLayers();var b=e.children(".oskari-tile-status");
b.empty();b.append("("+g.length+")")}},{protocol:["Oskari.userinterface.Tile"]});