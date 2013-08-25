/**
 * jquery.theCombo.js
 * Thiago Lagden | @thiagolagden | lagden@gmail.com
 * jQuery plugin
 */

;
(function(window) {

    'use strict';

    var $ = window.jQuery,
        pluginName = "theCombo",
        defaults = {
            theCss: "theCombo"
        };

    var supportsWebkitAppearance = false;

    try {
        supportsWebkitAppearance = window.CSS.supports("-webkit-appearance", "none");
    } catch (e) {
        supportsWebkitAppearance = false;
    }

    function Plugin(element, options) {
        this.element = element;
        this.$element = $(element);
        this.$span = null;
        this.textNode = null;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            if (this.$element.is('select'))
                this.stylezando();
        },
        stylezando: function() {
            var options = this.$element.find('option');
            var title = (options.filter(":selected").val() != '') ? options.filter(":selected").text() : options.eq(0).text();
            this.$span = $('<span>' + title + '</span>').addClass(this.options.theCss);
            this.$element
                .css({
                    "top": 0,
                    "left": 0,
                    "opacity": 0,
                    "position": "absolute"
                })
                .on('change.' + this._name, {
                    "that": this
                }, this.change)
                .after(this.$span);

            this.$element.appendTo(this.$span);

            this.textNode = this.$span.get(0).childNodes[0];

            var frm = this.$element.parents('form:eq(0)');
            if (frm.length === 1) {
                frm.on('reset', {
                    "that": this
                }, function(ev) {
                    ev.data.that.reset();
                });
            }
        },
        reset: function() {
            var el = this.$element.find('option:eq(0)');
            el.get(0).selected = true;
            this.textNode.nodeValue = el.text();
        },
        change: function(ev) {
            var that = ev.data.that;
            that.textNode.nodeValue = that.$element.find('option:selected').text();
        },
        destroy: function() {
            this.$element
                .removeClass(this.options.theCss)
                .off('change.' + this._name)
                .css({
                    'position': '',
                    'opacity': '',
                    'zIndex': ''
                })
                .next('span:eq(0)').remove();
            this.$span = null;
        }
    };

    $.fn[pluginName] = function(options) {
        var args = arguments;
        if (!supportsWebkitAppearance) {
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

                    if (options === 'destroy')
                        $.data(this, pluginName, null);
                });

                return returns !== undefined ? returns : this;
            }
        }
        return null;
    };
})(window);