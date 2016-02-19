/*
 * PoC: API for Oskari 2.0
 *
 */
define([
    "lodash",
    "src/oskari/oskari",
    "src/oskari/base/module",
    "src/framework/oskariui/module"
], function(_,Oskari, platform) {
    Oskari.VERSION = "2.1.0"; // Overwrite

    var cs = Oskari.clazz;

    /* Simplified Application API for Oskari 2.0 */
    var App = Oskari.cls(undefined, function() {
        this.instances = {};
        this.startupSeq = [];
        this.config = Oskari.appConfig;
    }).methods({
        setConfiguration: function(c) {
            Oskari.setConfiguration(c);
            return this;
        },
        setStartupSequence: function(startup) {
            this.startupSeq = startup;
            return this;
        },
        success: function(s) {
            if (this.result)
                s(this.result);
            else
                this.successFunc = s;
            return this;
        },
        _startApplication: function(callback) {
            // start app
            var me = this,
                result = {},

                // start modules in the given startupSequence order
                startupSequence = me.startupSeq,
                startupSequenceLength = startupSequence.length,
                modules = [];

            var startModules = function(moduleArray, callback) {
                if (moduleArray.length === 0) {
                    if (callback) {
                        callback();
                    }
                    return me;
                }
                var moduleItem = moduleArray.shift(),
                    moduleName = moduleItem.bundlename,
                    instance = null,
                    instancename = moduleItem.bundleinstancename;

                require([moduleName], function(module) {

                    instance = module.start(instancename);
                    name = instance.getName();
                    
                    // store handle for observability while testing and debugging
                    me.instances[name] = instance;

                    // recursively start all modules
                    startModules(moduleArray, callback);
                });
            };
            startModules(startupSequence, callback);
        },
        start: function() {
            var me = this;
            var app = Oskari.app;
            me._startApplication(function(result) {
                if (me.successFunc)
                    me.successFunc(me);
                else
                    me.result = result;

            });
            return this;
        },
        stopApplication: function() {
            // nop atm
            return this;
        },
        getModuleInstances: function() {
            return this.instances;
        }
    });

    /* Generic shortcuts */

    Oskari.Application = App;

    var defaultIdentifier = 0;
    var ConfigurableModule = Oskari.cls('Oskari.Module', function() {
        console.log("CREATED CONFIGURABLE MODULE as BASE for MODULES");
    }, {
        extend: function(props) {
            // Bundles are structured to modules, however the refactoring is done gradually.
            // TODO: Change Oskari.bundleCls to Oskari.moduleClass
            var moduleClass = Oskari.bundleCls(props.identifier);

            moduleClass.category(props);
            moduleClass.category({
                create: function() {
                    console.log("CREATING MODULE INSTANCE ", this.extension, this.identifier, this.locale, this.configuration);
                    var instance =
                        this.extension.create(this.identifier || '_' + (++defaultIdentifier), this.locale);

                    var configProps = this.configuration || {};

                    for (ip in configProps) {
                        if (configProps.hasOwnProperty(ip)) {
                            instance.conf[ip] = configProps[ip];
                        }
                    }

                    console.log("- INSTANCE", instance, "post conf");
                    return instance;
                }

            });

            console.log("DECLARED MODULE CLASS", moduleClass);
            return moduleClass;
        }

    });

    Oskari.Module = ConfigurableModule.create();
    
    /* Event, Request support Classes */   
    
    
    /* Oskari.Event */
    /* example: 
     *   var evtCls = Oskari.Event.extend({ name: 'MyEvent' });
     *   var evt = evtCls.create({ 'prop': 'value' }); 
     *   Oskari.getSandbox().notifyAll(evt);  
     */ 
    var ExtendableEvent = 
     Oskari.cls('Oskari.Event', function() {
        console.log("CREATED EXTENDABLE EVENT as BASE for EVENTS");
    }, {
	extend : function(props) {
	   return Oskari.cls(props.name ? 'Oskari.event._.'+props.name: undefined,function(instanceProps) {
	        for (ip in instanceProps) {
	       	    if (instanceProps.hasOwnProperty(ip)) {
        		this[ip] = instanceProps[ip];
	            }	
        	}
	      },{
              getName : function() {
                return this.name;
              }
           },{
             protocol : ['Oskari.mapframework.event.Event']
           }).category(props);
	}
    });

    Oskari.Event = ExtendableEvent.create();
    
    /* Oskari.Request */
    /* example: 
     *   var reqCls = Oskari.Request.extend({ name: 'MyRequest'});
     *   var req = reqcls.create( { 'prop': 'value' });
     *   Oskari.getSandbox().request("MainMapModule", req);
     *    
     */ 
    var ExtendableRequest = 
     Oskari.cls('Oskari.Request', function() {
        console.log("CREATED EXTENDABLE REQUEST as BASE for REQUESTS");
    }, {
	extend : function(props) {
          return Oskari.cls(props.name ? 'Oskari.request._.'+props.name: undefined,function(instanceProps) {
            for (ip in instanceProps) {
              if (instanceProps.hasOwnProperty(ip)) {
                 this[ip] = instanceProps[ip];
              }
            }
         },{
           getName : function() {
                return this.name;
           }
         },{
           protocol : ['Oskari.mapframework.request.Request']
         }).category(props);
       }
     });

    Oskari.Request = ExtendableRequest.create();
   
    /* Object Generic class */
    /* example:
     *    // instantiate
     *    var obj = Oskari.Object.create({ 'prop' : 'value' });
     * 
     *    // extend 
     *    var objCls = Oskari.Object.extend( {
     *        funk: function() { return "obj extended "+this.prop; } 
     *   }); 
     *    // and instantiate
     *   var enhancedObj = objCls.create({ 'prop' : 'new value' });
     *   enhancedObj.funk();
     */ 
    Oskari.Object = Oskari.cls('Oskari.Object',function(instanceProps) {
        for (ip in instanceProps) {
            if (instanceProps.hasOwnProperty(ip)) {
                 this[ip] = instanceProps[ip];
            }
        }
    });
   
   
    

    return Oskari;

});
