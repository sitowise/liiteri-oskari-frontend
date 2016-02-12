Oskari.clazz.category('Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance', 'state-methods', {

    /**
     * @method useState
     * @param {Object} savedState
     *      JSON presentation of application state, created with #getCurrentState()
     * method.
     *
     * Sends out Oskari.mapframework.request.common.RemoveMapLayerRequest,
     * Oskari.mapframework.request.common.AddMapLayerRequest,
     * Oskari.mapframework.request.common.ChangeMapLayerOpacityRequest and
     * Oskari.mapframework.request.common.MapMoveRequest to control the
     * application state
     */
    useState: function (state) {
        if (!state) {
            // dont do anything if we dont have a saved state
            return [];
        }

        var newState = jQuery.extend(true, {}, state),
            components = this.sandbox.getStatefulComponents(),
            loopedComponents = [],
            id;

        for (id in newState) {
            if (newState.hasOwnProperty(id)) {
                if (components[id] && components[id].setState) {
                    // safety check that we have the component in current config
                    components[id].setState(newState[id].state);
                }
                loopedComponents.push(id);
            }
        }
        return loopedComponents;
    },

    /**
     * @method resetState
     * Used to return the application to its original state.
     * Calls resetState-methods for all plugins and returns the application state
     * by
     * calling #useState with config gathered/saved on bundle start.
     *
     * All plugins should handle themselves what this means in the plugins
     * implementation.
     */
    resetState: function () {
        var me = this,
            pluginName,
            startupState;
        me._historyEnabled = false;
        me._historyPrevious = [];
        me._historyNext = [];


        for (pluginName in me._pluginInstances) {
            if (me._pluginInstances.hasOwnProperty(pluginName)) {
                me.sandbox.printDebug('[' + me.getName() + ']' + ' resetting state on ' + pluginName);
                me._pluginInstances[pluginName].resetState();
            }
        }
        // reinit with startup params

        // get initial state from server
        me._currentViewId = me._defaultViewId;
        startupState = me._getStartupState();
        if (startupState) {
            me._resetComponentsWithNoStateData(me.useState(startupState));
        } else {
            jQuery.ajax({
                dataType: "json",
                type: "GET",
                // noSavedState=true parameter tells we dont want the state saved in session
                url: me.sandbox.getAjaxUrl() + 'action_route=GetAppSetup&noSavedState=true',
                success: function (data) {
                    if (data && data.configuration) {
                        me._setStartupState(data.configuration);
                        me._resetComponentsWithNoStateData(me.useState(me._getStartupState()));
                        me._historyEnabled = true;
                    } else {
                        alert('error in getting configuration');
                    }
                },
                error: function () {
                    alert('error loading conf');
                    me._historyEnabled = true;
                },
                complete: function () {
                    me._historyEnabled = true;
                }
            });
        }

        me._historyEnabled = true;
    },

    /**
     * @method _getStartupState
     * Getter for the application's original state.
     * @return A copy of the application's original state.
     */
    _getStartupState: function () {
        var ret;
        if (this._startupState) {
            ret =  jQuery.extend(true, {}, this._startupState);
        } else {
            ret = this._startupState;
        }
        return ret;
    },

    /**
     * @method _setStartupState
     * Used to set the application's original state.
     * Stores a _copy_ of the given state.
     * This only stores the state, use useState to put it in use.
     * @param {Object} state Application's original state
     */
    _setStartupState: function (state) {
        this._startupState = jQuery.extend(true, {}, state);
    },

    /**
     * @method _resetComponentsWithNoStateData
     * Used to return the application to its original state.
     * Loops through all the stateful components and calls their setState()
     * with no parameters to reset them. Ignores the components whose IDs are listed in
     * the parameter array.
     * @param {String[]}  loopedComponents
     *      list of component IDs that had state data and should not be resetted
     *
     */
    _resetComponentsWithNoStateData: function (loopedComponents) {
        // loop all stateful components and reset their state they are not in loopedComponents
        var components = this.sandbox.getStatefulComponents(),
            cid,
            found,
            i;
        for (cid in components) {
            if (components.hasOwnProperty(cid)) {
                found = false;
                for (i = 0; i < loopedComponents.length; i += 1) {
                    if (cid === loopedComponents[i]) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    // set empty state for resetting state
                    components[cid].setState();
                }
            }
        }
    },
    /**
     * @method saveState
     * @param {Object} view
     * @param {String} pluginName (optional)
     * Calls the saveState method of the given plugin or if not given, calls it
     * for each plugin
     *
     * Used to store the application state though the module/bundle does nothing
     * itself.
     * All actual implementations are done in plugins.
     */
    saveState: function (view, pluginName) {
        var plugName;
        if (!pluginName) {
            for (plugName in this._pluginInstances) {
                if (this._pluginInstances.hasOwnProperty(plugName)) {
                    this.saveState(view, plugName);
                }
            }
            return;
        }
        this.sandbox.printDebug('[' + this.getName() + ']' + ' saving state with ' + pluginName);
        this._pluginInstances[pluginName].saveState(view);
    },
    /**
     * @method getCurrentState
     * @return {Object} JSON object presenting the state of the application at
     * the moment.
     */
    getCurrentState: function () {
        var state = {},
            components = this.sandbox.getStatefulComponents(),
            id;
        for (id in components) {
            if (components.hasOwnProperty(id)) {
                if (components[id].getState) {
                    state[id] = {
                        // wrap with additional state property so we can use the same json as in startup configuration
                        'state': components[id].getState()
                    };
                } else {
                    this.sandbox.printWarn('Stateful component ' + id + ' doesnt have getState()');
                }
            }
        }
        return state;
    },

    /**
     * @method getSavedState
     * @param {String} pluginName
     * Calls the plugins getState()-method.
     * It should return a JSON object created by #getCurrentState on earlier
     * time.
     */
    getSavedState: function (pluginName) {
        return this._pluginInstances[pluginName].getState();
    }


});