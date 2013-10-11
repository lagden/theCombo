/**
 * jquery.theCombo.js
 * Thiago Lagden | @thiagolagden | lagden@gmail.com
 * jQuery plugin
 */

;(function(window, navigator, document) {

    "use strict";

    var $ = window.jQuery,
        doc = document,
        pluginName = "theCombo",
        defaults = {
            theCss: null
        };

    function Plugin(element, options) {
        this.element = element;
        this.$element = $(element);
        this.$span = null;
        this.textNode = null;
        this.opts = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            if (this.$element.is('select'))
                this.custom();
        },
        custom: function() {
            // Create the custom element
            this.textNode = doc.createTextNode("");
            var span = doc.createElement('span');
            span.className = this.element.className;
            span.appendChild(this.textNode);
            this.$span = $(span);
            if(this.opts.theCss)
                this.$span.addClass(this.opts.theCss);

            // Some style and listener change
            this.$element
                .css({
                    "top": 0,
                    "left": 0,
                    "opacity": 0,
                    "position": "absolute",
                    "width": "100%"
                })
                .on('change.' + this._name, {"that": this}, _onChange)
                .after(this.$span)
                .appendTo(this.$span);

            // Listener Form Reset
            var frm = this.$element.parents('form:eq(0)');
            if (frm.length === 1)
                frm.on('reset', {"that": this}, _onReset);

            // Verify initial status
            _onChange({"data": {"that": this}});
        }
    };

    // Private methods
    function _onReset(e) {
        var that = e.data.that;
        that.textNode.nodeValue = that.$element.find('option:eq(0)').text();
    }

    function _onChange(e) {
        var that = e.data.that;
        that.textNode.nodeValue = that.$element.find('option:selected').text();
    }

    $.fn[pluginName] = function(options) {
        var args = arguments;
        var hasWebkit = Boolean(navigator.userAgent.indexOf('WebKit') > -1);
        if (hasWebkit === false) {
            if (options === undefined || typeof options === 'object') {
                return this.each(function() {
                    if (!$.data(this, pluginName))
                        $.data(this, pluginName, new Plugin(this, options));
                });
            } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
                var returns;

                this.each(function() {
                    var instance = $.data(this, pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function')
                        returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                });

                return returns !== undefined ? returns : this;
            }
        }
        return null;
    };

})(window, navigator, document);