/* This is a packed Oskari bundle (bundle script version Thu Feb 23 2012 11:08:28 GMT+0200 (Suomen normaaliaika)) */ 
Oskari.clazz.define("Oskari.tools.Yui",function(){this.bundle_manager=Oskari.bundle_manager;this.excludeTags={mapframework:true}},{setExcludeTags:function(a){this.excludeTags=a},getBundleTags:function(a){return this.bundle_manager.stateForBundleDefinitions[a].metadata.manifest["Bundle-Tag"]||{}},shallExclude:function(a){var b=this;var c=b.excludeTags;for(p in a){if(c[p]){return true}}return false},defaultCompressorJar:'"../tools/bundle/yui/yuicompressor-2.4.6.jar"',yui_command_line:function(i,j,g){var h=this;var c=h.bundle_manager.sources[i];var k="";k+="md build\n";var f="bundle.js";k+="java -jar "+j+" --charset UTF-8 --line-break 4096 --type js "+f+" > build/bundle-yui.js\n";k+="echo /* This is a packed Oskari bundle (bundle script version "+(new Date())+") */ > build/yui.js\n";k+="echo /* This is a unpacked Oskari bundle (bundle script version "+(new Date())+") */ > build/yui-pack.js\n";for(var d=0;d<c.scripts.length;d++){var b=c.scripts[d];var a=new String(b.src);var e="text/javascript"==b.type?"js":"css";if("css"==e){continue}while(a.indexOf("/")!=-1){a=a.replace("/","\\")}k+='type "'+a+'" >> build/yui-pack.js\n'}k+="java -jar "+j+" --charset UTF-8 --line-break 4096 --type js build/yui-pack.js >> build/yui.js\n";return k},yui_command_lines:function(a){var d=this;var c={};for(bndlName in d.bundle_manager.sources){var f=d.getBundleTags(bndlName);if(d.shallExclude(f)){continue}var b=Oskari.bundle_manager.stateForBundleDefinitions[bndlName].bundlePath;var e="";e+='pushd "'+b+'"\n';e+=d.yui_command_line(bndlName,a,b);e+="popd\n";c[bndlName]=e}return c},yui_command_line_for_app:function(a){var c=this;var e="SET CURRENT=%CD%\n";var f="SET YUICOMPRESSOR=%CURRENT%/"+this.defaultCompressorJar+"\n";var b=c.yui_command_lines(a);var d="";for(p in b){d+=b[p]}return e+f+d},showYuiBuildCmd:function(){var a=this.yui_command_line_for_app("%YUICOMPRESSOR%");var b=window.open();b.document.write('<body ><pre style="font: 9pt Verdana;">'+a+"</body></pre>")}});