/**
 * @class Oskari.userinterface.component.Component
 * Component
 */
Oskari.clazz.define('Oskari.userinterface.component.Component',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        'use strict';
        this._clazz = 'Oskari.userinterface.component.Component';
        this._element = null;
        this._visible = true;
    }, {

        /**
         * @method destroy
         * Called whenever someone wants to get rid of the component
         * @param {Boolean} cleanup True if destroy is called just for cleanup
         */
        destroy: function (cleanup) {
            'use strict';
            this._destroyImpl(cleanup);
            if (!cleanup) {
                if (this._element) {
                    if (this._element.parentNode) {
                        this._element.parentNode.removeChild(this._element);
                    }
                }
            }
        },

        /**
         * @method _destroyImpl
         * Called before component element is removed. Useful for cleanup.
         * @param {Boolean} cleanup True if destroy is called just for cleanup
         */
        _destroyImpl: function (cleanup) {
            'use strict';
            return undefined;
        },

        /**
         * @method _getClasses
         * @return {Array} Component classes in an array
         */
        _getClasses: function () {
            'use strict';
            if (this._element && this._element.className) {
                return this._element.className.split(/\s+/).sort();
            }
            return [];
        },

        /**
         * @method addClass
         * @param {String} className
         */
        addClass: function (className) {
            'use strict';
            if(!this._element) {
                return;
            }
            var classes = this._getClasses();
            if (classes.indexOf(className) === -1) {
                classes.push(className);
                this._element.className = classes.join(' ');
            }
        },

        /**
         * @method removeClass
         * @param {String} className
         */
        removeClass: function (className) {
            'use strict';
            if(!this._element) {
                return;
            }
            var classes = this._getClasses(),
                idx = classes.indexOf(className);
            if (idx !== -1) {
                classes.splice(idx, 1);
                this._element.className = classes.join(' ');
            }
        },

        /**
         * @method toggleClass
         * @param {String}  className
         * @param {Boolean} toggle
         */
        toggleClass: function (className, toggle) {
            'use strict';
            if (toggle) {
                this.addClass(className);
            } else {
                this.removeClass(className);
            }
        },

        /**
         * @method getClazz
         * @return {String} clazz
         */
        getClazz: function () {
            'use strict';
            return this._clazz;
        },

        /**
         * @method getElement
         * @return {HTMLElement} element
         */
        getElement: function () {
            'use strict';
            return this._element;
        },

        /**
         * @method getName
         * @return {String} name
         */
        getName: function () {
            'use strict';
            return undefined;
        },

        /**
         * @method setName
         * @param {String} name
         */
        setName: function (name) {
            'use strict';
            return undefined;
        },

        /**
         * @method getTitle
         * @return {String} title
         */
        getTitle: function () {
            'use strict';
            return undefined;
        },

        /**
         * @method setTitle
         * @param {String} title
         */
        setTitle: function (title) {
            'use strict';
            return undefined;
        },

        /**
         * @method isVisible
         * @return {Boolean}
         */
        isVisible: function () {
            'use strict';
            return this._visible;
        },

        /**
         * @method setVisible
         * @param {Boolean} visible
         */
        setVisible: function (visible) {
            'use strict';
            if (typeof visible !== 'boolean') {
                throw new TypeError(
                    this.getClazz() +
                        '.setVisible: visible is not a boolean'
                );
            }
            this._setVisibleImpl(visible);
        },

        /**
         * @method _setVisibleImpl
         * @param {Boolean} visible
         */
        _setVisibleImpl: function (visible) {
            'use strict';
            return undefined;
        },

        /**
         * @method insertTo
         * @param {HTMLElement} container
         */
        insertTo: function (container) {
            'use strict';
            var cont;
            if (!container) {
                throw new TypeError(
                    this.getClazz() +
                        '.insertTo: container is required.'
                );
            }
            cont = container;
            // Hackhack, dig up dom element from jquery obj
            if (!cont.appendChild && cont.length) {
                cont = cont[0];
            }
            if (!cont.appendChild) {
                throw new TypeError(
                    this.getClazz() +
                        '.insertTo: container is not a DOMElement.'
                );
            }
            cont.appendChild(this._element);
        }
    });
