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
            theCss: "theCombo"
        };

    var hasWebkit = Boolean(navigator.userAgent.indexOf('WebKit') > -1);

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
            var options = this.$element.find('option');
            var title = (options.filter(":selected").val() != '') ? options.filter(":selected").text() : options.eq(0).text();
            this.textNode = doc.createTextNode(title);

            var span = doc.createElement('span');
            span.className = this.opts.theCss;
            span.appendChild(this.textNode);
            this.$span = $(span);
            this.$element
                .css({
                    "top": 0,
                    "left": 0,
                    "opacity": 0,
                    "position": "absolute",
                    "width": "100%"
                })
                .on('change.' + this._name, {"that": this}, this.change);

            this.$element
                .after(this.$span)
                .appendTo(this.$span);

            var frm = this.$element.parents('form:eq(0)');
            if (frm.length === 1)
                frm.on('reset', {"that": this}, this.reset);
        },
        reset: function(e) {
            e = e || false;
            var that;
            if(e)
                that = e.data.that;
            else
                that = this;
            var el = that.$element.find('option:eq(0)');
            el.get(0).selected = true;
            that.textNode.nodeValue = el.text();
        },
        change: function(e) {
            var that = e.data.that;
            that.textNode.nodeValue = that.$element.find('option:selected').text();
        }
    };

    $.fn[pluginName] = function(options) {
        var args = arguments;
        if (hasWebkit === false) {
            if (options === undefined || typeof options === 'object') {
                return this.each(function(idx, element) {
                    if (!$.data(element, pluginName))
                        $.data(element, pluginName, new Plugin(element, options));
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