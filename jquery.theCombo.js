/**
 * jquery.theCombo.js
 * Thiago Lagden | @thiagolagden | lagden@gmail.com
 * jQuery plugin
 */

;(function(window, CSS) {

    'use strict';

    var $ = window.jQuery,
        pluginName = "theCombo",
        defaults = {
            theCss: false
        };

        var supportsWebkitAppearance;
        try{
            supportsWebkitAppearance = window.CSS.supports("-webkit-appearance", "none");
        }
        catch(e){
            supportsWebkitAppearance = false;
        }

    function Plugin(element, options) {
        this.element = element;
        this.$element = $(element);
        this.$span = null;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.support = supportsWebkitAppearance;
        if(!supportsWebkitAppearance)
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
            this.$span = $('<span>');
            this.$span = this.reposition().html(title);
            this.$element
            .after(this.$span)
            .addClass(this.options.theCss)
            .css({
                'position': 'relative',
                'opacity': 0,
                'zIndex': 2
            })
            .on('change.' + this._name, {
                "that": this
            }, this._change);

            var frm = this.$element.parents('form:eq(0)');
            if (frm.length === 1) {
                frm
                    .on('reset', {
                        "that": this
                    }, function(ev) {
                        ev.data.that.reset();
                    });
            }
        },
        reset: function() {
            var el = this.$element.find('option:eq(0)');
            el.get(0).selected = true;
            this.$span.text(el.text());
        },
        _change: function(ev) {
            ev.data.that.change();
        },
        change: function() {
            this.$span.text(this.$element.find('option:selected').text());
            console.log('qwe');
        },
        reposition: function(){
            var offsetElement = this.$element.offset();
            this.$span
            .attr("class", this.$element.attr("class"))
            .css({
                // 'width': this.$element.width() + 'px',
                'top': offsetElement.top + 'px',
                'left': offsetElement.left + 'px',
                'position': 'absolute',
                'zIndex': 1
            });
            return this.$span;
        },
        hide: function(){
            this.$span.hide();
        },
        show: function(){
            this.$span.show();
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
    };
})(window);